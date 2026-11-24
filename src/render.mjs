import { site } from './config.mjs';

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const abs = (p) => site.url + p;
export const registry = new Map(); // path -> { label, parent }

const nav = [
  ['/', 'Home'],
  ['/insurance-solutions/', 'Products'],
  ['/business-insurance-kenya/', 'Business'],
  ['/insurance-advisory-services/', 'Services'],
  ['/insurance-guides/', 'Our Blog'],
  ['/contact-us/', 'Contact']
];

// ---------- contact helpers ----------
export const waLink = (text = 'Hello Chestnut, I would like some insurance advice.') =>
  site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : '';
export const telLink = () => (site.phone ? `tel:${site.phone}` : '');
export const mailLink = () => (site.email ? `mailto:${site.email}` : '');
export const consultationLink = () => site.calendlyUrl || '/contact-us/';

export function contactButtons(light = false, waText) {
  const cls = light ? 'btn btn-light' : 'btn btn-ghost';
  const out = [];
  if (site.whatsapp) out.push(`<a class="${cls}" href="${esc(waLink(waText))}" rel="noopener">Chat on WhatsApp</a>`);
  if (site.phone) out.push(`<a class="${cls}" href="${esc(telLink())}">Call ${esc(site.phoneDisplay || site.phone)}</a>`);
  return out.join('');
}

// ---------- breadcrumbs ----------
export function crumbTrail(path, currentLabel) {
  const trail = [];
  let node = registry.get(path);
  let parent = node && node.parent;
  while (parent) {
    const r = registry.get(parent);
    if (!r) break;
    trail.unshift([r.label, parent]);
    parent = r.parent;
  }
  trail.unshift(['Home', '/']);
  trail.push([currentLabel, path]);
  return trail;
}
export const crumbsHtml = (trail) =>
  `<nav class="crumbs" aria-label="Breadcrumb"><ol>${trail
    .map(([n, p], i) => (i === trail.length - 1 ? `<li><span aria-current="page">${esc(n)}</span></li>` : `<li><a href="${p}">${esc(n)}</a></li>`))
    .join('')}</ol></nav>`;
export const crumbsSchema = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(p) }))
});

// ---------- components ----------
export const faqHtml = (faqs) =>
  faqs && faqs.length
    ? `<div class="faq">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`
    : '';
