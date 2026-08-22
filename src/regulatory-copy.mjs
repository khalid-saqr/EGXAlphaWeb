function replaceAll(value, pairs) {
  let output = String(value ?? '');
  for (const [source, target] of pairs) output = output.replaceAll(source, target);
  return output;
}

function isArabic(locale) {
  return String(locale || '').toLowerCase().startsWith('ar');
}

const EN_TEXT_PAIRS = [
  ['How to Read EGX /Alpha | Investor Guide | EGX Research', 'How to Read EGX /Alpha | Research Interpretation Guide | EGX Research'],
  ['A practical guide to what EGX /Alpha ranks, what Relative Rank and Model Direction mean, and how to use the daily signal as a research priority list.', 'A practical guide to Relative Rank, Model Direction, Rank Move and the four EGX /Alpha research horizons.'],
  ['Search public EGX /Alpha rankings by date, stock, outlook or signal.', 'Search public EGX /Alpha research records by date, stock, horizon or Model Direction classification.'],
  ['Quantitative investment research', 'Quantitative market research'],
  ['Institutional Access', 'Institutional Enquiries'],
  ['POST-CLOSE · CAIRO', 'AFTER EGX CLOSE']
];

const AR_TEXT_PAIRS = [
  ['كيف تقرأ EGX /Alpha | دليل المستثمر | EGX Research', 'كيف تقرأ EGX /Alpha | دليل تفسير المخرجات البحثية | EGX Research'],
  ['دليل عملي لفهم ما يرتبه EGX /Alpha، ومعنى الترتيب النسبي واتجاه النموذج، وكيف تستخدم الإشارة اليومية لتحديد أولويات البحث.', 'دليل عملي لفهم الترتيب النسبي واتجاه النموذج وتغير الترتيب وآفاق EGX /Alpha البحثية الأربعة.'],
  ['ابحث في ترتيبات EGX /Alpha العامة حسب التاريخ أو السهم أو الأفق أو اتجاه النموذج.', 'ابحث في سجلات EGX /Alpha البحثية العامة حسب التاريخ أو السهم أو الأفق أو تصنيف اتجاه النموذج.'],
  ['الوصول المؤسسي', 'استفسارات مؤسسية'],
  ['بعد الإغلاق · القاهرة', 'بعد إغلاق جلسة EGX']
];

