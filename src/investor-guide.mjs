import { abs, htmlShell, rel, siteFooter, siteHeader } from './templates.mjs';

const GUIDE_CSS = String.raw`
.page-investor-guide .guide-shell{width:min(100%,980px);margin:34px auto 0}
.page-investor-guide .guide-hero{padding:clamp(30px,6vw,62px);border:1px solid var(--line);border-radius:14px;background:var(--surface)}
.page-investor-guide .guide-hero h1{max-width:19ch;margin:12px 0 18px;font-size:clamp(2.35rem,5.5vw,4.8rem);line-height:.98}
.page-investor-guide .guide-hero .lede{max-width:76ch;margin:0;color:var(--soft);font-size:clamp(1rem,1.3vw,1.14rem);line-height:1.72}
.page-investor-guide .guide-market-context{margin:24px 0 0;padding:14px 16px;border-left:3px solid var(--blue);background:var(--surface-2);color:var(--muted);font-size:.82rem;line-height:1.6}
.page-investor-guide .guide-market-context strong{color:var(--text)}
.page-investor-guide .guide-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
.page-investor-guide .guide-meta a,.page-investor-guide .guide-meta span{padding:8px 10px;border:1px solid var(--line);border-radius:999px;color:var(--soft);font-family:var(--mono);font-size:.62rem;letter-spacing:.04em}
.page-investor-guide .guide-meta a:hover{border-color:var(--blue);color:var(--blue)}
.page-investor-guide .guide-article{margin-top:16px;padding:clamp(26px,5.5vw,58px);border:1px solid var(--line);border-radius:14px;background:var(--surface)}
.page-investor-guide .guide-article h2{max-width:78ch;margin:2.2em auto .8em;color:var(--text);font-size:clamp(1.35rem,2.2vw,1.85rem);line-height:1.2}
.page-investor-guide .guide-article h2:first-child{margin-top:0}
.page-investor-guide .guide-article p{max-width:78ch;margin:0 auto 1.35em;color:var(--soft);font-size:clamp(.97rem,1.25vw,1.08rem);line-height:1.82}
.page-investor-guide .guide-article a{color:var(--text);text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--blue) 55%,transparent);text-underline-offset:3px}
.page-investor-guide .guide-article a:hover{color:var(--blue)}
.page-investor-guide .guide-article em{color:var(--muted)}
.page-investor-guide .guide-question,.page-investor-guide .guide-reading{max-width:78ch;margin:1.5em auto;padding:18px 20px;border:1px solid var(--line);border-radius:12px;background:var(--surface-2)}
.page-investor-guide .guide-question strong,.page-investor-guide .guide-reading strong{color:var(--text)}
.page-investor-guide .guide-question p,.page-investor-guide .guide-reading p{margin:0;color:var(--soft);font-size:clamp(.97rem,1.25vw,1.08rem);line-height:1.75}
.page-investor-guide .guide-steps{max-width:78ch;margin:0 auto 1.4em;padding-left:1.35em;color:var(--soft)}
.page-investor-guide .guide-steps li{margin:.7em 0;padding-left:.25em;font-size:clamp(.97rem,1.25vw,1.08rem);line-height:1.72}
.page-investor-guide.locale-ar .guide-market-context{border-left:1px solid var(--line);border-right:3px solid var(--blue)}
.page-investor-guide.locale-ar .guide-steps{padding-left:0;padding-right:1.35em}
.page-investor-guide.locale-ar .guide-steps li{padding-left:0;padding-right:.25em}
.page-investor-guide .official-resources{margin-top:16px;padding:22px 24px;border:1px solid var(--line);border-radius:12px;background:var(--surface-2)}
.page-investor-guide .official-resources span{display:block;color:var(--blue);font-family:var(--mono);font-size:.58rem;font-weight:800;letter-spacing:.07em}
.page-investor-guide .official-resources p{margin:8px 0 0;color:var(--muted);font-size:.79rem;line-height:1.6}
.page-investor-guide .official-resources a{color:var(--text);text-decoration:underline;text-underline-offset:3px}
@media(max-width:700px){.page-investor-guide .guide-shell{margin-top:20px}.page-investor-guide .guide-hero,.page-investor-guide .guide-article{padding-left:20px;padding-right:20px}.page-investor-guide .guide-hero h1{max-width:none}}
`;

