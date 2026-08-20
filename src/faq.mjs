import { escapeHtml, htmlShell, siteFooter, siteHeader } from './templates.mjs';

export function faqPage(locale = 'en') {
  const lang = String(locale || 'en').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  const title = lang === 'ar' ? 'الاسئلة الشائعة' : 'Frequently Asked Questions';
  const body = `<main class="site-shell page-faq" data-page="faq">
    ${siteHeader(title)}
    <section class="faq-empty-page" aria-labelledby="faq-title">
      <h1 id="faq-title">${escapeHtml(title)}</h1>
    </section>
    ${siteFooter()}
  </main>
  <style>
    .faq-empty-page{min-height:55vh;display:flex;align-items:flex-start;padding:clamp(56px,8vw,110px) 0}
    .faq-empty-page h1{max-width:14ch;margin:0;font-size:clamp(2.7rem,6vw,5.8rem);line-height:.94;letter-spacing:-.055em}
    html[dir="rtl"] .faq-empty-page h1{letter-spacing:0;line-height:1.08}
  </style>`;
  return htmlShell({
    title: `${title} | EGX /Alpha`,
    description: title,
    canonicalPath: '/faq/',
    body,
    pageClass: 'page-faq',
    locale: lang
  });
}
