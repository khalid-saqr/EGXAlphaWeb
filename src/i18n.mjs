export const SUPPORTED_LOCALES = ['en', 'ar'];

export function normalizeLocale(value) {
  return String(value || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

export function isArabic(locale) { return normalizeLocale(locale) === 'ar'; }
export function directionFor(locale) { return isArabic(locale) ? 'rtl' : 'ltr'; }

export function stripLocalePath(value = '/') {
  let path = String(value || '/');
  if (!path.startsWith('/')) path = `/${path}`;
  if (path === '/ar') return '/';
  if (path.startsWith('/ar/')) path = path.slice(3) || '/';
  return path || '/';
}

export function localePath(value = '/', locale = 'en') {
  const path = stripLocalePath(value);
  if (!isArabic(locale)) return path;
  return path === '/' ? '/ar/' : `/ar${path}`;
}

export function counterpartPath(value = '/', locale = 'en') {
  const base = stripLocalePath(value);
  return isArabic(locale) ? base : localePath(base, 'ar');
}

export function languageSwitchLabel(locale) { return isArabic(locale) ? 'EN' : 'العربية'; }

const AR_REPLACEMENTS = [
  // Product shell and navigation.
  ['PUBLIC RESEARCH TERMINAL', 'منصة البحث العامة'],
  ['TODAY', 'اليوم'],
  ['HISTORY', 'السجل'],
  ['RESEARCH', 'البحث'],
  ['GUIDE', 'الدليل'],
  ['INSTITUTIONAL', 'للمؤسسات'],
  ['SEARCH', 'بحث'],
  ['MENU', 'القائمة'],
  ['Primary navigation', 'التنقل الرئيسي'],
  ['Site header', 'رأس الموقع'],
  ['Site footer', 'تذييل الموقع'],
  ['Footer navigation', 'روابط التذييل'],
  ['Search EGX /Alpha', 'البحث في EGX /Alpha'],
  ['Toggle light and dark theme', 'التبديل بين النمطين الفاتح والداكن'],
  ['Open navigation', 'فتح قائمة التنقل'],
  ['Public quantitative research for the Egyptian Exchange.', 'بحث كمي عام للبورصة المصرية.'],
  ['APPEARANCE', 'المظهر'],
  ['DARK / LIGHT', 'داكن / فاتح'],
  ['RESEARCH ECOSYSTEM', 'منظومة البحث'],
  ['EGX Research is a project of ', 'EGX Research مشروع تابع لـ '],
  ['Research and information only. Not investment advice. Public engine outputs are provided as-is. Nothing on this site is a recommendation, solicitation, target price or execution instruction. EGX Research Community LLP, KNOWDYN, 60Arabia and their affiliates accept no responsibility for trading decisions, losses, damages or other outcomes arising from use of, reliance on or interpretation of the public engine data, to the fullest extent permitted by applicable law.', 'لأغراض البحث والمعلومات فقط، وليس نصيحة استثمارية. تُعرض مخرجات المحرك العام كما هي. لا يمثل أي محتوى في هذا الموقع توصية أو دعوة للتعامل أو سعراً مستهدفاً أو تعليمات تنفيذ. لا تتحمل EGX Research Community LLP أو KNOWDYN أو 60Arabia أو الجهات التابعة لها مسؤولية قرارات التداول أو الخسائر أو الأضرار أو أي نتائج أخرى تنشأ عن استخدام بيانات المحرك العام أو الاعتماد عليها أو تفسيرها، وذلك إلى أقصى حد يسمح به القانون المعمول به.'],

  // Homepage research terminal.
  ['EGX /ALPHA PUBLIC RESEARCH TERMINAL', 'منصة EGX /ALPHA للبحث العام'],
  ['PRESERVED /ALPHA RESEARCH VIEW', 'رؤية /ALPHA البحثية المحفوظة'],
  ['Deep-learning ranking of Egyptian equities.', 'ترتيب أسهم البورصة المصرية باستخدام التعلم العميق.'],
  ['The model view preserved from this session.', 'رؤية النموذج المحفوظة من هذه الجلسة.'],
  ['After each completed EGX session, /Alpha ranks the eligible stock universe across multiple forward horizons. Relative Rank and Model Direction are separate model outputs and should be read together.', 'بعد كل جلسة مكتملة في البورصة المصرية، يرتب /Alpha الأسهم المؤهلة عبر عدة آفاق مستقبلية. الترتيب النسبي واتجاه النموذج مخرجان منفصلان ويجب قراءتهما معاً.'],
  ['This dated public record preserves the cross-sectional ranking that was available after the completed EGX session.', 'يحفظ هذا السجل العام المؤرخ الترتيب النسبي الذي كان متاحاً بعد اكتمال جلسة البورصة المصرية.'],
  ['POST-CLOSE · CAIRO', 'بعد الإغلاق · القاهرة'],
  ['LIVE PUBLIC RECORD', 'سجل عام حي'],
  ['HISTORICAL MODEL RECORD', 'سجل تاريخي للنموذج'],
  ['Relative Rank', 'الترتيب النسبي'],
  ['Model Direction', 'اتجاه النموذج'],
  ['compares eligible EGX stocks with each other.', 'يقارن أسهم EGX المؤهلة ببعضها.'],
  ['is a separate forward classification.', 'تصنيف مستقبلي منفصل عن الترتيب.'],
  ['EXPLORE ALL', 'استعرض كل'],
  ['EXPLORE THIS', 'استعرض هذه'],
  ['WHAT /ALPHA RANKS HIGHEST', 'أعلى الأسهم في ترتيب /ALPHA'],
  ['TOP 5 · SELECTED HORIZON', 'أعلى 5 · الأفق المحدد'],
  ['FORECAST HORIZON', 'أفق التوقع'],
  ['D = trading days', 'D = أيام تداول'],
  ['PRIMARY RESEARCH VIEW', 'الرؤية البحثية الرئيسية'],
  ['NEXT TRADING DAY', 'جلسة التداول التالية'],
  ['THREE TRADING DAYS', '3 أيام تداول'],
  ['TEN TRADING DAYS', '10 أيام تداول'],
  ['TRADING-DAY OUTLOOK', 'أفق بأيام التداول'],
  ['MODEL VIEW', 'رؤية النموذج'],
  ['RELATIVE RANK', 'الترتيب النسبي'],
  ['MODEL DIRECTION', 'اتجاه النموذج'],
  ['RANK MOVE', 'تغير الترتيب'],
  ['NO PRIOR RANK', 'لا يوجد ترتيب سابق'],
  ['UNCHANGED', 'دون تغيير'],
  ['The selected horizon controls the Control Deck, Market Pulse, full ranking and evidence below.', 'الأفق المحدد يتحكم في لوحة /Alpha ونبض السوق والترتيب الكامل والأدلة أدناه.'],
  ['MARKET PULSE', 'نبض السوق'],
  ['Context for the selected model horizon.', 'سياق الأفق المحدد للنموذج.'],
  ['MODEL DIRECTION', 'اتجاه النموذج'],
  ['BREADTH', 'اتساع الاتجاه'],
  ['POSITIVE', 'إيجابي'],
  ['NEUTRAL', 'محايد'],
  ['NEGATIVE', 'سلبي'],
  ['Direction counts across the complete published', 'أعداد تصنيفات الاتجاه عبر كامل الأسهم المنشورة لأفق'],
  ['universe.', '.'],
  ['RANK MOVERS', 'تحركات الترتيب'],
  ['BIGGEST CHANGES ·', 'أكبر التغيرات ·'],
  ['UP', 'صعود'],
  ['DOWN', 'هبوط'],
  ['No comparable rank movement.', 'لا تتوفر حركة ترتيب قابلة للمقارنة.'],
  ['Change versus the previous completed public ranking at the same horizon.', 'التغير مقارنة بالترتيب العام المكتمل السابق للأفق نفسه.'],
  ['/ALPHA MARKET RANKING', 'ترتيب سوق /ALPHA'],
  ['PRESERVED MODEL RANKING', 'ترتيب النموذج المحفوظ'],
  ['The complete eligible EGX universe.', 'كامل أسهم EGX المؤهلة.'],
  ['Relative Rank compares stocks with each other. Model Direction is separate, so a highly ranked stock can still carry a Neutral or Negative directional classification.', 'الترتيب النسبي يقارن الأسهم ببعضها. أما اتجاه النموذج فهو منفصل، لذلك قد يحمل سهم مرتفع الترتيب تصنيفاً محايداً أو سلبياً.'],
  ['SEARCH STOCK', 'ابحث عن سهم'],
  ['Ticker', 'رمز السهم'],
  ['Filter by model direction', 'تصفية حسب اتجاه النموذج'],
  ['ALL', 'الكل'],
  ['STOCK', 'السهم'],
  ['No matching stocks.', 'لا توجد أسهم مطابقة.'],
  ['PUBLICATION NOTE', 'ملاحظة النشر'],
  ['LEGACY RECORD', 'سجل قديم'],
  ['This record uses the earlier single-row public format. Full-universe controls apply to V2 records.', 'يستخدم هذا السجل صيغة النشر العام السابقة ذات الصف الواحد. أدوات التحكم في كامل السوق متاحة لسجلات V2.'],
  ['RESEARCH EVIDENCE', 'الأدلة البحثية'],
  ['Evidence behind the ranking system.', 'الأدلة الداعمة لنظام الترتيب.'],
  ['Historical validation and live realised-outcome tracking are separated. Live ranking metrics remain maturity-gated.', 'يتم الفصل بين التحقق التاريخي وتتبع النتائج الفعلية الحية. وتظل مقاييس الترتيب الحية خاضعة لشرط نضج الأدلة.'],
  ['Historical held-out evidence is preserved for this model record. Live evidence was not reconstructed.', 'تم حفظ أدلة الاختبار التاريخي خارج عينة التدريب لهذا السجل. ولم تتم إعادة بناء أدلة حية بأثر رجعي.'],
  ['HISTORICAL SAMPLES', 'العينات التاريخية'],
  ['TRAINING STOCKS', 'أسهم التدريب'],
  ['HELD-OUT TEST DATES', 'تواريخ الاختبار خارج العينة'],
  ['LIVE OUTCOMES', 'النتائج الحية'],
  ['SELECTED HORIZON EVIDENCE', 'أدلة الأفق المحدد'],
  ['HISTORICAL RANKIC', 'RankIC التاريخي'],
  ['TOP–BOTTOM SPREAD', 'فارق الأعلى–الأدنى'],
  ['held-out test', 'اختبار خارج عينة التدريب'],
  ['MATURED OUTCOMES', 'النتائج الناضجة'],
  ['live realised evidence', 'أدلة نتائج فعلية حية'],
  ['EVIDENCE DAYS', 'أيام الأدلة'],
  ['evidence accumulating', 'الأدلة قيد التراكم'],
  ['live metrics mature', 'المقاييس الحية ناضجة'],
  ['LIVE RANKIC', 'RankIC الحي'],
  ['LIVE SPREAD', 'الفارق الحي'],
  ['maturity-gated', 'مشروط بنضج الأدلة'],
  ['LIVE EVIDENCE', 'الأدلة الحية'],
  ['NOT RECONSTRUCTED', 'لم تُعد بناؤها'],
  ['historical provenance preserved', 'تم الحفاظ على المصدر التاريخي'],
  ['AS-OF STATE', 'الحالة في وقت السجل'],
  ['UNAVAILABLE', 'غير متاح'],
  ['not retroactively inferred', 'لم تُستنتج بأثر رجعي'],
  ['GOVERNANCE', 'الحوكمة'],
  ['Forecasts are scored only after their horizon matures.', 'لا يتم تقييم التوقعات إلا بعد نضج أفقها الزمني.'],
  ['Model promotion is not automatic; human review is required.', 'ترقية النموذج ليست تلقائية؛ المراجعة البشرية مطلوبة.'],
  ['EVIDENCE ACCUMULATING', 'الأدلة قيد التراكم'],
  ['HOW TO READ /ALPHA', 'كيفية قراءة /ALPHA'],
  ['Four concepts, one model view.', 'أربعة مفاهيم لرؤية واحدة للنموذج.'],
  ['#3 / 91 means the stock is third in the selected horizon\'s eligible comparison set.', '#3 / 91 يعني أن السهم يحتل المركز الثالث ضمن مجموعة المقارنة المؤهلة في الأفق المحدد.'],
  ['Positive, Neutral or Negative is a separate forward classification, not the rank itself.', 'إيجابي أو محايد أو سلبي هو تصنيف مستقبلي منفصل، وليس الترتيب نفسه.'],
  ['Shows how many ranking places changed versus the previous completed run at the same horizon.', 'يوضح عدد المراكز التي تغيرها الترتيب مقارنة بالتشغيل المكتمل السابق للأفق نفسه.'],
  ['1D, 3D, 5D and 10D are separate published model views. 5D is the primary research view.', '1D و3D و5D و10D رؤى منشورة منفصلة للنموذج، و5D هو الأفق البحثي الرئيسي.'],
  ['Forecast Horizon', 'أفق التوقع'],
  ['READ THE INVESTOR GUIDE →', 'اقرأ دليل المستثمر ←'],
  ['PUBLIC MODEL MEMORY', 'السجل العام للنموذج'],
  ['Recent completed analysis sessions.', 'أحدث جلسات التحليل المكتملة.'],
  ['VIEW FULL HISTORY →', 'عرض السجل الكامل ←'],
  ['Live model record', 'سجل حي للنموذج'],
  ['Historical model record', 'سجل تاريخي للنموذج'],
  ['Legacy single-row record', 'سجل قديم بصف واحد'],

  // Verification, archive, search, dossier.
  ['VERIFY PUBLIC RECORD', 'تحقق من السجل العام'],
  ['ANALYSIS DATE', 'تاريخ التحليل'],
  ['RECORD ORIGIN', 'مصدر السجل'],
  ['UNIVERSE', 'مجموعة الأسهم'],
  ['PUBLISHED HORIZONS', 'الآفاق المنشورة'],
  ['CONTENT HASH', 'بصمة المحتوى'],
  ['WIRE HASH', 'بصمة سجل النشر'],
  ['This disclosure verifies the public artifact only. It does not expose proprietary model internals.', 'يؤكد هذا القسم سلامة السجل العام فقط، ولا يكشف أي مكونات خاصة داخل النموذج.'],
  ['VIEW PUBLIC JSON →', 'عرض JSON العام ←'],
  ['PUBLIC SESSIONS', 'الجلسات العامة'],
  ['LIVE RECORDS', 'السجلات الحية'],
  ['HISTORICAL RECORDS', 'السجلات التاريخية'],
  ['NATIVE HORIZONS', 'الآفاق الأصلية'],
  ['Every completed public ranking, preserved.', 'كل ترتيب عام مكتمل محفوظ.'],
  ['Open any dated EGX /Alpha record exactly as published across its available model horizons. Provenance distinguishes live publications from historical model records without rewriting the underlying output.', 'افتح أي سجل مؤرخ لـ EGX /Alpha كما نُشر عبر آفاق النموذج المتاحة. يميز مصدر السجل بين النشر الحي والسجلات التاريخية دون إعادة كتابة المخرجات الأصلية.'],
  ['SEARCH MODEL MEMORY →', 'ابحث في سجل النموذج ←'],
  ['PUBLIC UNIVERSE', 'مجموعة الأسهم العامة'],
  ['MODEL HORIZONS', 'آفاق النموذج'],
  ['OPEN SESSION →', 'فتح الجلسة ←'],
  ['No public records yet.', 'لا توجد سجلات عامة حتى الآن.'],
  ['SEARCH PUBLIC MODEL MEMORY', 'البحث في السجل العام للنموذج'],
  ['Find a stock, session or model horizon.', 'ابحث عن سهم أو جلسة أو أفق للنموذج.'],
  ['Search the public archive by ticker, analysis date, 1D / 3D / 5D / 10D horizon, or Positive / Neutral / Negative Model Direction.', 'ابحث في الأرشيف العام برمز السهم أو تاريخ التحليل أو أفق 1D / 3D / 5D / 10D أو اتجاه النموذج: إيجابي / محايد / سلبي.'],
  ['TRY', 'جرّب'],
  ['SEARCH /ALPHA MEMORY', 'البحث في سجل /ALPHA'],
  ['Ticker, YYYY-MM-DD, 5D, Positive…', 'رمز السهم، YYYY-MM-DD، 5D، إيجابي…'],
  ['Search model records', 'البحث في سجلات النموذج'],
  ['TICKER · DATE · HORIZON · MODEL DIRECTION', 'رمز السهم · التاريخ · الأفق · اتجاه النموذج'],
  ['READY', 'جاهز'],
  ['STOCK RESEARCH', 'بحث السهم'],
  ['EGX /ALPHA STOCK RESEARCH', 'بحث سهم EGX /ALPHA'],
  ['See how /Alpha currently ranks this stock across its published horizons, then inspect the selected horizon\'s public history. Relative Rank and Model Direction remain separate throughout.', 'اطلع على ترتيب /Alpha الحالي لهذا السهم عبر الآفاق المنشورة، ثم راجع سجله العام للأفق المحدد. يظل الترتيب النسبي واتجاه النموذج منفصلين طوال العرض.'],
  ['PRIMARY VIEW', 'الرؤية الرئيسية'],
  ['TODAY ACROSS HORIZONS', 'الرؤية الحالية عبر الآفاق'],
  ['One stock. Four forward model views.', 'سهم واحد وأربع رؤى مستقبلية للنموذج.'],
  ['Select a horizon to inspect its public history below.', 'اختر أفقاً لمراجعة سجله العام أدناه.'],
  ['SELECTED HORIZON DETAIL', 'تفاصيل الأفق المحدد'],
  ['model history.', 'سجل النموذج.'],
  ['PUBLIC OBSERVATION', 'ملاحظة عامة'],
  ['PUBLIC OBSERVATIONS', 'ملاحظات عامة'],
  ['RANK PERCENTILE', 'المئين للترتيب'],
  ['secondary normalization', 'تطبيع ثانوي'],
  ['RELATIVE RANK HISTORY', 'سجل الترتيب النسبي'],
  ['LAST 30 PUBLIC SESSIONS', 'آخر 30 جلسة عامة'],
  ['Loading relative rank history…', 'جارٍ تحميل سجل الترتيب النسبي…'],
  ['The chart uses rank percentile to normalize changing eligible-universe size. It is not model confidence, a price chart or an expected-return series.', 'يستخدم الرسم المئين للترتيب لتطبيع تغير حجم مجموعة الأسهم المؤهلة. وهو ليس مقياس ثقة للنموذج ولا رسماً للسعر ولا سلسلة للعائد المتوقع.'],
  ['PUBLIC MODEL HISTORY', 'السجل العام للنموذج'],
  ['session record.', 'سجل الجلسة.'],
  ['DATE', 'التاريخ'],
  ['PCTL', 'المئين'],
  ['No public history.', 'لا يوجد سجل عام.'],

  // Institutional page.
  ['Quantitative Egyptian-equity intelligence, built for disciplined research.', 'ذكاء كمي لأسهم البورصة المصرية مصمم للبحث المنضبط.'],
  ['EGXResearch operates EGX /Alpha as a production ranking system with a bounded public disclosure layer and a reproducible daily research record.', 'تشغّل EGXResearch نظام EGX /Alpha كنظام ترتيب إنتاجي ذي طبقة إفصاح عام محددة وسجل بحثي يومي قابل لإعادة التحقق.'],
  ['CAPABILITIES', 'القدرات'],
  ['Research distribution without exposing the model core.', 'توزيع البحث دون كشف جوهر النموذج.'],
  ['Structured model outputs', 'مخرجات نموذج منظمة'],
  ['Daily public rankings and longitudinal model history across four trading-day outlooks.', 'ترتيبات عامة يومية وسجل زمني للنموذج عبر أربعة آفاق بأيام التداول.'],
  ['Bounded technology integration', 'تكامل تقني محدد الحدود'],
  ['A publication architecture that separates public research output from proprietary model internals.', 'بنية نشر تفصل مخرجات البحث العام عن المكونات الخاصة داخل النموذج.'],
  ['Strategic research applications', 'تطبيقات بحثية استراتيجية'],
  ['Institutional conversations around Egyptian-equity intelligence and systematic research workflows.', 'نقاشات مؤسسية حول ذكاء الأسهم المصرية ومسارات البحث المنهجي.'],
  ['ENQUIRIES', 'الاستفسارات'],
  ['Institutional contact.', 'التواصل المؤسسي.'],
  ['For research partnerships, technology integration, signal distribution or strategic enquiries:', 'للشراكات البحثية أو التكامل التقني أو توزيع الإشارة أو الاستفسارات الاستراتيجية:'],
  ['Research and information only. No execution service is offered by this public website.', 'لأغراض البحث والمعلومات فقط. لا يقدم هذا الموقع العام أي خدمة تنفيذ تداول.'],

  // Methodology white paper.
  ['PUBLIC QUANTITATIVE WHITE PAPER', 'ورقة بحثية كمية عامة'],
  ['EGX /Alpha: time-locked deep-learning ranking for Egyptian equities.', 'EGX /Alpha: ترتيب بأسلوب التعلم العميق ومقيد زمنياً لأسهم البورصة المصرية.'],
  ['EGX /Alpha is designed as a repeated market-simulation experiment: at each completed EGX session, the system freezes the information state that was actually knowable, applies a reviewed deep-learning inference package, and ranks the eligible domestic universe across four native forward horizons. The public product exposes the ranking, direction and evidence needed to interpret the model while keeping proprietary model mechanics private.', 'صُمم EGX /Alpha كتجربة محاكاة سوق متكررة: عند اكتمال كل جلسة في البورصة المصرية يثبت النظام حالة المعلومات التي كانت متاحة فعلياً في ذلك الوقت، ويطبق حزمة استدلال بالتعلم العميق خضعت للمراجعة، ثم يرتب مجموعة الأسهم المحلية المؤهلة عبر أربعة آفاق مستقبلية أصلية. يعرض المنتج العام الترتيب والاتجاه والأدلة اللازمة لفهم النموذج مع إبقاء آلياته الخاصة غير منشورة.'],
  ['MARKET', 'السوق'],
  ['EGYPTIAN EXCHANGE', 'البورصة المصرية'],
  ['RESEARCH DEFAULT', 'الافتراضي البحثي'],
  ['5D FULL RANKING', 'ترتيب 5D الكامل'],
  ['DEFAULT VIEW', 'الرؤية الافتراضية'],
  ['5D PRIMARY RESEARCH', '5D البحثي الرئيسي'],
  ['The simulation starts with chronology, not statistics.', 'تبدأ المحاكاة بالتسلسل الزمني لا بالإحصاءات.'],
  ['A stock-market simulation is credible only when every decision is made from the information state that existed at that moment. /Alpha therefore treats each EGX close as a sealed research state. Data availability, freshness and eligibility are resolved before inference; future observations are not allowed to leak backward into the decision frame.', 'لا تكون محاكاة سوق الأسهم موثوقة إلا إذا اتُّخذ كل قرار انطلاقاً من حالة المعلومات التي كانت موجودة في تلك اللحظة. لذلك يتعامل /Alpha مع كل إغلاق للبورصة المصرية باعتباره حالة بحثية مغلقة. تُحسم إتاحة البيانات وحداثتها وأهلية الأسهم قبل الاستدلال، ولا يُسمح للمشاهدات المستقبلية بالتسرب إلى إطار القرار السابق زمنياً.'],
  ['The daily run is not an exercise in reconstructing what would have looked attractive with hindsight. It is a forward experiment repeated under the same operational discipline: observe the completed session, lock the state, infer, rank, publish, and only later score outcomes after the relevant horizon has matured.', 'التشغيل اليومي ليس محاولة لإعادة بناء ما كان سيبدو جذاباً بعد معرفة النتائج. بل هو تجربة مستقبلية تتكرر بالانضباط التشغيلي نفسه: رصد الجلسة المكتملة، تثبيت الحالة، إجراء الاستدلال، الترتيب، النشر، ثم تقييم النتائج لاحقاً فقط بعد نضج الأفق المعني.'],
  ['Completed market state', 'حالة السوق المكتملة'],
  ['Use post-close observations available for that session.', 'استخدام المشاهدات المتاحة بعد إغلاق تلك الجلسة.'],
  ['Availability lock', 'تثبيت الإتاحة'],
  ['Reject stale, invalid or ineligible observations.', 'رفض المشاهدات القديمة أو غير الصالحة أو غير المؤهلة.'],
  ['Deep inference', 'استدلال عميق'],
  ['Apply the fixed reviewed production model package.', 'تطبيق حزمة النموذج الإنتاجي الثابتة والخاضعة للمراجعة.'],
  ['Cross-sectional rank', 'ترتيب مقطعي'],
  ['Order the eligible domestic universe from 1 through N.', 'ترتيب مجموعة الأسهم المحلية المؤهلة من 1 إلى N.'],
  ['Public projection', 'الإسقاط العام'],
  ['Publish only sanitized rank, direction and evidence.', 'نشر الترتيب والاتجاه والأدلة المسموح بها فقط.'],
  ['Outcome maturity', 'نضج النتائج'],
  ['Score realised evidence only after the horizon exists.', 'تقييم الأدلة الفعلية فقط بعد اكتمال الأفق.'],
  ['This time ordering is the core anti-lookahead discipline. A model can be statistically sophisticated and still be useless if its simulation permits information that would not have existed at the decision time.', 'هذا الترتيب الزمني هو جوهر منع النظر إلى المستقبل. قد يكون النموذج متقدماً إحصائياً ومع ذلك يصبح عديم القيمة إذا سمحت محاكاته بمعلومات لم تكن موجودة وقت اتخاذ القرار.'],
  ['Four horizons are native model questions, not interpolated labels.', 'الآفاق الأربعة أسئلة أصلية للنموذج وليست تسميات مستنتجة.'],
  ['The engine evaluates the eligible universe over four distinct forward trading-day windows. Each horizon produces its own complete cross-sectional ordering of the same eligible symbols for that run. The public interface labels these windows 1D, 3D, 5D and 10D, where D means trading days rather than calendar days.', 'يقيّم المحرك مجموعة الأسهم المؤهلة عبر أربعة نوافذ مستقبلية منفصلة بأيام التداول. ينتج كل أفق ترتيباً مقطعياً كاملاً خاصاً به للرموز المؤهلة نفسها في ذلك التشغيل. تعرض الواجهة العامة هذه النوافذ باسم 1D و3D و5D و10D، حيث تعني D أيام التداول لا الأيام التقويمية.'],
  ['The public interface uses one horizon controller across the research terminal. All four native horizons remain one tap away, while 5D is the canonical primary research view and the default state for the full public ranking.', 'تستخدم الواجهة العامة متحكماً واحداً للأفق عبر منصة البحث. تظل الآفاق الأربعة الأصلية متاحة مباشرة، بينما يمثل 5D الرؤية البحثية الرئيسية المعتمدة والحالة الافتراضية للترتيب العام الكامل.'],
  ['Next-session view', 'رؤية الجلسة التالية'],
  ['The shortest forward window for the next trading session.', 'أقصر نافذة مستقبلية للجلسة التالية.'],
  ['Short persistence view', 'رؤية الاستمرارية القصيرة'],
  ['Shows whether the relative model view extends beyond one session.', 'توضح ما إذا كانت الرؤية النسبية للنموذج تمتد لأكثر من جلسة.'],
  ['Primary research view', 'الرؤية البحثية الرئيسية'],
  ['The default public ranking horizon used for deeper comparison.', 'أفق الترتيب العام الافتراضي للمقارنة الأعمق.'],
  ['Extended view', 'الرؤية الممتدة'],
  ['A longer forward window for cross-horizon context.', 'نافذة مستقبلية أطول لسياق المقارنة بين الآفاق.'],
  ['Rank and direction are deliberately separate signals.', 'الترتيب والاتجاه إشارتان منفصلتان عمداً.'],
  ['The engine answers two different questions. Rank asks where a stock sits relative to the rest of the eligible market at the selected horizon. Direction assigns a separate Positive, Neutral or Negative model view. They should be read together rather than collapsed into a single marketing score.', 'يجيب المحرك عن سؤالين مختلفين. يحدد الترتيب موقع السهم مقارنة ببقية السوق المؤهل عند الأفق المحدد، بينما يمنح الاتجاه رؤية منفصلة للنموذج: إيجابية أو محايدة أو سلبية. ويجب قراءتهما معاً بدلاً من دمجهما في درجة تسويقية واحدة.'],
  ['A high rank with Positive direction is internally aligned. A high rank with Neutral or Negative direction is not a contradiction: the stock can be relatively stronger than peers while the absolute directional view remains weak. That distinction is especially important in broad risk-off or risk-on conditions.', 'يتوافق الترتيب المرتفع مع الاتجاه الإيجابي داخلياً. أما الترتيب المرتفع مع اتجاه محايد أو سلبي فليس تناقضاً؛ فقد يكون السهم أقوى نسبياً من نظرائه بينما تظل الرؤية الاتجاهية المطلقة ضعيفة. ويزداد أهمية هذا الفرق في حالات النفور الواسع من المخاطر أو الإقبال عليها.'],
  ['Percentile = 100 × (N − rank + 1) / N', 'المئين = 100 × (N − الترتيب + 1) / N'],
  ['Rank percentile is a public normalization of the cross-sectional position. It allows an investor to compare a rank across sessions when the eligible universe changes slightly. It is not a probability, confidence score, expected return or hidden model magnitude. Rank Move only shows movement versus the previous completed run at the same horizon.', 'المئين للترتيب هو تطبيع عام للموقع المقطعي، ويسمح بمقارنة الترتيب بين الجلسات عندما يتغير حجم مجموعة الأسهم المؤهلة قليلاً. وهو ليس احتمالاً أو درجة ثقة أو عائداً متوقعاً أو قيمة خفية للنموذج. أما تغير الترتيب فيوضح فقط الحركة مقارنة بالتشغيل المكتمل السابق للأفق نفسه.'],
  ['HIGH RANK + POSITIVE', 'ترتيب مرتفع + إيجابي'],
  ['Aligned relative and directional view', 'توافق بين الرؤية النسبية والاتجاهية'],
  ['Use as a stronger research-priority signal, not as a guaranteed gain.', 'يُستخدم كإشارة أولوية بحثية أقوى، وليس كضمان للربح.'],
  ['HIGH RANK + NEUTRAL', 'ترتيب مرتفع + محايد'],
  ['Strong relative position, mixed direction', 'موقع نسبي قوي واتجاه مختلط'],
  ['The stock ranks well against peers while the directional view remains inconclusive.', 'يحتل السهم ترتيباً جيداً مقابل نظرائه بينما تبقى الرؤية الاتجاهية غير حاسمة.'],
  ['HIGH RANK + NEGATIVE', 'ترتيب مرتفع + سلبي'],
  ['Relative strength inside a weak view', 'قوة نسبية داخل رؤية ضعيفة'],
  ['A top relative rank does not automatically become a bullish call.', 'الترتيب النسبي المتقدم لا يتحول تلقائياً إلى رؤية صعودية.'],
  ['The deep-learning layer is fixed during live inference.', 'طبقة التعلم العميق ثابتة أثناء الاستدلال الحي.'],
  ['Production inference uses a reviewed neural model package that has already passed development and promotion controls. The live network does not retrain itself while producing the daily public ranking, and the production run does not loosen data-quality rules to force an answer.', 'يستخدم الاستدلال الإنتاجي حزمة نموذج عصبي خضعت للمراجعة واجتازت ضوابط التطوير والترقية. لا تعيد الشبكة الحية تدريب نفسها أثناء إنتاج الترتيب العام اليومي، ولا يخفف التشغيل الإنتاجي قواعد جودة البيانات لفرض إجابة.'],
  ['The public white paper intentionally stops at the system level. Exact feature construction, network dimensions, optimization choices, private numerical model outputs and implementation paths remain proprietary. What matters publicly is the reproducible decision protocol around the model: fixed package, time-locked inputs, complete horizon rankings and controlled disclosure.', 'تتوقف الورقة البحثية العامة عمداً عند مستوى النظام. يظل بناء الخصائص الدقيق وأبعاد الشبكة وخيارات التحسين والمخرجات الرقمية الخاصة ومسارات التنفيذ معلومات مملوكة. وما يهم علناً هو بروتوكول القرار القابل لإعادة التحقق حول النموذج: حزمة ثابتة ومدخلات مقيدة زمنياً وترتيبات كاملة للآفاق وإفصاح مضبوط.'],
  ['Fixed production package', 'حزمة إنتاج ثابتة'],
  ['Daily inference uses the reviewed live package rather than an online self-modifying model.', 'يستخدم الاستدلال اليومي الحزمة الحية الخاضعة للمراجعة بدلاً من نموذج يتغير ذاتياً أثناء التشغيل.'],
  ['Same-run universe parity', 'تطابق مجموعة الأسهم في التشغيل نفسه'],
  ['Native horizons are published over the same eligible symbol set for that completed run.', 'تُنشر الآفاق الأصلية على مجموعة الرموز المؤهلة نفسها لذلك التشغيل المكتمل.'],
  ['Fail-closed publication', 'نشر يتوقف عند الفشل'],
  ['Incomplete or unsafe public records are rejected rather than partially exposed.', 'تُرفض السجلات العامة غير المكتملة أو غير الآمنة بدلاً من كشفها جزئياً.'],
  ['No invented confidence', 'لا توجد ثقة مصطنعة'],
  ['The public product never manufactures probability or return precision from rank alone.', 'لا يصنع المنتج العام احتمالاً أو دقة للعائد انطلاقاً من الترتيب وحده.'],
  ['Validation is chronological and evidence is separated by stage.', 'التحقق زمني والأدلة مفصولة حسب المرحلة.'],
  ['Development evidence and live realised evidence answer different questions and are therefore kept separate. Model development uses date-ordered partitions and held-out evaluation to test whether ranking behaviour generalises beyond the fitting interval. Production then accumulates a second evidence stream from predictions that were genuinely issued before their outcomes were known.', 'أدلة التطوير والأدلة الحية للنتائج الفعلية تجيب عن أسئلة مختلفة، ولذلك تبقى منفصلة. يستخدم تطوير النموذج تقسيمات مرتبة زمنياً واختباراً خارج عينة التدريب لفحص ما إذا كان سلوك الترتيب يعمم خارج فترة الملاءمة. ثم يجمع التشغيل الإنتاجي مساراً ثانياً من الأدلة من توقعات صدرت فعلياً قبل معرفة نتائجها.'],
  ['This separation prevents a common simulation error: presenting in-sample or reconstructed history as if it were live operational evidence. Historical validation describes the reviewed package; live evidence describes what has actually matured since deployment.', 'يمنع هذا الفصل خطأً شائعاً في المحاكاة: عرض تاريخ داخل عينة التدريب أو تاريخ معاد البناء على أنه دليل تشغيلي حي. يصف التحقق التاريخي الحزمة الخاضعة للمراجعة، بينما تصف الأدلة الحية ما نضج فعلياً منذ النشر.'],
  ['Training interval', 'فترة التدريب'],
  ['Learn from earlier chronological market history.', 'التعلم من تاريخ السوق الزمني الأسبق.'],
  ['Validation interval', 'فترة التحقق'],
  ['Tune and compare without touching the held-out test interval.', 'الضبط والمقارنة دون استخدام فترة الاختبار خارج العينة.'],
  ['Held-out test', 'اختبار خارج العينة'],
  ['Evaluate ranking behaviour on unseen later dates.', 'تقييم سلوك الترتيب على تواريخ لاحقة غير مستخدمة سابقاً.'],
  ['Fixed live package', 'حزمة حية ثابتة'],
  ['Promote only through controlled human review.', 'الترقية فقط عبر مراجعة بشرية مضبوطة.'],
  ['Live evidence', 'أدلة حية'],
  ['Score only forecasts whose future horizon has matured.', 'تقييم التوقعات التي نضج أفقها المستقبلي فقط.'],
  ['Realised outcomes arrive after the forecast, never before it.', 'النتائج الفعلية تأتي بعد التوقع لا قبله.'],
  ['Once enough future trading sessions exist, the private evidence loop pairs the earlier forecast state with the realised market outcome. Immature horizons remain pending. Missing or invalid observations do not receive fabricated scores. Aggregate live ranking metrics remain maturity-gated in the public product until the evidence policy allows them to be shown.', 'عندما يتوفر عدد كافٍ من جلسات التداول المستقبلية، تربط دورة الأدلة الخاصة حالة التوقع السابقة بالنتيجة الفعلية للسوق. تبقى الآفاق غير الناضجة معلقة، ولا تحصل المشاهدات المفقودة أو غير الصالحة على درجات مصطنعة. وتظل مقاييس الترتيب الحية المجمعة مشروطة بنضج الأدلة في المنتج العام حتى تسمح سياسة الأدلة بعرضها.'],
  ['The model is not automatically retrained or promoted because a few recent outcomes look strong or weak. Evidence can trigger review, but model replacement remains a human-governed decision.', 'لا يُعاد تدريب النموذج أو ترقيته تلقائياً لأن عدداً قليلاً من النتائج الأخيرة يبدو قوياً أو ضعيفاً. قد تؤدي الأدلة إلى مراجعة، لكن استبدال النموذج يظل قراراً تحكمه المراجعة البشرية.'],
  ['FORECAST TIME', 'وقت التوقع'],
  ['Rank the market', 'ترتيب السوق'],
  ['Issue the forward model record from the sealed session state.', 'إصدار سجل النموذج المستقبلي من حالة الجلسة المغلقة.'],
  ['WAIT', 'انتظار'],
  ['Let the horizon mature', 'انتظار نضج الأفق'],
  ['No scoring until the required future trading sessions exist.', 'لا تقييم قبل توفر جلسات التداول المستقبلية المطلوبة.'],
  ['EVIDENCE TIME', 'وقت الأدلة'],
  ['Measure realised behaviour', 'قياس السلوك الفعلي'],
  ['Accumulate outcome evidence without rewriting the original forecast.', 'تجميع أدلة النتائج دون إعادة كتابة التوقع الأصلي.'],
  ['The public product is a disclosure layer, not the model core.', 'المنتج العام طبقة إفصاح وليس جوهر النموذج.'],
  ['EGX Research publishes enough structure for an investor to inspect the system without publishing the proprietary machinery that makes the ranking economically valuable. Each public session is preserved by date, so visitors can inspect what the system actually disclosed rather than a later rewritten narrative.', 'تنشر EGX Research قدراً كافياً من البنية لتمكين المستثمر من فحص النظام دون نشر الآليات الخاصة التي تمنح الترتيب قيمته الاقتصادية. تُحفظ كل جلسة عامة بتاريخها، بحيث يمكن للزائر فحص ما كشفه النظام فعلياً بدلاً من رواية أعيدت صياغتها لاحقاً.'],
  ['Public research surface', 'واجهة البحث العامة'],
  ['Completed analysis date and eligible-universe context', 'تاريخ التحليل المكتمل وسياق مجموعة الأسهم المؤهلة'],
  ['1D / 3D / 5D / 10D full-universe rankings', 'ترتيبات كاملة للمجموعة عبر 1D / 3D / 5D / 10D'],
  ['Rank percentile and same-horizon Rank Move', 'المئين للترتيب وتغير الترتيب للأفق نفسه'],
  ['Positive / Neutral / Negative direction', 'اتجاه إيجابي / محايد / سلبي'],
  ['Historical held-out evidence and maturity-gated live evidence', 'أدلة تاريخية خارج العينة وأدلة حية مشروطة بالنضج'],
  ['Archive provenance and research-use disclaimer', 'مصدر الأرشيف وإخلاء مسؤولية الاستخدام البحثي'],
  ['Private research implementation', 'التنفيذ البحثي الخاص'],
  ['Raw source records and exact feature construction', 'سجلات المصادر الخام وبناء الخصائص الدقيق'],
  ['Network dimensions, trained parameters and optimization details', 'أبعاد الشبكة والمعاملات المدربة وتفاصيل التحسين'],
  ['Private numerical forecast magnitudes and model internals', 'قيم التوقع الرقمية الخاصة والمكونات الداخلية للنموذج'],
  ['Internal diagnostics, operational paths and governance state', 'التشخيصات الداخلية ومسارات التشغيل وحالة الحوكمة'],
  ['Any implementation detail that would expose the proprietary model core', 'أي تفاصيل تنفيذية تكشف جوهر النموذج الخاص'],
  ['Interpretation discipline.', 'ضوابط التفسير.'],
  ['EGX /Alpha is a quantitative research system operating under changing market regimes, liquidity conditions and source availability. Its rankings are conditional on the information set, eligible universe and selected horizon at the analysis cutoff. They are not personalised advice, target prices or execution instructions. The intended use is to prioritise research, compare relative model views and inspect a preserved record of forward-looking model output.', 'EGX /Alpha نظام بحث كمي يعمل في ظل تغير أنظمة السوق والسيولة وإتاحة المصادر. ترتيباته مشروطة بمجموعة المعلومات ومجموعة الأسهم المؤهلة والأفق المحدد عند وقت التحليل. وهي ليست نصيحة شخصية ولا أسعاراً مستهدفة ولا تعليمات تنفيذ. الاستخدام المقصود هو ترتيب أولويات البحث ومقارنة الرؤى النسبية للنموذج وفحص سجل محفوظ لمخرجات مستقبلية للنموذج.'],

  // Investor guide.
  ['RETAIL INVESTOR GUIDE', 'دليل المستثمر الفرد'],
  ['How Retail Investors Can Use EGX /Alpha in Their Decision-Making', 'كيف يستخدم المستثمر الفرد EGX /Alpha في دعم قراره'],
  ['A practical guide to reading the EGX /Alpha rank, direction, forecast horizon and validation evidence as decision support for Egyptian equities.', 'دليل عملي لقراءة ترتيب EGX /Alpha واتجاه النموذج وأفق التوقع وأدلة التحقق كعناصر مساندة للقرار في الأسهم المصرية.'],
  ['focuses on the Egyptian Stock Market —', 'يركز على سوق الأسهم المصرية —'],
  ['— using quantitative stock forecasting (', '— باستخدام التنبؤ الكمي بالأسهم ('],
  [') and systematic stock analysis (', ') والتحليل المنهجي للأسهم ('],
  ['LATEST RANKING', 'أحدث ترتيب'],
  ['RESEARCH METHOD', 'منهج البحث'],
  ['MODEL HISTORY', 'سجل النموذج'],
  ['SEARCH STOCKS', 'بحث الأسهم'],
  ['Egyptian retail investors already have more stock ideas than they can reasonably follow. Brokerage research, company disclosures, technical-analysis pages, investor groups, market rumors and daily price action can easily put ten or twenty names on a watchlist before the session even starts. The difficult part is deciding which of those names deserves serious attention and which can wait.', 'لدى المستثمر الفرد في مصر عادةً أفكار أسهم أكثر مما يمكن متابعته عملياً. تقارير شركات السمسرة وإفصاحات الشركات وصفحات التحليل الفني ومجموعات المستثمرين وشائعات السوق وحركة الأسعار اليومية قد تضع بسهولة عشرة أو عشرين سهماً على قائمة المتابعة قبل بدء الجلسة. الصعوبة الحقيقية هي تحديد أي هذه الأسهم يستحق بحثاً جاداً وأيها يمكن تأجيله.'],
  ['was built for that part of the process.', 'صُمم لهذه المرحلة من عملية القرار.'],
  ['EGX /Alpha is a deep-learning forecasting system for Egyptian equities. After each completed EGX session, the engine evaluates the eligible stock universe using the market information available at that point and produces a ranked view of expected relative performance over', 'EGX /Alpha نظام توقع بالتعلم العميق للأسهم المصرية. بعد كل جلسة مكتملة في البورصة المصرية يقيّم المحرك مجموعة الأسهم المؤهلة باستخدام معلومات السوق المتاحة في ذلك الوقت، وينتج ترتيباً للرؤية النسبية عبر'],
  ['1, 3, 5 and 10 trading days', '1 و3 و5 و10 أيام تداول'],
  ['. The current public universe contains 91 stocks. The 5-day horizon serves as the main research view, while the shorter horizons help investors understand how immediate or persistent a model preference appears to be.', '. يمثل أفق 5D الرؤية البحثية الرئيسية، بينما تساعد الآفاق الأقصر المستثمر على فهم مدى فورية تفضيل النموذج أو استمراره.'],
  ['A rank should be read as a relative position inside that universe. If a stock is ranked third out of 91, the model has placed it near the top of the market for that particular forecast horizon. The percentile shown on the website is simply another way of expressing the same relative position. A stock around the 98th percentile sits close to the top of the ranking; the figure does not represent a probability of profit or an expected return.', 'يجب قراءة الترتيب باعتباره موقعاً نسبياً داخل مجموعة الأسهم المؤهلة. فإذا احتل سهم المركز الثالث من بين الأسهم المؤهلة، فقد وضعه النموذج قرب قمة السوق لذلك الأفق تحديداً. المئين المعروض في الموقع طريقة أخرى للتعبير عن الموقع النسبي نفسه، ولا يمثل احتمالاً للربح أو عائداً متوقعاً.'],
  ['That distinction is especially useful for investors who are choosing between several possible positions. If four stocks all look interesting from a fundamental or technical perspective, /Alpha provides an additional way to compare them. A stock near the top of the 5-day ranking has a different model profile from one near the bottom. That information can help determine where to spend more research time before deciding whether a position is worth taking.', 'يفيد هذا الفرق خصوصاً عند الاختيار بين عدة مراكز محتملة. إذا بدت أربعة أسهم جذابة من منظور أساسي أو فني، يوفر /Alpha طريقة إضافية للمقارنة بينها. السهم القريب من قمة ترتيب 5D يحمل ملفاً مختلفاً لدى النموذج عن سهم قريب من القاع، ما يساعد في تحديد أين ينبغي تخصيص وقت البحث قبل اتخاذ القرار.'],
  ['The website also publishes a separate directional classification for each stock: Positive, Neutral or Negative. Rank and direction are designed to be read together. A stock may rank highly because the model expects it to perform better than most of the universe, while its directional classification remains Neutral or Negative. This can happen when the overall market backdrop is weak and relative strength does not imply an attractive absolute outlook. The reverse can also occur in a strong market, where a stock receives a Positive signal but still ranks below many peers that the model prefers more strongly.', 'ينشر الموقع أيضاً تصنيفاً اتجاهياً منفصلاً لكل سهم: إيجابي أو محايد أو سلبي. صُمم الترتيب والاتجاه ليُقرآ معاً. قد يحتل سهم ترتيباً مرتفعاً لأن النموذج يراه أفضل نسبياً من معظم السوق، بينما يبقى اتجاهه محايداً أو سلبياً. يحدث ذلك مثلاً عندما تكون خلفية السوق ضعيفة فلا تعني القوة النسبية بالضرورة رؤية مطلقة جذابة، وقد يحدث العكس في سوق قوي.'],
  ['The ', ''],
  ['August 17, 2026 public signal', 'السجل العام بتاريخ 17 أغسطس 2026'],
  [' illustrates how these pieces work together. MICH ranked first on the 1-day horizon with a Positive signal. For someone concentrating on the next trading session, that is an obvious stock to examine more closely. The picture becomes more cautious over longer windows: MICH was around fourth on the 3-day horizon with a Neutral signal and around fourth on the 5-day horizon with a Negative signal. The model therefore expressed its strongest preference at the shortest horizon, with a weaker directional view as the forecast window extended.', ' يوضح كيف تعمل هذه العناصر معاً. احتل MICH المركز الأول في أفق 1D مع اتجاه إيجابي. بالنسبة لمن يركز على الجلسة التالية، يجعله ذلك سهماً يستحق فحصاً أقرب. تصبح الصورة أكثر حذراً في النوافذ الأطول، ما يوضح أن قوة الترتيب قصير الأجل لا تعني تلقائياً قوة الاتجاه عبر جميع الآفاق.'],
  ['UEGC showed a different pattern. It ranked second and Positive over 1 day, second and Neutral over 3 days, and first and Neutral over 5 days. Its directional classification softened beyond the immediate session, but its relative position remained very strong across several horizons. For a retail investor, that kind of persistence is useful because it identifies a stock that repeatedly sits near the top of the model\'s ordering rather than appearing there only for a single short-term forecast.', 'أظهر UEGC نمطاً مختلفاً؛ بقي موقعه النسبي قوياً عبر عدة آفاق حتى مع تغير التصنيف الاتجاهي بعد الأفق القصير. بالنسبة للمستثمر الفرد، يفيد هذا النوع من الاستمرارية لأنه يميز سهماً يتكرر قرب قمة ترتيب النموذج عن سهم يظهر هناك في توقع قصير واحد فقط.'],
  ['At that point, the usual investment work still matters. An investor considering UEGC would want to look at liquidity, volume, recent disclosures, sector conditions, price structure, portfolio exposure and the amount of downside that would be acceptable if the trade failed. /Alpha narrows the field and provides a quantitative view; the eventual decision still depends on price, risk and the investor\'s own assessment.', 'عند هذه المرحلة يظل العمل الاستثماري المعتاد مهماً. ينبغي فحص السيولة وحجم التداول والإفصاحات الحديثة وظروف القطاع وبنية السعر وتعرض المحفظة وحجم الخسارة المقبولة. يضيّق /Alpha نطاق البحث ويقدم رؤية كمية، لكن القرار النهائي يظل مرتبطاً بالسعر والمخاطر وتقييم المستثمر نفسه.'],
  ['GGCC provides another useful example. On August 17 it ranked third with a Positive 1-day signal, first with a Neutral 3-day signal and fifth with a Neutral 5-day signal. Its movement from the previous run adds another layer of information. GGCC had been around eleventh on the previous 1-day ranking and then moved to third. The website displays that change as Δ, or rank movement.', 'يقدم GGCC مثالاً آخر على أهمية تغير الترتيب. انتقال السهم عدة مراكز بين تشغيلين يضيف طبقة معلومات مختلفة عن الترتيب الحالي نفسه. يعرض الموقع هذا التغير بوضوح كتغير في عدد مراكز الترتيب مقارنة بالتشغيل المكتمل السابق للأفق نفسه.'],
  ['Rank movement helps investors distinguish between a stock that has remained near the top for several sessions and one whose model position has improved sharply. Two stocks can share the same rank today while having arrived there through very different paths. A rapid move upward in the ranking signals a meaningful change in the model\'s relative assessment and may justify a closer look.', 'يساعد تغير الترتيب على التمييز بين سهم بقي قريباً من القمة لعدة جلسات وسهم تحسن موقعه لدى النموذج بسرعة. قد يشترك سهمان في الترتيب نفسه اليوم رغم وصولهما إليه بمسارين مختلفين تماماً. الحركة السريعة صعوداً تعني تغيراً ملموساً في التقييم النسبي للنموذج وقد تستحق فحصاً أدق.'],
  ['CEFM is a useful reminder to read the whole output rather than only the first column. It ranked fourth with a Positive signal over 1 day, then fifth with a Negative signal over 3 days and seventh with a Negative signal over 5 days. The immediate forecast was relatively strong, while the multi-session directional view was less favorable. Investors who move between the horizons can see that difference immediately and avoid treating a strong short-term rank as a general bullish view extending across the week.', 'يذكّر CEFM بضرورة قراءة المخرجات كاملة لا العمود الأول فقط. قد يكون الترتيب القصير قوياً بينما تصبح الرؤية الاتجاهية عبر عدة جلسات أقل دعماً. التنقل بين الآفاق يكشف هذا الفرق ويمنع تفسير ترتيب قصير قوي على أنه رؤية صعودية عامة تمتد طوال الأسبوع.'],
  ['For most retail investors, the simplest use of /Alpha is as a market filter. There is little value in studying all 91 eligible stocks with equal intensity every evening. The ranking can bring the stronger model candidates to the front, after which the different horizons, directional classifications and rank movements provide additional context. The website also keeps ', 'بالنسبة لمعظم المستثمرين الأفراد، أبسط استخدام لـ /Alpha هو كمرشح للسوق. لا توجد فائدة كبيرة من دراسة جميع الأسهم المؤهلة بالعمق نفسه كل مساء. يضع الترتيب مرشحي النموذج الأقوى في المقدمة، ثم تضيف الآفاق المختلفة وتصنيفات الاتجاه وتغيرات الترتيب مزيداً من السياق. يحتفظ الموقع أيضاً بـ '],
  ['public model history for individual stocks', 'السجل العام للنموذج لكل سهم'],
  [', so investors can see whether a current ranking is unusual, persistent or part of a recent change in the model\'s view.', '، ما يسمح للمستثمر برؤية ما إذا كان الترتيب الحالي استثنائياً أو مستمراً أو جزءاً من تغير حديث في رؤية النموذج.'],
  ['The ', ''],
  ['dated public forecasts are preserved in the archive', 'التوقعات العامة المؤرخة محفوظة في الأرشيف'],
  [', and the stock pages show previous ranks, percentiles, directional classifications and rank movements. That history gives investors a way to evaluate the model using the forecasts that were actually published at the time. A forecasting system becomes much easier to judge when old calls remain visible after the outcome is known.', '، وتعرض صفحات الأسهم الترتيبات السابقة والمئينات وتصنيفات الاتجاه وتغيرات الترتيب. يتيح هذا السجل تقييم النموذج باستخدام التوقعات التي نُشرت فعلياً في وقتها. يصبح الحكم على نظام التوقع أسهل عندما تبقى التوقعات القديمة ظاهرة بعد معرفة النتائج.'],
  ['Chronology is central to the ', 'يمثل التسلسل الزمني محوراً أساسياً في '],
  ['underlying research process', 'العملية البحثية الأساسية'],
  ['. Each completed EGX session is treated as a defined information state. Data availability, freshness and stock eligibility are resolved before inference, after which the reviewed deep-learning model package produces the cross-sectional rankings. Realized outcomes are evaluated only after the corresponding forecast horizon has matured. This sequencing is important because financial backtests can become misleading when information that was unavailable at the decision point finds its way into the historical simulation.', '. تُعامل كل جلسة مكتملة في البورصة المصرية كحالة معلومات محددة. تُحسم إتاحة البيانات وحداثتها وأهلية الأسهم قبل الاستدلال، ثم تنتج حزمة التعلم العميق الخاضعة للمراجعة الترتيبات المقطعية. لا يتم تقييم النتائج الفعلية إلا بعد نضج أفق التوقع المقابل، لأن الاختبارات التاريخية قد تصبح مضللة إذا تسربت إليها معلومات لم تكن متاحة وقت القرار.'],
  ['The published historical evidence currently covers 906 held-out test dates. On the 5-day horizon, the historical mean RankIC is approximately +0.028, with a positive top-minus-bottom spread of about 0.18 percentage points in the held-out test. RankIC measures the relationship between the model\'s ordering of stocks and the subsequent ordering of their realized performance. In practical terms, the positive historical value indicates that higher-ranked stocks showed some tendency to outperform lower-ranked stocks within the held-out sample.', 'تغطي الأدلة التاريخية المنشورة 906 تواريخ اختبار خارج عينة التدريب. وعلى أفق 5D بلغ متوسط RankIC التاريخي نحو +0.028، مع فارق موجب بين أعلى وأسفل الترتيب يقارب 0.18 نقطة مئوية في الاختبار خارج العينة. يقيس RankIC العلاقة بين ترتيب النموذج للأسهم وترتيب أدائها الفعلي اللاحق؛ وتشير القيمة التاريخية الموجبة إلى وجود ميل لدى الأسهم الأعلى ترتيباً للتفوق نسبياً على الأقل ترتيباً داخل العينة المختبرة.'],
  ['The size of that relationship should be viewed in the context of financial markets, where useful predictive effects are usually modest. The more relevant question is whether the signal continues to behave consistently outside the historical sample. That is why the public product separates historical validation from live validation.', 'ينبغي تفسير حجم هذه العلاقة في سياق الأسواق المالية، حيث تكون التأثيرات التنبؤية المفيدة عادةً محدودة. السؤال الأهم هو ما إذا كانت الإشارة تستمر في السلوك المتسق خارج العينة التاريخية، ولهذا يفصل المنتج العام بين التحقق التاريخي والتحقق الحي.'],
  ['The current live-validation status is marked as “evidence accumulating.” For the 5-day horizon, the public record contains 23 matured prediction days, while the governance framework requires 60 matured days before the live metrics are treated as ready. This gives investors a clear picture of where the evidence stands today. The historical results are available for inspection, while the production record is still building enough history for a more meaningful live assessment.', 'تُعرض حالة التحقق الحي حالياً باعتبارها «الأدلة قيد التراكم». لا تُعامل المقاييس الحية على أنها جاهزة قبل بلوغ حد النضج المحدد في إطار الحوكمة. يمنح ذلك المستثمر صورة واضحة عن مرحلة الأدلة: النتائج التاريخية متاحة للفحص، بينما يستمر السجل الإنتاجي في بناء تاريخ كافٍ لتقييم حي أكثر معنى.'],
  ['A practical routine can remain simple. Investors looking for a new position can start with the horizon that best matches their intended holding period, then compare the neighboring horizons to see how stable the model\'s preference appears. A strong rank combined with a supportive directional classification and favorable rank movement deserves more attention than a single attractive number viewed in isolation. Once a stock reaches that stage, the decision process moves back to the familiar questions of price, liquidity, disclosures, technical structure, sector exposure and portfolio risk.', 'يمكن إبقاء الروتين العملي بسيطاً. يبدأ المستثمر بالأفق الأقرب إلى مدة الاحتفاظ المستهدفة، ثم يقارن الآفاق المجاورة لقياس استقرار تفضيل النموذج. يستحق الترتيب القوي المصحوب باتجاه داعم وتغير ترتيب ملائم اهتماماً أكبر من رقم جذاب منفرد. بعد ذلك يعود القرار إلى أسئلة السعر والسيولة والإفصاحات والبنية الفنية والتعرض القطاعي ومخاطر المحفظة.'],
  ['The signal can also be useful for stocks that are already in a portfolio. If a holding begins to fall sharply through the 5-day or 10-day ranking, the change can prompt a review of the original thesis. The investor may ultimately decide that nothing material has changed, but the model has introduced a fresh piece of evidence that deserves consideration. The same applies in the other direction when a stock rises steadily through the rankings.', 'يمكن أن تكون الإشارة مفيدة أيضاً للأسهم الموجودة بالفعل في المحفظة. إذا بدأ سهم محتفظ به في التراجع بوضوح في ترتيب 5D أو 10D، فقد يدفع ذلك إلى مراجعة الفرضية الأصلية. قد يقرر المستثمر في النهاية أن لا شيء جوهرياً تغير، لكن النموذج أضاف دليلاً جديداً يستحق النظر. وينطبق الأمر نفسه عندما يرتفع سهم بثبات في الترتيب.'],
  ['This can be particularly valuable in a market where investment ideas often spread socially. A stock may gain attention because it is moving, because a well-followed investor mentions it, or because discussion around it has become unusually active. The published /Alpha ranking process operates independently of an individual investor\'s personal attachment to a stock or the opinions circulating in that investor\'s own trading circles. It therefore offers a consistent quantitative reference point that can either support or challenge the prevailing narrative.', 'تزداد قيمة ذلك في سوق تنتشر فيه الأفكار الاستثمارية اجتماعياً. قد يلفت سهم الانتباه بسبب حركته أو ذكره من مستثمر متابع أو ارتفاع النقاش حوله. تعمل عملية ترتيب /Alpha المنشورة بمعزل عن تعلق المستثمر الشخصي بسهم أو الآراء المتداولة في دوائره، فتقدم مرجعاً كمياً ثابتاً يمكن أن يدعم الرواية السائدة أو يتحداها.'],
  ['There are still many decisions the model leaves to the investor. A highly ranked stock may open at a price that makes the trade unattractive. Liquidity may be too thin for the intended position size. A new disclosure may arrive after the model\'s information state was locked. Existing portfolio exposure may make another position in the same sector undesirable. These are ordinary investment considerations, and they remain part of the final decision.', 'تبقى قرارات كثيرة خارج نطاق النموذج. قد يفتتح سهم مرتفع الترتيب عند سعر يجعل الصفقة غير جذابة، وقد تكون السيولة غير كافية لحجم المركز، وقد يصل إفصاح جديد بعد تثبيت حالة معلومات النموذج، أو يجعل تعرض المحفظة القائم إضافة مركز آخر في القطاع غير مناسبة. هذه اعتبارات استثمارية عادية وتظل جزءاً من القرار النهائي.'],
  ['The case for trusting EGX /Alpha rests on what can be examined over time: forecasts are generated from completed market states, the eligible universe is ranked across several native horizons, directional classifications are published separately from rank, dated outputs remain available, historical validation is disclosed and live evidence is allowed to mature before being treated as established performance. Confidence in the signal should grow or weaken with the evidence that accumulates.', 'تستند الثقة في EGX /Alpha إلى ما يمكن فحصه عبر الزمن: تُولد التوقعات من حالات سوق مكتملة، وتُرتب مجموعة الأسهم المؤهلة عبر عدة آفاق أصلية، وتُنشر تصنيفات الاتجاه منفصلة عن الترتيب، وتبقى المخرجات المؤرخة متاحة، ويُفصح عن التحقق التاريخي، وتُترك الأدلة الحية لتنضج قبل اعتبارها أداءً مستقراً. ينبغي أن تقوى الثقة في الإشارة أو تضعف وفق الأدلة المتراكمة.'],
  ['For a retail investor, the practical benefit is straightforward. EGX /Alpha reduces a large market universe to a more manageable set of candidates, shows how the model\'s view changes with the investment horizon and provides a consistent quantitative opinion that can be compared with the investor\'s own research. The uncertainty of the market remains, but the process of deciding where to look and what to question becomes more structured.', 'بالنسبة للمستثمر الفرد، الفائدة العملية مباشرة: يساعد EGX /Alpha على تحويل سوق واسع إلى مجموعة مرشحين أسهل في المتابعة، ويعرض كيف تتغير رؤية النموذج مع الأفق الاستثماري، ويوفر رأياً كمياً ثابتاً يمكن مقارنته ببحث المستثمر نفسه. تظل حالة عدم اليقين في السوق، لكن عملية تحديد أين ينظر المستثمر وما الذي يراجعه تصبح أكثر تنظيماً.'],
  ['EGX /Alpha is published for research and informational purposes. Its rankings and directional classifications are not execution instructions, guarantees of future returns or personalized investment advice.', 'يُنشر EGX /Alpha لأغراض البحث والمعلومات. ترتيباته وتصنيفاته الاتجاهية ليست تعليمات تنفيذ أو ضمانات لعوائد مستقبلية أو نصيحة استثمارية شخصية.'],
  ['OFFICIAL MARKET RESOURCES', 'مصادر السوق الرسمية'],
  ['For official exchange and regulatory information, consult the ', 'للمعلومات الرسمية الخاصة بالبورصة والرقابة، راجع '],
  ['Egyptian Exchange (EGX)', 'البورصة المصرية (EGX)'],
  [' and the ', ' و'],
  ['Financial Regulatory Authority capital-market resources', 'مصادر الهيئة العامة للرقابة المالية الخاصة بسوق رأس المال'],
  ['.', '.']
];

const AR_SORTED = [...AR_REPLACEMENTS].sort((a, b) => b[0].length - a[0].length);

function replaceStatic(value) {
  let output = String(value ?? '');
  for (const [source, target] of AR_SORTED) output = output.replaceAll(source, target);
  return output;
}

function replaceDynamic(value) {
  let output = String(value ?? '');
  output = output.replace(/\b(\d[\d,]*) STOCKS ANALYSED\b/g, '$1 سهماً محللاً');
  output = output.replace(/\bOF (\d[\d,]*) STOCKS\b/g, 'من $1 سهماً');
  output = output.replace(/\b(\d[\d,]*) STOCKS\b/g, '$1 سهماً');
  output = output.replace(/\b(\d[\d,]*) PUBLIC OBSERVATIONS?\b/g, '$1 ملاحظة عامة');
  output = output.replace(/\b(\d[\d,]*) MODEL SESSIONS?\b/g, '$1 جلسة نموذج');
  output = output.replace(/([↑↓])\s*(\d+)\s+PLACES?/g, '$1 $2 مراكز');
  const months = { JAN:'يناير', FEB:'فبراير', MAR:'مارس', APR:'أبريل', MAY:'مايو', JUN:'يونيو', JUL:'يوليو', AUG:'أغسطس', SEP:'سبتمبر', OCT:'أكتوبر', NOV:'نوفمبر', DEC:'ديسمبر' };
  output = output.replace(/\b(\d{1,2}) (JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (\d{4})\b/g, (_, d, m, y) => `${d} ${months[m]} ${y}`);
  return output;
}

function escapeRegExp(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function localizeInternalLinks(html, basePath = '') {
  const base = String(basePath || '').replace(/\/$/, '');
  const escapedBase = escapeRegExp(base);
  const contentRoute = '(?:today|archive|search|methodology|investor-guide|institutional|symbol)';
  const routePattern = new RegExp(`href="${escapedBase}(\\/(?:${contentRoute})(?:\\/[^"#?]*)?(?:[?#][^"]*)?)"`, 'g');
  let output = html.replace(routePattern, `href="${base}/ar$1"`);
  const rootPattern = new RegExp(`href="${escapedBase}/"`, 'g');
  output = output.replace(rootPattern, `href="${base}/ar/"`);
  return output;
}

export function translateText(value, locale = 'en') {
  if (!isArabic(locale)) return String(value ?? '');
  return replaceDynamic(replaceStatic(value));
}

export function localizeHtml(value, locale = 'en', { basePath = '' } = {}) {
  if (!isArabic(locale)) return String(value ?? '');
  return localizeInternalLinks(replaceDynamic(replaceStatic(value)), basePath);
}

export function clientStrings(locale = 'en') {
  if (!isArabic(locale)) return {
    outputCount: 'OF {n} STOCKS',
    noMatching: 'No {label} stocks in the selected {horizon} outlook.',
    matching: 'matching',
    showAll: 'Show all',
    chartNotEnough: 'Not enough public history yet.',
    chartUnavailable: 'Historical chart unavailable.',
    chartAria: 'Historical rank percentile chart',
    percentile: 'percentile',
    rank: 'Rank',
    searchUnavailable: 'Search index is unavailable.',
    unavailable: 'UNAVAILABLE',
    searchPrompt: 'Enter a ticker, analysis date, outlook or signal.',
    ready: 'READY',
    matches: '{n} MATCH{plural}',
    showing50: ' · SHOWING 50',
    noSearchResults: 'No matching public model records.',
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative'
  };
  return {
    outputCount: 'من {n} سهماً',
    noMatching: 'لا توجد أسهم {label} مطابقة في أفق {horizon} المحدد.',
    matching: 'مطابقة',
    showAll: 'عرض الكل',
    chartNotEnough: 'لا يوجد سجل عام كافٍ حتى الآن.',
    chartUnavailable: 'الرسم التاريخي غير متاح.',
    chartAria: 'رسم تاريخي للمئين للترتيب',
    percentile: 'المئين',
    rank: 'الترتيب',
    searchUnavailable: 'فهرس البحث غير متاح.',
    unavailable: 'غير متاح',
    searchPrompt: 'أدخل رمز سهم أو تاريخ تحليل أو أفقاً أو اتجاه النموذج.',
    ready: 'جاهز',
    matches: '{n} نتيجة',
    showing50: ' · عرض أول 50',
    noSearchResults: 'لا توجد سجلات عامة مطابقة.',
    positive: 'إيجابي',
    neutral: 'محايد',
    negative: 'سلبي'
  };
}