const EN_HTML_PAIRS = [
  ['A daily order of priority for the Egyptian market.', 'A daily cross-sectional research ranking of the Egyptian market.'],
  ['Start with what the model ranks highest. Then do your research.', 'Relative Rank and Model Direction provide general quantitative research observations for independent interpretation.'],
  ['WHAT /ALPHA RANKS HIGHEST', 'HIGHEST RELATIVE MODEL RANKS'],
  ['RETAIL INVESTOR GUIDE', 'PUBLIC RESEARCH INTERPRETATION GUIDE'],
  ['What EGX /Alpha Answers — and How to Read the Daily Ranking', 'What EGX /Alpha Publishes — and How to Interpret the Daily Ranking'],
  ['<strong>Start here.</strong> When many EGX stocks are competing for your attention, /Alpha answers a practical question: where does the model say your research should begin?', '<strong>Interpretation principle.</strong> EGX /Alpha answers a cross-sectional research question: how does the model order the eligible stocks relative to one another at a selected forward horizon?'],
  ['What is EGX /Alpha, and how can I use it as an investor?', 'What is EGX /Alpha, and how should its public ranking be interpreted?'],
  ['EGX /Alpha is a deep-learning research engine built to help investors decide where to start looking inside the Egyptian stock market. After every completed EGX session, it ranks the eligible stocks it can evaluate across 1, 3, 5 and 10 trading-day horizons.', 'EGX /Alpha is a deep-learning quantitative research engine that publishes relative rankings of eligible Egyptian Exchange stocks across 1, 3, 5 and 10 trading-day horizons.'],
  ['Instead of researching every stock with equal attention, you can use /Alpha as a daily priority list: start with the stocks the model ranks highest, read their Model Direction, then carry out your own fundamental, technical, liquidity and risk analysis before making a decision.', 'Its public ranking records how the model orders the eligible comparison universe at each horizon. Model Direction provides a separate Positive, Neutral or Negative market-relative classification. The outputs are general research information and do not incorporate an individual visitor’s objectives, circumstances, holdings, risk tolerance or suitability.'],
  ['The index tells you how the market moved. /Alpha tells you where to look.', 'The index tells you how the market moved. /Alpha ranks how eligible stocks compare.'],
  [' addresses a different decision layer — cross-sectional priority.', ' addresses a different research layer — cross-sectional comparison.'],
  ['From market noise to an order of priority.', 'From a broad market to a cross-sectional ranking.'],
  ['Read together, they turn a broad market into a practical research sequence: what deserves attention first, what deserves context, and what can wait.', 'Read together, they provide two complementary descriptions of the published model state without representing a probability of profit, price target or transaction recommendation.'],
  ['<strong>Research in order</strong><p>The output is a disciplined attention map, not an instruction to trade.</p>', '<strong>Interpret the ordering</strong><p>The output records relative model placement across the eligible universe.</p>'],
  ['improve the decision problem /Alpha was built to solve: identifying relative opportunity across the Egyptian market.', 'improve the research problem /Alpha was built to study: the relative forward ordering of eligible Egyptian equities.'],
  ['For research partnerships, technology integration, signal distribution or strategic enquiries:', 'For research collaboration, research publication, research-data formats, technology or other institutional enquiries:'],
  ['Research and information only. No execution service is offered by this public website.', 'Institutional enquiries do not constitute an offer of investment advisory, brokerage, execution, portfolio-management or custody services. No such service is offered through this website.'],
  ['Strategic research applications', 'Institutional research applications'],
  ['Institutional conversations around Egyptian-equity intelligence and systematic research workflows.', 'Research and technology discussions concerning quantitative analysis of Egyptian equities, publication infrastructure and reproducible model evidence.'],
  ['Quantitative Egyptian-equity intelligence, built for disciplined research.', 'Quantitative research on Egyptian equities, built for reproducible analysis.'],
  ['signal distribution', 'research publication'],
  ['daily signal', 'daily research output'],
  ['Investors, however, make decisions among individual stocks — and the distance between those stocks is where opportunity and loss separate.', 'The research question, however, concerns differences among individual stocks — and the distance between those stocks is what a cross-sectional model attempts to describe.'],
  ['which names are separating from the rest, and which deserve attention before the next sessions?', 'which names are separating from the rest, and how do their relative positions differ before the next sessions?'],
  ['A research process anchored only to average market performance can miss stocks that move materially ahead of that average and remain exposed to stocks that fall behind it.', 'A research process anchored only to average market performance can miss stocks that move materially ahead of or behind that average.'],
  ['eligible opportunity set', 'eligible comparison set'],
  ['rather than reduce every decision to a single rule.', 'rather than reduce the analysis to a single rule.'],
  ['that day’s public call', 'that day’s public output'],
  ['What an investor needs to use and verify /Alpha.', 'What a reader needs to interpret and verify /Alpha.'],
  ['Every completed EGX session leaves more possible ideas than any investor can examine properly.', 'Every completed EGX session leaves a broad set of securities that cannot all be examined with equal depth.'],
  ['A ranking can make a stock more important to investigate; it cannot know whether that stock is suitable for your portfolio or whether the price available to you offers an acceptable trade.', 'A ranking can identify a higher relative model placement; it does not assess whether a security is suitable for any particular person or whether any available price is appropriate for a transaction.'],
  ['Your own context still matters: entry price, position size, liquidity, new company disclosures, sector exposure and risk.', 'Independent assessment may incorporate entry price, position size, liquidity, new company disclosures, sector exposure and risk.']
];