export const faqSchema = (faqs) =>
  faqs && faqs.length
    ? { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
    : null;

export const ul = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

export function indexList(paths, descOf) {
  return `<ul class="index">${paths
    .filter((p) => registry.has(p))
    .map((p) => {
      const r = registry.get(p);
      return `<li><a href="${p}"><span class="i-name">${esc(r.label)}</span><span class="i-desc">${esc(descOf ? descOf(p, r) : r.blurb || '')}</span><span class="i-go">View</span></a></li>`;
    })
    .join('')}</ul>`;
}

export function ctaBand(title = 'Not sure what you need? Start with a conversation.', text = 'Tell us about your business, your family or your project. An advisor will come back with practical options and plain explanations. No pressure and no jargon.') {
  return `<section class="cta-band cta-band-brand"><div class="wrap">
    <h2>${esc(title)}</h2><p>${esc(text)}</p>
    <div class="btn-row"><a class="btn btn-primary" href="/get-a-quote/">Get a quote</a><a class="btn btn-light" href="${esc(consultationLink())}">Speak to an advisor</a>${contactButtons(true)}</div>
  </div></section>`;
}

export function field({ id, label, type = 'text', required = false, hint = '', options, autocomplete, rows }) {
  const req = required ? ' required' : '';
  const lab = `<label for="${id}">${esc(label)}${required ? '' : ' <span class="hint">(optional)</span>'}${hint ? ` <span class="hint">${esc(hint)}</span>` : ''}</label>`;
  let input;
  if (options) input = `<select id="${id}" name="${id}"${req}>${options}</select>`;
  else if (type === 'textarea') input = `<textarea id="${id}" name="${id}" rows="${rows || 4}"${req}></textarea>`;
  else input = `<input id="${id}" name="${id}" type="${type}"${req}${autocomplete ? ` autocomplete="${autocomplete}"` : ''}>`;
  return `<div class="field">${lab}${input}<div class="err" aria-live="polite"></div></div>`;
}

export function formShell(name, subject, inner, submitLabel = 'Send enquiry') {
  return `<form class="form" data-chestnut-form="${esc(name)}" data-subject="${esc(subject)}" data-endpoint="${esc(site.formEndpoint)}" data-email="${esc(site.email)}" method="post" action="#">
    ${inner}
    <div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
    <label class="check"><input type="checkbox" name="consent" required><span>I agree that Chestnut may use these details to respond to my enquiry. See the <a href="/privacy/">privacy notice</a>.</span></label>
    <div class="err" aria-live="polite"></div>
    <button class="btn btn-primary" type="submit">${esc(submitLabel)}</button>
    <div class="form-status" role="status" tabindex="-1"></div>
    <p class="form-note">${
      site.formEndpoint
        ? 'Your enquiry is sent securely to Chestnut and used only to respond to you.'
        : site.email
          ? 'Submitting opens your email app with your enquiry prefilled. Nothing is stored by this website.'
          : 'Form delivery is not connected yet. Complete the details and use the contact options on this site.'
    }</p>
  </form>`;
}

// ---------- schema ----------
export function orgSchema() {
  const addr = { '@type': 'PostalAddress', streetAddress: site.addressLine, addressLocality: site.locality, addressCountry: site.country };
  const org = {
    '@type': ['InsuranceAgency', 'Organization'],
    '@id': abs('/#org'),
    name: site.name,
    slogan: site.tagline,
    url: abs('/'),
    logo: abs('/images/chestnut-logo-correct.png'),
    address: addr,
    areaServed: { '@type': 'Country', name: 'Kenya' }
  };
  if (site.phone) org.telephone = site.phone;
  if (site.email) org.email = site.email;
  if (site.sameAs.length) org.sameAs = site.sameAs;
  return org;
}
export const websiteSchema = () => ({ '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: site.name, publisher: { '@id': abs('/#org') } });

// ---------- layout ----------
export function layout(page) {
  const { path, title, desc, body, schema = [], noindex = false, ogType = 'website' } = page;
  const canonical = abs(path);
  const graph = [orgSchema(), websiteSchema(), ...schema.filter(Boolean)];
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  const ga = site.ga4Id
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(site.ga4Id)}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${esc(site.ga4Id)}');</script>`
    : '';
  const navHtml = nav.map(([p, n]) => `<li><a href="${p}"${path.startsWith(p) && p !== '/' ? ' aria-current="page"' : ''}>${n}</a></li>`).join('');
  const mobileBar = `<div class="mobile-bar"><a class="btn btn-primary" href="/get-a-quote/">Get a quote</a>${
    site.whatsapp ? `<a class="btn btn-light" href="${esc(waLink())}" rel="noopener">WhatsApp</a>` : site.phone ? `<a class="btn btn-light" href="${esc(telLink())}">Call</a>` : `<a class="btn btn-light" href="/contact-us/">Contact</a>`
  }</div>`;

  const f = (title, items) => `<div><h2>${title}</h2><ul>${items.map(([p, n]) => `<li><a href="${p}">${n}</a></li>`).join('')}</ul></div>`;
  const footer = `<footer class="site-footer"><div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand"><h2>About Chestnut Insurance Agency</h2><p style="margin-top:.5rem">${esc(site.tagline)}. We help individuals, families, professionals, businesses and organisations in Kenya make informed insurance decisions with practical advice, clear options and support when it matters.</p>
        <p><svg class="contact-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 21s7-6.4 7-12a7 7 0 0 0-14 0c0 5.6 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg> ${esc(site.addressLine)}${site.phoneDisplay ? `<br><svg class="contact-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 3h4l2 5-3 2a13 13 0 0 0 6 6l2-3 5 2v4c0 1-1 2-2 2C10 20 4 14 3 5c0-1 1-2 2-2Z"/></svg> <a href="${esc(telLink())}">${esc(site.phoneDisplay)}</a>` : ''}${site.whatsapp ? `<br><svg class="contact-icon contact-icon-wa" aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L3 20l1-4.8A8.5 8.5 0 1 1 20.5 11.8Z"/><path d="M8 7.5c.4-.5 1-.4 1.3 0l1 1.7-.7 1c.6 1.2 1.4 2 2.6 2.6l1-.7 1.7 1c.5.3.5 1 .1 1.3-.8.7-1.7.8-2.7.4-2.8-1.1-4.8-3.1-5.8-5.8-.4-1-.2-1.8.5-2.5Z"/></svg> <a href="${esc(waLink())}">WhatsApp</a>` : ''}${site.email ? `<br><svg class="contact-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg> <a href="${esc(mailLink())}">${esc(site.email)}</a>` : ''}</p></div>
      ${f('Business', [['/business-insurance-kenya/', 'Business insurance'], ['/sme-insurance-kenya/', 'SME insurance'], ['/wiba-insurance-kenya/', 'WIBA'], ['/professional-indemnity-insurance-kenya/', 'Professional indemnity'], ['/public-liability-insurance-kenya/', 'Public liability'], ['/business-property-insurance/fire/', 'Fire and property'], ['/cyber-insurance-kenya/', 'Cyber']])}
      ${f('Personal', [['/motor-insurance-kenya/', 'Motor'], ['/medical-insurance-kenya/', 'Medical'], ['/travel-insurance-kenya/', 'Travel'], ['/home-insurance-kenya/', 'Home'], ['/personal-accident-insurance-kenya/', 'Personal accident'], ['/financial-products/', 'Wealth Management']])}
      ${f('Advisory', [['/insurance-portfolio-review/', 'Insurance review'], ['/claims-assistance/', 'Claims assistance'], ['/business-risk-assessment/', 'Risk assessment'], ['/insurance-tender-support/', 'Tender support'], ['/insurance-guides/', 'Guides']])}
      ${f('Chestnut', [['/about/', 'About'], ['/contact-us/', 'Contact'], ['/get-a-quote/', 'Get a quote'], ['/privacy/', 'Privacy notice']])}
    </div>
    <div class="foot-legal"><span>${esc(site.iraLicenceNote)}${site.iraLicenceNumber ? ' Licence no. ' + esc(site.iraLicenceNumber) + '.' : ''}</span>
    <span>&copy; ${new Date().getFullYear()} ${esc(site.name)}</span></div>
  </div></footer>`;

  return `<!doctype html>
<html lang="en-KE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
<meta name="theme-color" content="#006C67">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="en_KE">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs('/og.png')}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Chestnut Insurance Agency. The Insurance Experts.">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/images/chestnut-logo-correct.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/styles.css">
<noscript><style>.conditional[hidden]{display:block}</style></noscript>
<script type="application/ld+json">${ld}</script>
${ga}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap">
  <div class="nav-bar">
    <a class="brand" href="/" aria-label="${esc(site.name)} home">
      <img class="brand-logo" src="/images/chestnut-logo-correct.png" alt="Chestnut Insurance Agency">
    </a>
    <nav aria-label="Primary"><ul class="nav-list">${navHtml}</ul></nav>
    <a class="btn btn-primary nav-cta" href="/get-a-quote/">Get a quote</a>
    <button class="menu-btn" aria-expanded="false" aria-controls="mobile-menu">Menu</button>
  </div>
</div>
<div class="mobile-menu" id="mobile-menu"><div class="wrap"><ul>${nav.map(([p, n]) => `<li><a href="${p}">${n}</a></li>`).join('')}</ul></div></div>
</header>
<main id="main">
${body}
</main>
${footer}
${mobileBar}
<script src="/app.js" defer></script>
</body>
</html>`;
}
