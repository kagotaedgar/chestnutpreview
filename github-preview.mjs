// Preview-only post-build adjustment for GitHub Pages project sites.
// Production builds remain rooted at chestnut.co.ke.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const repo = (process.env.GITHUB_REPOSITORY || 'kagotaedgar/chestnutpreview').split('/').pop();
const base = `/${repo}`;
const prefix = (url) => {
  if (!url || url.startsWith('//') || url.startsWith('http:') || url.startsWith('https:') || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')) return url;
  if (url === '/') return `${base}/`;
  const clean = url.replace(/^\/+/, '');
  if (clean === repo || clean.startsWith(`${repo}/`)) return `/${clean}`;
  return `${base}/${clean}`;
};
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      html = html.replace(/(href|src|action)="(\/[^" ]*)"/g, (m, attr, url) => `${attr}="${prefix(url)}"`);
      html = html.replace('</head>', '<meta name="robots" content="noindex,nofollow">\n</head>');
      fs.writeFileSync(full, html);
    }
  }
}
walk(root);
const cssPath = path.join(root, 'styles.css');
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  css = css.replace(/url\(\s*['\"]?\/(?!\/)([^'\")]+)['\"]?\s*\)/g, (m, asset) => `url('${base}/${asset}')`);
  fs.writeFileSync(cssPath, css);
}
fs.writeFileSync(path.join(root, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`GitHub Pages preview path adjustments complete for ${base}.`);
