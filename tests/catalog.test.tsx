import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, createMemoryRouter, RouterProvider } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import type { ReactNode } from 'react';
import type { ProductDto } from '../src/api/services';
import { catalogService } from '../src/api/services';
import { toProduct } from '../src/api/adapters';
import { addMoney, canPurchase, formatMoney, previewPrice, selectedCartItem } from '../src/api/catalog';
import searchReducer, { fetchSearchResults } from '../src/redux/searchSlice';
import Home from '../src/pages/Home';
import Category from '../src/pages/Category';
import SearchResults from '../src/pages/SearchResults';
import ProductDetail from '../src/pages/ProductDetail/ProductDetail';
import ProductError from '../src/pages/ProductDetail/ProductError';
import ProductHero from '../src/components/ProductHero';
import ProductImage from '../src/components/ProductImage';
import VideoHero from '../src/components/VideoHero';
import { ShoppingCartContext } from '../src/contexts/shoppingCart';
import { loadProducts } from '../src/helpers/loaders';
import english from '../src/assets/languages/en-US.json';
import { defaultShoppingCartContext } from '../src/contexts/shoppingCart/shoppingCartContext';
import Header from '../src/components/Header';
import i18nReducer from '../src/redux/i18nSlice';
import userReducer from '../src/redux/userSlice';

vi.mock('../src/assets/apple.svg?react', () => ({ default: () => <svg aria-label="Store logo" /> }));

const i18n = createInstance();
void i18n.init({ lng: 'en-US', resources: { 'en-US': { translation: english } }, initAsync: false });
const product: ProductDto = {
  id: 41, name: 'Live tablet', title: 'A real product', image: '/media/tablet.svg', carouselImages: [],
  startingPrice: '900.00', installments: null, features: [], inStock: true, category: 'tablets',
  models: [{ id: 11, name: 'Base', specification: 'M4', price: '10.10', inStock: true },
    { id: 12, name: 'Pro', specification: 'M5', price: '20.20', inStock: true },
    { id: 13, name: 'Unavailable model', specification: '', price: '1.00', inStock: false }],
  memorySizes: [{ id: 21, name: '128GB', price: '0.20', inStock: true },
    { id: 22, name: '256GB', price: '3.30', inStock: true },
    { id: 23, name: 'Unavailable memory', price: '0.00', inStock: false }], colors: ['Blue', 'Black'],
};
const pageMeta = { page: 1, pageSize: 12, total: 13, totalPages: 2 };
const categories = [{ id: 1, title: 'Tablets', slug: 'tablets', subTitle: null }];
function mockApi(handler: (url: URL, request: Request) => unknown) {
  const requests: Request[] = [];
  vi.stubGlobal('fetch', vi.fn(async (request: Request) => {
    requests.push(request);
    const result = handler(new URL(request.url), request);
    if (result instanceof Response) return result;
    return new Response(JSON.stringify({ success: true, meta: null, ...result as object }), { headers: { 'Content-Type': 'application/json' } });
  }));
  return requests;
}
const provide = (children: ReactNode) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
function cartProvider(children: ReactNode, add = vi.fn()) {
  return <ShoppingCartContext.Provider value={{ ...defaultShoppingCartContext, authenticated: true, ready: true, cartItems: [], addToCart: add, removeFromCart: vi.fn(),
    updateItem: vi.fn(), clearCart: vi.fn(), refreshCart: async () => true }}>{children}</ShoppingCartContext.Provider>;
}
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('catalog pricing and availability', () => {
  it('adds model base plus memory increment exactly without startingPrice', () => {
    expect(addMoney('0.10', '0.20')).toBe('0.30');
    expect(formatMoney('9007199254740993.01')).toBe('RMB 9,007,199,254,740,993.01');
    expect(previewPrice(product)).toBe('10.30');
    expect(previewPrice(product, 12, 22)).toBe('23.50');
    expect(previewPrice(product, undefined, 22)).toBe('13.40');
    expect(selectedCartItem(product, 12, 'Blue', 22)).toEqual({ productId: 41, modelId: 12, memorySizeId: 22, color: 'Blue', qty: 1 });
    expect(toProduct(product).startingPrice).toBe('900.00');
  });
  it('refuses incomplete, foreign and unavailable SKU selections', () => {
    expect(selectedCartItem(product)).toBeNull();
    expect(selectedCartItem(product, 11, 'Unknown', 21)).toBeNull();
    expect(selectedCartItem(product, 999, 'Blue', 21)).toBeNull();
    expect(selectedCartItem(product, 13, 'Blue', 21)).toBeNull();
    expect(selectedCartItem(product, 11, 'Blue', 23)).toBeNull();
    expect(selectedCartItem({ ...product, inStock: false }, 11, 'Blue', 21)).toBeNull();
    expect(canPurchase({ ...product, models: [] })).toBe(false);
    expect(canPurchase({ ...product, colors: [] })).toBe(false);
    expect(canPurchase({ ...product, memorySizes: [] })).toBe(false);
    expect(selectedCartItem({ ...product, models: [{ ...product.models[0]!, price: '9007199254740993.01' }] }, 11, 'Blue', 21)).toEqual({ productId: 41, modelId: 11, memorySizeId: 21, color: 'Blue', qty: 1 });
  });
});