const AR_HTML_PAIRS = [
  ['ترتيب يومي للأولوية في السوق المصري.', 'ترتيب بحثي نسبي يومي للسوق المصري.'],
  ['ابدأ بما يضعه النموذج في أعلى الترتيب، ثم ابدأ بحثك.', 'يقدم الترتيب النسبي واتجاه النموذج مشاهدات بحثية كمية عامة للتفسير المستقل.'],
  ['أعلى الأسهم في ترتيب /ALPHA', 'أعلى المراكز في الترتيب النسبي للنموذج'],
  ['دليل المستثمر الفرد', 'دليل تفسير المخرجات البحثية العامة'],
  ['ما السؤال الذي يجيب عنه EGX /Alpha؟ وكيف تقرأ ترتيب كل يوم؟', 'ماذا ينشر EGX /Alpha؟ وكيف تُفسر ترتيباته اليومية؟'],
  ['<strong>ابدأ من هنا.</strong> عندما تكون أمامك أسهم كثيرة تتنافس على انتباهك، يجيب /Alpha عن سؤال عملي: من أين يقول النموذج إن بحثك يجب أن يبدأ؟', '<strong>قاعدة التفسير.</strong> يجيب EGX /Alpha عن سؤال بحثي نسبي: كيف يرتب النموذج الأسهم المؤهلة بعضها مقارنة ببعض عند أفق مستقبلي محدد؟'],
  ['ما هو EGX /Alpha؟ وكيف يمكنني الاستفادة منه كمستثمر يدير محفظته بنفسه؟', 'ما هو EGX /Alpha؟ وكيف تُفسر مخرجاته البحثية العامة؟'],
  ['EGX /Alpha هو محرك بحث كمي يعتمد على التعلم العميق، ومهمته أن يساعدك في تحديد الأسهم التي تستحق أن تبدأ منها بحثك داخل البورصة المصرية. بعد كل جلسة مكتملة، يرتب الأسهم المؤهلة التي يستطيع تقييمها عبر آفاق مستقبلية تمتد إلى 1 و3 و5 و10 جلسات تداول.', 'EGX /Alpha محرك بحث كمي يعتمد على التعلم العميق وينشر ترتيبات نسبية للأسهم المؤهلة في البورصة المصرية عبر آفاق 1 و3 و5 و10 جلسات تداول.'],
  ['بدلاً من أن تمنح كل الأسهم نفس الوقت والاهتمام، يمكنك استخدام /Alpha كقائمة يومية لأولويات البحث: ابدأ بالأسهم الأعلى ترتيباً، واقرأ اتجاه النموذج، ثم أكمل تحليلك الأساسي والفني والسيولة والمخاطر قبل اتخاذ قرارك.', 'يسجل الترتيب العام كيفية ترتيب النموذج لمجموعة الأسهم المؤهلة عند كل أفق، بينما يقدم اتجاه النموذج تصنيفاً مستقلاً: إيجابي أو محايد أو سلبي بالنسبة إلى السوق. وتُنشر هذه المخرجات كمعلومات بحثية عامة لا تراعي أهداف أي زائر بعينه أو ظروفه أو مكونات محفظته أو درجة تحمله للمخاطر أو مدى ملاءمة أي ورقة مالية له.'],
  ['المؤشر يخبرك كيف تحرك السوق. EGX /Alpha يخبرك أين تبدأ البحث داخله.', 'المؤشر يخبرك كيف تحرك السوق. ويعرض EGX /Alpha كيف يرتب النموذج الأسهم المؤهلة مقارنة ببعضها.'],
  ['طبقة قرار مختلفة: ترتيب الأولوية بين الأسهم.', 'طبقة بحثية مختلفة: المقارنة النسبية بين الأسهم.'],
  ['من ضوضاء السوق إلى ترتيب واضح للأولوية.', 'من سوق واسع إلى ترتيب بحثي نسبي.'],
  ['عند قراءتهما معاً يتحول السوق الواسع إلى تسلسل بحث عملي: ماذا يستحق الانتباه أولاً، وماذا يحتاج إلى سياق أكبر، وماذا يمكن تأجيله.', 'وعند قراءتهما معاً يقدمان وصفين متكاملين لحالة النموذج المنشورة دون أن يمثلا احتمالاً للربح أو سعراً مستهدفاً أو توصية بالتعامل.'],
  ['<strong>ابدأ البحث بالترتيب</strong><p>المخرج خريطة للانتباه البحثي، وليس أمراً بالتداول.</p>', '<strong>فسّر الترتيب النسبي</strong><p>يسجل المخرج الموقع النسبي للنموذج عبر مجموعة الأسهم المؤهلة.</p>'],
  ['توزيع الإشارة', 'نشر البحث'],
  ['للتعاون البحثي أو التكامل التقني أو توزيع الإشارة أو الاستفسارات الاستراتيجية:', 'للتعاون البحثي أو نشر البحث أو صيغ البيانات البحثية أو التكنولوجيا أو غيرها من الاستفسارات المؤسسية:'],
  ['للبحث والمعلومات فقط. لا يقدم هذا الموقع العام خدمة تنفيذ.', 'لا تمثل الاستفسارات المؤسسية عرضاً لخدمات الاستشارات الاستثمارية أو الوساطة أو التنفيذ أو إدارة المحافظ أو الحفظ، ولا يقدم الموقع أياً من هذه الخدمات.'],
  ['متوسط السوق مهم. لكنه لا يكفي لاتخاذ قرار بين الأسهم.', 'متوسط السوق مهم. لكنه لا يصف الفروق بين الأسهم منفردة.'],
  ['بينما قرار المستثمر يقع في النهاية بين أسهم منفردة — والفارق بين هذه الاختيارات هو المكان الذي تنفصل فيه الفرصة عن الخسارة.', 'أما السؤال البحثي فيتعلق بالفروق بين الأسهم المنفردة — وهي الفروق التي يحاول النموذج المقطعي وصفها وترتيبها.'],
  ['أي الأسهم تتقدم على غيرها، وأيها يستحق أن يبدأ منه البحث قبل الجلسات التالية؟', 'أي الأسهم تتقدم على غيرها، وكيف تختلف مواقعها النسبية قبل الجلسات التالية؟'],
  ['عندما يبقى منهج البحث أسيراً لمتوسط السوق، يمكن أن يفوّت الأسهم التي تبتعد عنه إيجابياً وأن يظل معرضاً للأسهم التي تتراجع خلفه.', 'عندما يبقى منهج البحث أسيراً لمتوسط السوق، يمكن أن يفوّت الأسهم التي تبتعد عنه إيجابياً أو سلبياً.'],
  ['مجموعة الفرص المؤهلة', 'مجموعة المقارنة المؤهلة'],
  ['بدلاً من اختزال القرار في قاعدة منفردة.', 'بدلاً من اختزال التحليل في قاعدة منفردة.'],
  ['إشارة ذلك اليوم', 'المخرج العام لذلك اليوم']
];

