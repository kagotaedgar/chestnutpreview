// Chestnut static site build. Zero dependencies. Run: node build.mjs  ->  ./dist
import fs from 'node:fs';
import path from 'node:path';
import { site, hasContact } from './src/config.mjs';
import { business } from './src/products-business.mjs';
import { personal, financial } from './src/products-personal.mjs';
import { guides } from './src/guides.mjs';
import { legacy } from './src/redirects.mjs';
import {
  esc, abs, registry, layout, crumbTrail, crumbsHtml, crumbsSchema, faqHtml, faqSchema, ul, indexList,
  ctaBand, field, formShell, contactButtons, waLink, telLink, mailLink, consultationLink
} from './src/render.mjs';

const DIST = path.resolve('dist');
const pages = []; // { path, html, noindex }
const warnings = [];
const todo = (t) => `<span class="todo">[${esc(t)}]</span>`;

// ---------------------------------------------------------------- registry
const blurbOf = (lead) => {
  const first = lead.split('. ')[0].replace(/\.$/, '') + '.';
  return first.length > 150 ? first.slice(0, 147).replace(/\s+\S*$/, '') + '...' : first;
};
const add = (path, label, parent, blurb = '') => registry.set(path, { label, parent, blurb });

add('/insurance-solutions/', 'Insurance Solutions', null);
add('/personal-insurance/', 'Personal Insurance', '/insurance-solutions/');
add('/financial-products/', 'Financial Products', null);
add('/insurance-advisory-services/', 'Advisory Services', null);
add('/insurance-guides/', 'Resources', null);
add('/about/', 'About Chestnut', null);
add('/contact-us/', 'Contact', null);
add('/get-a-quote/', 'Get a Quote', null);
add('/privacy/', 'Privacy Notice', null);

const services = [
  {
    path: '/insurance-portfolio-review/', label: 'Insurance Portfolio Review', kind: 'review',
    title: 'Insurance Portfolio Review for Businesses | Chestnut',
    h1: 'Insurance Portfolio Review for Businesses',
    desc: 'Find gaps, overlaps and out-of-date values in your business insurance. Request a portfolio review from Chestnut ahead of renewal.',
    lead: 'A portfolio review compares the insurance you hold with the risks you actually carry. It is most useful 6 to 8 weeks before renewal, when there is still time to change course.',
    does: ['Read your policy schedules and key wording', 'Compare sums insured with realistic replacement values', 'Spot gaps, such as an activity with no liability cover', 'Spot overlaps that add cost without adding protection', 'Check contract and tender insurance requirements against what you hold', 'Prepare a renewal strategy and approach insurers for terms where you ask us to'],
    need: ['Current policy schedules (and wording where available)', 'Renewal dates and premiums paid', 'Asset, stock and payroll summaries', 'Claims record for recent years', 'Contracts that specify insurance'],
    steps: [['Share your documents', 'Send what you have. We tell you what is missing.'], ['We review', 'We map your risks to your covers and list gaps and questions.'], ['We explain', 'You get a clear summary in plain language with recommendations.'], ['You decide', 'We act only on what you instruct, including approaching insurers.']],
    limits: ['A review is advice on information you provide. It does not guarantee lower premiums or claim outcomes.', 'Insurers decide whether to offer terms and on what basis.'],
    faqs: [['Do I need to change my broker or agent to get a review?', 'No. You can ask for a review of your existing programme. If changes are worthwhile, we explain them and you decide.'], ['What does it cost?', 'Please ask us. Any fees or remuneration arrangements will be explained to you before you proceed.']]
  },
  {
    path: '/claims-assistance/', label: 'Claims Assistance', kind: 'claims',
    title: 'Insurance Claims Assistance Kenya | Chestnut',
    h1: 'Insurance Claims Assistance',
    desc: 'Practical help preparing and following up an insurance claim. What to do first, what to document and how Chestnut can support you.',
    lead: 'A claim goes better when the first steps are right. Chestnut helps clients understand their policy, prepare documents and follow up with the insurer. We cannot promise a settlement, which depends on the policy terms and the facts of the loss.',
    does: ['Help you understand what your policy says about your loss', 'Tell you what documents the insurer is likely to ask for', 'Help you prepare and submit a clear claim', 'Follow up with the insurer and keep you informed', 'Explain assessor, repair and settlement steps as they arise'],
    need: ['Policy number and insurer', 'Date, place and description of the incident', 'Photos, police abstract or other evidence where relevant', 'Quotations or invoices for repair or replacement'],
    steps: [['Report to your insurer', 'Notify the insurer as your policy requires, as soon as reasonably possible. Do not wait to contact us first if a deadline applies.'], ['Protect the evidence', 'Take photos, keep damaged items where safe to do so and do not admit liability to others.'], ['Contact Chestnut', 'Tell us what happened. We guide you on documents and next steps.'], ['Submit and follow up', 'We help you file and chase, and explain the insurer\u2019s response.']],
    limits: ['Settlement depends on the policy, its exclusions and conditions, and the insurer\u2019s assessment.', 'We do not guarantee any claim outcome or timeline.', 'In an emergency, contact the relevant emergency services first.'],
    faqs: [['How soon should I report a claim?', 'As soon as reasonably possible. Many policies set time limits for notification. Check your policy and notify the insurer.'], ['Can you help with a claim on a policy I did not buy through Chestnut?', 'Please contact us and tell us what happened. We will explain what help we can offer.']]
  },
  {
    path: '/business-risk-assessment/', label: 'Business Risk Assessment', kind: 'risk',
    title: 'Business Insurance Risk Assessment Kenya | Chestnut',
    h1: 'Business Risk Assessment',
    desc: 'A structured review of your business risks and how insurance and risk controls can address them. Request a business risk assessment.',
    lead: 'Insurance works best when it follows a clear view of your risks. A business risk assessment walks through your operations, assets, people and contracts to identify what can go wrong, how badly, and what to do about it.',
    does: ['Map your operations, premises, people and contracts', 'Identify exposures to property, liability, people, transit and cyber risks', 'Suggest practical risk controls alongside insurance options', 'Prioritise what to insure, what to retain and what to fix', 'Prepare a clear summary you can share with partners or lenders'],
    need: ['A short description of your business and locations', 'Asset and stock summary', 'Employee numbers and roles', 'Existing policies, if any'],
    steps: [['Intake', 'You complete a short form and send basic documents.'], ['Conversation', 'We talk through how the business really runs.'], ['Findings', 'We summarise risks, gaps and options in plain language.'], ['Action plan', 'You choose what to act on, with our help if you want it.']],
    limits: ['A risk assessment is advisory. It is not an engineering survey or a legal opinion.', 'Insurer terms and availability apply to any cover that follows.'],
    faqs: [['Is this only for large companies?', 'No. Small businesses often benefit most because a single loss can hurt more.']]
  },
  {
    path: '/insurance-tender-support/', label: 'Tender and RFQ Support', kind: 'tender',
    title: 'Insurance Tender and RFQ Support Kenya | Chestnut',
    h1: 'Insurance Tender and RFQ Support',
    desc: 'Help meeting insurance requirements in tenders, contracts and RFQs: the right covers, limits and documents. Request tender support.',
    lead: 'Tenders and contracts often set minimum insurance requirements. Missing a certificate or a limit can disqualify a bid. Chestnut helps you work out what is required, arrange suitable cover and prepare the documents.',
    does: ['Read the insurance clauses in the tender or contract', 'Identify the covers, limits and endorsements required', 'Arrange or adjust cover where you instruct us to', 'Help you obtain the certificates and letters you need', 'Flag requirements that need clarification from the procuring entity'],
    need: ['The tender or contract insurance clause', 'Submission deadline', 'Your existing policies, if any'],
    steps: [['Share the requirement', 'Send the insurance section and your deadline.'], ['We interpret', 'We list what is required and what you already hold.'], ['We arrange', 'We obtain quotations and arrange cover as you instruct.'], ['Documents', 'We help you obtain the certificates and evidence for submission.']],
    limits: ['Winning a tender depends on many factors outside insurance.', 'Timelines depend on insurers and on the information provided, so contact us early.'],
    faqs: [['How early should I contact you?', 'As soon as you see the requirement. Some covers take time to arrange.']]
  }
];
services.push(
  {
    path: '/insurance-policy-contract-review/', label: 'Policy and Contract Review', kind: 'generic',
    title: 'Insurance Policy and Contract Review | Chestnut',
    h1: 'Insurance Policy and Contract Review',
    desc: 'Review policy wording, schedules and contractual insurance requirements to identify gaps, conditions and questions before you commit.',
    lead: 'Insurance documents and contract clauses can be difficult to interpret. We help you review what a policy says, what a contract requires and what questions should be resolved before you sign, renew or rely on the cover.',
    does: ['Review policy schedules and key wording against your stated needs', 'Identify limits, exclusions, conditions, warranties and reporting obligations to pay attention to', 'Compare contract or tender insurance clauses with existing cover', 'Prepare a clear list of issues and questions for insurers or the contracting party', 'Explain the practical implications in plain language'],
    need: ['Policy schedule and wording, if available', 'Relevant contract, tender or lease clauses', 'Your business activity and the reason for the review'],
    steps: [['Share documents','Send the policy, contract clause or documents you want reviewed.'],['Review','We identify key terms, gaps, obligations and points needing clarification.'],['Discussion','We explain the findings and possible next steps.'],['Action','If you instruct us, we can help seek clarification or explore alternative cover.']],
    limits: ['This is an insurance review, not a legal opinion. Legal interpretation of a contract should be confirmed with your lawyer.', 'Insurer decisions and cover are subject to underwriting and policy terms.'],
    faqs: [['Can you review a policy I did not arrange?','Yes. Share the documents and tell us what you want to understand. We will confirm the scope of assistance.']]
  },
  {
    path: '/insurance-renewal-management/', label: 'Insurance Renewal Management', kind: 'generic',
    title: 'Insurance Renewal Management Kenya | Chestnut',
    h1: 'Insurance Renewal Management',
    desc: 'Prepare for insurance renewal early, review values and exposures, seek terms and compare options before expiry.',
    lead: 'Renewal should be a review of the business as it is today—not a repeat of last year’s policy. We help organise the process, update information, identify changes and seek renewal terms in good time.',
    does: ['Create a renewal timeline and list the information insurers need', 'Review sums insured, payroll, turnover, activities and locations', 'Identify changes in risk, claims or contractual requirements', 'Seek renewal terms and alternatives where you instruct us', 'Compare premiums, limits, exclusions and conditions', 'Help track outstanding documents and decisions'],
    need: ['Current policy schedules and renewal dates', 'Updated asset, stock, payroll or turnover information as relevant', 'Claims and incident history', 'Changes to business activities, locations or contracts'],
    steps: [['Plan','Start before expiry and identify the covers due.'],['Update','Refresh the information and confirm changes.'],['Market','We seek terms from insurers where instructed and available.'],['Compare and decide','Review options and choose what to renew or change.']],
    limits: ['Renewal terms and availability depend on insurers and the information provided.', 'We cannot guarantee lower premiums or uninterrupted cover if instructions or information arrive late.'],
    faqs: [['When should I start?','Ideally begin several weeks before expiry. Complex risks or tender requirements may need more time.']]
  },
  {
    path: '/insurance-procurement-support/', label: 'Insurance Procurement Support', kind: 'generic',
    title: 'Insurance Procurement Support Kenya | Chestnut',
    h1: 'Insurance Procurement Support',
    desc: 'Support for organisations procuring insurance: prepare requirements, compare insurer quotations and review cover and terms.',
    lead: 'Insurance procurement is more than collecting prices. We help organisations define the requirement, gather quotations, compare the coverage and conditions, and document the decision-making process.',
    does: ['Help develop an insurance schedule or request for quotation', 'Clarify the required covers, limits, extensions and information', 'Coordinate quotation requests with insurers, subject to your instruction', 'Compare responses on coverage, limits, exclusions, excesses and price', 'Highlight differences and questions for the procurement team', 'Support the organisation through selection and placement instructions'],
    need: ['Current programme or draft requirements', 'Procurement timeline and evaluation criteria', 'Asset, payroll, turnover or exposure information relevant to the covers'],
    steps: [['Define','Clarify the organisation’s risk and insurance requirements.'],['Request','Seek quotations from suitable insurers where instructed.'],['Compare','Prepare a structured comparison of terms and pricing.'],['Decide','Support your team with questions and next steps.']],
    limits: ['Insurer participation and quotation availability are not guaranteed.', 'Procurement rules and the organisation’s internal approvals remain the client’s responsibility.'],
    faqs: [['Can you help us compare quotations we already have?','Yes. We can review the quotations and compare the coverage, terms, exclusions, limits and excesses—not just price.']]
  },
  {
    path: '/insurance-programme-management/', label: 'Insurance Programme Management', kind: 'generic',
    title: 'Insurance Programme Management | Chestnut',
    h1: 'Insurance Programme Management',
    desc: 'Help organisations coordinate insurance policies, renewals, documents, changes, reporting and claims support across their programme.',
    lead: 'For organisations with several policies, locations, assets or departments, insurance administration can become fragmented. We help create a clearer view of the programme and coordinate key insurance tasks.',
    does: ['Maintain a consolidated view of policies, insurers, limits and expiry dates', 'Coordinate renewal planning and information collection', 'Help track certificates, endorsements and policy documents', 'Support policy changes as operations or assets change', 'Coordinate claims follow-up and outstanding information', 'Provide periodic programme review and issue tracking'],
    need: ['Policy list and schedules', 'Locations, assets and operating departments', 'Renewal calendar and key contacts', 'Known claims, incidents or outstanding issues'],
    steps: [['Map','Compile the existing policies and key information.'],['Organise','Create a renewal and document-tracking approach.'],['Coordinate','Help manage information, changes and follow-ups.'],['Review','Identify programme issues and actions for the next cycle.']],
    limits: ['Scope and frequency of programme-management support will be agreed with the client.', 'Insurers retain responsibility for issuing policies, endorsements and claim decisions.'],
    faqs: [['Is this only for large organisations?','It can help any organisation with multiple policies or renewals, although the scope should be proportionate to the programme.']]
  },
  {
    path: '/employee-insurance-education/', label: 'Employee Insurance Education', kind: 'generic',
    title: 'Employee Insurance Education and Benefits Awareness | Chestnut',
    h1: 'Employee Insurance Education',
    desc: 'Help employees understand workplace insurance and benefits, what cover provides, how to access it and how claims or notifications work.',
    lead: 'Employee benefits are more useful when people understand them. We can help organisations provide practical education on the insurance benefits they offer, including what is covered, key limits, exclusions, contacts and how to access support.',
    does: ['Explain employee insurance benefits in plain language', 'Provide education on WIBA, group medical, group life and other benefits in scope', 'Clarify how to access care, report an incident or notify a claim', 'Prepare FAQs and practical guidance for staff', 'Deliver briefings or sessions for employees and HR teams'],
    need: ['Current benefit and policy summaries', 'Employee audience and preferred format', 'Questions or recurring issues from staff'],
    steps: [['Agree the scope','Confirm which benefits and employee groups are covered.'],['Prepare','Develop a practical briefing based on the actual policies.'],['Deliver','Conduct the agreed session or provide materials.'],['Follow up','Answer agreed questions and identify recurring issues.']],
    limits: ['Education is based on the actual policy documents provided. It does not amend policy terms or replace the insurer’s formal wording.', 'Availability, format and fees, if any, will be agreed before delivery.'],
    faqs: [['Can this be tailored to our employees?','Yes. The content can be tailored to your workforce, benefit structure and common questions.']]
  }
);
services.forEach((s) => add(s.path, s.label, '/insurance-advisory-services/', blurbOf(s.lead)));

