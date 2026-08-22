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

export function applyDigitalTwinTightening(value, locale = 'en') {
  return replaceAll(value, String(locale).toLowerCase().startsWith('ar') ? AR : EN);
}