const COPY = {
  en: {
    title: 'How to Read EGX /Alpha | Investor Guide | EGX Research',
    description: 'What EGX /Alpha is designed to answer, why its relative ranking is useful for Egyptian investors, and how to read the daily rank, Model Direction, horizon and rank movement.',
    eyebrow: 'RETAIL INVESTOR GUIDE',
    heading: 'What EGX /Alpha Answers — and How to Read the Daily Ranking',
    lede: 'EGX /Alpha does not try to tell you that a stock is simply “good” or that it must rise. It is designed to rank eligible EGX stocks by a model score learned from their future performance relative to the market baseline used by the engine.',
    context: '<strong>Start with the question.</strong> The value of /Alpha is not an isolated opinion on one ticker. It is a consistent way to decide where the model places each eligible stock relative to the other opportunities available at the same market cutoff.',
    latest: 'LATEST RANKING',
    method: 'RESEARCH METHOD',
    history: 'MODEL HISTORY',
    search: 'SEARCH STOCKS',
    officialLabel: 'OFFICIAL MARKET RESOURCES',
    officialText: 'For official exchange and regulatory information, consult the Egyptian Exchange (EGX) and the Financial Regulatory Authority capital-market resources.'
  },
  ar: {
    title: 'كيف تقرأ EGX /Alpha | دليل المستثمر | EGX Research',
    description: 'ما السؤال الذي صُمم EGX /Alpha للإجابة عنه، ولماذا يفيد ترتيبه النسبي المستثمر في البورصة المصرية، وكيف تقرأ الترتيب اليومي واتجاه النموذج والأفق وتغير الترتيب.',
    eyebrow: 'دليل المستثمر الفرد',
    heading: 'ما السؤال الذي يجيب عنه EGX /Alpha؟ وكيف تقرأ ترتيب كل يوم؟',
    lede: 'لا يحاول EGX /Alpha أن يقول لك إن سهماً ما «جيد» ببساطة أو أنه لا بد أن يصعد. وظيفته هي ترتيب أسهم EGX المؤهلة وفق درجة يتعلمها النموذج من أدائها المستقبلي مقارنة بمرجع السوق الذي يستخدمه المحرك.',
    context: '<strong>ابدأ بالسؤال.</strong> قيمة /Alpha ليست في إعطاء رأي منفصل في سهم واحد، بل في تقديم طريقة ثابتة لمعرفة أين يضع النموذج كل سهم مؤهل مقارنة بالفرص الأخرى المتاحة عند نفس وقت إغلاق المعلومات.',
    latest: 'أحدث ترتيب',
    method: 'منهج البحث',
    history: 'سجل النموذج',
    search: 'بحث الأسهم',
    officialLabel: 'مصادر السوق الرسمية',
    officialText: 'للمعلومات الرسمية عن البورصة والرقابة، راجع البورصة المصرية (EGX) وموارد سوق المال لدى الهيئة العامة للرقابة المالية.'
  }
};

function articleSchema(locale, copy) {
  const path = locale === 'ar' ? '/ar/investor-guide/' : '/investor-guide/';
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: copy.heading,
    description: copy.description,
    mainEntityOfPage: abs(path),
    url: abs(path),
    datePublished: '2026-08-17',
    dateModified: '2026-08-18',
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'EGX Research', url: abs(locale === 'ar' ? '/ar/' : '/') },
    publisher: { '@type': 'Organization', name: 'EGX Research', url: abs(locale === 'ar' ? '/ar/' : '/') },
    keywords: locale === 'ar'
      ? ['EGX Research', 'EGX /Alpha', 'البورصة المصرية', 'ترتيب الأسهم', 'التعلم العميق', 'تحليل الأسهم']
      : ['EGX Research', 'EGX /Alpha', 'Egyptian Exchange', 'EGX stocks', 'stock ranking', 'deep learning', 'stock analysis'],
    about: [
      { '@type': 'Thing', name: 'Egyptian Exchange', alternateName: 'البورصة المصرية' },
      { '@type': 'Thing', name: 'Cross-sectional stock ranking' },
      { '@type': 'Thing', name: 'Quantitative investment research' }
    ]
  };
}

