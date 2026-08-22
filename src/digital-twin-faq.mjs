function u(base,path){ return `${base}${path}`; }
export function digitalTwinFaqSection(ar,b){
 const link=p=>u(b,p);
 const qa=ar?[
 ['ما هو EGX /Alpha؟','EGX /Alpha توأم رقمي بحثي متجدد لسوق الأسهم المصري. يستخدم التعلم العميق لبناء تمثيل تحليلي للعلاقات النسبية بين الأسهم المؤهلة وينشر حالة نموذج عامة بعد كل جلسة مكتملة.'],
 ['ماذا يعني «توأم رقمي بحثي»؟','يعني تمثيلاً تحليلياً متعلماً يتجدد مع جلسات السوق ويمكن تتبع حالاته العامة عبر الزمن.'],
 ['هل EGX /Alpha نسخة رقمية من كل البورصة المصرية؟','لا. المصطلح يصف تمثيلاً بحثياً لمجموعة الأسهم المؤهلة وسلوكها النسبي، ولا يعني محاكاة نظام التداول أو دفتر الأوامر أو المقاصة أو التسوية أو كل بنية البورصة التشغيلية.'],
 ['لماذا تعد الثقافة المالية جزءاً من المنتج؟','لأن الموقع يشرح مفاهيم الترتيب المقطعي واتساع السوق والآفاق المستقبلية والسجلات ex-ante والأدلة المتحققة باستخدام سجل عام يمكن فحصه.'],
 ['ماذا يعني الترتيب النسبي؟','هو موقع السهم داخل ترتيب النموذج لمجموعة الأسهم المؤهلة عند أفق محدد، وليس احتمالاً للربح أو سعراً مستهدفاً.'],
 ['ما هو اتجاه النموذج؟','تصنيف مستقل — إيجابي أو محايد أو سلبي — للرؤية المستقبلية النسبية إلى السوق.'],
 ['لماذا قد يكون السهم مرتفع الترتيب بينما اتجاه النموذج محايد أو سلبي؟','لأن الترتيب يقارن السهم ببقية المجموعة، بينما اتجاه النموذج يصنف رؤيته المستقبلية النسبية بصورة منفصلة.'],
 ['لماذا ينشر EGX /Alpha أربعة آفاق؟','لأن العلاقات قصيرة الأجل وطويلة الأجل قد تختلف. لذلك توجد حالات مستقلة لآفاق 1D و3D و5D و10D.'],
 ['ما هو تغير الترتيب؟','هو تغير الموقع النسبي للسهم مقارنة بالحالة العامة السابقة عند الأفق نفسه، وليس تغير سعر السهم.'],
 ['كيف يتعلم EGX /Alpha؟','يتعلم من تاريخ أسبق للسوق، ويُقيّم على فترات لاحقة غير مستخدمة في الملاءمة، ثم تتحول التوقعات المنشورة إلى أدلة بعد اكتمال آفاقها.'],
 ['هل يعيد نموذج الإنتاج كتابة نفسه كل يوم؟','لا. نموذج الإنتاج المنشور لا يعيد كتابة نفسه أثناء إصدار الحالة اليومية. ويخضع أي جيل منافس للبحث والتقييم والمراجعة البشرية قبل الترقية.'],
 ['ما الأدلة التي يمكن فحصها؟','يمكن فحص الحالات المؤرخة والأرشيف والسجل القابل للقراءة آلياً ومقاييس الأدلة التي تُعرض بعد نضج النتائج ذات الصلة.'],
 ['هل يخبرني EGX /Alpha بما يجب أن أشتريه أو أبيعه أو أحتفظ به؟','لا. الترتيب النسبي واتجاه النموذج تصنيفات بحثية عامة وغير شخصية وليست توصيات شراء أو احتفاظ أو بيع ولا تقيم الملاءمة لشخص بعينه.'],
 ['هل يمكن استخدام EGX /Alpha لتعلم مفاهيم الاستثمار الكمي؟','نعم، كبيئة تعليمية لدراسة مفاهيم مثل الترتيب المقطعي واتساع الاتجاه واختلاف الآفاق والتحقق الزمني والأدلة المتحققة، وليس كخدمة توصيات شخصية.'],
 ['لماذا الأرشيف مهم؟','لأنه يحفظ ما نشره النموذج قبل معرفة النتائج اللاحقة، ما يسمح بدراسة التغير والتقييم من دون إعادة كتابة الماضي.'],
 ['من يملك EGX Research ومن يديرها؟','حقوق الملكية الفكرية مملوكة لـEGX Research Community LLP بالمملكة المتحدة، ويُشغّل الموقع بواسطة KNOWDYN LTD بالمملكة المتحدة و60Arabia بالولايات المتحدة.']
 ]:[
 ['What is EGX /Alpha?','EGX /Alpha is a continuously updated research digital twin of the Egyptian equity market. It uses deep learning to build an analytical representation of relative relationships across eligible stocks and publishes a public model state after each completed session.'],
 ['What does “research digital twin” mean?','It means a learned analytical representation that updates with completed market sessions and whose public states can be traced through time.'],
 ['Is EGX /Alpha a digital copy of the whole Egyptian Exchange?','No. The term describes a research representation of the eligible equity universe and its relative behaviour. It does not claim to reproduce the trading engine, order book, clearing, settlement or the Exchange’s complete operating infrastructure.'],
 ['Why is financial literacy part of the product?','Because the site uses an inspectable public record to explain cross-sectional ranking, market breadth, forward horizons, ex-ante records and realised evidence.'],
 ['What does Relative Rank mean?','It is a stock’s position inside the model ordering of the eligible universe at a selected horizon, not a probability of profit or a price target.'],
 ['What is Model Direction?','A separate Positive, Neutral or Negative classification of the model’s forward market-relative view.'],
 ['Why can a highly ranked stock have Neutral or Negative Model Direction?','Because rank compares the stock with the eligible universe, while Model Direction separately classifies the forward market-relative view.'],
 ['Why does EGX /Alpha publish four horizons?','Because short- and longer-window relationships can differ. The system therefore publishes separate 1D, 3D, 5D and 10D model states.'],
 ['What is Rank Move?','The change in a stock’s relative placement versus the previous completed public state at the same horizon. It is not a price move.'],
 ['How does EGX /Alpha learn?','It learns from earlier market history, is evaluated on later unseen periods, and turns published forecasts into evidence after their horizons mature.'],
 ['Does the production model rewrite itself every day?','No. The published production model does not rewrite itself while issuing the daily state. Challenger generations remain outside production until evaluated and human-reviewed for promotion.'],
 ['What evidence can I inspect?','Dated public states, archive chronology, the machine-readable public record and maturity-gated evidence metrics are available for inspection.'],
 ['Does EGX /Alpha tell me what to buy, sell or hold?','No. Relative Rank and Model Direction are general, non-personalised research classifications. They are not Buy, Hold or Sell recommendations and do not assess suitability for any individual.'],
 ['Can I use EGX /Alpha to learn about quantitative investing concepts?','Yes—as an educational environment for concepts such as cross-sectional ranking, breadth, horizon differences, time-respecting validation and realised evidence, not as personalised advice.'],
 ['Why is the archive important?','It preserves what the model published before later outcomes were known, allowing change and evidence to be studied without rewriting the past.'],
 ['Who owns and operates EGX Research?','The intellectual property rights are owned by EGX Research Community LLP, United Kingdom, and the website is operated by KNOWDYN LTD, United Kingdom, and 60Arabia, United States.']
 ];
 const title=ar?'افهم ما هو EGX /Alpha وما الذي ينشره وكيف تُقرأ مخرجاته.':'Understand what EGX /Alpha is, what it publishes and how to read it.';
 const intro=ar?'أسئلة موجزة عن التوأم الرقمي البحثي والتعلم العميق والثقافة المالية وحالة النموذج العامة وحدود المخرجات.':'Concise answers about the research digital twin, deep learning, financial literacy, public model states and the limits of the outputs.';
 return `<section class="faq-page" aria-labelledby="faq-title"><header class="faq-hero"><p class="eyebrow">${ar?'الأسئلة الشائعة عن EGX /ALPHA':'EGX /ALPHA FAQ'}</p><h1 id="faq-title">${title}</h1><p class="faq-intro">${intro}</p></header><div class="faq-list">${qa.map((x,i)=>`<details class="faq-question"><summary><span class="faq-number">${String(i+1).padStart(2,'0')}</span><span>${x[0]}</span></summary><div class="faq-answer"><p>${x[1]}</p>${i===0?`<p><a href="${link('/investor-guide/')}">${ar?'افتح دليل التعلم ←':'Open the learning guide →'}</a></p>`:''}</div></details>`).join('')}</div></section>`;
}
