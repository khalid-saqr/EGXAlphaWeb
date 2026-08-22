function replaceAll(value, pairs) {
  let out = String(value ?? '');
  for (const [from, to] of pairs) out = out.replaceAll(from, to);
  return out;
}

const EN = [
  ['published to support financial literacy, quantitative market education and reproducible research.', 'published for quantitative market research, financial literacy and reproducible study.'],
  ['published to support financial literacy, quantitative market education and reproducible research', 'published for quantitative market research, financial literacy and reproducible study'],
  ['for financial literacy and quantitative market education.', 'for quantitative market research and financial literacy.'],
  ['for financial literacy and quantitative market education', 'for quantitative market research and financial literacy'],
  ['EGX /Alpha turns each completed Egyptian Exchange session into an inspectable public research state:', 'After each completed Egyptian Exchange session, EGX /Alpha publishes an inspectable model state:'],
  ['<strong>Core idea:</strong> EGX /Alpha is a research digital twin of the market—an analytical learned representation of relative behaviour across the eligible equity universe, not a copy of the Exchange’s complete operating infrastructure.', '<strong>Scope:</strong> EGX /Alpha is a research digital twin of the Egyptian equity market—a learned analytical representation of relative behaviour across the eligible equity universe, not a copy of the Exchange’s operating infrastructure.'],
  ['The educational purpose is to let a reader study how the representation changed and compare earlier observations with later market outcomes.', 'The public record lets readers study how the representation changed and compare earlier observations with later market outcomes.'],
  ['Why is financial literacy part of the product?', 'How does the site support financial literacy?'],
  ['Because the site uses an inspectable public record to explain cross-sectional ranking, market breadth, forward horizons, ex-ante records and realised evidence.', 'By using an inspectable public record to explain cross-sectional ranking, market breadth, forward horizons, ex-ante records and realised evidence.'],
  ['Can I use EGX /Alpha to learn about quantitative investing concepts?', 'Can I use EGX /Alpha to learn quantitative market concepts?'],
  ['Yes—as an educational environment for concepts such as cross-sectional ranking, breadth, horizon differences, time-respecting validation and realised evidence, not as personalised advice.', 'Yes. The public record can be used to study cross-sectional ranking, breadth, horizon differences, time-respecting validation and realised evidence. It is not personalised advice.'],
  ['Research, education and reproducible public model states.', 'Reproducible model states for research and education.'],
  ['The website provides general research and educational content intended to advance financial literacy and quantitative understanding of the Egyptian Exchange and emerging markets using deep-learning techniques.', 'The website provides general research and educational content using deep-learning techniques to advance quantitative understanding of the Egyptian Exchange and emerging markets, financial literacy and reproducible market research.']
];

