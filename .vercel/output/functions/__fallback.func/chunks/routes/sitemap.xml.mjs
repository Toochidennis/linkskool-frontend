import { d as defineEventHandler, s as setHeader } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const isObject = (obj) => obj !== null && typeof obj === "object" && !Array.isArray(obj) && !(obj instanceof Date);
const isArray = (obj) => Array.isArray(obj);
const toCamel = (obj) => {
  if (isArray(obj)) {
    return obj.map(toCamel);
  }
  if (isObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, m) => m.toUpperCase()),
        toCamel(v)
      ])
    );
  }
  return obj;
};

async function fetchAllNewsSlugs(baseUrl, apiKey) {
  var _a, _b, _c, _d;
  const slugs = [];
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const limit = 100;
  let page = 1;
  for (let guard = 0; guard < 50; guard++) {
    const response = await fetch(`${cleanBase}/news/list?page=${page}&limit=${limit}`, {
      headers: apiKey ? { "x-api-key": apiKey } : {}
    });
    if (!response.ok) {
      break;
    }
    const raw = await response.json();
    const payload = toCamel((_a = raw == null ? void 0 : raw.data) != null ? _a : raw);
    for (const item of (_c = (_b = payload == null ? void 0 : payload.data) == null ? void 0 : _b.news) != null ? _c : []) {
      if (item == null ? void 0 : item.slug) {
        slugs.push(item.slug);
      }
    }
    if (!((_d = payload == null ? void 0 : payload.meta) == null ? void 0 : _d.hasNext)) {
      break;
    }
    page++;
  }
  return slugs;
}

const SITE = "https://linkskool.com";
const staticRoutes = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/about", changefreq: "monthly", priority: "0.8" },
  { loc: "/news", changefreq: "daily", priority: "0.9" },
  { loc: "/contact", changefreq: "monthly", priority: "0.7" },
  { loc: "/faqs", changefreq: "monthly", priority: "0.6" },
  { loc: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { loc: "/terms-of-use", changefreq: "yearly", priority: "0.3" }
];
const sitemap_xml = defineEventHandler(async (event) => {
  const baseUrl = process.env.VITE_API_BASE_URL || "https://linkskool.com/api/v4/public";
  const apiKey = process.env.VITE_API_KEY;
  let newsSlugs = [];
  try {
    newsSlugs = await fetchAllNewsSlugs(baseUrl, apiKey);
  } catch {
  }
  const lastmod = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const urls = [
    ...staticRoutes,
    ...newsSlugs.map((slug) => ({
      loc: `/news/${slug}`,
      changefreq: "weekly",
      priority: "0.7"
    }))
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
` + urls.map(
    (u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  ).join("\n") + `
</urlset>
`;
  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return body;
});

export { sitemap_xml as default };
//# sourceMappingURL=sitemap.xml.mjs.map
