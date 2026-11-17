// Rebuild a small, inert documentation vocabulary. Never copy arbitrary attributes,
// embedded content, styles, forms, SVG or executable URLs from API content.
const tags = new Set(['P', 'BR', 'H1', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'STRONG', 'EM', 'B', 'I', 'A', 'BLOCKQUOTE', 'PRE', 'CODE', 'HR', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD']);
const dropped = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH', 'FORM', 'INPUT', 'BUTTON', 'TEMPLATE', 'IMG', 'VIDEO', 'AUDIO', 'LINK', 'META', 'BASE']);

export function sanitizeSupportHtml(html: string): string {
  const source = new DOMParser().parseFromString(html, 'text/html');
  const output = document.createElement('div');
  function copy(node: Node, parent: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      parent.appendChild(document.createTextNode(node.textContent ?? ''));
      return;
    }
    if (!(node instanceof Element) || node.namespaceURI !== "http://www.w3.org/1999/xhtml" || dropped.has(node.tagName)) return;
    const target = tags.has(node.tagName) ? document.createElement(node.tagName.toLowerCase()) : document.createDocumentFragment();
    if (target instanceof HTMLAnchorElement) {
      const href = node.getAttribute('href')?.trim();
      // Only same-origin absolute paths, fragments, HTTPS and mail links.
      if (href && !/[\u0000-\u0020\\]/.test(href) && (/^\/(?!\/)/.test(href) || href.startsWith('#') || /^https:\/\//i.test(href) || /^mailto:/i.test(href))) {
        target.setAttribute('href', href);
        target.setAttribute('rel', 'noopener noreferrer');
      }
    }
    for (const child of node.childNodes) copy(child, target);
    parent.appendChild(target);
  }
  for (const child of source.body.childNodes) copy(child, output);
  return output.innerHTML;
}
