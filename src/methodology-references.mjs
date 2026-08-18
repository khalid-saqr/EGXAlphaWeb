import { rel } from './templates.mjs';

export const EXTERNAL = {
  egx: 'https://www.egx.com.eg/en/indexrulesmethodologyegx70-ewi.aspx?nav=16',
  gu: 'https://academic.oup.com/rfs/article/33/5/2223/5758276',
  chen: 'https://pubsonline.informs.org/doi/10.1287/mnsc.2023.4695'
};

export function ext(href, label) {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function referenceCard(kind, href, title, note, external = false) {
  return `<a class="reference-card" href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}><span>${kind}</span><strong>${title}</strong><small>${note}</small></a>`;
}

export function sharedReferenceGrid(ar = false) {
  if (ar) return `<div class="reference-grid">
    ${referenceCard('مرجع خارجي', EXTERNAL.egx, 'البورصة المصرية — قواعد ومنهجية المؤشرات', 'مرجع رسمي يوضح أن المؤشر بناء مرجعي له قواعد محددة، وليس أداة لاختيار الأسهم.', true)}
    ${referenceCard('بحث أكاديمي', EXTERNAL.gu, 'Gu, Kelly & Xiu — Empirical Asset Pricing via Machine Learning', 'بحث محكّم عن استخدام التعلم الآلي والشبكات العصبية في التنبؤ المقطعي بعوائد الأسهم والتفاعلات غير الخطية.', true)}
    ${referenceCard('بحث أكاديمي', EXTERNAL.chen, 'Chen, Pelger & Zhu — Deep Learning in Asset Pricing', 'بحث محكّم عن استخدام الشبكات العميقة مع معلومات واسعة ومتغيرة زمنياً في تسعير الأصول.', true)}
    ${referenceCard('تحقق داخلي', rel('/today/'), 'ترتيب EGX /Alpha اليومي', 'شاهد الترتيب العام المنشور والآفاق واتجاه النموذج كما يراها المستثمر.')}
    ${referenceCard('تحقق داخلي', rel('/archive/'), 'السجل العام للنموذج', 'افتح ترتيبات سابقة كما نُشرت واحفظ الفصل بين السجل الحي والسجل التاريخي.')}
    ${referenceCard('تحقق داخلي', rel('/data/latest.json'), 'السجل العام القابل للقراءة آلياً', 'افحص آخر مخرج عام منشور دون كشف أي مكونات خاصة بالمحرك.')}
  </div>`;
  return `<div class="reference-grid">
    ${referenceCard('EXTERNAL', EXTERNAL.egx, 'The Egyptian Exchange — Index Rules & Methodology', 'Official context for how an index compresses a defined basket into a benchmark rather than selecting stocks.', true)}
    ${referenceCard('ACADEMIC', EXTERNAL.gu, 'Gu, Kelly & Xiu — Empirical Asset Pricing via Machine Learning', 'Peer-reviewed evidence on machine learning, nonlinear predictor interactions and cross-sectional equity-return prediction.', true)}
    ${referenceCard('ACADEMIC', EXTERNAL.chen, 'Chen, Pelger & Zhu — Deep Learning in Asset Pricing', 'Peer-reviewed evidence on deep neural networks using broad conditioning information and time variation in asset pricing.', true)}
    ${referenceCard('INTERNAL', rel('/today/'), 'Today’s EGX /Alpha ranking', 'Inspect the public ranking, horizons and Model Direction exactly as an investor sees them.')}
    ${referenceCard('INTERNAL', rel('/archive/'), 'Public model memory', 'Open preserved rankings by session and verify the public chronology.')}
    ${referenceCard('INTERNAL', rel('/data/latest.json'), 'Machine-readable public record', 'Inspect the latest published public output without exposing the private engine.')}
  </div>`;
}