const AR = [
  ['يُنشر لدعم الثقافة المالية والتعليم الكمي للأسواق والبحث القابل لإعادة التحقق.', 'يُنشر للبحث الكمي في السوق، ودعم الثقافة المالية، والدراسة القابلة لإعادة التحقق.'],
  ['يُنشر لدعم الثقافة المالية والتعليم الكمي للأسواق والبحث القابل لإعادة التحقق', 'يُنشر للبحث الكمي في السوق، ودعم الثقافة المالية، والدراسة القابلة لإعادة التحقق'],
  ['يحول EGX /Alpha كل جلسة مكتملة في البورصة المصرية إلى حالة بحثية عامة يمكن فحصها:', 'بعد كل جلسة مكتملة في البورصة المصرية، ينشر EGX /Alpha حالة نموذج عامة قابلة للفحص:'],
  ['<strong>الفكرة الأساسية:</strong> EGX /Alpha توأم رقمي بحثي للسوق، أي تمثيل تحليلي متعلم للسلوك النسبي لمجموعة الأسهم المؤهلة، وليس نسخة من البنية التشغيلية الكاملة للبورصة.', '<strong>النطاق:</strong> EGX /Alpha توأم رقمي بحثي لسوق الأسهم المصري؛ تمثيل تحليلي متعلم للسلوك النسبي لمجموعة الأسهم المؤهلة، وليس نسخة من البنية التشغيلية للبورصة.'],
  ['والهدف التعليمي هو أن يستطيع القارئ دراسة كيفية تغير تمثيل النموذج ثم مقارنة المشاهدات السابقة بما حدث لاحقاً.', 'ويتيح السجل العام للقارئ دراسة كيفية تغير تمثيل النموذج ثم مقارنة المشاهدات السابقة بما حدث لاحقاً.'],
  ['لماذا تعد الثقافة المالية جزءاً من المنتج؟', 'كيف يدعم الموقع الثقافة المالية؟'],
  ['لأن الموقع يشرح مفاهيم الترتيب المقطعي واتساع السوق والآفاق المستقبلية والسجلات ex-ante والأدلة المتحققة باستخدام سجل عام يمكن فحصه.', 'من خلال سجل عام قابل للفحص يشرح الترتيب المقطعي واتساع السوق والآفاق المستقبلية والسجلات السابقة للنتيجة والأدلة المتحققة.'],
  ['هل يمكن استخدام EGX /Alpha لتعلم مفاهيم الاستثمار الكمي؟', 'هل يمكن استخدام EGX /Alpha لتعلم مفاهيم التحليل الكمي للأسواق؟'],
  ['نعم، كبيئة تعليمية لدراسة مفاهيم مثل الترتيب المقطعي واتساع الاتجاه واختلاف الآفاق والتحقق الزمني والأدلة المتحققة، وليس كخدمة توصيات شخصية.', 'نعم. يتيح السجل العام دراسة الترتيب المقطعي واتساع الاتجاه واختلاف الآفاق والتحقق الذي يحترم الزمن والأدلة المتحققة، ولا يمثل خدمة توصيات شخصية.'],
  ['بحث وتعليم وحالات نموذج عامة قابلة لإعادة التحقق.', 'حالات نموذج قابلة لإعادة التحقق للبحث والتعليم.'],
  ['يقدم الموقع محتوى بحثياً وتعليمياً عاماً يهدف إلى تعزيز الثقافة المالية والفهم الكمي للبورصة المصرية والأسواق الناشئة باستخدام تقنيات التعلم العميق.', 'يقدم الموقع محتوى بحثياً وتعليمياً عاماً يستخدم تقنيات التعلم العميق لتعزيز الفهم الكمي للبورصة المصرية والأسواق الناشئة، والثقافة المالية، والبحث السوقي القابل لإعادة التحقق.']
];

