import DOMPurify from 'dompurify';

let purifier = DOMPurify;
{
  const { JSDOM } = await import('jsdom');
  const { window } = new JSDOM("");
  purifier = DOMPurify(window);
}
const sanitizeHtml = (html, config) => purifier.sanitize(html, config);

export { sanitizeHtml as s };
//# sourceMappingURL=sanitizeHtml-jsTyqf9a.mjs.map
