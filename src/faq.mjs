import { escapeHtml, htmlShell, rel, siteFooter, siteHeader } from './templates.mjs';

const FAQ_COPY = {
  en: {
    title: 'Frequently Asked Questions',
    eyebrow: 'EGX /ALPHA FAQ',
    intro: 'The essential questions about what EGX /Alpha does, how to read its daily ranking, and how to use it responsibly as part of your own investment research.',
    questions: [
      {
        q: 'What is EGX /Alpha, and how can I use it as an investor?',
        a: `<p>EGX /Alpha is a deep-learning research engine built to help investors decide where to start looking inside the Egyptian stock market. After every completed EGX session, it ranks the eligible stocks it can evaluate across 1, 3, 5 and 10 trading-day horizons.</p><p>Instead of researching every stock with equal attention, you can use /Alpha as a daily priority list: start with the stocks the model ranks highest, read their Model Direction, then carry out your own fundamental, technical, liquidity and risk analysis before making a decision.</p><p><a href="${rel('/investor-guide/')}">Read the Investor Guide →</a></p>`
      },
      {
        q: 'How does EGX /Alpha work?',
        a: `<p>EGX /Alpha uses deep learning to study relationships in Egyptian market data that can be difficult to represent with simple rules. These include interactions between price behaviour, trading activity, volatility, liquidity, sector behaviour and the wider state of the market.</p><p>The engine learns from earlier market history and is evaluated on later periods that were not used to fit the model. After each session, it scores eligible stocks and converts those scores into a relative ranking for each forecast horizon. It is solving a cross-sectional question: which stocks currently rank ahead of the other eligible alternatives?</p>`
      },
      {
        q: "What does a stock's Relative Rank actually mean?",
        a: `<p>Relative Rank tells you where a stock stands compared with the other eligible EGX stocks evaluated by /Alpha for the same horizon.</p><p>If a stock is ranked <strong>#3 out of 91</strong>, only two stocks were placed ahead of it by the model in that particular ranking. It does not mean there is a 97% probability of profit, that the stock will necessarily rise, or that it has a specific expected return. Rank is an order of relative model preference.</p>`
      },
      {
        q: 'What is Model Direction, and how is it different from the ranking?',
        a: `<p>Model Direction is a separate classification: <strong>Positive, Neutral or Negative</strong>.</p><p>Relative Rank asks where the stock stands compared with the other eligible stocks. Model Direction asks a different question: what is the model's forward market-relative view for this stock?</p><p>Because the two measures are separate, a stock can rank relatively high while still carrying a Neutral or Negative Model Direction. Reading both together gives more information than either measure alone.</p>`
      },
      {
        q: 'Why are there 1D, 3D, 5D and 10D rankings?',
        a: `<p>Market opportunity can look different depending on the time horizon. A stock that ranks highly for the next trading session does not necessarily have to rank equally highly over the next ten sessions.</p><p>EGX /Alpha therefore evaluates the market separately across <strong>1D, 3D, 5D and 10D</strong> horizons. The public site treats 5D as the primary research horizon, while the surrounding horizons help show whether the model's relative preference is short-lived or appears across several forward windows.</p>`
      },
      {
        q: 'How can I verify whether EGX /Alpha is actually useful?',
        a: `<p>Do not take the model's claims on trust. Check what it actually published.</p><p>EGXResearch.com preserves dated public rankings so visitors can compare earlier model views with what happened after those forecasts were issued. Forecast outcomes are evaluated only after the relevant horizon has matured, and the site separates historical model validation from accumulating live evidence.</p><p>No forecasting system can guarantee that every individual prediction will be right. The relevant question is whether the ranking demonstrates useful performance consistently as sufficient evidence accumulates.</p><p><a href="${rel('/archive/')}">Explore Ranking History →</a></p>`
      },
      {
        q: 'Does EGX /Alpha tell me what to buy or sell?',
        a: `<p><strong>No.</strong> EGX /Alpha is a research-prioritisation system, not a personalized investment adviser and not an execution system. A high ranking means the model currently prefers that stock relative to more of the eligible alternatives at the selected horizon.</p><p>Your decision still needs to consider price, valuation where relevant, liquidity, company disclosures, technical structure, portfolio exposure, position size and downside risk. Think of /Alpha as answering <strong>“Where should I investigate first?”</strong>, not <strong>“What must I buy?”</strong></p>`
      },
      {
        q: 'Does EGX /Alpha analyse every stock listed on the Egyptian Exchange?',
        a: `<p>Not necessarily every listed security on every session. Each published ranking contains the <strong>eligible stocks the engine can evaluate with the required current information</strong>. If a stock cannot be evaluated under those requirements, it is left out of that session's comparison.</p><p>That is why you may see a denominator such as <strong>#3 / 91</strong> and why the number of analysed stocks can change over time.</p>`
      },
      {
        q: 'Is EGX /Alpha a website or an app?',
        a: `<p><strong>Both.</strong> EGX /Alpha is built as a Progressive Web App (PWA). You can use it normally through EGXResearch.com, or install it on a supported phone, tablet or computer so that it behaves more like an app.</p><p>Use the <strong>Install EGX /Alpha</strong> control on the website. On supported Chromium browsers it can open the native installation prompt; on iPhone and iPad the site provides the appropriate Add to Home Screen instructions.</p>`
      },
      {
        q: 'Is the daily ranking everything EGX /Alpha can do?',
        a: `<p>No. The public website is intentionally a focused research surface rather than the entire research system.</p><p>Visitors can inspect the daily rankings, Model Direction, Rank Move, four forecast horizons, historical model records, research evidence and a machine-readable public record. Behind that surface is a broader research system that maintains market memory, validates observations, scores matured forecasts, monitors evidence and model behaviour, and supports controlled research into future model generations.</p><p>The purpose of the free public site is to make the core /Alpha signal useful, transparent and independently inspectable without exposing the proprietary engine itself.</p>`
      }
    ]
  },
  ar: {
    title: 'الاسئلة الشائعة',
    eyebrow: 'الأسئلة الشائعة عن EGX /ALPHA',
    intro: 'أهم الأسئلة لفهم ما يقدمه EGX /Alpha، وكيف تقرأ ترتيبه اليومي، وكيف تستخدمه بصورة مسؤولة ضمن بحثك الاستثماري.',
    questions: [
      {
        q: 'ما هو EGX /Alpha؟ وكيف يمكنني الاستفادة منه كمستثمر يدير محفظته بنفسه؟',
        a: `<p>EGX /Alpha هو محرك بحث كمي يعتمد على التعلم العميق، ومهمته أن يساعدك في تحديد الأسهم التي تستحق أن تبدأ منها بحثك داخل البورصة المصرية. بعد كل جلسة مكتملة، يرتب الأسهم المؤهلة التي يستطيع تقييمها عبر آفاق مستقبلية تمتد إلى 1 و3 و5 و10 جلسات تداول.</p><p>بدلاً من أن تمنح كل الأسهم نفس الوقت والاهتمام، يمكنك استخدام /Alpha كقائمة يومية لأولويات البحث: ابدأ بالأسهم الأعلى ترتيباً، واقرأ اتجاه النموذج، ثم أكمل تحليلك الأساسي والفني والسيولة والمخاطر قبل اتخاذ قرارك.</p><p><a href="${rel('/investor-guide/')}">اقرأ دليل المستثمر ←</a></p>`
      },
      {
        q: 'كيف يعمل EGX /Alpha؟ وكيف يستطيع ترتيب الأسهم؟',
        a: `<p>يستخدم EGX /Alpha تقنية التعلم العميق لفهم العلاقات المتداخلة داخل بيانات البورصة المصرية، مثل حركة الأسعار، ونشاط التداول، والتذبذب، والسيولة، وسلوك القطاعات، وحالة السوق الأوسع.</p><p>يتعلم المحرك من تاريخ سابق للسوق، ثم يتم اختباره على فترات زمنية لاحقة لم تدخل في عملية تدريب النموذج. وبعد كل جلسة، يمنح الأسهم المؤهلة درجات نموذجية ويحولها إلى ترتيب نسبي مستقل لكل أفق مستقبلي. لذلك فهو يحاول الإجابة عن سؤال أوسع: أي الأسهم يضعها النموذج حالياً في مركز أفضل مقارنة ببقية الفرص المؤهلة؟</p>`
      },
      {
        q: 'ماذا يعني الترتيب النسبي للسهم؟',
        a: `<p>الترتيب النسبي يخبرك بموقع السهم مقارنة ببقية أسهم EGX المؤهلة التي قيّمها /Alpha في نفس الأفق الزمني.</p><p>إذا كان السهم في المركز <strong>#3 من 91 سهماً</strong>، فهذا يعني أن النموذج وضع سهمين فقط أمامه في هذا الترتيب. لكن ذلك لا يعني أن احتمال الربح يساوي نسبة معينة، ولا يعني أن سعر السهم سيرتفع حتماً أو أن له عائداً مستهدفاً محدداً. الترتيب هو ترتيب لتفضيل النموذج بين البدائل.</p>`
      },
      {
        q: 'ما هو اتجاه النموذج؟ وما الفرق بينه وبين ترتيب السهم؟',
        a: `<p>اتجاه النموذج هو تصنيف مستقل يظهر كـ <strong>إيجابي أو محايد أو سلبي</strong>.</p><p>الترتيب النسبي يجيب عن سؤال: أين يقع هذا السهم مقارنة ببقية الأسهم المؤهلة؟ أما اتجاه النموذج فيجيب عن سؤال مختلف: ما طبيعة رؤية النموذج المستقبلية لأداء السهم مقارنة بالسوق؟</p><p>ولهذا يمكن أن يكون السهم مرتفعاً في الترتيب، وفي الوقت نفسه يحمل اتجاهاً محايداً أو سلبياً. قراءة المؤشرين معاً تعطي صورة أكثر اكتمالاً.</p>`
      },
      {
        q: 'لماذا توجد توقعات منفصلة لـ1 و3 و5 و10 جلسات تداول؟',
        a: `<p>لأن ترتيب الفرص داخل السوق قد يختلف باختلاف المدة الزمنية. السهم الذي يظهر في مركز مرتفع للجلسة التالية ليس بالضرورة أن يحتفظ بنفس المركز خلال عشر جلسات.</p><p>لذلك ينشر EGX /Alpha رؤى مستقلة لآفاق <strong>1 و3 و5 و10 جلسات تداول</strong>. ويستخدم الموقع أفق 5 جلسات كرؤية بحثية رئيسية، بينما تساعدك الآفاق الأخرى على معرفة ما إذا كان تفضيل النموذج قصير الأجل أم يظهر عبر أكثر من نافذة زمنية.</p>`
      },
      {
        q: 'كيف أستطيع التحقق بنفسي من أداء EGX /Alpha؟',
        a: `<p>لا تحتاج إلى أن تثق في النموذج لمجرد أنه يقول إنه جيد؛ يمكنك مراجعة ما نشره فعلياً.</p><p>يحتفظ EGXResearch.com بسجل مؤرخ للترتيبات السابقة، بحيث يستطيع أي زائر مقارنة ما قاله النموذج وقتها بما حدث بعد صدور التوقع. ولا يتم تقييم نتيجة التوقع إلا بعد مرور الأفق الزمني الخاص به، كما يفصل الموقع بين الاختبارات التاريخية وأدلة الأداء الحي التي تتراكم مع الوقت.</p><p>لا يوجد نموذج توقع يستطيع ضمان صحة كل توقع منفرد. السؤال الأهم هو ما إذا كان الترتيب يثبت فائدته بصورة متكررة عندما تتراكم أدلة كافية.</p><p><a href="${rel('/archive/')}">استعرض سجل الترتيب ←</a></p>`
      },
      {
        q: 'هل يخبرني EGX /Alpha بما يجب أن أشتريه أو أبيعه؟',
        a: `<p><strong>لا.</strong> EGX /Alpha هو نظام لتحديد أولويات البحث، وليس مستشاراً استثمارياً شخصياً ولا نظاماً لإصدار أوامر شراء وبيع. ارتفاع ترتيب سهم يعني أن النموذج يفضله نسبياً على عدد أكبر من البدائل المؤهلة في الأفق المحدد.</p><p>أما قرارك أنت فيحتاج أيضاً إلى دراسة السعر، والتقييم عند الحاجة، والسيولة، وإفصاحات الشركة، والتحليل الفني، وتوزيع محفظتك، وحجم المركز والمخاطر المحتملة. الأفضل أن تتعامل مع /Alpha باعتباره يجيب عن سؤال <strong>«من أين أبدأ البحث؟»</strong> وليس <strong>«ماذا يجب أن أشتري؟»</strong>.</p>`
      },
      {
        q: 'هل يحلل EGX /Alpha كل الأسهم الموجودة في البورصة المصرية؟',
        a: `<p>ليس بالضرورة أن يشمل كل ورقة مالية مقيدة في كل جلسة. كل ترتيب منشور يضم <strong>الأسهم المؤهلة التي يستطيع المحرك تقييمها باستخدام المعلومات المطلوبة والمتاحة في ذلك الوقت</strong>. وإذا لم يستطع تقييم سهم وفق هذه الشروط، فلا يدخل ذلك السهم في مقارنة الجلسة.</p><p>ولهذا قد ترى مثلاً <strong>#3 / 91</strong>، كما يمكن أن يتغير عدد الأسهم الداخلة في الترتيب من جلسة إلى أخرى.</p>`
      },
      {
        q: 'هل EGX /Alpha موقع أم تطبيق؟',
        a: `<p><strong>الاثنان.</strong> تم بناء EGX /Alpha كتطبيق ويب تقدمي <strong>PWA</strong>. يمكنك استخدامه مباشرة من EGXResearch.com مثل أي موقع، أو تثبيته على الهاتف أو الجهاز اللوحي أو الكمبيوتر المدعوم ليعمل بصورة أقرب إلى التطبيقات العادية.</p><p>استخدم زر <strong>تثبيت EGX /Alpha</strong> الموجود على الموقع. وعلى iPhone وiPad ستظهر لك إرشادات إضافة إلى الشاشة الرئيسية المناسبة للجهاز.</p>`
      },
      {
        q: 'هل الترتيب اليومي هو كل ما يستطيع EGX /Alpha تقديمه؟',
        a: `<p>لا. الموقع العام هو واجهة بحثية مركزة، وليس كل النظام البحثي الموجود خلف EGX /Alpha.</p><p>يستطيع الزائر الاطلاع على الترتيب اليومي، واتجاه النموذج، وتغير الترتيب، وآفاق 1 و3 و5 و10 جلسات، والسجل التاريخي، وأدلة البحث، والسجل العام القابل للقراءة آلياً. وخلف هذه الواجهة يوجد نظام بحثي أوسع يحتفظ بذاكرة السوق، ويتحقق من جودة المشاهدات، ويقيّم التوقعات بعد نضجها، ويراقب الأدلة وسلوك النموذج، ويدعم البحث المنضبط في أجيال مستقبلية من النماذج.</p><p>الهدف من الموقع المجاني هو جعل إشارة /Alpha الأساسية مفيدة وشفافة وقابلة للتحقق من الجمهور، من دون كشف جوهر المحرك الخاص.</p>`
      }
    ]
  }
};