function replaceGuideWorkflow(output, locale) {
  if (!isArabic(locale)) {
    return output.replace(
      /<h2>How to use \/Alpha as a daily research process<\/h2>[\s\S]*?<p>The value of \/Alpha is the order it creates before that work begins\.[\s\S]*?<\/p>/,
      `<h2>How the fields can be read together</h2>
<p>The four fields describe different dimensions of the same published research record.</p>
<p><strong>Forecast Horizon</strong> identifies the forward window represented by the model output. <strong>Relative Rank</strong> records where the stock stands within the eligible comparison universe for that horizon. <strong>Model Direction</strong> provides a separate Positive, Neutral or Negative market-relative classification. <strong>Rank Move</strong> records how the stock's relative position changed from the previous completed public ranking at the same horizon.</p>
<p>Comparing these fields can show whether a stock's relative model placement is concentrated in one horizon, appears across several horizons, or has changed between successive public records. Those observations remain inputs to independent research rather than transaction instructions.</p>`
    );
  }
  return output.replace(
    /<h2>كيف تستخدم \/Alpha في بحثك اليومي؟<\/h2>[\s\S]*?<p>قيمة \/Alpha هنا هي أنه يرتب نقطة البداية\.[\s\S]*?<\/p>/,
    `<h2>كيف تُقرأ الحقول معاً؟</h2>
<p>تصف الحقول الأربعة أبعاداً مختلفة للسجل البحثي المنشور نفسه.</p>
<p><strong>أفق التوقع</strong> يحدد النافذة الزمنية المستقبلية التي يمثلها مخرج النموذج. <strong>الترتيب النسبي</strong> يوضح موقع السهم داخل مجموعة المقارنة المؤهلة لذلك الأفق. <strong>اتجاه النموذج</strong> يقدم تصنيفاً منفصلاً: إيجابي أو محايد أو سلبي بالنسبة إلى السوق. <strong>تغير الترتيب</strong> يسجل تغير الموقع النسبي للسهم مقارنة بالترتيب العام المكتمل السابق للأفق نفسه.</p>
<p>وتسمح مقارنة هذه الحقول بملاحظة ما إذا كان الموقع النسبي للنموذج يتركز في أفق واحد، أو يظهر عبر عدة آفاق، أو تغير بين سجلين عامين متتاليين. وتظل هذه المشاهدات مدخلات للبحث المستقل وليست تعليمات للتعامل.</p>`
  );
}