const personalHub = new Set(personal.filter((p) => p.parent === '/personal-insurance/' || p.path.startsWith('/motor') || p.path.startsWith('/medical') || p.path.startsWith('/travel')).map((p) => p.path));
const allProducts = [...business, ...personal, ...financial];
allProducts.forEach((p) => add(p.path, p.label, p.parent, blurbOf(p.lead)));
guides.forEach((g) => add(g.path, g.h1.replace(/^./, (c) => c.toUpperCase()), g.parent));

// ---------------------------------------------------------------- helpers
const emit = (p, html, noindex = false) => pages.push({ path: p, html, noindex });
const quoteLink = (p) => `/get-a-quote/?cover=${encodeURIComponent(p)}`;
const heroCtas = (p, who = 'a quote') => `<div class="btn-row"><a class="btn btn-primary" href="${quoteLink(p)}">Request ${who}</a><a class="btn btn-ghost" href="${esc(consultationLink())}">Speak to an advisor</a></div>`;
const disclaimer = '<p class="callout callout-teal"><strong>General information only.</strong> What is covered, the terms and the premium depend on the insurer\u2019s policy wording, your circumstances and the information you disclose. Nothing here is a promise of cover.</p>';

// ---------------------------------------------------------------- product pages
function businessLandingPage(p) {
  const trail = crumbTrail(p.path, p.label);
  const coverGroups = [
    { title: 'Property and assets', intro: 'Protect the physical assets your business depends on.', links: ['/business-property-insurance/', '/business-property-insurance/fire/', '/business-property-insurance/burglary/', '/business-property-insurance/business-interruption/'] },
    { title: 'People and employee benefits', intro: 'Address employee obligations and the benefits you provide.', links: ['/wiba-insurance-kenya/', '/employers-liability-insurance-kenya/', '/medical-insurance-kenya/group/', '/group-life-insurance-kenya/'] },
    { title: 'Liability and professional risk', intro: 'Consider claims from customers, clients, third parties and professional services.', links: ['/public-liability-insurance-kenya/', '/professional-indemnity-insurance-kenya/', '/directors-officers-insurance-kenya/', '/cyber-insurance-kenya/'] },
    { title: 'Operations, transit and projects', intro: 'Cover risks arising from movement of goods, vehicles, projects and equipment.', links: ['/marine-insurance-kenya/', '/goods-in-transit-insurance-kenya/', '/motor-insurance-kenya/commercial-fleet/', '/engineering-insurance-kenya/', '/contractors-all-risks-insurance-kenya/', '/contractors-plant-machinery-insurance-kenya/'] }
  ];
  const businessTypes = [
    ['Retail, wholesale and distribution', 'Stock, premises, customer liability, money, deliveries and employee risks.'],
    ['Hospitality, restaurants and accommodation', 'Buildings and contents, interruption, guest liability, employees and specialist operational risks.'],
    ['Contractors and project businesses', 'Contract works, plant, third-party liability, WIBA and contract insurance requirements.'],
    ['Professional and service businesses', 'Professional indemnity, cyber, office assets, employee benefits and liability.'],
    ['Manufacturing, workshops and logistics', 'Machinery, property, interruption, goods in transit, fleet and workforce risks.'],
    ['Schools, clinics and organisations', 'Property, public liability, employee cover, specialist equipment and service-related exposures.']
  ];
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(trail)}
  <p style="margin-top:var(--s5)"><span class="pill">Business insurance</span></p>
  <h1>${esc(p.h1)}</h1>
  <p class="lead">${esc(p.lead)}</p>
  <div class="btn-row"><a class="btn btn-primary" href="/get-a-quote/?cover=%2Fbusiness-insurance-kenya%2F">Request business insurance options</a><a class="btn btn-ghost" href="/business-risk-assessment/">Request a risk assessment</a><a class="btn btn-ghost" href="/insurance-portfolio-review/">Review existing cover</a></div>
