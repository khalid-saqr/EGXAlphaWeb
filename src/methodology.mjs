import { siteFooter, siteHeader } from './templates.mjs';
import { METHODOLOGY_CSS } from './methodology-style.mjs';
import { englishMethodology } from './methodology-en.mjs';
import { arabicMethodology } from './methodology-ar.mjs';

export function methodologyPage() {
  const locale = String(globalThis.__EGX_RENDER_LOCALE || 'en').toLowerCase();
  const body = locale.startsWith('ar') ? arabicMethodology() : englishMethodology();
  return `<style id="methodology-document-styles">${METHODOLOGY_CSS}</style><main class="site-shell page-methodology" data-page="methodology">${siteHeader('RESEARCH', 'research')}${body}${siteFooter()}</main>`;
}