function strengthenFaqNonAdvice(output, locale) {
  if (!isArabic(locale)) {
    output = output.replace(
      `<p><strong>No.</strong> EGX /Alpha is a research-prioritisation system, not a personalized investment adviser and not an execution system. A high ranking means the model currently prefers that stock relative to more of the eligible alternatives at the selected horizon.</p><p>Your decision still needs to consider price, valuation where relevant, liquidity, company disclosures, technical structure, portfolio exposure, position size and downside risk. Think of /Alpha as answering <strong>“Where should I investigate first?”</strong>, not <strong>“What must I buy?”</strong></p>`,
      `<p><strong>No.</strong> EGX /Alpha publishes general quantitative research classifications. It does not generate personalised recommendations and does not instruct a visitor to buy, sell or hold a security.</p><p>A high Relative Rank means only that the model places that stock higher than more members of the eligible comparison universe at the selected horizon. Positive, Neutral and Negative are market-relative model classifications rather than Buy, Hold or Sell labels. The public website does not assess suitability, portfolio objectives, position size, financial circumstances or an individual visitor's risk tolerance.</p>`
    );
  } else {
    output = output.replace(
      /<p><strong>لا\.<\/strong>[\s\S]*?<strong>«ماذا يجب أن أشتري\؟»<\/strong><\/p>/,
      `<p><strong>لا.</strong> ينشر EGX /Alpha تصنيفات بحثية كمية عامة، ولا يصدر توصيات شخصية ولا يوجه أي زائر إلى شراء ورقة مالية أو بيعها أو الاحتفاظ بها.</p><p>ولا يعني ارتفاع الترتيب النسبي سوى أن النموذج يضع السهم في موقع أعلى من عدد أكبر من أعضاء مجموعة المقارنة المؤهلة عند الأفق المحدد. أما إيجابي ومحايد وسلبي فهي تصنيفات نموذجية نسبية إلى السوق، وليست بدائل لمصطلحات شراء أو احتفاظ أو بيع. ولا يقيّم الموقع العام مدى ملاءمة ورقة مالية لشخص بعينه أو أهداف محفظته أو حجم مركزه أو ظروفه المالية أو درجة تحمله للمخاطر.</p>`
    );
  }
  return output;
}