</div></section>
<section class="section"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Built around your operations</p><h2>Insurance for the business you actually run</h2><p class="lead">The right programme depends on your industry, premises, assets, employees, contracts and how your business operates. Start with the exposures that matter most, then select covers that respond to them.</p></div>
  <div class="solution-cards business-type-cards">${businessTypes.map(([h,t])=>`<article class="solution-card"><h3>${esc(h)}</h3><p>${esc(t)}</p></article>`).join('')}</div>
</div></section>
<section class="section section-warm"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Explore business cover</p><h2>Build your insurance programme</h2><p class="lead">There is no single policy that protects every business against every loss. These are the main areas to consider.</p></div>
  <div class="solution-cards business-cover-cards">${coverGroups.map(g=>`<article class="solution-card"><h3>${esc(g.title)}</h3><p>${esc(g.intro)}</p><ul>${g.links.map(x=>`<li><a href="${x}">${esc(registry.get(x)?.label || x)}</a></li>`).join('')}</ul></article>`).join('')}</div>
</div></section>
<section class="section"><div class="wrap"><div class="split">
  <div><p class="eyebrow">Common gaps</p><h2>What a business insurance review can uncover</h2></div>
  <div class="prose"><ul>${p.risks.map(([h,t])=>`<li><strong>${esc(h)}:</strong> ${esc(t)}</li>`).join('')}</ul><p>Business insurance should be reviewed when your assets, workforce, activities, contracts or locations change—not only when a policy is about to expire.</p></div>
</div></div></section>
<section class="section section-warm"><div class="wrap"><div class="split">
  <div><p class="eyebrow">Our approach</p><h2>Practical advice, from assessment to renewal</h2></div>
  <div class="prose"><ol><li><strong>Understand your business.</strong> We discuss what you do, what you own, your people and your contractual obligations.</li><li><strong>Identify the exposures.</strong> We help separate essential, recommended and optional covers.</li><li><strong>Seek suitable terms.</strong> With your instruction, we approach insurers for options based on the information provided and available markets.</li><li><strong>Explain the differences.</strong> We help you compare cover, limits, exclusions, excesses and premiums—not just price.</li><li><strong>Support you after placement.</strong> We can assist with policy documents, changes, renewals and claims follow-up.</li></ol></div>
</div></div></section>
<section class="section"><div class="wrap"><div class="split">
  <div><p class="eyebrow">Before requesting a quote</p><h2>Information that helps insurers assess your risk</h2></div>
  <div>${ul(p.info)}<p>Don't worry if you do not have everything ready. Start with a brief description of your business and we will advise what additional information is needed.</p></div>
</div></div></section>
<section class="section section-warm"><div class="wrap"><div class="split">
  <div><p class="eyebrow">Questions</p><h2>Business insurance FAQs</h2></div><div>${faqHtml(p.faqs)}</div>
</div></div></section>
<section class="section"><div class="wrap"><div class="section-head"><h2>Start with the areas relevant to you</h2></div>${indexList(p.related)}<div class="btn-row" style="margin-top:var(--s5)"><a class="btn btn-primary" href="/get-a-quote/">Request a business quote</a><a class="btn btn-ghost" href="/insurance-advisory-services/">Explore advisory services</a></div></div></section>
${ctaBand('Protect your business with a programme that fits.', 'Tell us what you do, what you need to protect and any insurance requirements you have. We will help you identify the next step.')}
`;
  emit(p.path, layout({ path:p.path, title:p.title, desc:p.desc, body, schema:[{ '@type':'WebPage', '@id':abs(p.path)+'#page', url:abs(p.path), name:p.title, description:p.desc, isPartOf:{'@id':abs('/#website')} }, crumbsSchema(trail), faqSchema(p.faqs)] }));
}

function productPage(p) {
  if (p.path === '/business-insurance-kenya/') { businessLandingPage(p); return; }
  const isFin = Boolean(p.financial);
  const trail = crumbTrail(p.path, p.label);
  const group = isFin ? 'Financial products (not insurance)' : personalHub.has(p.path) || p.path.startsWith('/home') || p.path.startsWith('/personal-acc') || p.path.startsWith('/group-life') ? 'Insurance' : 'Business insurance';
  const rel = (p.related || []).filter((x) => registry.has(x));
  const gds = (p.guides || []).filter((x) => registry.has(x));
  const finBox = isFin
    ? (p.path === '/money-market-funds-kenya/' ? '' : `<div class="callout"><strong>This is not insurance.</strong> Chestnut does not manufacture, manage or guarantee this product. It is provided by a licensed provider under that provider\u2019s terms, and returns or benefits are not guaranteed. ${todo('CONFIRM before launch: Chestnut\u2019s authority and provider arrangements for this product, and add the provider disclosures')}</div>`)
    : disclaimer;
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml(trail)}
  <p style="margin-top:var(--s5)"><span class="pill${isFin ? ' pill-fin' : ''}">${group}</span></p>
  <h1>${esc(p.h1)}</h1>
  <p class="lead">${esc(p.lead)}</p>
  ${isFin ? `<div class="btn-row"><a class="btn btn-primary" href="${esc(consultationLink())}">Speak to an advisor</a></div>` : heroCtas(p.path)}
</div></section>
<div class="wrap product-grid">
  <article class="prose">
    ${finBox}
    <h2>${isFin ? 'What to know' : 'What it covers'}</h2>${ul(p.covers)}
    <h2>Who needs it</h2>${ul(p.who)}
    <h2>Common risks</h2>${p.risks.map(([t, x]) => `<div class="risk"><h3>${esc(t)}</h3><p>${esc(x)}</p></div>`).join('')}
    <h2>Important considerations and exclusions</h2>${ul(p.limits)}
    <h2>${isFin ? 'What affects the outcome' : 'What affects the premium'}</h2>${ul(p.factors)}
    ${isFin ? '' : `<p>Premiums are set by insurers, so we do not publish figures. Tell us about your situation and we will explain what is driving the quotation.</p>`}
    <h2>${isFin ? 'What to prepare' : 'What we need for a quotation'}</h2>${ul(p.info)}
    <h2>How Chestnut can help</h2>
    <p>${isFin ? 'We can explain the options in plain language and tell you what Chestnut can and cannot assist with.' : 'We explain the cover in plain language, collect the information insurers need, approach suitable insurers for terms, and help with renewals and claims. Policies are issued by insurers, and you decide what to buy.'}</p>
    <h2>Frequently asked questions</h2>${faqHtml(p.faqs)}
  </article>
  <aside class="aside">
    <div class="aside-box">
      <h2>${isFin ? 'Talk to an advisor' : `Request a ${esc(p.label.toLowerCase())} quote`}</h2>
      <p>${isFin ? 'Tell us your goal and we will explain what is available and what Chestnut can assist with.' : 'Share a few details and an advisor will respond with options. It takes about two minutes.'}</p>
      <a class="btn btn-primary" href="${isFin ? consultationLink() : quoteLink(p.path)}">${isFin ? 'Speak to an advisor' : 'Get a quote'}</a>
      ${site.whatsapp ? `<a class="btn btn-ghost" href="${esc(waLink(`Hello Chestnut, I would like to ask about ${p.label}.`))}" rel="noopener">Chat on WhatsApp</a>` : ''}
      ${site.phone ? `<a class="btn btn-ghost" href="${esc(telLink())}">Call ${esc(site.phoneDisplay || site.phone)}</a>` : ''}
    </div>
    ${rel.length ? `<div class="aside-links"><h3>Related cover</h3><ul>${rel.map((x) => `<li><a href="${x}">${esc(registry.get(x).label)}</a></li>`).join('')}</ul></div>` : ''}
    ${gds.length ? `<div class="aside-links"><h3>Guides</h3><ul>${gds.map((x) => `<li><a href="${x}">${esc(registry.get(x).label)}</a></li>`).join('')}</ul></div>` : ''}
    <div class="aside-links"><h3>Also see</h3><ul><li><a href="/insurance-portfolio-review/">Insurance portfolio review</a></li><li><a href="/claims-assistance/">Claims assistance</a></li></ul></div>
  </aside>
</div>
${ctaBand()}`;
  emit(p.path, layout({
    path: p.path, title: p.title, desc: p.desc, body,
    schema: [{ '@type': 'WebPage', '@id': abs(p.path) + '#page', url: abs(p.path), name: p.title, description: p.desc, isPartOf: { '@id': abs('/#website') } }, crumbsSchema(trail), faqSchema(p.faqs)]
  }));
}
allProducts.forEach(productPage);

