import { isArabic } from './i18n.mjs';

function replaceAll(value, pairs) {
  let output = String(value ?? '');
  for (const [source, target] of pairs) output = output.replaceAll(source, target);
  return output;
}

const TEXT_PAIRS = [
  ['Search EGX /Alpha model history — EGXResearch', 'البحث في سجل نموذج EGX /Alpha — EGXResearch'],
  ['EGX /Alpha model history — EGXResearch', 'سجل نموذج EGX /Alpha — EGXResearch'],
  ['EGX /Alpha model history', 'سجل نموذج EGX /Alpha'],
  ['How EGX /Alpha works — EGXResearch', 'كيف يعمل EGX /Alpha — EGXResearch'],
  ['How to Use EGX /Alpha | Egyptian Stock Market Decision Support | EGX Research', 'كيفية استخدام EGX /Alpha | دعم القرار في سوق الأسهم المصرية | EGX Research'],
  ['Institutional — EGX /Alpha', 'للمؤسسات — EGX /Alpha'],
  ['Public methodology and interpretation guide for EGX /Alpha.', 'المنهجية العامة ودليل تفسير EGX /Alpha.'],
  ['Explore dated EGX /Alpha quantitative model rankings.', 'استعرض ترتيبات نموذج EGX /Alpha الكمي المحفوظة حسب التاريخ.'],
  ['Search public EGX /Alpha rankings by date, stock, outlook or signal.', 'ابحث في ترتيبات EGX /Alpha العامة حسب التاريخ أو السهم أو الأفق أو اتجاه النموذج.'],
  ['Institutional research and technology enquiries for EGX /Alpha.', 'استفسارات البحث والتقنية للمؤسسات بشأن EGX /Alpha.'],
  ['Public quantitative EGX /Alpha ranking history for ', 'السجل العام لترتيب EGX /Alpha الكمي للسهم '],
  ['EGX /Alpha quantitative market ranking for the Egyptian Exchange, analysis date ', 'ترتيب EGX /Alpha الكمي لسوق البورصة المصرية، تاريخ التحليل '],
  ['How retail investors can use EGX /Alpha for Egyptian Stock Market research, deep-learning stock forecasting and EGX stock analysis, including البورصة المصرية.', 'كيف يمكن للمستثمر الفرد استخدام EGX /Alpha في بحث سوق الأسهم المصرية وتوقع الأسهم بالتعلم العميق وتحليل أسهم البورصة المصرية.'],
  ['Switch language', 'تغيير اللغة'],
  ['Install EGX /Alpha', 'تثبيت EGX /Alpha'],
  ['INSTALL EGX /ALPHA', 'تثبيت EGX /ALPHA'],
  ['ONLINE · LATEST RECORD CHECKED ON OPEN', 'متصل · يتم فحص أحدث سجل عند فتح التطبيق'],
  ['OFFLINE · SHOWING LAST CACHED PUBLIC RECORD', 'غير متصل · عرض آخر سجل عام محفوظ'],
  ['LANGUAGE', 'اللغة'],
  ['Today', 'اليوم'],
  ['History', 'السجل'],
  ['Search', 'بحث'],
  ['Guide', 'الدليل'],
  ['Institutional', 'للمؤسسات'],
  ['INVESTOR GUIDE', 'دليل المستثمر'],
  ['INVESTOR الدليل', 'دليل المستثمر'],
  [', in association with ', '، بالتعاون مع '],
  [' and ', ' و'],
  ['Positive', 'إيجابي'],
  ['Neutral', 'محايد'],
  ['Negative', 'سلبي'],
  ['Rank Move', 'تغير الترتيب'],
  ['Evidence accumulating', 'الأدلة قيد التراكم'],
  ['Validated', 'متحقق'],
  ['Live', 'حي']
];

export function polishLocalizedText(value, locale = 'en') {
  if (!isArabic(locale)) return String(value ?? '');
  let output = replaceAll(value, TEXT_PAIRS);
  output = output.replace(/\b(\d[\d,]*) stocks\b/gi, '$1 سهماً');
  return output;
}

export function polishLocalizedHtml(value, locale = 'en') {
  if (!isArabic(locale)) return String(value ?? '');
  let output = String(value ?? '');

  // Keep the live homepage value proposition atomic so generic localization cannot split its meaning.
  const liveHero = output.includes('Which EGX stocks deserve your attention now?');
  if (liveHero) {
    output = output.replaceAll('Which EGX stocks deserve your attention now?', 'أي أسهم EGX تستحق انتباهك الآن؟');
    output = output.replace(
      /<p class="control-deck-lede">[\s\S]*?<\/p>/,
      '<p class="control-deck-lede">بعد كل جلسة في البورصة المصرية، يواجه المستثمرون المشكلة نفسها: <strong>أسهم كثيرة، وضوضاء كثيرة، وقدرة محدودة على المتابعة.</strong> يحول EGX /Alpha السوق إلى ترتيب يومي للأولوية، موضحاً الأسهم التي يتوقع نموذجه أن تحقق أداءً أفضل نسبياً من بقية السوق في الأيام المقبلة. <strong>كلما ظهر السهم في مركز أعلى، كان تفضيل EGX /Alpha النسبي له أقوى.</strong> يضيف اتجاه النموذج رؤية منفصلة إيجابية أو محايدة أو سلبية، لمساعدتك على تحديد أين تبدأ بحثك.</p>'
    );
  }
  output = polishLocalizedText(output, locale);

  // Repair counts before/after legacy uppercase token replacement.
  output = output.replaceAll('السهمS', 'سهماً');
  output = output.replace(/(\d[\d,]*)\s+STOCKS ANALYSED/gi, '$1 سهماً محللاً');
  output = output.replace(/(\d[\d,]*)\s+stocks analysed/gi, '$1 سهماً محللاً');
  output = output.replace(/(\d[\d,]*)\s+places?/gi, '$1 مراكز');
  output = output.replace(/OF\s+(\d[\d,]*)\s+(?:STOCKS|سهماً)/g, 'من $1 سهماً');
  output = output.replace(/(\d+)D VIEW/g, 'عرض $1D');

  // Keep brand, tickers and research abbreviations Latin while localizing UI labels.
  output = output.replace(/>Research</g, '>البحث<');
  output = output.replace(/>Positive</g, '>إيجابي<');
  output = output.replace(/>Neutral</g, '>محايد<');
  output = output.replace(/>Negative</g, '>سلبي<');
  output = output.replace(/>LANGUAGE</g, '>اللغة<');
  output = output.replace(/>APP</g, '>التطبيق<');
  output = output.replace(/>Today</g, '>اليوم<');
  output = output.replace(/>History</g, '>السجل<');
  output = output.replace(/>Search</g, '>بحث<');
  output = output.replace(/>Guide</g, '>الدليل<');
  output = output.replace(/>Institutional</g, '>للمؤسسات<');

  // Arabic Article structured data must describe the Arabic route, not the English route.
  output = output.replace('"inLanguage":"en"', '"inLanguage":"ar"');
  output = output.replace(/("(?:mainEntityOfPage|url)":")([^"\n]*?)\/investor-guide\/(\")/g, '$1$2/ar/investor-guide/$3');

  return output;
}