function englishArticle() {
  return `
<h2>The question the engine is built to answer</h2>
<p>After an EGX session closes, an investor can have dozens of possible stocks to investigate. The difficult question is not simply, “Will this stock rise?” The question /Alpha is built around is: <strong>given the same completed market information, which eligible EGX stocks should receive higher model scores than the others for the next 1, 3, 5 or 10 trading sessions?</strong></p>
<div class="guide-question"><p><strong>In plain language:</strong> /Alpha is trying to order the eligible market from the stocks its model currently prefers most to those it prefers least, separately for each forecast horizon.</p></div>
<p>That ordering has a specific training target. For each historical stock, date and horizon, the engine calculates the stock's forward return and subtracts the forward market baseline built from the modeled market data. The result is a <strong>market-relative forward return</strong>. A higher target means the stock later performed better relative to that market baseline; a lower target means it performed worse relative to it. This is not the same as asking whether the stock price itself went up or down.</p>
<p>The ranking is learned directly during training. Stocks from the same historical date are compared in pairs. If stock A later achieved a higher market-relative forward return than stock B, the ranking loss penalizes the model when it gives B a higher score than A. The training objective therefore teaches the network not only to estimate a forward outcome, but also to put stocks in the correct relative order.</p>
<p>The model does not look only at one stock's recent price. The current engine uses a 32-session lookback and combines the stock's return, volatility, price and volume behavior with liquidity information, market-relative and sector-relative behavior, liquidity-tier context, market and volume regimes, and learned structural embeddings derived from historical relationships between symbols. In live execution, each eligible stock receives model outputs and the resulting ranking scores are then ordered across the complete eligible set for each horizon.</p>

<h2>Why that is valuable for an EGX investor</h2>
<p>The practical problem for most investors is scarcity of attention. You cannot research every listed stock with equal depth every evening. /Alpha turns a broad eligible universe into a <strong>research priority list</strong>. It gives every published stock the same model treatment at the same information cutoff, then shows where each one stands relative to the others.</p>
<p>This makes the ranking useful even when you already have your own fundamental or technical process. If several stocks look interesting, /Alpha gives you another independent question to ask: <strong>which of these names is the model currently placing higher relative to the rest of the eligible EGX set for my intended time horizon?</strong> The answer is not a trade instruction; it is a way to allocate research attention more systematically.</p>
<p>Eligibility matters. The live engine only ranks symbols that satisfy its model and data contracts, including membership in the trained domestic universe, sufficient recent history, complete required features, recognized sector and liquidity information, and the required learned embedding. A symbol that cannot be evaluated safely is excluded rather than filled with invented data. The denominator shown in the daily ranking is therefore the actual comparison set published for that session.</p>

<h2>How to read the daily ranking</h2>
<p><strong>Relative Rank</strong> is the simplest field. If the page shows <strong>#3 / 84</strong> at 5D, that means the stock received the third-highest ranking score among the 84 eligible stocks published for the 5-session horizon. It does <em>not</em> mean an 84% or 97% probability of profit, and it does not mean the model expects a specific percentage return.</p>
<p><strong>Model Direction</strong> is a separate model output published as Positive, Neutral or Negative. The direction head was trained on whether the stock's market-relative forward return was above zero — in other words, whether it beat the engine's market baseline over that horizon — so the label should not be interpreted as a guarantee that the stock's absolute price will rise or fall. Rank tells you <em>where the stock sits versus the other eligible stocks</em>; Model Direction gives a separate classification of the model's forward relative view.</p>
<p><strong>Forecast Horizon</strong> matters because 1D, 3D, 5D and 10D are separate model outputs. A stock can rank highly at 1D and much lower at 10D without any contradiction. The model is answering a different forward-ranking question at each horizon. The 5D horizon is the product's primary research view, but the neighboring horizons show whether the model's preference is short-lived or persists across several windows.</p>
<p><strong>Rank Move</strong> compares today's position with the previous completed public ranking at the same horizon. A move from #12 to #4 means the stock improved eight places in the model's relative ordering. It does not mean the price rose eight places, eight percent or any fixed amount. It only describes how the model ranking changed.</p>
<div class="guide-reading"><p><strong>Example:</strong> “#2 / 84 · Positive · ↑ 5 places · 5D” means the stock is second in the current 5-session ranking, carries a Positive Model Direction classification, and improved five ranking positions versus the previous completed 5D record. None of those fields guarantees a profitable trade.</p></div>
<p>When a stock stays near the top across several horizons, that tells you the model's relative preference is present in more than one forward window. It does not convert the ranking into a probability or certainty. Likewise, a sharp improvement in rank is evidence of a changing model view, not proof that the market must follow it.</p>

<h2>What the ranking does not decide for you</h2>
<p>/Alpha does not know your entry price, portfolio size, risk tolerance or concentration limits. It does not decide whether today's opening price offers an attractive trade, whether your order is suitable for the available liquidity, or whether a company disclosure released after the model cutoff changes the investment case. A high rank can justify deeper investigation; it cannot replace the rest of the investment decision.</p>
<p>That is why the most useful workflow is to combine the model's relative ordering with ordinary EGX due diligence: liquidity and volume, current disclosures, price structure, sector exposure, valuation where relevant, position sizing and downside risk. The engine narrows the field; the investor still decides what to do with the evidence.</p>

<h2>How to use /Alpha as a daily research process</h2>
<ol class="guide-steps">
<li>Choose the horizon that best matches the decision you are considering: 1, 3, 5 or 10 trading sessions.</li>
<li>Read Relative Rank as a priority position inside that day's eligible comparison set, not as a probability or target return.</li>
<li>Read Model Direction separately from rank and check whether the two outputs reinforce or complicate the same idea.</li>
<li>Check Rank Move and the neighboring horizons to see whether the model view is persistent, newly improving or confined to one window.</li>
<li>Only then move to the normal investment questions: price, liquidity, disclosures, technical structure, portfolio exposure and risk.</li>
</ol>

<h2>Why the public record matters</h2>
<p>The <a href="${rel('/archive/')}">archive</a> preserves dated rankings, and the <a href="${rel('/search/')}">stock history</a> lets investors inspect how a symbol's rank and direction changed over time. The <a href="${rel('/methodology/')}">methodology page</a> separately publishes historical held-out ranking evidence and maturity-gated live evidence. This matters because a forward-looking model should be judged from forecasts that were actually available before the outcome was known, not from explanations reconstructed afterward.</p>
<p>The engine's recorded validation is deliberately ranking-focused: promotion requires evidence such as rank correlation and top-versus-bottom realized spreads, including sector-neutral and liquidity-neutral checks. These historical effects are modest rather than certain, and live evidence is allowed to mature before it is treated as established. That is the appropriate way to read /Alpha: as a disciplined quantitative research signal whose usefulness must continue to earn support from realized evidence.</p>
<p><em>EGX /Alpha is published for research and informational purposes. Its rankings and directional classifications are not execution instructions, guarantees of future returns, target prices or personalized investment advice.</em></p>`;
}