// ---------------------------------------------------------------- guides
function guidePage(g) {
  const label = registry.get(g.path).label;
  const trail = crumbTrail(g.path, label);
  const rel = g.related.filter((x) => registry.has(x));
  const body = `
<section class="article-hero"><div class="wrap">
  ${crumbsHtml(trail)}
  <p style="margin-top:var(--s5)"><span class="pill">${esc(g.category)} guide</span></p>
  <h1>${esc(g.h1)}</h1>
  <p class="byline">${esc(site.name)} editorial team &middot; Published ${new Date(site.published).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
</div></section>
<article class="article">
  <p class="answer">${esc(g.answer)}</p>
  ${g.sections.map((s) => `<h2>${esc(s.h)}</h2>${(s.p || []).map((x) => `<p>${esc(x)}</p>`).join('')}${s.ul ? ul(s.ul) : ''}`).join('')}
  <p class="callout callout-teal">This guide is general education about insurance in Kenya. It is not legal or financial advice and does not describe any specific policy. Policy wording, exclusions and the law that applies at the time govern. <a href="${esc(consultationLink())}">Speak to an advisor</a> about your situation.</p>
  <div class="btn-row"><a class="btn btn-primary" href="/get-a-quote/">Get a quote</a><a class="btn btn-ghost" href="/insurance-portfolio-review/">Request a review</a></div>
  <div class="read-next"><h2 style="font-size:1.3rem">Related</h2>${indexList(rel, (p, r) => r.blurb)}</div>
</article>`;
  emit(g.path, layout({
    path: g.path, title: g.title, desc: g.desc, body, ogType: 'article',
    schema: [{ '@type': 'Article', headline: g.h1, description: g.desc, datePublished: site.published, dateModified: site.published, mainEntityOfPage: abs(g.path), author: { '@id': abs('/#org') }, publisher: { '@id': abs('/#org') } }, crumbsSchema(trail)]
  }));
}
guides.forEach(guidePage);

// ---------------------------------------------------------------- hubs
function hubPage({ path: p, title, desc, h1, lead, label, body, pill, schemaExtra = [] }) {
  const trail = crumbTrail(p, label);
  const html = `
<section class="page-hero hub-hero"><div class="wrap">
  ${crumbsHtml(trail)}
  ${pill ? `<p style="margin-top:var(--s5)"><span class="pill${pill.fin ? ' pill-fin' : ''}">${esc(pill.text)}</span></p>` : '<div style="height:var(--s5)"></div>'}
  <h1>${esc(h1)}</h1><p class="lead">${esc(lead)}</p>
</div></section>
${body}
${ctaBand()}`;
  emit(p, layout({ path: p, title, desc, body: html, schema: [{ '@type': 'CollectionPage', url: abs(p), name: title, description: desc }, crumbsSchema(trail), ...schemaExtra] }));
}

const sect = (h, intro, list) => `<section class="section"><div class="wrap"><div class="split"><div><h2>${esc(h)}</h2><p style="color:var(--ink-soft)">${esc(intro)}</p></div><div>${list}</div></div></div></section>`;

hubPage({
  path: '/insurance-solutions/', label: 'Insurance Solutions',
  title: 'Insurance Solutions in Kenya | Business and Personal | Chestnut',
  desc: 'Find the insurance that fits your business, profession or family. Chestnut explains each cover and helps you request a quotation.',
  h1: 'Insurance solutions, organised around you', lead: 'Start with who you are and what you need to protect. Each page explains the cover in plain language, what to watch for, and what we need to quote.',
  body:
    sect('For your business', 'Property, people, liability and operations.', indexList(['/business-insurance-kenya/', '/sme-insurance-kenya/', '/business-property-insurance/', '/wiba-insurance-kenya/', '/public-liability-insurance-kenya/', '/marine-insurance-kenya/', '/goods-in-transit-insurance-kenya/', '/motor-insurance-kenya/commercial-fleet/'])) +
    `<div class="section-warm">` + sect('For your profession', 'Cover for advice, governance and digital risk.', indexList(['/professional-indemnity-insurance-kenya/', '/directors-officers-insurance-kenya/', '/cyber-insurance-kenya/', '/public-liability-insurance-kenya/'])) + `</div>` +
    sect('For projects and engineering', 'Construction, plant and machinery.', indexList(['/engineering-insurance-kenya/', '/contractors-all-risks-insurance-kenya/', '/contractors-plant-machinery-insurance-kenya/'])) +
    `<div class="section-warm">` + sect('For your employees', 'Benefits and obligations.', indexList(['/wiba-insurance-kenya/', '/employers-liability-insurance-kenya/', '/medical-insurance-kenya/group/', '/group-life-insurance-kenya/', '/travel-insurance-kenya/corporate/'])) + `</div>` +
    sect('For you and your family', 'Personal protection.', indexList(['/motor-insurance-kenya/', '/medical-insurance-kenya/', '/travel-insurance-kenya/', '/home-insurance-kenya/', '/personal-accident-insurance-kenya/'])) +
    `<section class="section section-warm"><div class="wrap"><p>Looking for savings, pensions or money market funds? Those are not insurance, so they sit separately under <a href="/financial-products/">Financial Products</a>.</p></div></section>`
});

hubPage({
  path: '/personal-insurance/', label: 'Personal Insurance',
  title: 'Personal Insurance in Kenya | Motor, Medical, Travel, Home | Chestnut',
  desc: 'Personal insurance in Kenya: motor, medical, travel, home and personal accident. Understand your options and request a quote from Chestnut.',
  h1: 'Personal insurance for you and your family', lead: 'Cars, health, travel, home and personal accident. We explain what each cover does and does not do so you can decide with confidence.',
  body: sect('Choose a cover', 'Each page sets out what to check before you buy.', indexList(['/motor-insurance-kenya/', '/medical-insurance-kenya/', '/travel-insurance-kenya/', '/home-insurance-kenya/', '/personal-accident-insurance-kenya/', '/group-life-insurance-kenya/'])) +
    `<section class="section section-warm"><div class="wrap"><p>Savings plans, education plans and pensions are financial products rather than insurance. See <a href="/financial-products/">Financial Products</a> for how they are presented and what Chestnut can assist with.</p></div></section>`
});

hubPage({
  path: '/financial-products/', label: 'Financial Products', pill: { text: 'Separate from insurance', fin: true },
  title: 'Financial Products in Kenya | Savings, MMFs, Pensions | Chestnut',
  desc: 'General information about money market funds, savings and education plans, and pensions. These are financial products, not insurance.',
  h1: 'Wealth Management & Financial Solutions', lead: 'Plan for the milestones that matter: from building savings and funding education to preparing for retirement. Chestnut Insurance Agency helps Kenyan individuals and families explore financial solutions aligned with their goals and time horizons.',
  body: `<section class="section"><div class="wrap"><div class="callout callout-teal"><strong>Build a plan around your goals.</strong> Explore savings, education, investment and retirement solutions with an advisor. Product availability, providers, fees, terms and risks will be explained before you make a decision.</div>` +
    indexList(['/money-market-funds-kenya/', '/savings-and-education-plans-kenya/', '/pension-and-retirement-planning-kenya/']) + `</div></section>`
});

hubPage({
  path: '/insurance-advisory-services/', label: 'Advisory Services',
  title: 'Insurance Advisory Services Kenya | Review, Claims, Risk | Chestnut',
  desc: 'Insurance portfolio reviews, claims assistance, business risk assessments and tender support from Chestnut Insurance Agency in Nairobi.',
  h1: 'Advice that goes beyond buying a policy', lead: 'Insurance is only useful if it fits your risks and responds when you need it. Our advisory services help before you buy, at renewal and when a claim arises.',
  body: `<section class="section"><div class="wrap"><div class="solution-cards advisory-service-cards">${services.map((s) => `<article class="solution-card"><h3><a href="${s.path}">${esc(s.label)}</a></h3><p>${esc(s.lead)}</p><a class="textlink" href="${s.path}">Explore service</a></article>`).join('')}</div></div></section>`
});

// ---------------------------------------------------------------- service pages
function serviceForm(kind, serviceLabel = 'Advisory service') {
  const base = field({ id: 'name', label: 'Your name', required: true, autocomplete: 'name' }) +
    `<div class="row">${field({ id: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel' })}${field({ id: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' })}</div>`;
  const extra = {
    review: field({ id: 'company', label: 'Business name', required: true }) + `<div class="row">${field({ id: 'current_covers', label: 'Current covers', hint: 'e.g. fire, WIBA, motor' })}${field({ id: 'renewal', label: 'Renewal date', type: 'date' })}</div>`,
    claims: `<div class="row">${field({ id: 'insurer', label: 'Insurer' })}${field({ id: 'policy_type', label: 'Type of policy', required: true, hint: 'e.g. motor, fire' })}</div>${field({ id: 'incident_date', label: 'Date of incident', type: 'date', required: true })}`,
    risk: field({ id: 'company', label: 'Business name', required: true }) + `<div class="row">${field({ id: 'industry', label: 'Industry', required: true })}${field({ id: 'employees', label: 'Number of employees' })}</div>`,
    tender: field({ id: 'company', label: 'Organisation', required: true }) + `<div class="row">${field({ id: 'deadline', label: 'Submission deadline', type: 'date', required: true })}${field({ id: 'procuring', label: 'Procuring entity' })}</div>`,
    generic: field({ id: 'company', label: 'Business or organisation name' }) + field({ id: 'service_details', label: 'What would you like help with?', type: 'textarea', required: true })
  }[kind];
  const msg = { review: 'Anything you want us to focus on', claims: 'Brief description of what happened', risk: 'What worries you most about the business', tender: 'Which insurance requirements does the tender set?', generic: 'Any additional details' }[kind];
  return formShell(`service-${kind}`, `${serviceLabel} enquiry from website`, base + extra + field({ id: 'message', label: msg, type: 'textarea', required: kind === 'claims' || kind === 'tender' }), 'Send request');
}
services.forEach((s) => {
  const trail = crumbTrail(s.path, s.label);
  const body = `
<section class="page-hero"><div class="wrap">${crumbsHtml(trail)}<p style="margin-top:var(--s5)"><span class="pill">Advisory service</span></p><h1>${esc(s.h1)}</h1><p class="lead">${esc(s.lead)}</p>
${s.kind === 'claims' && (site.phone || site.whatsapp) ? `<div class="btn-row">${contactButtons()}</div>` : ''}</div></section>
<div class="wrap product-grid"><article class="prose">
  <h2>What we do</h2>${ul(s.does)}
  <h2>How it works</h2><ol class="steps" style="grid-template-columns:1fr">${s.steps.map(([h, t]) => `<li><h3>${esc(h)}</h3><p>${esc(t)}</p></li>`).join('')}</ol>
  <h2>What to have ready</h2>${ul(s.need)}
  <h2>Please note</h2>${ul(s.limits)}
  <h2>Questions</h2>${faqHtml(s.faqs)}
</article>
<aside class="aside"><div class="aside-box" id="request"><h2>${s.kind === 'claims' ? 'Request claims support' : 'Make a request'}</h2><p>Tell us a little and an advisor will respond.</p>${serviceForm(s.kind, s.label)}</div></aside></div>
${ctaBand()}`;
  emit(s.path, layout({ path: s.path, title: s.title, desc: s.desc, body, schema: [{ '@type': 'WebPage', url: abs(s.path), name: s.title, description: s.desc }, crumbsSchema(trail), faqSchema(s.faqs)] }));
});