describe('live home and category content', () => {
  it('uses live category slugs in desktop and mobile navigation from a nested route', async () => {
    mockApi(() => ({ data: categories }));
    const store = configureStore({ reducer: { search: searchReducer, i18n: i18nReducer, user: userReducer } });
    render(provide(<Provider store={store}><MemoryRouter initialEntries={['/product-detail/41']}><Header /></MemoryRouter></Provider>));
    await waitFor(() => expect(screen.getAllByRole('link', { name: 'iPad' })).toHaveLength(2));
    for (const link of screen.getAllByRole('link', { name: 'iPad' })) expect(link.getAttribute('href')).toBe('/categories/tablets');
    expect(screen.queryByRole('link', { name: 'iPhone' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Shopping cart' })).toBeTruthy();
    const menu = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(menu);
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement?.textContent).toBe('Close menu');
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(menu);
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Search' }));
    fireEvent.keyUp(document.activeElement!, { key: 'Escape' });
    expect(screen.queryByRole('textbox')).toBeNull();

  });
  it('loads live cards and full featured SKU data, linking only product cards', async () => {
    const requests = mockApi(url => {
      if (url.pathname.endsWith('/offers')) return { data: [] };
      if (url.pathname.endsWith('/newarrivals')) return { data: [
        { id: 1, productId: 41, title: 'Live arrival', detail: 'Today', image: '/media/a.svg', soldOut: false, textColor: 'black' },
        { id: 2, productId: null, title: 'Editorial', detail: 'News', image: '', soldOut: true, textColor: 'black' },
      ] };
      if (url.pathname === '/api/products') return { data: [product], meta: pageMeta };
      if (url.pathname === '/api/products/41') return { data: product };
      throw new Error(`Unexpected ${url.pathname}`);
    });
    render(provide(<MemoryRouter><Home /></MemoryRouter>));
    await screen.findByText('Live arrival');
    await screen.findByText('Buy Live tablet');
    expect(screen.getByRole('link', { name: /Live arrival/ }).getAttribute('href')).toBe('/product-detail/41');
    expect(screen.getByText('Editorial').closest('a')).toBeNull();
    expect(screen.getByText('Special Offers')).toBeTruthy();
    expect(screen.queryByText('迎新春限时优惠')).toBeNull();
    expect(requests.some(request => new URL(request.url).pathname === '/api/products/41')).toBe(true);
    expect(screen.getByRole('link', { name: english.cart.signIn })).toBeTruthy();
  });
  it('renders active offers returned by the API with nullable product links', async () => {
    mockApi(url => {
      if (url.pathname.endsWith('/offers')) return { data: [
        { id: 9, productId: 41, type: 'Active', title: 'Current offer', detail: 'Live', image: '/media/o.svg', soldOut: false },
        { id: 10, productId: null, type: 'News', title: 'Editorial offer', detail: 'Info', image: '', soldOut: false },
      ] };
      return { data: [], meta: pageMeta };
    });
    render(provide(<MemoryRouter><Home /></MemoryRouter>));
    expect((await screen.findByRole('link', { name: /Current offer/ })).getAttribute('href')).toBe('/product-detail/41');
    expect(screen.getByText('Editorial offer').closest('a')).toBeNull();
  });
  it('shows independent home failures and retries without fixture fallback', async () => {
    let failed = true;
    mockApi(() => {
      if (failed) throw new Error('offline');
      return { data: [], meta: pageMeta };
    });
    render(provide(<MemoryRouter><Home /></MemoryRouter>));
    await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(3));
    failed = false;
    for (const button of screen.getAllByRole('button', { name: 'Try again' })) fireEvent.click(button);
    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(0));
    expect(screen.queryByText(/iPhone 16/)).toBeNull();
  });
  it('uses category slugs, handles null videos and links summaries to real detail routes', async () => {
    const requests = mockApi(() => ({ data: { id: 1, title: 'Tablets', slug: 'tablets', subTitle: null,
      videos: null, features: [], products: [{ id: 41, name: 'Live tablet', title: 'Available', image: '',
        startingPrice: '10.10', installments: null, features: [], inStock: false }] } }));
    const { container } = render(provide(<MemoryRouter initialEntries={['/categories/tablets']}>
      <Routes><Route path="/categories/:category" element={<Category />} /></Routes>
    </MemoryRouter>));
    await screen.findByText('Live tablet');
    expect(new URL(requests[0]!.url).pathname).toBe('/api/categories/tablets');
    expect(container.querySelector('video')).toBeNull();
    expect(screen.getByRole('link', { name: 'Learn more' }).getAttribute('href')).toBe('/product-detail/41');
    expect(screen.queryByRole('link', { name: 'Choose options' })).toBeNull();
    expect(screen.getByRole('link', { name: 'View all products' }).getAttribute('href')).toBe('/search?category=tablets');
    expect(screen.queryByText(/month/)).toBeNull();
  });
  it('shows category errors instead of an endless loading skeleton', async () => {
    mockApi(() => { throw new Error('offline'); });
    render(provide(<MemoryRouter initialEntries={['/categories/tablets']}>
      <Routes><Route path="/categories/:category" element={<Category />} /></Routes>
    </MemoryRouter>));
    await screen.findByRole('alert');
    expect(screen.queryByRole('status')).toBeNull();
  });
});

