// CENTRAL SITE CONFIGURATION
// Everything that needs confirming before launch lives here.
// Empty strings are treated as "not yet available": the site hides the
// matching button or link instead of inventing a value.

export const site = {
  name: 'Chestnut Insurance Agency',
  short: 'Chestnut Insurance Agency',
  tagline: 'The Insurance Experts',
  url: 'https://www.chestnut.co.ke', // CONFIRM canonical host (www or non-www) before launch

  // ---- CONTACT DETAILS: REPLACE BEFORE LAUNCH ----
  phone: '+254721233951',
  phoneDisplay: '0721 233 951',
  whatsapp: '254721233951',
  email: 'info@chestnut.co.ke',
  officeHours: '24/7 through online channels',

  // ---- ADDRESS ----
  addressLine: 'Lavington Mall, James Gichuru Road, Nairobi',
  locality: 'Nairobi',
  country: 'KE',

  // ---- REGULATORY ----
  iraLicenceNote: 'Chestnut Insurance Agency is an insurance agency licensed by the Insurance Regulatory Authority (IRA).',
  iraLicenceNumber: 'IRA/05/44335/2026',

  // ---- FORMS ----
  // formEndpoint: any HTTPS endpoint accepting a JSON POST (Formspree, Web3Forms, a Cloudflare Worker).
  // If empty, forms fall back to opening the visitor's email app (needs `email`).
  // If both are empty, forms validate, then tell the visitor plainly that the form is not connected yet.
  formEndpoint: '',
  // Add your Calendly booking URL here before publishing consultation CTAs.
  calendlyUrl: 'https://calendly.com/chestnut-info/30min',

  // ---- ANALYTICS ----
  ga4Id: '', // e.g. 'G-XXXXXXXXXX'. Loaded only when set.

  // ---- SOCIAL (verified profiles only; used for schema sameAs) ----
  sameAs: [],

  published: '2026-11-21'
};

export const hasContact = () => Boolean(site.phone || site.whatsapp || site.email);