// ---------------------------------------------------------------- resources hub
{
  const cats = [...new Set(guides.map((g) => g.category))];
  hubPage({
    path: '/insurance-guides/', label: 'Our Blog',
    title: 'Insurance Blog Kenya | Chestnut Insurance Agency',
    desc: 'Insurance blog and guides for Kenya: business cover, WIBA, professional indemnity, motor, medical, marine cargo, claims, costs and risk management.',
    h1: 'Insurance Blog: Guides, Risk Insights & Practical Advice for Kenya', lead: 'Insurance insights for Kenyan businesses, professionals, employers, families, motorists, importers and property owners. Explore practical guides, risk checklists, insurance costs, claims advice and cover requirements.',
    body: (() => {
      const imageFor = (category) => category === 'Motor' ? '/images/site/motor.jpg' : category === 'Employers' ? '/images/site/business.jpg' : category === 'Professionals' ? '/images/site/individuals.jpg' : category === 'Marine' ? '/images/site/marine.jpg' : category === 'Medical' ? '/images/site/medical.jpg' : category === 'Travel' ? '/images/site/travel.jpg' : category === 'Claims' ? '/images/site/claims.jpg' : category === 'SMEs' ? '/images/site/business.jpg' : '/images/site/wealth.jpg';
      const card = (g, featured = false) => `<article class="blog-card${featured ? ' blog-card-featured' : ''}"><a class="blog-card-image" href="${g.path}"><img src="${imageFor(g.category)}" alt="" loading="lazy"><span class="blog-category">${esc(g.category)}</span></a><div class="blog-card-body"><p class="blog-meta">Chestnut Editorial · ${new Date(site.published).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p><h3><a href="${g.path}">${esc(g.h1)}</a></h3><p>${esc(g.desc)}</p><a class="blog-read" href="${g.path}">Read more <span aria-hidden="true">→</span></a></div></article>`;
      const featured = guides[0], rest = guides.slice(1);
      return `<section class="blog-listing"><div class="wrap"><div class="blog-featured">${card(featured,true)}</div><div class="blog-grid">${rest.map(g=>card(g)).join('')}</div></div></section>`;
    })()
  });
}