function restoreCaseStudiesToMethodologyHero(value, locale) {
  let out = String(value ?? '');
  if (!out.includes('methodology-story') || !out.includes('methodology-case-studies')) return out;

  const match = out.match(/<aside class="methodology-closing methodology-case-studies"[\s\S]*?<\/aside>/);
  if (!match) return out;

  let box = match[0];
  out = out.replace(box, '');
  const ar = String(locale).toLowerCase().startsWith('ar');

  if (ar) {
    box = replaceAll(box, [
      ['<aside class="methodology-closing methodology-case-studies">', '<aside class="methodology-closing methodology-case-studies" aria-labelledby="methodology-case-studies-title-ar">'],
      ['<span class="case-study-kicker">محاكاة بحثية افتراضية</span><h2>دراسات حالة EGX /Alpha</h2>', '<span class="case-study-kicker">توقعات EX-ANTE · محاكاة بحثية افتراضية</span><h2 id="methodology-case-studies-title-ar">دراسات حالة EGX /Alpha</h2><p class="case-study-intro">تبدأ كل دراسة من مخرجات نموذج حُفظت قبل معرفة النتيجة السوقية اللاحقة، ثم تطبق افتراضات محاكاة معلنة على بيانات EGX المرصودة. وهي دراسات بحثية افتراضية وليست أداءً فعلياً لعملاء أو توصيات بالتداول.</p>'],
      ['مقارنة ex-ante محكومة بين قاعدتين محددتين مسبقاً للاختيار من الترتيب', 'EGX /Alpha Rank 1 vs. Rank 1+: A Comparative 1D/3D Exit-Discipline Trading Simulation'],
      ['محاكاة بأسهم كاملة في الجلسة التالية', 'EGX /Alpha Rank 1 vs. Rank 1+: Comparative Next-Session Whole-Share Trading Simulations'],
      ['محاكاة لمحفظة تراعي سعة التداول', 'Positive-Filtered vs. Raw-Rank Five-Sleeve Portfolios'],
      ['مقارنة في ظل افتراضات متطابقة للتنفيذ والخروج.', 'مقارنة ex-ante محكومة تستخدم افتراضات تنفيذ وخروج 1D/3D متطابقة؛ والاختلاف الوحيد هو قاعدة الاختيار من الترتيب.'],
      ['دراسة لمسارين تاريخيين أنتجتهما قاعدتان محددتان مسبقاً في ظل آليات متماثلة فيما عدا ذلك.', 'محاكاة للجلسة التالية بأسهم كاملة تقارن بين قاعدتين محفوظتين للاختيار من الترتيب في ظل آليات تنفيذ متطابقة.'],
      ['مقارنة ترشيح اتجاه النموذج بالترتيب الخام مع تضمين أثر معدل الدوران ومسار المحفظة.', 'محاكاة لمحفظة من خمس شرائح تراعي سعة التداول وتقارن الترشيح باتجاه النموذج بالترتيب الخام، مع تضمين أثر معدل الدوران ومسار المحفظة.']
    ]);
  } else {
    box = replaceAll(box, [
      ['<aside class="methodology-closing methodology-case-studies">', '<aside class="methodology-closing methodology-case-studies" aria-labelledby="methodology-case-studies-title">'],
      ['<span class="case-study-kicker">HYPOTHETICAL RESEARCH SIMULATIONS</span><h2>EGX /Alpha Case Studies</h2>', '<span class="case-study-kicker">EX-ANTE FORECASTS · HYPOTHETICAL RESEARCH SIMULATIONS</span><h2 id="methodology-case-studies-title">EGX /Alpha Case Studies</h2><p class="case-study-intro">Each study begins from model outputs preserved before the subsequent market outcome was known, then applies stated simulation assumptions to observed EGX data. These are research simulations, not client performance or trading recommendations.</p>'],
      ['Controlled ex-ante comparison of two predefined ranking-selection rules under identical execution and exit assumptions', 'EGX /Alpha Rank 1 vs. Rank 1+: A Comparative 1D/3D Exit-Discipline Trading Simulation'],
      ['Next-session whole-share simulation of two predefined ranking-selection rules', 'EGX /Alpha Rank 1 vs. Rank 1+: Comparative Next-Session Whole-Share Trading Simulations'],
      ['Capacity-aware portfolio simulation comparing direction filtering with raw ranking', 'Positive-Filtered vs. Raw-Rank Five-Sleeve Portfolios'],
      ['Controlled comparison of two predefined ranking-selection rules.', 'A controlled ex-ante comparison using identical execution and 1D/3D exit assumptions; only the ranking-selection rule differs.'],
      ['Study of different historical paths under otherwise identical mechanics.', 'A next-session whole-share simulation comparing two preserved ex-ante ranking-selection rules under otherwise identical mechanics.'],
      ['Includes turnover and portfolio-path effects.', 'A capacity-aware five-sleeve portfolio simulation comparing direction-filtered selection with raw ranking, including turnover and portfolio-path effects.']
    ]);
  }

  box = box
    .replaceAll('</strong></summary>', '</strong><span class="case-study-toggle" aria-hidden="true"></span></summary>')
    .replaceAll('· PDF</a>', '· PDF <span aria-hidden="true">↓</span></a>');

  return out.replace(/(<div class="methodology-question">[\s\S]*?<\/div>)(<\/header>)/, `$1${box}$2`);
}

function refineHomepagePrimaryAction(value) {
  const out = String(value ?? '');
  if (!(out.includes('page-home') || out.includes('data-page="signal"'))) return out;
  return out.replace('<a class="primary-action" href="#ranking">', '<a class="primary-action hero-primary-action" href="#ranking">');
}

export function applyDigitalTwinTightening(value, locale = 'en') {
  let out = replaceAll(value, String(locale).toLowerCase().startsWith('ar') ? AR : EN);
  out = restoreCaseStudiesToMethodologyHero(out, locale);
  out = refineHomepagePrimaryAction(out);
  return out;
}