function arabicArticle() {
  return `
<h2>ما السؤال الذي صُمم المحرك للإجابة عنه؟</h2>
<p>بعد إغلاق جلسة EGX، قد يكون أمام المستثمر عشرات الأسهم التي يمكن بحثها. السؤال الصعب ليس فقط: «هل سيصعد هذا السهم؟». السؤال الذي بُني عليه /Alpha هو: <strong>باستخدام نفس معلومات السوق المكتملة، أي الأسهم المصرية المؤهلة يجب أن تحصل من النموذج على درجات أعلى من غيرها خلال الجلسة التالية أو خلال 3 أو 5 أو 10 جلسات تداول؟</strong></p>
<div class="guide-question"><p><strong>بأبسط صورة:</strong> يحاول /Alpha ترتيب السوق المؤهل من الأسهم التي يفضلها النموذج حالياً إلى الأسهم التي يفضلها بدرجة أقل، مع ترتيب مستقل لكل أفق زمني.</p></div>
<p>هذا الترتيب له هدف تدريبي محدد. لكل سهم ولكل تاريخ ولكل أفق، يحسب المحرك عائد السهم المستقبلي ثم يطرح منه مرجع السوق المستقبلي الذي يبنيه من بيانات السوق التي يستخدمها النموذج. الناتج هو <strong>عائد مستقبلي نسبي إلى السوق</strong>. إذا كان الهدف أعلى فهذا يعني أن السهم حقق لاحقاً أداءً أفضل بالنسبة إلى هذا المرجع، وإذا كان أقل فهذا يعني أنه كان أضعف منه. هذا ليس نفس سؤال ما إذا كان سعر السهم نفسه قد صعد أو هبط.</p>
<p>والترتيب نفسه جزء مباشر من التدريب. يقارن المحرك أسهماً من نفس التاريخ التاريخي في أزواج. فإذا حقق السهم A لاحقاً عائداً نسبياً أعلى من السهم B، تُعاقب دالة خسارة الترتيب النموذج إذا أعطى B درجة أعلى من A. لذلك لا يتعلم النموذج مجرد رقم مستقبلي لكل سهم؛ بل يتعلم أيضاً كيف يرتب الأسهم بالنسبة إلى بعضها.</p>
<p>ولا ينظر النموذج إلى حركة سعر السهم وحدها. يستخدم المحرك الحالي آخر 32 جلسة، ويجمع بين العوائد والتذبذب وسلوك السعر وحجم التداول والسيولة، وبين أداء السهم بالنسبة إلى السوق والقطاع وفئة السيولة، وحالات السوق وأحجام التداول، وتمثيلات متعلمة للعلاقات التاريخية بين الرموز. وفي التشغيل اليومي يحصل كل سهم مؤهل على مخرجات النموذج، ثم تُجمع درجات الترتيب وتُرتب على كامل مجموعة الأسهم المؤهلة داخل كل أفق.</p>

<h2>لماذا هذا مفيد للمستثمر في EGX؟</h2>
<p>المشكلة العملية عند معظم المستثمرين هي محدودية الوقت والانتباه. لا يمكن بحث كل سهم مدرج بنفس العمق كل مساء. يحول /Alpha مجموعة كبيرة من الأسهم المؤهلة إلى <strong>قائمة أولويات للبحث</strong>. كل سهم منشور يمر بنفس قواعد النموذج وعند نفس نقطة المعلومات، ثم يظهر موقعه بالنسبة إلى بقية الأسهم.</p>
<p>لذلك يظل الترتيب مفيداً حتى إذا كان لديك تحليلك الأساسي أو الفني الخاص. إذا كان أمامك عدة أسهم تبدو مثيرة للاهتمام، يضيف /Alpha سؤالاً مستقلاً: <strong>أي هذه الأسهم يضعه النموذج حالياً في مرتبة أعلى مقارنة ببقية أسهم EGX المؤهلة على الأفق الذي يهمني؟</strong> الإجابة ليست أمراً بالشراء أو البيع؛ بل طريقة أكثر انضباطاً لتحديد أين تبدأ البحث.</p>
<p>ومعنى «مؤهل» مهم. المحرك الحي لا يرتب إلا الرموز التي تستوفي عقود النموذج والبيانات، ومنها أن تكون ضمن مجموعة EGX المحلية التي تدرب عليها النموذج، وأن يتوافر لها سجل حديث كافٍ وخصائص مكتملة ومعلومات قطاع وسيولة معروفة والتمثيل المتعلم المطلوب. إذا تعذر تقييم سهم بأمان يُستبعد بدلاً من اختلاق بيانات له. لذلك فإن المقام الظاهر في الترتيب اليومي هو عدد الأسهم الفعلي الذي دخل مجموعة المقارنة المنشورة في تلك الجلسة.</p>

<h2>كيف تقرأ ترتيب كل يوم؟</h2>
<p><strong>الترتيب النسبي</strong> هو أبسط خانة. إذا ظهر <strong>#3 / 84</strong> عند أفق 5D، فهذا يعني أن السهم حصل على ثالث أعلى درجة ترتيب بين 84 سهماً مؤهلاً منشوراً لأفق الخمس جلسات. لا يعني ذلك احتمال ربح 84% أو 97%، ولا يعني أن النموذج يتوقع نسبة عائد محددة.</p>
<p><strong>اتجاه النموذج</strong> مخرج منفصل يُنشر على شكل إيجابي أو محايد أو سلبي. رأس الاتجاه في النموذج تدرب على ما إذا كان العائد المستقبلي النسبي للسوق أعلى من الصفر — أي ما إذا كان السهم قد تفوق على مرجع السوق الذي يستخدمه المحرك خلال ذلك الأفق — لذلك لا ينبغي قراءة هذا التصنيف كضمان بأن السعر المطلق للسهم سيصعد أو يهبط. الترتيب يخبرك <em>أين يقع السهم بالنسبة إلى بقية الأسهم المؤهلة</em>، أما اتجاه النموذج فيضيف تصنيفاً منفصلاً لرؤيته المستقبلية النسبية.</p>
<p><strong>أفق التوقع</strong> مهم لأن 1D و3D و5D و10D مخرجات منفصلة للنموذج. قد يكون السهم مرتفع الترتيب عند 1D وأقل بكثير عند 10D من دون أي تناقض؛ فالنموذج يجيب عن سؤال ترتيب مستقبلي مختلف في كل أفق. أفق 5D هو الرؤية البحثية الرئيسية للمنتج، بينما تساعد الآفاق المجاورة على معرفة ما إذا كان تفضيل النموذج قصير الأجل أم ممتداً عبر أكثر من نافذة.</p>
<p><strong>تغير الترتيب</strong> يقارن مركز اليوم بآخر ترتيب عام مكتمل للأفق نفسه. الانتقال من #12 إلى #4 يعني أن السهم تحسن ثمانية مراكز داخل ترتيب النموذج. لا يعني أن السعر ارتفع ثمانية مراكز أو 8% أو أي مقدار ثابت؛ بل يصف فقط تغير موقع السهم في ترتيب النموذج.</p>
<div class="guide-reading"><p><strong>مثال:</strong> «#2 / 84 · إيجابي · ↑ 5 مراكز · 5D» يعني أن السهم في المركز الثاني في ترتيب الخمس جلسات الحالي، ويحمل تصنيف اتجاه إيجابياً من النموذج، وتحسن خمسة مراكز مقارنة بالسجل المكتمل السابق لأفق 5D. لا تضمن أي من هذه الخانات أن الصفقة ستكون رابحة.</p></div>
<p>إذا ظل سهم قرب القمة عبر أكثر من أفق، فهذا يعني أن التفضيل النسبي للنموذج يظهر في أكثر من نافذة مستقبلية. لكنه لا يحول الترتيب إلى احتمال أو يقين. وبالمثل، الصعود السريع في الترتيب يعني أن رؤية النموذج النسبية تغيرت، لا أن السوق ملزم بأن يتحرك بالطريقة نفسها.</p>

<h2>ما الذي لا يقرره الترتيب نيابة عنك؟</h2>
<p>لا يعرف /Alpha سعر دخولك أو حجم محفظتك أو قدرتك على تحمل المخاطر أو حدود التركيز لديك. ولا يقرر ما إذا كان سعر الافتتاح اليوم مناسباً للدخول، أو ما إذا كانت السيولة تكفي لحجم أمر معين، أو ما إذا كان إفصاح صدر بعد وقت إغلاق معلومات النموذج قد غير حالة الاستثمار. الترتيب المرتفع قد يبرر بحثاً أعمق، لكنه لا يحل محل قرار الاستثمار الكامل.</p>
<p>لذلك تكون الاستفادة الأفضل عند جمع الترتيب النسبي للنموذج مع الفحص المعتاد في EGX: السيولة وحجم التداول، الإفصاحات الحالية، هيكل السعر، التعرض القطاعي، التقييم عند الحاجة، حجم المركز ومخاطر الهبوط. المحرك يضيق مجال البحث؛ والمستثمر هو من يقرر ماذا يفعل بالأدلة.</p>

<h2>طريقة عملية لاستخدام /Alpha كل يوم</h2>
<ol class="guide-steps">
<li>اختر الأفق الأقرب إلى القرار الذي تفكر فيه: جلسة واحدة أو 3 أو 5 أو 10 جلسات تداول.</li>
<li>اقرأ الترتيب النسبي كموقع أولوية داخل مجموعة المقارنة المؤهلة لذلك اليوم، وليس كاحتمال ربح أو عائد مستهدف.</li>
<li>اقرأ اتجاه النموذج منفصلاً عن الترتيب، ولاحظ هل المخرجان يدعمان الفكرة نفسها أم يضيفان تعقيداً إليها.</li>
<li>راجع تغير الترتيب والآفاق المجاورة لمعرفة هل رؤية النموذج مستمرة أم تحسنت حديثاً أم تتركز في نافذة واحدة فقط.</li>
<li>بعد ذلك فقط ارجع إلى أسئلة الاستثمار المعتادة: السعر والسيولة والإفصاحات والبنية الفنية والتعرض في المحفظة والمخاطر.</li>
</ol>

<h2>لماذا يهم وجود سجل عام محفوظ؟</h2>
<p>يحفظ <a href="${rel('/archive/')}">الأرشيف</a> الترتيبات المؤرخة، ويتيح <a href="${rel('/search/')}">سجل السهم</a> فحص تغير ترتيبه واتجاهه بمرور الوقت. كما تعرض <a href="${rel('/methodology/')}">صفحة المنهجية</a> أدلة الاختبار التاريخي خارج عينة التدريب والأدلة الحية المشروطة بنضجها كلٌ على حدة. وهذا مهم لأن أي نموذج مستقبلي يجب أن يُحكم عليه من توقعات كانت موجودة فعلاً قبل معرفة النتيجة، لا من تفسيرات أعيد بناؤها بعد ذلك.</p>
<p>والتحقق المسجل للمحرك يركز عمداً على جودة الترتيب: تمرير النموذج يتطلب أدلة مثل ارتباط الترتيب بفروق الأداء الفعلي بين أعلى وأسفل الترتيب، مع اختبارات تراعي القطاع والسيولة. هذه التأثيرات التاريخية محدودة وليست يقيناً، كما يُسمح للأدلة الحية بأن تنضج قبل معاملتها كأداء مستقر. وهذه هي القراءة الصحيحة لـ /Alpha: إشارة بحث كمي منضبطة يجب أن تستمر فائدتها في اكتساب الدعم من النتائج الفعلية.</p>
<p><em>يُنشر EGX /Alpha لأغراض البحث والمعلومات. ترتيباته وتصنيفات اتجاه النموذج ليست تعليمات تنفيذ أو ضمانات لعوائد مستقبلية أو أسعاراً مستهدفة أو نصيحة استثمارية شخصية.</em></p>`;
}