// ---------------------------------------------------------------- quote
{
  const groupOf = (p) => (p.includes('wiba') ? 'wiba' : p.includes('professional-indemnity') ? 'pi' : p.startsWith('/motor') ? 'motor' : p.startsWith('/medical') ? 'medical' : p.startsWith('/travel') ? 'travel' : p.includes('marine') || p.includes('goods-in-transit') ? 'cargo' : p.startsWith('/home') || p.includes('personal-accident') ? 'personal' : 'business');
  const opt = (p) => `<option value="${p}" data-group="${groupOf(p)}">${esc(registry.get(p).label)}</option>`;
  const biz = ['/business-insurance-kenya/', '/sme-insurance-kenya/', '/wiba-insurance-kenya/', '/public-liability-insurance-kenya/', '/employers-liability-insurance-kenya/', '/professional-indemnity-insurance-kenya/', '/directors-officers-insurance-kenya/', '/cyber-insurance-kenya/', '/business-property-insurance/fire/', '/business-property-insurance/business-interruption/', '/business-property-insurance/burglary/', '/marine-insurance-kenya/', '/goods-in-transit-insurance-kenya/', '/engineering-insurance-kenya/', '/contractors-all-risks-insurance-kenya/', '/contractors-plant-machinery-insurance-kenya/', '/motor-insurance-kenya/commercial-fleet/', '/medical-insurance-kenya/group/', '/group-life-insurance-kenya/', '/travel-insurance-kenya/corporate/'];
  const pers = ['/motor-insurance-kenya/private-car/', '/motor-insurance-kenya/psv/', '/medical-insurance-kenya/individual-family/', '/travel-insurance-kenya/', '/travel-insurance-kenya/schengen/', '/home-insurance-kenya/', '/personal-accident-insurance-kenya/'];
  const cond = (forGroups, inner) => `<div class="conditional" data-for="${forGroups}" hidden>${inner}</div>`;
  const bands = (arr) => `<option value="">Select</option>${arr.map((a) => `<option>${a}</option>`).join('')}`;
  const inner =
    `<div class="row">${field({ id: 'name', label: 'Your name', required: true, autocomplete: 'name' })}${field({ id: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel' })}</div>` +
    field({ id: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' }) +
    field({ id: 'cover', label: 'What do you need cover for?', required: true, options: `<option value="" data-group="">Select a cover</option><optgroup label="Business and organisations">${biz.map(opt).join('')}</optgroup><optgroup label="Personal">${pers.map(opt).join('')}</optgroup><optgroup label="Not sure"><option value="/insurance-portfolio-review/" data-group="business">I am not sure, please advise</option></optgroup>` }) +
    cond('business wiba pi cargo', `<div class="row">${field({ id: 'company', label: 'Business or firm name' })}${field({ id: 'industry', label: 'Industry or profession' })}</div>`) +
    cond('business wiba pi', `<div class="row">${field({ id: 'employees', label: 'Number of employees', options: bands(['1 to 5', '6 to 20', '21 to 50', '51 to 200', 'More than 200']) })}${field({ id: 'turnover', label: 'Approximate annual turnover or fees', options: bands(['Under KES 5 million', 'KES 5 to 20 million', 'KES 20 to 100 million', 'Over KES 100 million', 'Prefer to discuss']) })}</div>`) +
    cond('wiba', field({ id: 'payroll', label: 'Approximate annual payroll', options: bands(['Under KES 5 million', 'KES 5 to 20 million', 'KES 20 to 100 million', 'Over KES 100 million', 'Prefer to discuss']) })) +
    cond('motor', `<div class="row">${field({ id: 'vehicle', label: 'Vehicle make, model and year' })}${field({ id: 'vehicle_use', label: 'Use', options: bands(['Private', 'Commercial', 'Hire or taxi', 'Fleet']) })}</div>`) +
    cond('medical', field({ id: 'members', label: 'Who needs cover?', hint: 'Number of people and their ages' })) +
    cond('travel', `<div class="row">${field({ id: 'destination', label: 'Destination' })}${field({ id: 'travel_dates', label: 'Travel dates' })}</div>`) +
    cond('cargo', `<div class="row">${field({ id: 'goods', label: 'Goods being moved' })}${field({ id: 'route', label: 'Route', hint: 'From and to' })}</div>`) +
    field({ id: 'message', label: 'Anything else we should know', type: 'textarea' }) +
    field({ id: 'contact_pref', label: 'Best way to reach you', options: bands(['Phone call', 'WhatsApp', 'Email']) });
  const trail = crumbTrail('/get-a-quote/', 'Get a Quote');
  const body = `
<section class="page-hero"><div class="wrap">${crumbsHtml(trail)}<h1 style="margin-top:var(--s5)">Get a quote</h1><p class="lead">Tell us what you need and an advisor will come back with options. We only ask for what we need to start. We will ask for more detail later.</p></div></section>
<div class="wrap product-grid"><div class="panel">${formShell('quote', 'Quote request from website', inner, 'Request my quote')}</div>
<aside class="aside"><div class="aside-box"><h2>What happens next</h2><ul class="steps" style="gap:var(--s4)"><li><h3>We review</h3><p>An advisor reads your request and checks what insurers will need.</p></li><li><h3>We ask questions</h3><p>We follow up by your preferred route for anything missing.</p></li><li><h3>You get options</h3><p>We explain the cover, limits, exclusions and premiums in plain language.</p></li></ul>
${site.whatsapp ? `<a class="btn btn-ghost" href="${esc(waLink())}" rel="noopener">Prefer WhatsApp?</a>` : ''}</div></aside></div>`;
  emit('/get-a-quote/', layout({ path: '/get-a-quote/', title: 'Get an Insurance Quote in Kenya | Chestnut Insurance Agency', desc: 'Request an insurance quotation from Chestnut for business, professional or personal cover. Tell us what you need and an advisor will respond.', body, schema: [{ '@type': 'WebPage', url: abs('/get-a-quote/') }, crumbsSchema(trail)] }));
}

// ---------------------------------------------------------------- contact
{
  const trail = crumbTrail('/contact-us/', 'Contact');
  const items = [];
  if (site.whatsapp) items.push(`<li><strong><span aria-hidden="true">☏</span> WhatsApp</strong><a href="${esc(waLink())}" rel="noopener">Start a chat</a></li>`); else items.push(`<li><strong><span aria-hidden="true">☏</span> WhatsApp</strong>${todo('Add WhatsApp number in src/config.mjs')}</li>`);
  if (site.phone) items.push(`<li><strong><span aria-hidden="true">☎</span> Phone</strong><a href="${esc(telLink())}">${esc(site.phoneDisplay || site.phone)}</a></li>`); else items.push(`<li><strong><span aria-hidden="true">☎</span> Phone</strong>${todo('Add phone number in src/config.mjs')}</li>`);
  if (site.email) items.push(`<li><strong><span aria-hidden="true">✉</span> Email</strong><a href="${esc(mailLink())}">${esc(site.email)}</a></li>`); else items.push(`<li><strong><span aria-hidden="true">✉</span> Email</strong>${todo('Add email address in src/config.mjs')}</li>`);
  items.push(`<li><strong><span aria-hidden="true">📍</span> Office</strong>${esc(site.addressLine)}${site.addressLine === 'Lavington Mall, Nairobi' ? ' ' + todo('Confirm floor, unit and street') : ''}</li>`);
  items.push(`<li><strong>Hours</strong>${site.officeHours ? esc(site.officeHours) : todo('Add office hours in src/config.mjs')}</li>`);
  const body = `
<section class="page-hero"><div class="wrap">${crumbsHtml(trail)}<h1 style="margin-top:var(--s5)">Contact Chestnut Insurance Agency</h1><p class="lead">Speak to an insurance advisor about business, professional or personal cover, a renewal, or a claim.</p><div class="btn-row"><a class="btn btn-primary" href="${esc(consultationLink())}">Book a Consultation</a><a class="btn btn-ghost" href="/insurance-portfolio-review/">Request a Free Review</a></div></div></section>
<div class="wrap section"><div class="split split-even">
  <div><h2>Reach us</h2><ul class="contact-list">${items.join('')}</ul>
    <p style="margin-top:var(--s5)" class="form-note">Prefer to start with details? Use <a href="/get-a-quote/">the quote form</a>, <a href="/insurance-portfolio-review/">request a review</a> or <a href="/claims-assistance/">ask for claims help</a>.</p></div>
  <div class="panel"><h2 style="font-size:1.6rem">Send us a message</h2>${formShell('contact', 'Website enquiry', field({ id: 'name', label: 'Your name', required: true, autocomplete: 'name' }) + `<div class="row">${field({ id: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel' })}${field({ id: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' })}</div>` + field({ id: 'topic', label: 'What is this about?', options: '<option value="">Select</option><option>Business insurance</option><option>Professional insurance</option><option>Personal insurance</option><option>Insurance review</option><option>Claim</option><option>Something else</option>' }) + field({ id: 'message', label: 'Message', type: 'textarea', required: true }))}</div>
</div></div>
<section class="section section-warm"><div class="wrap"><h2>Find our office</h2><div class="map-embed"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1159.5422551072993!2d36.769918774277826!3d-1.2802185254495473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1bf71d294991%3A0x81a7bd7323b959ba!2sChestnut%20Insurance%20Agency!5e0!3m2!1sen!2ske!4v1795418632252!5m2!1sen!2ske" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="Chestnut Insurance Agency location"></iframe></div></div></section>`;
  emit('/contact-us/', layout({ path: '/contact-us/', title: 'Contact Chestnut Insurance Agency | Nairobi, Kenya', desc: 'Contact Chestnut Insurance Agency in Nairobi to speak with an insurance advisor about business, professional or personal cover, or a claim.', body, schema: [{ '@type': 'ContactPage', url: abs('/contact-us/') }, crumbsSchema(trail)] }));
}

// ---------------------------------------------------------------- about
{
  const trail = crumbTrail('/about/', 'About Chestnut');
  const body = `
<section class="page-hero"><div class="wrap">${crumbsHtml(trail)}<p class="eyebrow" style="margin-top:var(--s5)">About Chestnut</p><h1>Insurance explained properly, by people who work in it.</h1>
<p class="lead">Chestnut Insurance Agency is a Nairobi-based insurance agency that helps individuals, businesses and organisations understand their risks, choose suitable cover and get support when they claim.</p></div></section>
<section class="section"><div class="wrap"><div class="split">
  <div><h2>What we believe</h2></div>
  <div class="principles" style="grid-template-columns:1fr">
    <div><h3>Expertise</h3><p>Insurance is technical and the wording matters. We explain cover, limits and exclusions in clear Kenyan context so you know what you are buying.</p></div>
    <div><h3>Advocacy</h3><p>We are on the client\u2019s side of the table: reading the wording, asking insurers the awkward questions and supporting you when a claim arises.</p></div>
    <div><h3>Practical solutions</h3><p>Quotes, renewals, reviews and claims should be easy. We keep the process simple and the communication plain.</p></div>
  </div></div></div></section>
<section class="section section-warm"><div class="wrap"><div class="split">
  <div><h2>How we work</h2></div>
  <div class="prose"><p>Chestnut is an intermediary. We advise you, gather the information insurers need and approach suitable insurers for terms. The policy is issued by the insurer and governed by its wording. You decide what to buy.</p>
  <p>We focus on business and specialist insurance, including professional indemnity, WIBA, liability, property, engineering and marine, alongside personal covers for motor, medical, travel and home.</p>
  <p class="callout callout-teal">${esc(site.iraLicenceNote)}${site.iraLicenceNumber ? ' Licence number ' + esc(site.iraLicenceNumber) + '.' : ' ' + todo('Add IRA licence number and confirm wording against the IRA register')}</p></div>
</div></div></section>

${ctaBand('Let us look at your insurance.', 'Whether you are buying for the first time or reviewing at renewal, start with a conversation.')}`;
  emit('/about/', layout({ path: '/about/', title: 'About Chestnut Insurance Agency | The Insurance Experts', desc: 'Chestnut is a Nairobi insurance agency offering advice-led business, professional and personal insurance. Learn how we work and what we stand for.', body, schema: [{ '@type': 'AboutPage', url: abs('/about/') }, crumbsSchema(trail)] }));
}

// ---------------------------------------------------------------- privacy (draft, noindex)
{
  const trail = crumbTrail('/privacy/', 'Privacy Notice');
  const body = `<section class="page-hero"><div class="wrap">${crumbsHtml(trail)}<h1 style="margin-top:var(--s5)">Privacy notice</h1></div></section>
<div class="wrap section"><div class="prose" style="max-width:46rem">
<p class="callout">${todo('DRAFT for legal review. Have this notice reviewed against the Kenya Data Protection Act, 2019 and Chestnut\u2019s actual data practices before launch.')}</p>
<h2>What we collect</h2><p>When you complete a form on this website we collect the details you enter, such as your name, contact details and information about the cover you are asking about.</p>
<h2>How we use it</h2><p>We use your details to respond to your enquiry, prepare quotations and provide advice. With your instruction, we share the information insurers need with them to obtain terms.</p>
<h2>Your choices</h2><p>You may ask what we hold about you and ask us to correct or delete it, subject to legal and regulatory requirements. Contact us using the details on our <a href="/contact-us/">contact page</a>.</p>
<h2>Analytics</h2><p>${site.ga4Id ? 'This website uses Google Analytics to understand how it is used.' : 'This website does not currently use analytics cookies.'}</p>
</div></div>`;
  emit('/privacy/', layout({ path: '/privacy/', title: 'Privacy Notice | Chestnut Insurance Agency', desc: 'How Chestnut Insurance Agency handles information you submit through this website.', body, noindex: true, schema: [crumbsSchema(trail)] }), true);
}

// ---------------------------------------------------------------- 404
emit('/404.html', layout({ path: '/404/', title: 'Page not found | Chestnut Insurance Agency', desc: 'The page you were looking for could not be found.', noindex: true, body: `<section class="notfound"><div class="wrap"><p class="eyebrow">404</p><h1>We could not find that page.</h1><p class="lead">It may have moved. Try one of these, or tell us what you were looking for.</p>${indexList(['/business-insurance-kenya/', '/personal-insurance/', '/professional-indemnity-insurance-kenya/', '/get-a-quote/', '/contact-us/'])}</div></section>` }), true);

// ---------------------------------------------------------------- HOME
{
  const featured = ['/professional-indemnity-insurance-kenya/', '/wiba-insurance-kenya/', '/public-liability-insurance-kenya/', '/business-property-insurance/fire/', '/contractors-all-risks-insurance-kenya/', '/cyber-insurance-kenya/', '/directors-officers-insurance-kenya/', '/marine-insurance-kenya/', '/goods-in-transit-insurance-kenya/', '/medical-insurance-kenya/group/'];
  const faqs = [
    ['What does an insurance agency do?', 'We advise you on the cover you need, collect the information insurers require, approach suitable insurers for terms and support you with renewals and claims. The policy itself is issued by the insurer.'],
    ['What insurance does my business need?', 'It depends on what you own, who you employ and what you do. Most employers need work injury cover (WIBA), most businesses with premises need property cover and many need liability cover. A short review will give you a clear list.'],
    ['Do you only work with businesses?', 'No. Our depth is in business and specialist cover, and we also arrange motor, medical, travel, home and personal accident insurance for individuals and families.'],
    ['Can you help with a claim?', 'Yes. We help you understand your policy, prepare documents and follow up with the insurer. We cannot promise a settlement, since that depends on the policy and the facts of the loss.']
  ];
  const latest = guides.slice(0, 4).map((g) => g.path);
  const body = `
<section class="hero hero-photo"><div class="wrap hero-grid">
  <div>
    <p class="eyebrow">The Insurance Experts &middot; Nairobi</p>
    <h1>Insurance advice and protection for <span class="hero-highlight">individuals, businesses and organisations</span></h1>
    <p class="lead">Chestnut Insurance Agency is a Kenyan insurance agency helping businesses, professionals, families and organisations arrange motor, medical, business, property, liability, marine cargo and specialist insurance. We work with established insurance companies in Kenya including APA, Britam, CIC, Jubilee, Old Mutual and other providers to source suitable cover, compare terms and support clients through renewals and claims.</p>
    <div class="btn-row"><a class="btn btn-primary" href="${esc(consultationLink())}">Book a Consultation</a><a class="btn btn-light" href="/insurance-portfolio-review/">Free Insurance Review</a><a class="btn btn-ghost" href="/get-a-quote/">Get a Quote</a></div>
  </div>
  <div class="paths">
    <p class="paths-title">Where would you like to start?</p><p class="paths-sub">Choose the path closest to you.</p>
    <ul>
      <li><a href="/business-insurance-kenya/"><span class="path-num">01</span><span><span class="path-name">My business</span><span class="path-desc">Property, people, liability, transit and operations</span></span><span class="path-arrow" aria-hidden="true">&rarr;</span></a></li>
      <li><a href="/professional-indemnity-insurance-kenya/"><span class="path-num">02</span><span><span class="path-name">My profession</span><span class="path-desc">Professional indemnity, directors and cyber cover</span></span><span class="path-arrow" aria-hidden="true">&rarr;</span></a></li>
      <li><a href="/personal-insurance/"><span class="path-num">03</span><span><span class="path-name">Myself and my family</span><span class="path-desc">Motor, medical, travel, home and accident</span></span><span class="path-arrow" aria-hidden="true">&rarr;</span></a></li>
      <li><a href="/contractors-all-risks-insurance-kenya/"><span class="path-num">04</span><span><span class="path-name">My project or property</span><span class="path-desc">Construction, plant, buildings and stock</span></span><span class="path-arrow" aria-hidden="true">&rarr;</span></a></li>
      <li><a href="/financial-products/"><span class="path-num">05</span><span><span class="path-name">My wealth and financial goals</span><span class="path-desc">Money market funds, savings, education and retirement solutions</span></span><span class="path-arrow" aria-hidden="true">&rarr;</span></a></li>
    </ul>
  </div>
</div></section>



<section class="section popular-covers-section chestnut-solutions"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Our insurance solutions</p><h2>Insurance for the way you live and work in Kenya</h2><p class="lead">Compare cover from Kenyan insurers with an advisor who explains the terms and stays with you at claim time.</p></div>
  <div class="solution-featured">
    <a class="solution-feature" href="/motor-insurance-kenya/"><img src="/images/site/motor.jpg" alt="" loading="lazy"><div class="solution-feature-content"><span class="solution-icon" aria-hidden="true">🚘</span><div><h3>Motor Insurance</h3><p>Private, commercial, PSV and fleet cover.</p><span class="solution-link">Explore cover <span aria-hidden="true">→</span></span></div></div></a>
    <a class="solution-feature" href="/medical-insurance-kenya/"><img src="/images/site/medical.jpg" alt="" loading="lazy"><div class="solution-feature-content"><span class="solution-icon" aria-hidden="true">♡</span><div><h3>Medical Insurance</h3><p>Individual, family and group cover for hospital and outpatient care.</p><span class="solution-link">Explore cover <span aria-hidden="true">→</span></span></div></div></a>
    <a class="solution-feature" href="/business-insurance-kenya/"><img src="/images/site/business.jpg" alt="" loading="lazy"><div class="solution-feature-content"><span class="solution-icon" aria-hidden="true">▦</span><div><h3>Business Insurance</h3><p>Property, liability, equipment, stock and people in one programme.</p><span class="solution-link">Explore cover <span aria-hidden="true">→</span></span></div></div></a>
  </div>
  <div class="solution-groups">
    <div class="solution-group"><h3>For employers and businesses</h3><div class="solution-link-grid">
      <a href="/wiba-insurance-kenya/"><span class="sg-icon">⌂</span><span><strong>WIBA</strong><small>Statutory work injury cover for employees.</small></span><b aria-hidden="true">›</b></a>
      <a href="/medical-insurance-kenya/group/"><span class="sg-icon">♧</span><span><strong>Group Medical &amp; Life</strong><small>Staff benefits for employers.</small></span><b aria-hidden="true">›</b></a>
      <a href="/contractors-all-risks-insurance-kenya/"><span class="sg-icon">⚒</span><span><strong>Contractors All Risks</strong><small>Construction projects and third parties.</small></span><b aria-hidden="true">›</b></a>
      <a href="/marine-insurance-kenya/"><span class="sg-icon">≋</span><span><strong>Marine Cargo</strong><small>Import cover for sea, air and road.</small></span><b aria-hidden="true">›</b></a>
      <a href="/public-liability-insurance-kenya/"><span class="sg-icon">◇</span><span><strong>Public Liability</strong><small>Injury and damage claims from third parties.</small></span><b aria-hidden="true">›</b></a>
      <a href="/professional-indemnity-insurance-kenya/"><span class="sg-icon">▤</span><span><strong>Professional Indemnity &amp; Cyber</strong><small>Professional errors and digital risks.</small></span><b aria-hidden="true">›</b></a>
    </div></div>
    <div class="solution-group"><h3>For individuals and families</h3><div class="solution-link-grid">
      <a href="/travel-insurance-kenya/"><span class="sg-icon">✈</span><span><strong>Travel Insurance</strong><small>Medical, trip and baggage cover.</small></span><b aria-hidden="true">›</b></a>
      <a href="/home-insurance-kenya/"><span class="sg-icon">⌂</span><span><strong>Home Insurance</strong><small>Your house, contents and valuables.</small></span><b aria-hidden="true">›</b></a>
      <a href="/personal-accident-insurance-kenya/"><span class="sg-icon">＋</span><span><strong>Personal Accident</strong><small>Protection after an accident.</small></span><b aria-hidden="true">›</b></a>
      <a href="/group-life-insurance-kenya/"><span class="sg-icon">♧</span><span><strong>Life Insurance</strong><small>Financial protection for your family.</small></span><b aria-hidden="true">›</b></a>
    </div></div>
  </div>
  <div class="financial-section"><div class="financial-heading"><h2>Beyond Insurance</h2></div><p class="financial-intro">Planning for your financial future</p><div class="financial-card-grid"><a href="/money-market-funds-kenya/"><span class="sg-icon">◉</span><span><strong>Money Market Funds</strong><small>Explore investment and savings opportunities.</small></span><b aria-hidden="true">›</b></a><a href="/savings-and-education-plans-kenya/"><span class="sg-icon">✦</span><span><strong>Savings &amp; Education Plans</strong><small>Plan for education and long-term goals.</small></span><b aria-hidden="true">›</b></a><a href="/pension-and-retirement-planning-kenya/"><span class="sg-icon">⌛</span><span><strong>Pensions &amp; Annuities</strong><small>Prepare for retirement and future income.</small></span><b aria-hidden="true">›</b></a></div><p class="financial-disclosure">Financial products are separate from insurance and offered through partner providers, subject to eligibility and arrangements.</p></div>
</div></section>

<section class="section partners-section"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Our Insurance Partners</p><h2>Insurance solutions backed by leading providers</h2><p class="lead">We work with leading insurance companies in Kenya including APA Insurance, Britam, CIC, Jubilee, Old Mutual, ICEA Lion, First Assurance, AAR, GA Insurance, Sanlam Allianz and Fidelity, subject to product availability and underwriting.</p></div>
  <div class="partners-carousel" aria-label="Insurance partner logos">
    <div class="partners-track">
      <div class="partner-logo"><img src="/images/partners/apa.png" alt="APA Insurance" loading="lazy"></div>
      <div class="partner-logo"><img src="/images/partners/old-mutual.png" alt="Old Mutual" loading="lazy"></div>
      <div class="partner-logo"><img src="/images/partners/cic.png" alt="CIC Insurance" loading="lazy"></div>
      <div class="partner-logo"><img src="/images/partners/britam.png" alt="Britam" loading="lazy"></div>
      <div class="partner-logo"><img src="/images/partners/icea-lion.jpg" alt="ICEA Lion" loading="lazy"></div>
      <div class="partner-logo"><img src="/images/partners/first-assurance.png" alt="First Assurance" loading="lazy"></div>
      <div class="partner-logo"><img src="/images/partners/ga-insurance.png" alt="GA Insurance" loading="lazy"></div>
      <div class="partner-logo"><img src="/images/partners/jubilee.webp" alt="Jubilee Insurance" loading="lazy"></div>
      <div class="partner-logo"><img src="/images/partners/fidelity.webp" alt="Fidelity Insurance" loading="lazy"></div>
      <div class="partner-logo"><img src="/images/partners/aar.png" alt="AAR Insurance" loading="lazy"></div>
      <div class="partner-logo"><img src="/images/partners/sanlam-allianz.png" alt="Sanlam Allianz" loading="lazy"></div>
      <div class="partner-logo" aria-hidden="true"><img src="/images/partners/apa.png" alt="" loading="lazy"></div>
      <div class="partner-logo" aria-hidden="true"><img src="/images/partners/old-mutual.png" alt="" loading="lazy"></div>
      <div class="partner-logo" aria-hidden="true"><img src="/images/partners/cic.png" alt="" loading="lazy"></div>
      <div class="partner-logo" aria-hidden="true"><img src="/images/partners/britam.png" alt="" loading="lazy"></div>
      <div class="partner-logo" aria-hidden="true"><img src="/images/partners/icea-lion.jpg" alt="" loading="lazy"></div>
      <div class="partner-logo" aria-hidden="true"><img src="/images/partners/first-assurance.png" alt="" loading="lazy"></div>
      <div class="partner-logo" aria-hidden="true"><img src="/images/partners/ga-insurance.png" alt="" loading="lazy"></div>
      <div class="partner-logo" aria-hidden="true"><img src="/images/partners/jubilee.webp" alt="" loading="lazy"></div>
      <div class="partner-logo" aria-hidden="true"><img src="/images/partners/fidelity.webp" alt="" loading="lazy"></div>
      <div class="partner-logo" aria-hidden="true"><img src="/images/partners/aar.png" alt="" loading="lazy"></div>
      <div class="partner-logo" aria-hidden="true"><img src="/images/partners/sanlam-allianz.png" alt="" loading="lazy"></div>
    </div>
  </div>
</div></section>




<section class="section section-dark advisory-services-band" style="background-color:#006C67 !important;"><div class="wrap"><div class="split">
  <div><p class="eyebrow">Advisory services</p><h2>Useful services for HR, Procurement, Finance and Admin teams</h2><p style="color:rgba(255,255,255,.85)">Ways we help you get more from your Insurance Program.</p></div>
  <div class="adv">
    <a href="/insurance-portfolio-review/"><strong>Insurance portfolio review</strong><p>Find gaps, overlaps and outdated values before renewal.</p></a>
    <a href="/claims-assistance/"><strong>Claims assistance</strong><p>Prepare, submit and follow up a claim with confidence.</p></a>
    <a href="/business-risk-assessment/"><strong>Business risk assessment</strong><p>A structured view of what can go wrong, and what to do about it.</p></a>
    <a href="/insurance-tender-support/"><strong>Tender and RFQ support</strong><p>Meet the insurance requirements of your next bid or contract.</p></a>
  </div></div></div></section>






<section class="section testimonials-section"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Client experience</p><h2>What working with Chestnut should feel like</h2><p class="lead">Insurance advice built around clarity, responsiveness and practical support.</p></div>
  <div class="testimonial-carousel" aria-roledescription="carousel" aria-label="Client experience">
    <div class="testimonial-slides">
      <article class="testimonial-card testimonial-slide is-active"><span class="testimonial-mark" aria-hidden="true">“</span><h3>Clear, straightforward advice</h3><p>Understand the cover, the limits, the exclusions and what your options actually mean—without jargon.</p><span class="testimonial-source">Clarity at every step</span></article>
      <article class="testimonial-card testimonial-slide"><span class="testimonial-mark" aria-hidden="true">“</span><h3>Support that stays with you</h3><p>From quotation and onboarding to renewal questions and claims follow-up, know where to turn for help.</p><span class="testimonial-source">Practical support</span></article>
      <article class="testimonial-card testimonial-slide"><span class="testimonial-mark" aria-hidden="true">“</span><h3>Options, not pressure</h3><p>Compare suitable insurance options and make an informed decision based on your needs and budget.</p><span class="testimonial-source">Your decision comes first</span></article>
      <article class="testimonial-card testimonial-slide"><span class="testimonial-mark" aria-hidden="true">“</span><h3>Advice that understands Kenya</h3><p>Recommendations shaped around local business realities, contracts, operations and the risks you face.</p><span class="testimonial-source">Local context</span></article>
      <article class="testimonial-card testimonial-slide"><span class="testimonial-mark" aria-hidden="true">“</span><h3>Renewals made easier</h3><p>Review your programme before renewal, identify gaps and prepare the information insurers need.</p><span class="testimonial-source">A more organised renewal</span></article>
    </div>
    <div class="testimonial-controls"><button class="testimonial-prev" type="button" aria-label="Previous slide">‹</button><div class="testimonial-dots" role="group" aria-label="Choose slide"><button type="button" class="is-active" aria-label="Slide 1"></button><button type="button" aria-label="Slide 2"></button><button type="button" aria-label="Slide 3"></button><button type="button" aria-label="Slide 4"></button><button type="button" aria-label="Slide 5"></button></div><button class="testimonial-next" type="button" aria-label="Next slide">›</button></div>
  </div>
</div></section>
<script>document.addEventListener('DOMContentLoaded',()=>{const root=document.querySelector('.testimonial-carousel');if(!root)return;const slides=[...root.querySelectorAll('.testimonial-slide')],dots=[...root.querySelectorAll('.testimonial-dots button')];let i=0,timer;function restart(){clearInterval(timer);timer=setInterval(()=>show(i+1),7000)}function show(n){i=(n+slides.length)%slides.length;slides.forEach((s,k)=>{s.classList.toggle('is-active',k===i);s.setAttribute('aria-hidden',k===i?'false':'true')});dots.forEach((d,k)=>d.classList.toggle('is-active',k===i));restart()}root.querySelector('.testimonial-prev').addEventListener('click',()=>show(i-1));root.querySelector('.testimonial-next').addEventListener('click',()=>show(i+1));dots.forEach((d,k)=>d.addEventListener('click',()=>show(k)));root.addEventListener('mouseenter',()=>clearInterval(timer));root.addEventListener('mouseleave',restart);show(0);});</script>

<section class="section section-warm homepage-questions" id="homepage-questions"><div class="wrap"><div class="split">
  <div><p class="eyebrow">Questions</p><h2>Common questions</h2></div>
  <div>${faqHtml(faqs)}</div>
</div></div></section>
<section class="section homepage-blog" id="blog-preview"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Our Blog</p><h2>Insurance insights for Kenyan businesses, professionals and households</h2><p class="lead">Practical guides to help you understand insurance and make informed decisions.</p><p><a class="textlink" href="/insurance-guides/">Explore all articles</a></p></div>
  <div class="home-blog-grid">
    ${latest.slice(0,3).map((p) => { const g=guides.find((g) => g.path === p); const imageFor=(category)=>category === "Motor" ? "/images/site/motor.jpg" : category === "Employers" ? "/images/site/business.jpg" : category === "Professionals" ? "/images/site/individuals.jpg" : category === "Marine" ? "/images/site/marine.jpg" : category === "Medical" ? "/images/site/medical.jpg" : category === "Travel" ? "/images/site/travel.jpg" : category === "Claims" ? "/images/site/claims.jpg" : category === "SMEs" ? "/images/site/business.jpg" : "/images/site/wealth.jpg"; return `<article class="home-blog-card"><a class="home-blog-image" href="${g.path}"><img src="${imageFor(g.category)}" alt="" loading="lazy"><span class="blog-category">${esc(g.category)}</span></a><div class="home-blog-body"><h3><a href="${g.path}">${esc(g.h1)}</a></h3><p>${esc(g.desc)}</p><a class="blog-read" href="${g.path}">Read article <span aria-hidden="true">→</span></a></div></article>`; }).join("")} 
  </div>
</div></section>
${ctaBand()}`;
  emit('/', layout({
    path: '/', title: 'Chestnut Insurance Agency Kenya | Insurance Advice & Protection',
    desc: 'Insurance advice and protection for individuals, businesses and organisations in Kenya. Get a quote or speak with Chestnut\u2019s insurance advisors.',
    body, schema: [{ '@type': 'WebPage', '@id': abs('/#page'), url: abs('/'), name: 'Chestnut Insurance Agency Kenya', isPartOf: { '@id': abs('/#website') }, about: { '@id': abs('/#org') } }, faqSchema(faqs)]
  }));
}

// ---------------------------------------------------------------- redirects + migration doc
const redirectLines = [];
const rows = [];
for (const [old, target, fallback, note] of legacy) {
  let dest = null, status = '';
  if (old === '/about') { rows.push([old, '/about/', 'RETAINED (same URL)', note]); continue; }
  if (registry.has(target)) { dest = target; status = 'OK'; }
  else if (fallback && registry.has(fallback)) { dest = fallback; status = `INTERIM (preferred ${target} not built)`; }
  else status = `UNRESOLVED (no page for ${target})`;
  if (dest) redirectLines.push(`${old} ${dest} 301`, `${old}/ ${dest} 301`);
  rows.push([old, dest || '-', status, note]);
}

// ---------------------------------------------------------------- write dist
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
for (const f of fs.readdirSync('public')) { const src=path.join('public', f), dest=path.join(DIST, f); if (fs.statSync(src).isDirectory()) fs.cpSync(src, dest, {recursive:true}); else fs.copyFileSync(src, dest); }
for (const pg of pages) {
  const file = pg.path.endsWith('.html') ? path.join(DIST, pg.path) : path.join(DIST, pg.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, pg.html);
}
const indexable = [...pages.filter((p) => !p.noindex).map((p) => p.path), '/motor-insurance-calculator/'].sort();
const today = site.published;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((p) => `  <url><loc>${abs(p)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);
fs.writeFileSync(path.join(DIST, '_redirects'), redirectLines.join('\n') + '\n');
fs.writeFileSync(path.join(DIST, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n\n/styles.css\n  Cache-Control: public, max-age=3600\n/app.js\n  Cache-Control: public, max-age=3600\n`);
fs.writeFileSync('MIGRATION.md', `# Legacy URL migration (49 URLs)\n\nGenerated by \`node build.mjs\`. **Provisional.** Check each row against Google Search Console, Analytics and backlink data before launch. Nothing redirects to the homepage.\n\n| Old path | Destination | Status | Note |\n| --- | --- | --- | --- |\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}\n\nINTERIM rows redirect to the closest existing page until the preferred page is built. Replace them when the preferred page ships.\n`);

// summary
const todos = pages.reduce((n, p) => n + (p.html.match(/class="todo"/g) || []).length, 0);
console.log(`Built ${pages.length} pages (${indexable.length} in sitemap), ${redirectLines.length / 2} redirects, ${todos} visible TODO placeholders.`);
if (!hasContact()) console.log('NOTE: no phone, WhatsApp or email set in src/config.mjs. Those buttons are hidden and forms are not connected.');
if (!site.formEndpoint) console.log('NOTE: site.formEndpoint is empty. Forms will not deliver enquiries until configured.');
const bad = rows.filter((r) => r[2].startsWith('INTERIM') || r[2].startsWith('UNRESOLVED')).length;
console.log(`Migration: ${rows.length} legacy URLs, ${bad} need a follow-up page (see MIGRATION.md).`);