function neutralizeCaseStudies(output, locale) {
  if (!isArabic(locale)) {
    output = output.replace(
      'Each study begins with forecasts preserved before the subsequent market outcome was known, then validates the simulated trading path against observed EGX prices and trading availability after the forecast matured.',
      'HYPOTHETICAL RESEARCH SIMULATIONS — The studies below examine predefined ranking and portfolio rules using historical or subsequently observed market data under stated assumptions. Simulated results are research evidence only; they do not represent actual client performance, future expected returns or recommendations to employ the simulated strategies.'
    );
    output = output.replace(/A tightly controlled ex-ante test: identical execution and 1D\/3D exits, only stock selection differed\. <strong>#1\+ finished \+22\.31% versus \+20\.80% for raw #1\.<\/strong>/, 'A controlled ex-ante simulation comparing two predefined ranking-selection rules under identical execution and exit assumptions. The paper reports the complete methodology, assumptions and comparative results.');
    output = output.replace(/The preserved ex-ante signal choice reshaped the entire trading path: <strong>#1\+ compounded EGP 1m to \+56\.74%, while raw #1 finished −7\.37%<\/strong> under identical mechanics\./, 'A next-session whole-share simulation examining how two predefined ranking-selection rules produced different historical trading paths under otherwise identical mechanics.');
    output = output.replace(/A capacity-aware portfolio stress test delivered the uncomfortable result: positive-direction filtering reduced turnover, but <strong>raw Top-5 still won, \+15\.61% to \+12\.30%\.<\/strong>/, 'A capacity-aware portfolio simulation comparing a direction-filtered rule with a raw-ranking rule, including turnover and portfolio-path effects.');
  } else {
    output = output.replace(
      'تبدأ كل دراسة بتوقعات محفوظة قبل معرفة النتيجة السوقية اللاحقة، ثم تتحقق من مسار التداول المحاكى باستخدام أسعار EGX وتوافر التداول الفعلي بعد نضج التوقع.',
      'محاكاة بحثية افتراضية — تفحص الدراسات التالية قواعد محددة مسبقاً للترتيب والمحافظ باستخدام بيانات تاريخية أو نتائج سوقية لوحظت لاحقاً وفق افتراضات موضحة في كل دراسة. وتمثل النتائج المحاكاة أدلة بحثية فقط، ولا تمثل أداءً فعلياً لعملاء أو عوائد مستقبلية متوقعة أو توصيات بتطبيق الاستراتيجيات المحاكاة.'
    );
    output = output.replace(/اختبار ex-ante محكوم: التنفيذ وخروج 1D\/3D متطابقان، والاختلاف فقط في اختيار السهم؛ <strong>أنهى #1\+ المحاكاة عند \+22\.31% مقابل \+20\.80% لـ raw #1\.<\/strong>/, 'محاكاة ex-ante محكومة تقارن بين قاعدتين محددتين مسبقاً للاختيار من الترتيب في ظل افتراضات متطابقة للتنفيذ والخروج. وتعرض الدراسة المنهجية الكاملة والافتراضات والنتائج المقارنة.');
    output = output.replace(/غيّر اختيار الإشارة ex-ante المحفوظ مسار التداول بالكامل: <strong>نما حساب #1\+ من مليون جنيه إلى \+56\.74%، بينما أنهى raw #1 عند −7\.37%<\/strong> بالآليات نفسها\./, 'محاكاة لتداول أسهم كاملة في الجلسة التالية تفحص كيف أدت قاعدتان محددتان مسبقاً للاختيار من الترتيب إلى مسارين تاريخيين مختلفين في ظل آليات متطابقة فيما عدا ذلك.');
    output = output.replace(/اختبار محفظة يراعي سعة التداول كشف نتيجة معاكسة للتوقع: خفّض الترشيح الإيجابي معدل الدوران، لكن <strong>raw Top-5 فاز بعائد \+15\.61% مقابل \+12\.30%\.<\/strong>/, 'محاكاة لمحفظة تراعي سعة التداول وتقارن بين قاعدة تستخدم ترشيح اتجاه النموذج وقاعدة تعتمد الترتيب الخام، مع دراسة أثر معدل الدوران ومسار المحفظة.');
  }
  return output;
}

function strengthenFooter(output, locale) {
  if (!isArabic(locale)) {
    const oldTail = 'Any legal obligation remains subject to the mandatory rules applicable to each entity, according to the nature and place of conduct of the relevant activity.';
    const newTail = 'The publication is produced and operated outside the Arab Republic of Egypt and is not offered or directed to persons located in Egypt. Relative Rank, Model Direction and other model outputs are general research classifications and do not constitute recommendations to buy, sell or hold any security. Any legal obligation remains subject to the mandatory rules applicable to each entity, according to the nature and place of conduct of the relevant activity.';
    return output.replaceAll(oldTail, newTail);
  }
  const oldTail = 'ويظل أي التزام قانوني خاضعًا للقواعد الإلزامية المنطبقة على كل جهة وفقًا لطبيعة نشاطها ومكان مزاولة النشاط ذي الصلة.';
  const newTail = 'يُنتج هذا المنشور ويُدار من خارج جمهورية مصر العربية، ولا يُعرض أو يُوجَّه إلى أشخاص موجودين داخل مصر. ويُعد الترتيب النسبي واتجاه النموذج وسائر مخرجاته تصنيفات بحثية عامة، ولا تمثل توصيات بشراء أي ورقة مالية أو بيعها أو الاحتفاظ بها. ويظل أي التزام قانوني خاضعًا للقواعد الإلزامية المنطبقة على كل جهة وفقًا لطبيعة نشاطها ومكان مزاولة النشاط ذي الصلة.';
  return output.replaceAll(oldTail, newTail);
}

function addModelClassificationNotice(output, locale) {
  if (!isArabic(locale)) {
    const source = '<p>Relative Rank compares stocks with each other. Model Direction is separate, so a highly ranked stock can still carry a Neutral or Negative directional classification.</p>';
    const target = `${source}<p class="small-note regulatory-model-note">Positive, Neutral and Negative are market-relative model classifications, not Buy, Hold or Sell recommendations.</p>`;
    return output.replaceAll(source, target);
  }
  const source = '<p>الترتيب النسبي يقارن الأسهم ببعضها. أما اتجاه النموذج فهو منفصل، لذلك قد يحمل سهم مرتفع الترتيب تصنيفاً محايداً أو سلبياً.</p>';
  const target = `${source}<p class="small-note regulatory-model-note">إيجابي ومحايد وسلبي تصنيفات نموذجية نسبية إلى السوق، وليست توصيات شراء أو احتفاظ أو بيع.</p>`;
  return output.replaceAll(source, target);
}

function replaceLiveHero(output, locale) {
  if (!isArabic(locale)) {
    if (!output.includes('Which EGX stocks deserve your attention tomorrow?')) return output;
    output = output.replaceAll('Which EGX stocks deserve your attention tomorrow?', 'How does EGX /Alpha rank the eligible EGX universe for the sessions ahead?');
    return output.replace(
      /<p class="control-deck-lede">[\s\S]*?<\/p>/,
      '<p class="control-deck-lede">After each completed EGX session, EGX /Alpha publishes a cross-sectional research ranking of the eligible stocks it can evaluate across 1, 3, 5 and 10 trading-day horizons. A higher position means the model places that stock ahead of more eligible stocks in its relative forward ordering. Model Direction is a separate Positive, Neutral or Negative classification. <strong>Relative Rank and Model Direction are general model outputs intended for research and informational use; they are not recommendations to buy, sell or hold any security.</strong></p>'
    );
  }
  if (!output.includes('أي أسهم EGX تستحق انتباهك غداً؟')) return output;
  output = output.replaceAll('أي أسهم EGX تستحق انتباهك غداً؟', 'كيف يرتب EGX /Alpha أسهم EGX المؤهلة للجلسات المقبلة؟');
  return output.replace(
    /<p class="control-deck-lede">[\s\S]*?<\/p>/,
    '<p class="control-deck-lede">بعد كل جلسة مكتملة في البورصة المصرية، ينشر EGX /Alpha ترتيباً بحثياً نسبياً للأسهم المؤهلة التي يستطيع تقييمها عبر آفاق 1 و3 و5 و10 جلسات تداول. ويعني المركز الأعلى أن النموذج يضع السهم أمام عدد أكبر من الأسهم المؤهلة في ترتيبه المستقبلي النسبي. أما اتجاه النموذج فهو تصنيف منفصل: إيجابي أو محايد أو سلبي. <strong>الترتيب النسبي واتجاه النموذج مخرجات نموذجية عامة مخصصة للبحث والمعلومات، وليسا توصيات بشراء أي ورقة مالية أو بيعها أو الاحتفاظ بها.</strong></p>'
  );
}

export function applyRegulatoryText(value, locale = 'en') {
  return replaceAll(value, isArabic(locale) ? AR_TEXT_PAIRS : EN_TEXT_PAIRS);
}

export function applyRegulatoryHtml(value, locale = 'en') {
  let output = String(value ?? '');
  output = replaceLiveHero(output, locale);
  output = replaceAll(output, isArabic(locale) ? AR_HTML_PAIRS : EN_HTML_PAIRS);

  if (!isArabic(locale)) {
    output = output.replace(
      'After every completed EGX session, EGX /Alpha ranks the eligible stocks it can evaluate for the next 1, 3, 5 and 10 trading sessions. Read that ranking as a daily order of research priority: the higher a stock appears, the stronger the model’s relative preference for it at that horizon.',
      'After every completed EGX session, EGX /Alpha ranks the eligible stocks it can evaluate across 1, 3, 5 and 10 trading-day horizons. The ranking describes the model’s relative ordering of that eligible universe for each horizon. A higher position means a higher placement in that model ordering; it does not by itself imply a positive absolute return or a recommendation to transact.'
    );
  } else {
    output = output.replace(
      'بعد كل جلسة مكتملة في البورصة المصرية، يرتب EGX /Alpha الأسهم المؤهلة التي يستطيع تقييمها للجلسة التالية ولآفاق 3 و5 و10 جلسات تداول. اقرأ هذا الترتيب كقائمة يومية لأولويات البحث: كلما ارتفع مركز السهم، كان تفضيل النموذج النسبي له أقوى عند ذلك الأفق.',
      'بعد كل جلسة مكتملة في البورصة المصرية، يرتب EGX /Alpha الأسهم المؤهلة التي يستطيع تقييمها عبر آفاق 1 و3 و5 و10 جلسات تداول. ويصف هذا الترتيب موقع كل سهم داخل الترتيب النسبي للنموذج عند الأفق المحدد. ولا يعني المركز الأعلى بذاته عائداً مطلقاً موجباً أو توصية بالتعامل.'
    );
  }

  output = replaceGuideWorkflow(output, locale);
  output = strengthenFaqNonAdvice(output, locale);
  output = neutralizeCaseStudies(output, locale);
  output = addModelClassificationNotice(output, locale);
  output = strengthenFooter(output, locale);
  output = applyRegulatoryText(output, locale);
  return output;
}
