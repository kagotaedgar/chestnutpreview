// Post-build QA: links, anchors, metadata, headings, sitemap, redirects, forms, em dashes.
import fs from 'node:fs';
import path from 'node:path';
const DIST = path.resolve('dist');
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); f.isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(DIST);
const toUrl = (f) => '/' + path.relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');
const exists = (u) => { const clean = u.split('#')[0].split('?')[0]; if (!clean || clean === '/') return true;
  if (/\.[a-z0-9]+$/i.test(clean)) return fs.existsSync(path.join(DIST, clean));
  return fs.existsSync(path.join(DIST, clean, 'index.html')); };
const errs = [], titles = new Map(), descs = new Map();
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8'), url = toUrl(f);
  const m = (re) => (html.match(re) || [])[1];
  const title = m(/<title>(.*?)<\/title>/), desc = m(/<meta name="description" content="(.*?)">/);
  const noindex = /content="noindex/.test(html);
  if (!noindex) {
    if (!title) errs.push(`${url}: missing title`); else { if (titles.has(title)) errs.push(`${url}: duplicate title with ${titles.get(title)}`); titles.set(title, url); if (title.length > 70) errs.push(`${url}: title ${title.length} chars`); }
    if (!desc) errs.push(`${url}: missing description`); else { if (descs.has(desc)) errs.push(`${url}: duplicate description with ${descs.get(desc)}`); descs.set(desc, url); if (desc.length > 175) errs.push(`${url}: description ${desc.length} chars`); }
    if (!/rel="canonical"/.test(html)) errs.push(`${url}: no canonical`);
  }
  const h1 = (html.match(/<h1[ >]/g) || []).length; if (h1 !== 1) errs.push(`${url}: ${h1} h1 tags`);
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    if (href.startsWith('/') && !exists(href)) errs.push(`${url}: broken link ${href}`);
  }
  for (const [, id] of html.matchAll(/aria-controls="([^"]+)"/g)) if (!html.includes(`id="${id}"`)) errs.push(`${url}: aria-controls target missing ${id}`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) if (!/ alt=/.test(tag)) errs.push(`${url}: img without alt`);
  if (/[\u2014\u2013]/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) errs.push(`${url}: contains a long dash`);
  for (const [, j] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(j); } catch { errs.push(`${url}: invalid JSON-LD`); } }
}
const sm = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
for (const [, loc] of sm.matchAll(/<loc>(.*?)<\/loc>/g)) { const p = loc.replace(/^https?:\/\/[^/]+/, ''); if (!exists(p)) errs.push(`sitemap: ${p} not built`); }
for (const line of fs.readFileSync(path.join(DIST, '_redirects'), 'utf8').split('\n').filter(Boolean)) { const [, to] = line.split(' '); if (!exists(to)) errs.push(`redirect target missing: ${line}`); if (to === '/') errs.push(`redirect to homepage: ${line}`); }
// every indexable page should be linked from somewhere
const linked = new Set(); for (const f of files) for (const [, h] of fs.readFileSync(f, 'utf8').matchAll(/href="(\/[^"#?]*)"/g)) linked.add(h);
for (const f of files) { const u = toUrl(f); if (u !== '/' && !u.endsWith('404.html') && !linked.has(u)) errs.push(`orphan page (no internal links): ${u}`); }
console.log(`Checked ${files.length} pages.`);
if (errs.length) { console.log(errs.join('\n')); process.exit(1); } else console.log('All checks passed.');
