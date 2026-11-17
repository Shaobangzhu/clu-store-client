import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import Support from '../src/pages/Support';
import VideoHero from '../src/components/VideoHero';
import ProductImage from '../src/components/ProductImage';
import { sanitizeSupportHtml } from '../src/helpers/supportHtml';
import { catalogService } from '../src/api/services';
import en from '../src/assets/languages/en-US.json';
import fr from '../src/assets/languages/fr-FR.json';
import cn from '../src/assets/languages/zh-CN.json';
import tw from '../src/assets/languages/zh-TW.json';

const i18n = createInstance();
void i18n.init({ lng: 'en-US', resources: { 'en-US': { translation: en } }, initAsync: false });
const wrap = (content: React.ReactNode) => <I18nextProvider i18n={i18n}>{content}</I18nextProvider>;
afterEach(cleanup);

it('rebuilds support formatting while discarding executable content and attributes', () => {
  const html = sanitizeSupportHtml('<h2 id="x" style="color:red">Help</h2><script>alert(1)</script><svg><a href="javascript:evil()">evil</a></svg><iframe src="/evil"></iframe><p onclick="evil()">Text <strong>bold</strong></p><img src="x" onerror="evil()"><form><input name="x"></form>');
  expect(html).toBe('<h2>Help</h2><p>Text <strong>bold</strong></p>');
});
it.each(['javascript:alert(1)', 'data:text/html,evil', '//evil.test', '/\\evil.test', 'java\nscript:alert(1)', '&#106;avascript:alert(1)'])('rejects unsafe support URL %s', href => {
  expect(sanitizeSupportHtml(`<a href="${href}" target="_blank" onmouseover="evil()">Help</a>`)).toBe('<a>Help</a>');
});
it.each(['/support', '#help', 'https://example.com/help', 'mailto:help@example.com'])('retains useful safe link %s', href => {
  expect(sanitizeSupportHtml(`<a href="${href}">Help</a>`)).toContain(`href="${href}"`);
});
it('shows safe support failures and retries with sanitized typed content', async () => {
  const request = vi.spyOn(catalogService, 'support').mockRejectedValueOnce(new Error('secret backend detail'))
    .mockResolvedValueOnce({ data: { locale: 'en-US', html: '<h1>Support help</h1><script>evil()</script>' }, meta: null, status: 200, requestId: null });
  render(wrap(<Support />));
  expect(await screen.findByRole('alert')).toBeTruthy();
  expect(screen.queryByText('secret backend detail')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByRole('heading', { name: 'Support help' })).toBeTruthy();
  expect(request).toHaveBeenCalledTimes(2);
});
it('shows empty support content after removing unsafe content', async () => {
  vi.spyOn(catalogService, 'support').mockResolvedValue({ data: { locale: 'en-US', html: '<script>evil()</script>' }, meta: null, status: 200, requestId: null });
  render(wrap(<Support />));
  expect(await screen.findByText(en.support.empty)).toBeTruthy();
});
it('falls back after both video sources fail', () => {
  const { container } = render(wrap(<VideoHero videoSrc="/media/a.mp4" videoSmallSrc="/media/b.mp4" />));
  fireEvent.error(container.querySelector('video')!);
  fireEvent.error(container.querySelector('video')!);
  expect(screen.getByRole('status').textContent).toBe(en.ui.noVideo);
});
it('handles absent and broken images and recovers for a different source', () => {
  const { rerender } = render(wrap(<ProductImage alt="Tablet" />));
  expect(screen.getByText(en.catalog.noImage)).toBeTruthy();
  rerender(wrap(<ProductImage src="/media/a.png" alt="Tablet" />));
  fireEvent.error(screen.getByAltText('Tablet'));
  expect(screen.getByText(en.catalog.noImage)).toBeTruthy();
  rerender(wrap(<ProductImage src="/media/b.png" alt="Tablet" />));
  expect(screen.getByAltText('Tablet').getAttribute('src')).toBe('/media/b.png');
});
it('provides the same nonempty translation keys in four languages', () => {
  function keys(value: object, prefix = ''): string[] {
    return Object.entries(value).flatMap(([key, child]) => typeof child === 'object' ? keys(child, `${prefix}${key}.`) : [`${prefix}${key}`]);
  }
  for (const locale of [fr, cn, tw]) expect(keys(locale).sort()).toEqual(keys(en).sort());
  for (const locale of [en, fr, cn, tw]) for (const label of [...Object.values(locale.ui), ...Object.values(locale.support)]) expect(label.trim()).not.toBe('');
});
