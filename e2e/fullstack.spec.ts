import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
const zh = JSON.parse(await readFile(new URL('../src/assets/languages/zh-CN.json', import.meta.url), 'utf8')) as typeof import('../src/assets/languages/zh-CN.json');
import type { CartDto, OrderDto } from '../src/api/services';

type Account = { id: string; username: string; email: string; password: string };
type Manifest = { version: number; baseURL: string; users: Record<'customer' | 'other' | 'admin', Account>;
  categorySlug: string; productId: number; expectedUnitPrice: string;
  input: { productId: number; modelId: number; memorySizeId: number; color: string; qty: number } };
let fixture: Manifest;
let signup: Omit<Account, 'id'>;
let customer: Page;
let other: Page;
let admin: Page;
let customerToken: string;
let otherToken: string;
let adminToken: string;
let receipt: OrderDto;
const contexts: BrowserContext[] = [];
let nextRequest = 0;

// Share a request budget across all contexts and direct API probes. Keep real
// backend limits enabled (100 requests/minute, 10 auth attempts/15 minutes).
async function pace() {
  const slot = Math.max(nextRequest, Date.now());
  nextRequest = slot + 850;
  await delay(Math.max(0, slot - Date.now()));
}
async function api<T>(path: string, token?: string, method = 'GET', body?: unknown, key?: string, paced = true) {
  if (paced) await pace();
  const response = await fetch(`${fixture.baseURL}${path}`, {
    method, signal: AbortSignal.timeout(10_000), headers: {
      'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(key ? { 'Idempotency-Key': key } : {}),
    }, ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const envelope = response.status === 204 ? null : await response.json();
  return { status: response.status, data: envelope?.data as T, code: envelope?.error?.code as string | undefined };
}
async function login(page: Page, account: Omit<Account, 'id'>) {
  await page.goto('/auth/signin');
  await page.getByLabel(zh.auth.identifier).fill(account.email);
  await page.getByLabel(zh.auth.password, { exact: true }).fill(account.password);
  await page.getByRole('button', { name: zh.auth.signIn, exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:5173/');
  await expect.poll(() => page.evaluate(() => Boolean(sessionStorage.getItem('clu.auth.session')))).toBe(true);
  return page.evaluate(() => JSON.parse(sessionStorage.getItem('clu.auth.session')!).token as string);
}
async function configureProduct(page: Page) {
  await page.goto(`/product-detail/${fixture.productId}`);
  // Session restoration remounts account-scoped UI. Select only after it settles.
  await expect(page.getByRole('button', { name: zh.home_page.product_hero.add_cart })).toBeVisible();
  await page.getByRole('button', { name: /Test model specification/ }).click();
  await page.getByRole('button', { name: fixture.input.color, exact: true }).click();
  await page.getByRole('button', { name: /Upgrade.*0\.10/ }).click();
  await expect(page.getByRole('button', { name: /Test model specification/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: fixture.input.color, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /Upgrade.*0\.10/ })).toHaveAttribute('aria-pressed', 'true');
}
async function addProduct(page: Page) {
  await configureProduct(page);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('button', { name: zh.home_page.product_hero.add_cart })).toBeEnabled();
  const added = page.waitForResponse(response => response.url().endsWith('/api/shopping-cart/items') && response.request().method() === 'POST', { timeout: 15_000 });
  await page.getByRole('button', { name: zh.home_page.product_hero.add_cart }).click();
  expect((await added).status()).toBe(201);
  await expect(page.getByRole('button', { name: zh.home_page.product_hero.add_cart })).toBeEnabled();
}

test.describe('Real API commerce journey', () => {
  // One fixture and three authenticated contexts: no retries or worker restarts
  // that would exhaust auth limits or replay non-idempotent setup.
  test.describe.configure({ mode: 'serial' });
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(90_000);
    fixture = JSON.parse(await readFile(process.env.E2E_FIXTURE_PATH!, 'utf8'));
    signup = JSON.parse(await readFile(process.env.E2E_REGISTRATION_PATH!, 'utf8'));
    if (fixture.version !== 1 || fixture.baseURL !== process.env.E2E_API_URL
      || !/^http:\/\/127\.0\.0\.1:[1-9]\d*$/.test(fixture.baseURL)
      || process.env.DATABASE_URL || process.env.TEST_DATABASE_URL || process.env.JWT_SECRET
      || fixture.input.productId !== fixture.productId || fixture.expectedUnitPrice !== '10.10'
      || Object.values(fixture.users).some(account => !account.email.endsWith('@example.test'))) {
      throw new Error('Unsafe or unsupported backend fixture contract');
    }
    expect((await api('/ready')).status).toBe(200);
    for (let index = 0; index < 3; index++) {
      const context = await browser.newContext({ baseURL: 'http://127.0.0.1:5173' });
      contexts.push(context);
      await context.route(/^http:\/\/127\.0\.0\.1:5173\/(?:api|media)\//, async route => { await pace(); await route.continue(); });
    }
    customer = await contexts[0]!.newPage();
    other = await contexts[1]!.newPage();
    admin = await contexts[2]!.newPage();
    customerToken = await login(customer, fixture.users.customer);
    otherToken = await login(other, fixture.users.other);
    adminToken = await login(admin, fixture.users.admin);
  });
  test.afterAll(async () => { await Promise.all(contexts.map(context => context.close())); });

  test('E2E-01 registration, duplicate registration and invalid login', async ({ browser }) => {
    const context = await browser.newContext({ baseURL: 'http://127.0.0.1:5173' });
    try {
      await context.route(/^http:\/\/127\.0\.0\.1:5173\/(?:api|media)\//, async route => { await pace(); await route.continue(); });
      const page = await context.newPage();
      await page.goto('/auth/register');
      await page.getByPlaceholder('yourname').fill(signup.username);
      await page.getByPlaceholder('name@example.com').fill(signup.email);
      await page.locator('input[type=password]').nth(0).fill(signup.password);
      await page.locator('input[type=password]').nth(1).fill(signup.password);
      const registration = page.waitForResponse(response => response.url().endsWith('/api/auth/register'));
      await page.getByRole('button', { name: zh.auth.register, exact: true }).click();
      expect((await registration).status()).toBe(201);
      await expect(page).toHaveURL(/\/auth\/signin$/);
      await page.getByLabel(zh.auth.identifier).fill(signup.email);
      await page.getByLabel(zh.auth.password, { exact: true }).fill('invalid-synthetic-password');
      await page.getByRole('button', { name: zh.auth.signIn, exact: true }).click();
      await expect(page.getByRole('alert')).toHaveText(zh.auth.invalidCredentials);
      const token = await login(page, signup);
      const identity = await api<{ role: string }>('/api/auth/me', token);
      expect(identity.status).toBe(200);
      expect(identity.data.role).toBe('USER');
      const duplicate = await api('/api/auth/register', undefined, 'POST', { ...signup, confirmPassword: signup.password });
      expect(duplicate.status).toBe(409);
    } finally { await context.close(); }
  });

  test('E2E-02 catalog search, empty results and product details', async () => {
    await customer.goto(`/search?category=${fixture.categorySlug}`);
    const productName = `${fixture.categorySlug.replace(/_a$/, '')} Device`;
    await customer.getByRole('searchbox').fill(productName);
    await expect(customer.getByRole('heading', { name: productName, exact: true })).toBeVisible();
    await expect(customer.getByRole('heading', { level: 3 })).toHaveCount(1);
    await customer.getByRole('button', { name: zh.catalog.learnMore, exact: true }).click();
    await expect(customer).toHaveURL(new RegExp(`/product-detail/${fixture.productId}$`));
    await expect(customer.getByText('Original test device', { exact: true })).toBeVisible();
    await expect(customer.getByRole('button', { name: /Test model specification/ })).toBeVisible();
    await customer.goto(`/search?category=${fixture.categorySlug}&query=nonexistent-synthetic-product`);
    await expect(customer.getByText(zh.catalog.empty, { exact: true })).toBeVisible();
  });

  test('E2E-03 cart creation, quantities, removal and user isolation', async () => {
    await addProduct(customer);
    await customer.goto('/cart');
    await expect(customer.getByRole('combobox', { name: zh.cart.quantity })).toHaveValue('1');
    await customer.getByRole('button', { name: zh.cart.increase }).click();
    await expect(customer.getByRole('combobox', { name: zh.cart.quantity })).toHaveValue('2');
    const cart = await api<CartDto>('/api/shopping-cart', customerToken);
    expect(cart.status).toBe(200);
    expect(cart.data.totalAmount).toBe('20.20');
    const itemId = cart.data.items[0]!.id;
    expect((await api('/api/shopping-cart/items/' + itemId, otherToken, 'PATCH', { qty: 3 })).status).toBe(404);
    expect((await api('/api/shopping-cart/items/' + itemId, otherToken, 'DELETE')).status).toBe(404);
    expect((await api<CartDto>('/api/shopping-cart', otherToken)).data.items).toHaveLength(0);
    await other.goto('/cart');
    await expect(other.getByText(zh.cart.empty, { exact: true })).toBeVisible();
    await customer.getByRole('combobox', { name: zh.cart.quantity }).selectOption('3');
    await expect(customer.getByRole('combobox', { name: zh.cart.quantity })).toHaveValue('3');
    await customer.getByRole('button', { name: zh.cart.decrease }).click();
    await expect(customer.getByRole('combobox', { name: zh.cart.quantity })).toHaveValue('2');
    await customer.getByRole('button', { name: zh.cart.remove }).click();
    await expect(customer.getByText(zh.cart.empty, { exact: true })).toBeVisible();
    expect((await api<CartDto>('/api/shopping-cart', customerToken)).data.items).toHaveLength(0);
  });

  test('E2E-04 demo checkout, receipt and duplicate submission', async () => {
    await addProduct(customer);
    await customer.goto('/cart');
    await customer.getByRole('button', { name: zh.cart.checkout, exact: true }).click();
    await expect(customer.getByText(zh.checkout.demo, { exact: true })).toBeVisible();
    const placement = customer.waitForResponse(response => response.url().endsWith('/api/orders/place'));
    const button = customer.getByRole('button', { name: zh.checkout.place });
    await expect(button).toBeEnabled();
    // Same event loop: two clicks exercise the application's synchronous guard.
    await button.evaluate(element => { (element as HTMLButtonElement).click(); (element as HTMLButtonElement).click(); });
    const response = await placement;
    expect(response.status()).toBe(201);
    receipt = (await response.json()).data;
    const key = response.request().headers()['idempotency-key'];
    expect(Boolean(key)).toBe(true);
    await expect(customer).toHaveURL(new RegExp(`/orders/${receipt.id}$`));
    await expect(customer.getByRole('heading', { name: zh.order.title })).toBeVisible();
    await expect(customer.getByText(zh.order.pending, { exact: true })).toBeVisible();
    expect(receipt.totalAmount).toBe(fixture.expectedUnitPrice);
    expect(receipt.items[0]!.qty).toBe(1);
    const replay = await api<OrderDto>('/api/orders/place', customerToken, 'POST', {}, key);
    expect(replay.status).toBe(200);
    expect(replay.data.id).toBe(receipt.id);
    expect((await api<CartDto>('/api/shopping-cart', customerToken)).data.items).toHaveLength(0);
    const history = await api<OrderDto[]>('/api/orders', customerToken);
    expect(history.data.map(order => order.id)).toEqual([receipt.id]);
  });

  test('E2E-05 order history, ownership and role enforcement', async () => {
    await customer.goto('/user');
    await expect(customer.locator(`a[href="/orders/${receipt.id}"]`)).toBeVisible();
    await other.goto(`/orders/${receipt.id}`);
    await expect(other.getByRole('alert')).toHaveText(zh.order.notFound);
    expect((await api(`/api/orders/${receipt.id}`, otherToken)).status).toBe(404);
    expect((await api('/api/admin/orders', customerToken)).status).toBe(403);
    expect((await api(`/api/orders/${receipt.id}/approve`, customerToken, 'POST', {})).status).toBe(403);
    expect((await api(`/api/orders/${receipt.id}/reject`, otherToken, 'POST', {})).status).toBe(403);
    await customer.goto('/admin/orders');
    await expect(customer.getByRole('alert')).toHaveText(zh.orders.forbidden);
    await other.goto('/user');
    await expect(other.getByText(zh.orders.empty, { exact: true })).toBeVisible();
  });

  test('E2E-06 admin approval, rejection and immutable decisions', async () => {
    await admin.goto('/admin/orders');
    await admin.locator(`a[href="/orders/${receipt.id}"]`).click();
    await admin.getByLabel(zh.orders.note).fill('Synthetic approval');
    await admin.getByRole('button', { name: zh.orders.approve, exact: true }).click();
    await expect(admin.getByText(zh.order.approved, { exact: true })).toBeVisible();
    await expect(admin.getByText('Synthetic approval', { exact: true })).toBeVisible();
    expect((await api(`/api/orders/${receipt.id}/reject`, adminToken, 'POST', {})).status).toBe(409);
    const second = await api<OrderDto>('/api/orders/place', customerToken, 'POST', fixture.input, 'synthetic-rejection');
    expect(second.status).toBe(201);
    await admin.goto(`/orders/${second.data.id}`);
    await admin.getByLabel(zh.orders.note).fill('Synthetic rejection');
    await admin.getByRole('button', { name: zh.orders.reject, exact: true }).click();
    await expect(admin.getByText(zh.order.rejected, { exact: true })).toBeVisible();
    const rejected = await api<OrderDto>(`/api/orders/${second.data.id}`, customerToken);
    expect(rejected.data.status).toBe('rejected');
    expect(rejected.data.statusHistory[rejected.data.statusHistory.length - 1]?.toStatus).toBe('rejected');
    await customer.goto(`/orders/${receipt.id}`);
    await expect(customer.getByText(zh.order.approved, { exact: true })).toBeVisible();
  });

  test('E2E-07 concurrent idempotency, conflicting payload and key isolation', async () => {
    const key = 'synthetic-concurrent-checkout';
    await pace();
    const [first, replay] = await Promise.all([
      api<OrderDto>('/api/orders/place', customerToken, 'POST', fixture.input, key, false),
      api<OrderDto>('/api/orders/place', customerToken, 'POST', fixture.input, key, false),
    ]);
    expect([first.status, replay.status].sort()).toEqual([200, 201]);
    expect(first.data.id).toBe(replay.data.id);
    expect((await api('/api/orders/place', customerToken, 'POST', { ...fixture.input, qty: 2 }, key)).status).toBe(409);
    const distinct = await api<OrderDto>('/api/orders/place', otherToken, 'POST', fixture.input, key);
    expect(distinct.status).toBe(201);
    expect(distinct.data.id).not.toBe(first.data.id);
    const orders = await api<OrderDto[]>('/api/orders', customerToken);
    expect(orders.data.filter(order => order.id === first.data.id)).toHaveLength(1);
    expect(orders.data.some(order => order.id === distinct.data.id)).toBe(false);
  });

  test('E2E-08 real validation errors and browser transport recovery', async () => {
    expect((await api('/api/orders/place', customerToken, 'POST', {}, 'synthetic-empty-cart')).status).toBe(422);
    expect((await api('/api/shopping-cart/items', customerToken, 'POST', { ...fixture.input, qty: 0 })).status).toBe(400);
    expect((await api('/api/auth/me', 'invalid-synthetic-token')).status).toBe(401);
    // Fault injection only drops a read; successful data still comes from Express.
    await customer.route('**/api/products?**', route => route.abort('connectionfailed'));
    await customer.goto(`/search?category=${fixture.categorySlug}`);
    await expect(customer.getByRole('alert')).toContainText(zh.catalog.failed);
    await customer.unroute('**/api/products?**');
    await customer.getByRole('button', { name: zh.catalog.retry, exact: true }).click();
    await expect(customer.getByRole('heading', { level: 3 })).toHaveCount(2);
  });

  test('E2E-09 session expiry clears private UI and protects routes', async () => {
    await customer.goto('/user');
    await expect(customer.locator(`a[href="/orders/${receipt.id}"]`)).toBeVisible();
    // Advance the browser's clock beyond the genuine login token deadline.
    // This verifies CLIENT expiry; it does not pretend the API clock advanced.
    await customer.clock.setFixedTime(new Date(Date.now() + 16 * 60_000));
    await customer.evaluate(() => window.dispatchEvent(new Event('focus')));
    await expect(customer).toHaveURL(/\/auth\/signin$/);
    expect(await customer.evaluate(() => sessionStorage.getItem('clu.auth.session') === null)).toBe(true);
    await customer.goto(`/orders/${receipt.id}`);
    await expect(customer).toHaveURL(/\/auth\/signin$/);
    await expect(customer.getByRole('heading', { name: zh.order.title })).toHaveCount(0);
    // An independent admin context remains authenticated.
    await admin.goto('/admin/orders');
    await expect(admin.getByRole('heading', { name: zh.orders.admin })).toBeVisible();
  });
});
