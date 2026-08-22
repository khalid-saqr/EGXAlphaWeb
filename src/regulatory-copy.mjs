import { transformDigitalTwinHome } from './digital-twin-home.mjs';
import { digitalTwinGuideSection } from './digital-twin-guide.mjs';
import { digitalTwinFaqSection } from './digital-twin-faq.mjs';
import { digitalTwinMethodologyArticle } from './digital-twin-methodology.mjs';
import { transformDigitalTwinInstitutional, transformDigitalTwinArchiveSearchSymbol, transformDigitalTwinFooter } from './digital-twin-shared.mjs';

function isArabic(locale) { return String(locale || '').toLowerCase().startsWith('ar'); }
function replaceAll(value, pairs) { let out=String(value??''); for(const [a,b] of pairs) out=out.replaceAll(a,b); return out; }
function basePath(html){
  const m=String(html).match(/href="([^"?#]*?)(?:\/today\/|\/archive\/|\/search\/|\/methodology\/|\/investor-guide\/|\/institutional\/|\/faq\/)/);
  if(!m) return ''; const prefix=m[1].replace(/\/$/,''); return prefix.replace(/\/ar$/,'');
}

const EN_TEXT=[
 ['How to Read EGX /Alpha | Investor Guide | EGX Research','Learn to Read EGX /Alpha | Financial Literacy Guide | EGX Research'],
 ['EGX /Alpha model history — EGXResearch','EGX /Alpha Public Model Memory | Research Digital Twin'],
 ['Search EGX /Alpha model history — EGXResearch','Search EGX /Alpha Public Model Memory | EGX Research'],
 ['Quantitative investment research','Quantitative market research'],
 ['Institutional Access','Institutional Enquiries'],
 ['ONLINE · LATEST RECORD CHECKED ON OPEN','ONLINE · LATEST PUBLIC MODEL STATE CHECKED ON OPEN'],
 ['OFFLINE · SHOWING LAST CACHED PUBLIC RECORD','OFFLINE · SHOWING LAST CACHED PUBLIC MODEL STATE'],
 ['POST-CLOSE · CAIRO','AFTER EGX CLOSE']
];
const AR_TEXT=[
 ['كيف تقرأ EGX /Alpha | دليل المستثمر | EGX Research','تعلّم قراءة EGX /Alpha | دليل الثقافة المالية | EGX Research'],
 ['سجل نموذج EGX /Alpha — EGXResearch','الذاكرة العامة لنموذج EGX /Alpha | التوأم الرقمي البحثي'],
 ['البحث في سجل نموذج EGX /Alpha — EGXResearch','البحث في الذاكرة العامة للتوأم الرقمي | EGX Research'],
 ['Quantitative investment research','Quantitative market research'],
 ['الوصول المؤسسي','استفسارات مؤسسية'],
 ['متصل · يتم فحص أحدث سجل عند فتح التطبيق','متصل · يتم فحص أحدث حالة عامة للنموذج عند فتح التطبيق'],
 ['غير متصل · عرض آخر سجل عام محفوظ','غير متصل · عرض آخر حالة عامة محفوظة للنموذج'],
 ['بعد الإغلاق · القاهرة','بعد إغلاق جلسة EGX']
];

export function applyRegulatoryText(value,locale='en'){
  let out=replaceAll(value,isArabic(locale)?AR_TEXT:EN_TEXT);
  if(!isArabic(locale)) {
    out=out.replace(/^EGX \/Alpha — \d{4}-\d{2}-\d{2} — \d+ stocks$/,'EGX /Alpha | Research Digital Twin of the Egyptian Equity Market');
    out=out.replace(/^EGX \/Alpha quantitative market ranking for the Egyptian Exchange, analysis date .+$/,'EGX /Alpha is a deep-learning research digital twin of the Egyptian equity market, publishing public model states for financial literacy, quantitative market education and reproducible research.');
    out=out.replace(/^(.+?) — EGX \/Alpha model history — EGXResearch$/,'$1 | Public Model Memory | EGX Research');
    out=out.replace(/^(.+?) — EGX \/Alpha model history$/,'$1 | Stock Model Memory | EGX Research');
  } else {
    out=out.replace(/^EGX \/Alpha — \d{4}-\d{2}-\d{2} — \d+ سهماً$/,'EGX /Alpha | توأم رقمي بحثي لسوق الأسهم المصري');
    out=out.replace(/^ترتيب EGX \/Alpha الكمي لسوق البورصة المصرية، تاريخ التحليل .+$/,'EGX /Alpha توأم رقمي بحثي بالتعلم العميق لسوق الأسهم المصري، ينشر حالات نموذج عامة لدعم الثقافة المالية والتعليم الكمي للأسواق والبحث القابل لإعادة التحقق.');
    out=out.replace(/^(.+?) — سجل نموذج EGX \/Alpha$/,'$1 | ذاكرة النموذج للسهم | EGX Research');
  }
  return out;
}
export function applyRegulatoryHtml(value,locale='en'){
 const ar=isArabic(locale); let out=String(value??''); const b=basePath(out);
 if(out.includes('page-home')||out.includes('data-page="signal"')) out=transformDigitalTwinHome(out,ar);
 if(out.includes('guide-shell')) out=out.replace(/<div class="guide-shell">[\s\S]*<\/div>\s*(?=<footer class="site-footer research-footer")/,digitalTwinGuideSection(ar,b));
 if(out.includes('page-faq')||out.includes('faq-page')) out=out.replace(/<section class="faq-page"[\s\S]*<\/section>\s*(?=<footer class="site-footer research-footer")/,digitalTwinFaqSection(ar,b));
 if(out.includes('methodology-story')) out=out.replace(/<article class="methodology-story"[\s\S]*<\/article>/,digitalTwinMethodologyArticle(ar,b));
 out=transformDigitalTwinInstitutional(out,ar);
 out=transformDigitalTwinArchiveSearchSymbol(out,ar);
 out=transformDigitalTwinFooter(out,ar);
 return applyRegulatoryText(out,locale);
}