export function investorGuidePage(locale = 'en') {
  const lang = String(locale || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  const copy = COPY[lang];
  const schema = JSON.stringify(articleSchema(lang, copy)).replaceAll('</script', '<\\/script');
  const article = lang === 'ar' ? arabicArticle() : englishArticle();
  const officialText = lang === 'ar'
    ? `للمعلومات الرسمية عن البورصة والرقابة، راجع <a href="https://www.egx.com.eg/ar/HomePage.aspx" target="_blank" rel="noopener noreferrer external">البورصة المصرية (EGX)</a> و<a href="https://fra.gov.eg/%D8%B3%D9%88%D9%82-%D8%A7%D9%84%D9%85%D8%A7%D9%84/" target="_blank" rel="noopener noreferrer external">موارد سوق المال لدى الهيئة العامة للرقابة المالية</a>.`
    : `For official exchange and regulatory information, consult the <a href="https://www.egx.com.eg/en/HomePage.aspx" target="_blank" rel="noopener noreferrer external">Egyptian Exchange (EGX)</a> and the <a href="https://fra.gov.eg/en/%D8%B3%D9%88%D9%82-%D8%A7%D9%84%D9%85%D8%A7%D9%84/" target="_blank" rel="noopener noreferrer external">Financial Regulatory Authority capital-market resources</a>.`;
  return htmlShell({
    title: copy.title,
    description: copy.description,
    canonicalPath: '/investor-guide/',
    pageClass: 'page-investor-guide',
    locale: lang,
    body: `<style id="investor-guide-styles">${GUIDE_CSS}</style><script type="application/ld+json">${schema}</script><main class="site-shell">${siteHeader(lang === 'ar' ? 'دليل المستثمر' : 'INVESTOR GUIDE', 'guide')}<div class="guide-shell"><header class="guide-hero"><p class="eyebrow">${copy.eyebrow}</p><h1>${copy.heading}</h1><p class="lede">${copy.lede}</p><p class="guide-market-context">${copy.context}</p><div class="guide-meta"><a href="${rel('/today/')}">${copy.latest}</a><a href="${rel('/methodology/')}">${copy.method}</a><a href="${rel('/archive/')}">${copy.history}</a><a href="${rel('/search/')}">${copy.search}</a></div></header><article class="guide-article">${article}</article><aside class="official-resources"><span>${copy.officialLabel}</span><p>${officialText}</p></aside></div>${siteFooter()}</main>`
  });
}