function renderFaqItems(items) {
  return items.map((item, index) => `<details class="faq-question">
    <summary><span class="faq-number">${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(item.q)}</span></summary>
    <div class="faq-answer">${item.a}</div>
  </details>`).join('');
}

export function faqPage(locale = 'en') {
  const lang = String(locale || 'en').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  const copy = FAQ_COPY[lang];
  const body = `<main class="site-shell page-faq" data-page="faq">
    ${siteHeader(copy.title)}
    <section class="faq-page" aria-labelledby="faq-title">
      <header class="faq-hero">
        <p class="eyebrow">${escapeHtml(copy.eyebrow)}</p>
        <h1 id="faq-title">${escapeHtml(copy.title)}</h1>
        <p class="faq-intro">${escapeHtml(copy.intro)}</p>
      </header>
      <div class="faq-list">${renderFaqItems(copy.questions)}</div>
    </section>
    ${siteFooter()}
  </main>
  <style>
    .faq-page{width:min(100%,980px);margin:0 auto;padding:clamp(44px,7vw,86px) 0 clamp(54px,8vw,96px)}
    .faq-hero{padding:clamp(28px,5vw,52px);border:1px solid var(--line);border-radius:14px;background:var(--surface)}
    .faq-hero h1{max-width:14ch;margin:10px 0 18px;color:var(--text);font-size:clamp(2.7rem,6vw,5.4rem);line-height:.95;letter-spacing:-.055em}
    .faq-intro{max-width:72ch;margin:0;color:var(--soft);font-size:clamp(.98rem,1.25vw,1.08rem);line-height:1.72}
    .faq-list{display:grid;gap:10px;margin-top:16px}
    .faq-question{overflow:hidden;border:1px solid var(--line);border-radius:12px;background:var(--surface)}
    .faq-question summary{min-height:70px;display:grid;grid-template-columns:42px minmax(0,1fr) 28px;gap:12px;align-items:center;padding:15px 18px;color:var(--text);font-size:clamp(.94rem,1.2vw,1.04rem);font-weight:760;line-height:1.45;cursor:pointer;list-style:none}
    .faq-question summary::-webkit-details-marker{display:none}
    .faq-question summary::after{content:'+';display:grid;place-items:center;color:var(--brand);font-family:var(--mono);font-size:1.25rem;font-weight:500}
    .faq-question[open] summary{border-bottom:1px solid var(--line);background:var(--surface-2)}
    .faq-question[open] summary::after{content:'−'}
    .faq-question summary:focus-visible{outline:2px solid var(--brand);outline-offset:-3px}
    .faq-number{color:var(--brand);font-family:var(--mono);font-size:.64rem;font-weight:850;letter-spacing:.06em}
    .faq-answer{padding:20px 22px 22px 72px;background:var(--surface);color:var(--soft)}
    .faq-answer p{max-width:76ch;margin:0 0 1em;font-size:clamp(.93rem,1.15vw,1.02rem);line-height:1.78}
    .faq-answer p:last-child{margin-bottom:0}
    .faq-answer strong{color:var(--text)}
    .faq-answer a{color:var(--brand);font-weight:760;text-decoration:none}
    .faq-answer a:hover{text-decoration:underline;text-underline-offset:3px}
    html[dir="rtl"] .faq-hero h1{letter-spacing:0;line-height:1.08}
    html[dir="rtl"] .faq-answer{padding:20px 72px 22px 22px}
    @media(max-width:620px){.faq-page{padding-top:28px}.faq-hero{padding:24px 20px}.faq-question summary{grid-template-columns:34px minmax(0,1fr) 24px;padding:14px}.faq-answer,html[dir="rtl"] .faq-answer{padding:18px 16px 20px}}
  </style>`;
  return htmlShell({
    title: `${copy.title} | EGX /Alpha`,
    description: copy.intro,
    canonicalPath: '/faq/',
    body,
    pageClass: 'page-faq',
    locale: lang
  });
}
