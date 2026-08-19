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
    description: 'A practical guide to what EGX /Alpha ranks, what Relative Rank and Model Direction mean, and how to use the daily signal as a research priority list.',
    eyebrow: 'RETAIL INVESTOR GUIDE',
    heading: 'What EGX /Alpha Answers — and How to Read the Daily Ranking',
    lede: 'After every completed EGX session, EGX /Alpha ranks the eligible stocks it can evaluate for the next 1, 3, 5 and 10 trading sessions. Read that ranking as a daily order of research priority: the higher a stock appears, the stronger the model’s relative preference for it at that horizon.',
    context: '<strong>Start here.</strong> When many EGX stocks are competing for your attention, /Alpha answers a practical question: where does the model say your research should begin?',
    latest: 'LATEST RANKING',
    method: 'RESEARCH METHOD',
    history: 'MODEL HISTORY',
    search: 'SEARCH STOCKS',
    officialLabel: 'OFFICIAL MARKET RESOURCES'
  },
  ar: {
    title: 'كيف تقرأ EGX /Alpha | دليل المستثمر | EGX Research',
    description: 'دليل عملي لفهم ما يرتبه EGX /Alpha، ومعنى الترتيب النسبي واتجاه النموذج، وكيف تستخدم الإشارة اليومية لتحديد أولويات البحث.',
    eyebrow: 'دليل المستثمر الفرد',
    heading: 'ما السؤال الذي يجيب عنه EGX /Alpha؟ وكيف تقرأ ترتيب كل يوم؟',
    lede: 'بعد كل جلسة مكتملة في البورصة المصرية، يرتب EGX /Alpha الأسهم المؤهلة التي يستطيع تقييمها للجلسة التالية ولآفاق 3 و5 و10 جلسات تداول. اقرأ هذا الترتيب كقائمة يومية لأولويات البحث: كلما ارتفع مركز السهم، كان تفضيل النموذج النسبي له أقوى عند ذلك الأفق.',
    context: '<strong>ابدأ من هنا.</strong> عندما تكون أمامك أسهم كثيرة تتنافس على انتباهك، يجيب /Alpha عن سؤال عملي: من أين يقول النموذج إن بحثك يجب أن يبدأ؟',
    latest: 'أحدث ترتيب',
    method: 'منهج البحث',
    history: 'سجل النموذج',
    search: 'بحث الأسهم',
    officialLabel: 'مصادر السوق الرسمية'
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
    dateModified: '2026-08-19',
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
<p>Every completed EGX session leaves more possible ideas than any investor can examine properly. EGX /Alpha reduces that field to an ordered view. For each of its four horizons, it ranks the eligible stocks from the model’s strongest relative preference to its weakest.</p>
<p>The ranking is relative for a reason. The engine learns from <strong>market-relative forward return</strong>: how a stock performs over a forward period compared with the market baseline used by the model over the same period. A higher position therefore means the model places that stock ahead of more of the eligible alternatives. It is not a promise about the stock’s absolute price.</p>
<p>Only stocks the engine can evaluate with the required current information enter that day’s comparison. If a stock cannot be evaluated safely, it is left out. That is why the denominator can change from one session to another: it is the number of stocks actually included in that published ranking.</p>
<div class="guide-question"><p><strong>Keep one rule in mind:</strong> the higher the rank, the stronger EGX /Alpha’s relative preference for that stock at the selected horizon.</p></div>

<h2>How to read the daily ranking</h2>
<p><strong>Relative Rank</strong> tells you where the stock stands inside that day’s eligible market. If a stock is <strong>#3 / 84</strong>, only two of the 84 published stocks rank above it for that horizon. Rank is an order of preference, not a probability of profit or a target return.</p>
<p><strong>Model Direction</strong> is separate from rank. It publishes the model’s forward market-relative view as Positive, Neutral or Negative. A high-ranked stock can still carry a Neutral or Negative direction because the two fields answer different questions: Rank compares the stock with the other eligible stocks; Direction classifies the model’s forward relative view.</p>
<p><strong>Forecast Horizon</strong> tells you how far ahead the ranking question is being asked. 1D, 3D, 5D and 10D are separate model views. A stock can lead the short horizon and sit lower on the longer one. The 5D view is the primary research horizon on the public site; the surrounding horizons show whether the preference is concentrated or persists across more than one window.</p>
<p><strong>Rank Move</strong> shows how the stock’s position changed from the previous completed public ranking at the same horizon. An upward move means the stock has gained places in the model’s relative order; a downward move means it has lost places. It describes a change in model preference, not a price move.</p>
<div class="guide-reading"><p><strong>Read the screen in this order:</strong> Relative Rank tells you <em>where it stands</em>; Model Direction tells you <em>the separate forward relative view</em>; Horizon tells you <em>for how long</em>; Rank Move tells you <em>what changed since the previous ranking</em>.</p></div>

<h2>How to use /Alpha as a daily research process</h2>
<ol class="guide-steps">
<li><strong>Choose your horizon first.</strong> A 1D question and a 10D question are not the same investment question.</li>
<li><strong>Start near the top of that ranking.</strong> Those are the stocks the model currently places ahead of the rest of the eligible set for that horizon.</li>
<li><strong>Read Model Direction beside the rank.</strong> Positive reinforces the relative ranking view; Neutral or Negative tells you the model’s separate directional view is less supportive.</li>
<li><strong>Look across neighboring horizons and Rank Move.</strong> This shows whether the preference appears across several windows and whether the stock is gaining or losing relative position.</li>
<li><strong>Then do the investment work.</strong> Check price, liquidity, disclosures, technical structure, valuation where relevant, portfolio exposure and downside risk before making your own decision.</li>
</ol>
<p>The value of /Alpha is the order it creates before that work begins. Instead of giving every stock equal attention, you can start with the names the model ranks highest and investigate them in a disciplined sequence.</p>

<h2>What /Alpha tells you — and what it leaves to you</h2>
<p>EGX /Alpha tells you how its model orders the eligible market at each horizon and how that view changes through time. It does not publish a probability of profit, a target price, a guaranteed return or an instruction to buy or sell. A ranking can make a stock more important to investigate; it cannot know whether that stock is suitable for your portfolio or whether the price available to you offers an acceptable trade.</p>
<p>Your own context still matters: entry price, position size, liquidity, new company disclosures, sector exposure and risk. Information released after the model’s cutoff also belongs to your current research, because the published ranking can only reflect information available to the engine when that session was processed.</p>

<h2>Check what the model actually said</h2>
<p>The public site keeps the signal inspectable. The <a href="${rel('/archive/')}">model history</a> preserves dated rankings, while <a href="${rel('/search/')}">Search</a> lets you follow a stock across published sessions. For the technology, evidence discipline and research agenda behind the system, read the <a href="${rel('/methodology/')}">Methodology</a>.</p>
<p>That separation is intentional. The Investor Guide teaches you how to read and use the daily signal. The Methodology explains the research system behind it. The archive shows what /Alpha actually published before later market outcomes were known.</p>
<p><em>EGX /Alpha is published for research and informational purposes. Its rankings and Model Direction classifications are not execution instructions, guarantees of future returns, target prices or personalized investment advice.</em></p>`;
}

function arabicArticle() {
  return `
<h2>ما السؤال الذي صُمم المحرك للإجابة عنه؟</h2>
<p>تنتهي كل جلسة في البورصة المصرية بعدد كبير من الأسهم التي يمكن بحثها، بينما يظل وقت المستثمر وانتباهه محدودين. يحول EGX /Alpha هذه المساحة إلى ترتيب واضح. ولكل أفق من آفاقه الأربعة، يرتب الأسهم المؤهلة من أقوى تفضيل نسبي لدى النموذج إلى أضعفه.</p>
<p>هذا الترتيب نسبي بطبيعته. يتعلم المحرك من أداء السهم مستقبلاً مقارنة بمرجع السوق خلال الفترة نفسها. لذلك فإن المركز الأعلى يعني أن النموذج يضع السهم أمام عدد أكبر من البدائل المؤهلة. ولا يعني ذلك أن سعر السهم نفسه سيصعد بالضرورة.</p>
<p>لا يدخل الترتيب اليومي إلا السهم الذي يستطيع المحرك تقييمه بالمعلومات المطلوبة لذلك اليوم. وإذا تعذر تقييم سهم بصورة آمنة، لا يدخل مجموعة المقارنة. ولهذا قد يتغير العدد الظاهر بجوار الترتيب من جلسة إلى أخرى: فهو عدد الأسهم التي شملها الترتيب المنشور فعلاً.</p>
<div class="guide-question"><p><strong>احتفظ بقاعدة واحدة:</strong> كلما ارتفع مركز السهم، كان تفضيل EGX /Alpha النسبي له أقوى عند الأفق الذي اخترته.</p></div>

<h2>كيف تقرأ ترتيب كل يوم؟</h2>
<p><strong>الترتيب النسبي</strong> يحدد موقع السهم داخل مجموعة الأسهم المؤهلة لذلك اليوم. إذا ظهر السهم في المركز <strong>#3 / 84</strong>، فهذا يعني أن سهمين فقط من بين الأسهم الـ84 المنشورة يسبقان هذا السهم عند الأفق نفسه. الترتيب يحدد أولوية نسبية؛ ولا يمثل احتمالاً للربح أو عائداً مستهدفاً.</p>
<p><strong>اتجاه النموذج</strong> قراءة منفصلة عن الترتيب، وتظهر على شكل إيجابي أو محايد أو سلبي. قد يكون السهم مرتفع الترتيب ويحمل اتجاهاً محايداً أو سلبياً من دون تناقض: الترتيب يقارن السهم ببقية الأسهم المؤهلة، أما اتجاه النموذج فيصنف رؤيته المستقبلية النسبية بصورة مستقلة.</p>
<p><strong>أفق التوقع</strong> يحدد المدة التي ينظر إليها ذلك الترتيب. 1D و3D و5D و10D رؤى منفصلة للنموذج. قد يتصدر سهم الأفق القصير ثم يأتي في مركز أقل عند أفق أطول. ويظل 5D هو الأفق البحثي الرئيسي في الموقع، بينما تساعدك الآفاق الأخرى على معرفة ما إذا كان تفضيل النموذج محصوراً في نافذة قصيرة أو ممتداً عبر أكثر من أفق.</p>
<p><strong>تغير الترتيب</strong> يوضح كيف تغير مركز السهم مقارنة بآخر ترتيب عام مكتمل للأفق نفسه. الصعود يعني أن السهم كسب مراكز في ترتيب النموذج، والهبوط يعني أنه فقد مراكز. هذه حركة في التفضيل النسبي للنموذج، وليست حركة في سعر السهم.</p>
<div class="guide-reading"><p><strong>اقرأ الشاشة بهذا الترتيب:</strong> الترتيب النسبي يخبرك <em>أين يقف السهم</em>؛ واتجاه النموذج يضيف <em>الرؤية المستقبلية النسبية المنفصلة</em>؛ والأفق يحدد <em>المدة</em>؛ وتغير الترتيب يوضح <em>ما الذي تغير منذ آخر ترتيب</em>.</p></div>

<h2>كيف تستخدم /Alpha في بحثك اليومي؟</h2>
<ol class="guide-steps">
<li><strong>حدد الأفق أولاً.</strong> سؤال جلسة واحدة يختلف عن سؤال عشر جلسات.</li>
<li><strong>ابدأ من المراكز العليا في ذلك الأفق.</strong> هذه هي الأسهم التي يضعها النموذج حالياً أمام بقية مجموعة الأسهم المؤهلة.</li>
<li><strong>اقرأ اتجاه النموذج بجوار الترتيب.</strong> الاتجاه الإيجابي يدعم الرؤية النسبية، بينما يخبرك الاتجاه المحايد أو السلبي بأن القراءة الاتجاهية المنفصلة أقل دعماً.</li>
<li><strong>قارن الآفاق المجاورة وتغير الترتيب.</strong> ستعرف هل يظهر التفضيل عبر أكثر من نافذة، وهل السهم يكسب موقعاً نسبياً أم يفقده.</li>
<li><strong>بعد ذلك قم ببحثك الاستثماري.</strong> راجع السعر والسيولة والإفصاحات والبنية الفنية والتقييم عند الحاجة والتعرض في المحفظة ومخاطر الهبوط، ثم اتخذ قرارك أنت.</li>
</ol>
<p>قيمة /Alpha هنا هي أنه يرتب نقطة البداية. بدلاً من توزيع انتباهك بالتساوي على السوق، تبدأ بالأسهم التي يضعها النموذج في المقدمة ثم تبحثها بترتيب منضبط.</p>

<h2>ماذا يخبرك /Alpha؟ وماذا يبقى عليك؟</h2>
<p>يخبرك EGX /Alpha كيف يرتب نموذجه السوق المؤهل عند كل أفق، وكيف تتغير هذه الرؤية مع الوقت. لكنه لا ينشر احتمالاً للربح أو سعراً مستهدفاً أو عائداً مضموناً أو أمراً بالشراء أو البيع. المركز المرتفع يجعل السهم أولوية أعلى للبحث، لكنه لا يقرر ما إذا كان مناسباً لمحفظتك أو ما إذا كان السعر المتاح لك مناسباً للدخول.</p>
<p>يبقى سياقك الاستثماري أساسياً: سعر الدخول، حجم المركز، السيولة، الإفصاحات الجديدة، التعرض القطاعي والمخاطر. وأي معلومة تصدر بعد وقت معالجة الجلسة يجب أن تدخل في بحثك الحالي، لأن الترتيب المنشور يعكس ما كان متاحاً للمحرك وقت إصدار تلك القراءة.</p>

<h2>راجع ما قاله النموذج فعلاً</h2>
<p>يبقي الموقع الإشارة قابلة للمراجعة. يحفظ <a href="${rel('/archive/')}">سجل النموذج</a> الترتيبات المؤرخة، ويتيح لك <a href="${rel('/search/')}">البحث</a> متابعة السهم عبر الجلسات المنشورة. أما التكنولوجيا ومنهج الأدلة وأجندة البحث التي يقوم عليها النظام فتجدها في <a href="${rel('/methodology/')}">صفحة المنهجية</a>.</p>
<p>هذا الفصل مقصود. دليل المستثمر يشرح كيف تقرأ الإشارة اليومية وتستخدمها. صفحة المنهجية تشرح النظام البحثي الذي يقف خلفها. والسجل العام يريك ما نشره /Alpha فعلاً قبل أن تصبح نتائج السوق اللاحقة معروفة.</p>
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