function searchView(entry = '/search?query=tablet') {
  const store = configureStore({ reducer: { search: searchReducer } });
  render(provide(<Provider store={store}><MemoryRouter initialEntries={[entry]}><Routes>
    <Route path="/search" element={<SearchResults />} />
    <Route path="/product-detail/:id" element={<p>Choose a full SKU</p>} />
  </Routes></MemoryRouter></Provider>));
  return store;
}
describe('server search and pagination', () => {
  it('sends keyword/category/page/pageSize, uses total metadata and resets page on filters', async () => {
    const requests = mockApi(url => {
      if (url.pathname === '/api/categories') return { data: categories };
      const page = Number(url.searchParams.get('page'));
      return { data: [{ ...product, name: `Page ${page} tablet` }], meta: { ...pageMeta, page } };
    });
    searchView();
    await screen.findByText('Page 1 tablet');
    expect(screen.getByText('Products found: 13')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Previous' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByText('Page 2 tablet');
    expect(screen.queryByText('Page 1 tablet')).toBeNull();
    expect((screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Tablets' }));
    await screen.findByText('Page 1 tablet');
    const last = new URL(requests.filter(request => new URL(request.url).pathname === '/api/products').at(-1)!.url);
    expect(Object.fromEntries(last.searchParams)).toEqual({ keyword: 'tablet', category: 'tablets', page: '1', pageSize: '12' });
    fireEvent.click(screen.getByRole('button', { name: 'Choose options' }));
    await screen.findByText('Choose a full SKU');
  });
  it('resets keyword pagination, searches blank keywords and never sends invalid pages', async () => {
    const requests = mockApi(url => url.pathname === '/api/categories' ? { data: categories } : { data: [product], meta: pageMeta });
    searchView('/search?query=old&page=-3');
    await screen.findByText('Live tablet');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    await waitFor(() => {
      const last = new URL(requests.filter(request => new URL(request.url).pathname === '/api/products').at(-1)!.url);
      expect(last.searchParams.has('keyword')).toBe(false);
      expect(last.searchParams.get('page')).toBe('1');
    });
  });
  it('handles empty searches, failures and retries with disabled paging', async () => {
    let failure = true;
    mockApi(url => {
      if (url.pathname === '/api/categories') return { data: [] };
      if (failure) throw new Error('offline');
      return { data: [], meta: { ...pageMeta, total: 0, totalPages: 0 } };
    });
    searchView('/search');
    await screen.findByRole('alert');
    expect((screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement).disabled).toBe(true);
    failure = false;
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await screen.findByText('No products available.');
    expect(screen.getByText('Products found: 0')).toBeTruthy();
  });
  it('ignores stale fulfillment/rejection and treats cancellation without an error', () => {
    let state = searchReducer(undefined, fetchSearchResults.pending('old', { keyword: 'old' }));
    state = searchReducer(state, fetchSearchResults.pending('new', { keyword: 'new' }));
    state = searchReducer(state, fetchSearchResults.fulfilled({ items: [product], meta: pageMeta }, 'old', {}));
    expect(state.items).toEqual([]);
    expect(state.isLoading).toBe(true);
    state = searchReducer(state, fetchSearchResults.rejected(new Error('late'), 'old', {}));
    expect(state.error).toBeNull();
    state = searchReducer(state, fetchSearchResults.fulfilled({ items: [product], meta: pageMeta }, 'new', {}));
    expect(state.items).toEqual([product]);
    state = searchReducer(state, fetchSearchResults.pending('cancel', {}));
    state = searchReducer(state, fetchSearchResults.rejected({ name: 'AbortError', message: 'Aborted' }, 'cancel', {}));
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });
});

describe('detail and hero SKU selection', () => {
  it('loads detail, previews changes and adds only a complete available SKU', async () => {
    mockApi(() => ({ data: product }));
    const add = vi.fn();
    const router = createMemoryRouter([{ path: '/product-detail/:id', loader: ({ params, request }) => loadProducts(params.id!, request.signal), element: <ProductDetail />, hydrateFallbackElement: <p>Loading</p> }], {
      initialEntries: ['/product-detail/41'],
    });
    render(provide(cartProvider(<RouterProvider router={router} />, add)));
    await screen.findByText('Buy Live tablet');
    const button = screen.getByRole('button', { name: 'Add to Cart' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(screen.getByRole('button', { name: /Unavailable model/ }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Pro \(M5\)/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Blue' }));
    expect(button.disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /256GB/ }));
    expect(screen.getByText('RMB 23.50')).toBeTruthy();
    expect(button.disabled).toBe(false);
    fireEvent.click(button);
    expect(add).toHaveBeenCalledWith(expect.objectContaining({ productId: 41, modelId: 12, memorySizeId: 22, color: 'Blue', qty: 1 }));
  });
  it('disables purchases for an unavailable product and incomplete summary SKU data', () => {
    const add = vi.fn();
    const { rerender } = render(provide(cartProvider(<MemoryRouter><ProductHero product={{ ...product, inStock: false }} /></MemoryRouter>, add)));
    expect((screen.getByRole('button', { name: 'Add to Cart' }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText('Currently unavailable')).toBeTruthy();
    rerender(provide(cartProvider(<MemoryRouter><ProductHero product={{ ...product, models: [], memorySizes: [], colors: [] }} /></MemoryRouter>, add)));
    expect((screen.getByRole('button', { name: 'Add to Cart' }) as HTMLButtonElement).disabled).toBe(true);
    expect(add).not.toHaveBeenCalled();
  });
  it('uses IDs for hero choices and clears selections when the product changes', () => {
    const add = vi.fn();
    const { rerender } = render(provide(cartProvider(<MemoryRouter><ProductHero product={product} /></MemoryRouter>, add)));
    fireEvent.change(screen.getByLabelText('Model'), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText('Finish'), { target: { value: 'Blue' } });
    fireEvent.change(screen.getByLabelText('Storage Capacity'), { target: { value: '22' } });
    expect(screen.getByText('RMB 23.50')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(add).toHaveBeenCalledWith(expect.objectContaining({ modelId: 12, memorySizeId: 22 }));
    rerender(provide(cartProvider(<MemoryRouter><ProductHero product={{ ...product, id: 42 }} /></MemoryRouter>, add)));
    expect((screen.getByRole('button', { name: 'Add to Cart' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByLabelText('Model') as HTMLSelectElement).value).toBe('');
  });
  it('renders a recoverable detail error and 404 without purchase controls', async () => {
    mockApi(() => new Response(JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: 'Missing', details: null } }), {
      status: 404, headers: { 'Content-Type': 'application/json' },
    }));
    const router = createMemoryRouter([{ path: '/product-detail/:id', loader: ({ params }) => loadProducts(params.id!),
      element: <ProductDetail />, errorElement: <ProductError /> }], { initialEntries: ['/product-detail/999'] });
    render(provide(<RouterProvider router={router} />));
    await screen.findByText('No products available.');
    expect(screen.queryByRole('button', { name: 'Add to Cart' })).toBeNull();
  });
  it('retries failed detail loaders and handles nullable image data from the server', async () => {
    let failed = true;
    mockApi(() => {
      if (failed) return new Response('Unavailable', { status: 503 });
      return { data: { ...product, image: null, carouselImages: null } };
    });
    const router = createMemoryRouter([{ path: '/product-detail/:id', loader: ({ params }) => loadProducts(params.id!),
      element: <ProductDetail />, errorElement: <ProductError />, hydrateFallbackElement: <p>Loading</p> }], { initialEntries: ['/product-detail/41'] });
    render(provide(<RouterProvider router={router} />));
    await screen.findByRole('alert');
    failed = false;
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await screen.findByText('Buy Live tablet');
    expect(screen.getByText('Image unavailable')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });
  it('aborts a superseded server search', async () => {
    let signal: AbortSignal | undefined;
    vi.spyOn(catalogService, 'products').mockImplementation((_query, options) => {
      signal = options?.signal;
      return new Promise(() => {});
    });
    const store = configureStore({ reducer: { search: searchReducer } });
    const pending = store.dispatch(fetchSearchResults({ keyword: 'old' }));
    await act(async () => { pending.abort(); await pending; });
    expect(signal?.aborted).toBe(true);
    expect(store.getState().search.error).toBeNull();
  });
});

describe('catalog media fallback', () => {
  it('handles missing images, broken media and recovers for a new URL', () => {
    const { rerender } = render(provide(<ProductImage src="" alt="Product" />));
    expect(screen.getByText('Image unavailable')).toBeTruthy();
    rerender(provide(<ProductImage src="/media/a.svg" alt="Product" />));
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('Image unavailable')).toBeTruthy();
    rerender(provide(<ProductImage src="/media/b.svg" alt="Product" />));
    expect(screen.getByRole('img').getAttribute('src')).toBe('/media/b.svg');
  });
  it('uses the available video size and hides failed or missing videos', () => {
    const { container, rerender } = render(<VideoHero videoSrc="/media/regular.mp4" videoSmallSrc="" />);
    expect(container.querySelector('video')?.getAttribute('src')).toBe('/media/regular.mp4');
    fireEvent.error(container.querySelector('video')!);
    expect(container.querySelector('video')).toBeNull();
    rerender(<VideoHero videoSrc="" videoSmallSrc="" />);
    expect(container.querySelector('video')).toBeNull();
  });
  it('falls back to the alternate video when the preferred size fails', () => {
    const { container } = render(<VideoHero videoSrc="/media/regular.mp4" videoSmallSrc="/media/small.mp4" />);
    expect(container.querySelector('video')?.getAttribute('src')).toBe('/media/regular.mp4');
    fireEvent.error(container.querySelector('video')!);
    expect(container.querySelector('video')?.getAttribute('src')).toBe('/media/small.mp4');
    fireEvent.error(container.querySelector('video')!);
    expect(container.querySelector('video')).toBeNull();
  });
});
