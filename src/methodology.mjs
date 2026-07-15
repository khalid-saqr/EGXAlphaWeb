import { escapeHtml, megaFooter, siteHeader } from './templates.mjs';

const METHODOLOGY_CSS = String.raw`
.page-methodology .methodology-paper {
  width: min(100%, 1040px);
  margin: 0 auto 28px;
  overflow: hidden;
  color: #1c2733;
  background: #fffefb;
  border: 1px solid rgba(21, 35, 49, 0.16);
  border-radius: 10px;
  box-shadow: 0 38px 110px rgba(0, 0, 0, 0.34);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 17px;
  line-height: 1.72;
}
.page-methodology .methodology-paper * { box-sizing: border-box; }
.page-methodology .paper-masthead,
.page-methodology .paper-frontmatter,
.page-methodology .paper-main,
.page-methodology .paper-disclosure,
.page-methodology .paper-rights { padding-inline: clamp(24px, 6.5vw, 84px); }
.page-methodology .paper-masthead {
  min-height: 620px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: clamp(34px, 6vw, 72px);
  padding-bottom: clamp(34px, 6vw, 72px);
  background:
    linear-gradient(135deg, rgba(16, 105, 88, 0.08), transparent 42%),
    linear-gradient(180deg, #fffefb, #f7f4ec);
  border-bottom: 1px solid #d9d4c9;
}
.page-methodology .paper-kicker,
.page-methodology .paper-label,
.page-methodology .paper-section-index,
.page-methodology .paper-step span,
.page-methodology .paper-control dt {
  margin: 0;
  color: #0d725f;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.page-methodology .paper-title {
  max-width: 13ch;
  margin: 22px 0 18px;
  color: #111b26;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(3.4rem, 8vw, 7.1rem);
  font-weight: 900;
  letter-spacing: -0.07em;
  line-height: 0.92;
}
.page-methodology .paper-deck {
  max-width: 770px;
  margin: 0;
  color: #344454;
  font-size: clamp(1.12rem, 2vw, 1.48rem);
  line-height: 1.48;
}
.page-methodology .paper-cover-rule {
  width: 84px;
  height: 5px;
  margin: 34px 0 28px;
  background: #0d725f;
}
.page-methodology .paper-control {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 34px 0 0;
  border-top: 1px solid #cfc9bc;
  border-bottom: 1px solid #cfc9bc;
}
.page-methodology .paper-control div { padding: 15px 14px; border-right: 1px solid #ded9cf; }
.page-methodology .paper-control div:first-child { padding-left: 0; }
.page-methodology .paper-control div:last-child { border-right: 0; }
.page-methodology .paper-control dd {
  margin: 6px 0 0;
  color: #182433;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  font-weight: 750;
}
.page-methodology .whitepaper-actions { margin-top: 26px; }
.page-methodology .paper-icon { color: #152230; background: #fff; border-color: #bfc7c4; }
.page-methodology .paper-frontmatter { padding-top: 54px; padding-bottom: 50px; }
.page-methodology .paper-abstract {
  margin: 0;
  padding: 28px 30px;
  border: 1px solid #cfded9;
  border-left: 6px solid #0d725f;
  background: #f1f7f4;
}
.page-methodology .paper-abstract h2,
.page-methodology .paper-executive h2,
.page-methodology .paper-disclosure h2,
.page-methodology .paper-rights h2 {
  margin: 0 0 12px;
  color: #172431;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.28rem;
  letter-spacing: -0.025em;
}
.page-methodology .paper-abstract p,
.page-methodology .paper-executive p { max-width: 78ch; margin-bottom: 0; color: #2d3e4c; }
.page-methodology .paper-executive { padding: 38px 0 4px; }
.page-methodology .paper-executive p + p { margin-top: 16px; }
.page-methodology .whitepaper-toc {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin: 38px 0 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid #d5d1c8;
  border-radius: 4px;
  background: #d5d1c8;
}
.page-methodology .whitepaper-toc a {
  min-height: 54px;
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #233443;
  background: #fffefb;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
}
.page-methodology .whitepaper-toc a:hover { color: #0d725f; background: #f0f7f4; }
.page-methodology .methodology-flow {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0;
  margin: 48px 0 0;
  border-block: 1px solid #cbc6bb;
}
.page-methodology .paper-step {
  min-height: 152px;
  padding: 18px 14px;
  border-right: 1px solid #d9d4c9;
  background: #fbfaf6;
}
.page-methodology .paper-step:last-child { border-right: 0; }
.page-methodology .paper-step strong {
  display: block;
  margin: 16px 0 8px;
  color: #182635;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.98rem;
  letter-spacing: -0.02em;
}
.page-methodology .paper-step p { margin: 0; color: #53616e; font-size: 0.82rem; line-height: 1.45; }
.page-methodology .paper-main { padding-top: 22px; padding-bottom: 64px; }
.page-methodology .paper-section {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 28px;
  padding: 46px 0;
  border-top: 1px solid #d8d3c8;
  scroll-margin-top: 24px;
}
.page-methodology .paper-section:first-child { border-top: 0; }
.page-methodology .paper-section-index {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border: 1px solid #85ad9f;
  border-radius: 50%;
  background: #eff7f4;
  font-size: 0.78rem;
}
.page-methodology .paper-section-copy { min-width: 0; }
.page-methodology .paper-section-copy h2 {
  margin: 0 0 18px;
  color: #142230;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.65rem, 3vw, 2.35rem);
  line-height: 1.12;
  letter-spacing: -0.045em;
}
.page-methodology .paper-section-copy p {
  max-width: 76ch;
  margin: 0;
  color: #334654;
  font-size: 1.03rem;
  text-wrap: pretty;
}
.page-methodology .paper-section-copy p + p { margin-top: 17px; }
.page-methodology .paper-note {
  margin-top: 24px;
  padding: 19px 21px;
  border-left: 4px solid #0d725f;
  background: #f3f7f5;
  color: #2a3b47;
  font-size: 0.96rem;
}
.page-methodology .paper-principles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 26px;
}
.page-methodology .paper-principle {
  min-height: 178px;
  padding: 20px;
  border: 1px solid #d6d2c8;
  background: #fff;
}
.page-methodology .paper-principle strong {
  display: block;
  margin-bottom: 10px;
  color: #172635;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
}
.page-methodology .paper-principle p { margin: 0; color: #566572; font-size: 0.91rem; line-height: 1.55; }
.page-methodology .paper-disclosure {
  padding-top: 52px;
  padding-bottom: 52px;
  background: #eef5f2;
  border-block: 1px solid #cadbd5;
}
.page-methodology .paper-disclosure > p { max-width: 76ch; color: #344754; }
.page-methodology .paper-disclosure-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 26px;
}
.page-methodology .paper-disclosure-card {
  padding: 24px;
  border: 1px solid #c9d4d0;
  background: rgba(255,255,255,0.78);
}
.page-methodology .paper-disclosure-card h3 {
  margin: 0 0 14px;
  color: #172635;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 1.05rem;
}
.page-methodology .paper-disclosure-card p { margin: 0; color: #475966; font-size: 0.94rem; }
.page-methodology .paper-rights {
  padding-top: 46px;
  padding-bottom: 52px;
  background: #fffefb;
}
.page-methodology .paper-rights p { max-width: 82ch; color: #495966; font-size: 0.92rem; }
.page-methodology .paper-rights .button { margin-top: 12px; color: #07111d; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
@media (max-width: 980px) {
  .page-methodology .paper-control { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .page-methodology .paper-control div:nth-child(2) { border-right: 0; }
  .page-methodology .paper-control div:nth-child(-n+2) { border-bottom: 1px solid #ded9cf; }
  .page-methodology .methodology-flow { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .page-methodology .paper-step:nth-child(4) { border-right: 0; }
  .page-methodology .paper-step:nth-child(-n+4) { border-bottom: 1px solid #d9d4c9; }
}
@media (max-width: 720px) {
  .page-methodology .paper-masthead { min-height: auto; }
  .page-methodology .paper-control,
  .page-methodology .whitepaper-toc,
  .page-methodology .methodology-flow,
  .page-methodology .paper-principles,
  .page-methodology .paper-disclosure-grid { grid-template-columns: 1fr; }
  .page-methodology .paper-control div,
  .page-methodology .paper-control div:nth-child(2),
  .page-methodology .paper-step,
  .page-methodology .paper-step:nth-child(4) { border-right: 0; }
  .page-methodology .paper-control div,
  .page-methodology .paper-step { border-bottom: 1px solid #d9d4c9; }
  .page-methodology .paper-control div:last-child,
  .page-methodology .paper-step:last-child { border-bottom: 0; }
  .page-methodology .paper-section { grid-template-columns: 1fr; gap: 15px; padding: 36px 0; }
  .page-methodology .paper-section-index { width: 46px; height: 46px; }
  .page-methodology .paper-title { font-size: clamp(3rem, 17vw, 4.7rem); }
}
@media print {
  @page { size: A4; margin: 15mm; }
  .page-methodology { background: #fff !important; }
  .page-methodology .topbar,
  .page-methodology .mega-footer,
  .page-methodology .whitepaper-actions,
  .page-methodology script { display: none !important; }
  .page-methodology .site-shell { width: 100%; padding: 0; }
  .page-methodology .methodology-paper { width: 100%; margin: 0; border: 0; border-radius: 0; box-shadow: none; font-size: 10.5pt; }
  .page-methodology .paper-masthead { min-height: 235mm; page-break-after: always; }
  .page-methodology .paper-section,
  .page-methodology .paper-abstract,
  .page-methodology .paper-principle,
  .page-methodology .paper-disclosure-card { break-inside: avoid; }
  .page-methodology .methodology-flow { grid-template-columns: repeat(4, 1fr); }
}`;

function controlItem(label, value) {
  return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
}

function workflowStep(number, title, body) {
  return `<div class="paper-step"><span>${escapeHtml(number)}</span><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></div>`;
}

function principle(title, body) {
  return `<article class="paper-principle"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></article>`;
}

function section(number, title, paragraphs, extra = '') {
  return `<section class="paper-section" id="m${escapeHtml(number)}">
    <div class="paper-section-index" aria-hidden="true">${escapeHtml(number)}</div>
    <div class="paper-section-copy">
      <h2>${escapeHtml(title)}</h2>
      ${paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      ${extra}
    </div>
  </section>`;
}

function note(text) {
  return `<aside class="paper-note">${escapeHtml(text)}</aside>`;
}

export function methodologyPage() {
  const accessHref = 'mailto:access@egxresearch.com?subject=EGX%20Alpha%20early%20access%20request';
  return `<style id="methodology-document-styles">${METHODOLOGY_CSS}</style>
  <main class="site-shell page-methodology" data-page="methodology">
    ${siteHeader('Methodology')}
    <article class="methodology-paper paper-document" aria-labelledby="methodology-title">
      <header class="paper-masthead paper-cover">
        <div>
          <p class="paper-kicker">Public methodology white paper</p>
          <h1 class="paper-title" id="methodology-title">EGX /Alpha Methodology</h1>
          <div class="paper-cover-rule" aria-hidden="true"></div>
          <p class="paper-deck">A ranking-first deep-learning and real-time monitoring system for the Egyptian Exchange, described at the level required to understand its scientific discipline without disclosing its proprietary implementation.</p>
          <dl class="paper-control" aria-label="Document control">
            ${controlItem('Document class', 'Public technical white paper')}
            ${controlItem('Method status', 'Live research protocol')}
            ${controlItem('Publication', 'July 2026')}
            ${controlItem('Use', 'Research and information only')}
          </dl>
        </div>
        <div class="whitepaper-actions" aria-label="White paper actions">
          <button class="icon-button paper-icon" type="button" data-share aria-label="Share methodology page">Share</button>
          <button class="icon-button paper-icon" type="button" data-print aria-label="Print methodology page">Print</button>
        </div>
      </header>

      <div class="paper-frontmatter">
        <section class="paper-abstract">
          <p class="paper-label">Abstract</p>
          <h2>Purpose and scope</h2>
          <p>EGX /Alpha is a persistent market-observation, neural-ranking and evidence-follow-up system built for the structure of the Egyptian Exchange. The private engine converts time-locked market observations into a cross-sectional ranking over forward evaluation windows, applies operational and validation gates, publishes one bounded public signal, and later compares matured forecasts with realised outcomes. This paper explains that methodology in public terms. It deliberately omits the feature recipes, numerical model configuration, trained parameters, full ranking outputs and private operational artefacts that constitute the proprietary research layer.</p>
        </section>

        <section class="paper-executive">
          <p class="paper-label">Executive summary</p>
          <h2>The system asks a ranking question</h2>
          <p>EGX /Alpha is designed to compare eligible EGX securities with one another after the market close. Its central question is whether the system can order the domestic market into relatively stronger and weaker forward opportunities after accounting for market context, rather than treating every security as an isolated binary prediction.</p>
          <p>The methodology joins three disciplines: leakage-safe time-series learning, market-structure-aware ranking and an evidence loop that waits for each forecast horizon to mature before judging it. The public website exposes only a selected research signal and the information needed to interpret its publication boundary.</p>
        </section>

        <nav class="whitepaper-toc" aria-label="White paper contents">
          <a href="#m1">1. Research objective</a>
          <a href="#m2">2. Observation discipline</a>
          <a href="#m3">3. Market representation</a>
          <a href="#m4">4. Deep-learning ranking</a>
          <a href="#m5">5. Validation protocol</a>
          <a href="#m6">6. Live signal production</a>
          <a href="#m7">7. Evidence and drift</a>
          <a href="#m8">8. Public-wire boundary</a>
          <a href="#m9">9. Interpretation limits</a>
        </nav>

        <section class="methodology-flow" aria-label="EGX Alpha methodology workflow">
          ${workflowStep('01', 'Observe', 'Acquire eligible post-close market observations.')}
          ${workflowStep('02', 'Time-lock', 'Admit only information available by the decision cutoff.')}
          ${workflowStep('03', 'Represent', 'Encode temporal, structural and regime context.')}
          ${workflowStep('04', 'Rank', 'Order eligible domestic securities across forward windows.')}
          ${workflowStep('05', 'Gate', 'Apply integrity, robustness and deployment checks.')}
          ${workflowStep('06', 'Publish', 'Release one bounded public-wire signal.')}
          ${workflowStep('07', 'Learn', 'Score matured outcomes and monitor evidence drift.')}
        </section>
      </div>

      <div class="paper-main">
        ${section('1', 'Research objective: relative opportunity, not an isolated label', [
          'The model is trained and evaluated as a cross-sectional ranking system. At each eligible market date, it compares securities within the domestic EGX universe and estimates their relative forward position. The research target is market-relative opportunity across several evaluation windows, not a promise that a quoted price will move by a particular amount.',
          'This ranking-first formulation reflects the practical question faced by an investor with a finite opportunity set: which eligible securities deserve more attention than their peers under the same market conditions? Directional labels remain useful for interpretation, but they are secondary to the ordering problem.'
        ], `<div class="paper-principles">
          ${principle('Domestic universe', 'Ordinary model ranking is restricted to validated Egyptian Exchange symbols rather than mixing incomparable offshore instruments into the investable set.')}
          ${principle('Relative target', 'The learning problem focuses on forward performance in relation to the surrounding market, reducing the influence of broad market direction.')}
          ${principle('Multiple windows', 'The system evaluates more than one forward horizon so that a signal is tied to an explicit period rather than an undefined forecast.')}
        </div>`)}

        ${section('2', 'Real-time monitoring layer: availability before prediction', [
          'The live process begins with source-aware daily market observation. Each accepted record carries both a market timestamp and an availability timestamp. Information is admitted to a prediction only when it was demonstrably available by the Cairo-time input cutoff.',
          'Freshness, valid prices, active trading and sufficient historical depth are treated as eligibility conditions. Missing dependencies, stale bars, zero-volume observations or incomplete histories produce an explicit exclusion or no-signal state; the pipeline does not manufacture replacements merely to keep the daily workflow running.'
        ], note('The time lock is a scientific boundary. It prevents later information from leaking backward into a forecast and separates a reproducible post-close research signal from an informal hindsight narrative.'))}

        ${section('3', 'Market representation: sequence, structure and regime', [
          'Raw daily rows are transformed into a model-ready representation that combines recent temporal behaviour with market context. The temporal component summarises how price, trading activity and stability evolve through a rolling history. The structural component locates each security within symbol, sector and liquidity relationships. A regime component describes prevailing volatility, trading continuity and volume conditions.',
          'These information families are normalised using training-time statistics and are accepted only when their live contract matches the reviewed model package. The public description stops at these conceptual families: the exact transformations, embedding construction, dimensions and feature-selection rules remain proprietary.'
        ], `<div class="paper-principles">
          ${principle('Temporal memory', 'A rolling sequence allows the model to reason from evolving behaviour rather than a single end-of-day snapshot.')}
          ${principle('Structural context', 'Sector, liquidity and learned market relationships help distinguish stock-specific behaviour from common market movement.')}
          ${principle('Regime awareness', 'Volatility, continuity and volume conditions inform how comparable a present observation is with the regimes seen during training.')}
        </div>`)}

        ${section('4', 'Deep-learning ranking layer', [
          'A neural ranking model combines the eligible temporal and structural representations and produces a comparable ordering for each forward evaluation window. The training objective is ranking-aware: it rewards correct relative ordering and forward market-excess separation while retaining directional behaviour as a diagnostic constraint.',
          'The live model is exported into a compact inference package and executed through a fixed contract. Production inference does not retrain the network, alter its parameters or relax missing-data requirements. It applies the reviewed transformation and model package to the current eligible universe.'
        ], note('This paper does not disclose the neural architecture, objective weights, optimisation schedule, tensor schema, trained parameters or symbol-level numerical outputs. Those details are not required to understand the methodological claim and would reveal the implementation layer.'))}

        ${section('5', 'Validation and promotion protocol', [
          'Model development uses date-ordered, walk-forward separation so that later market periods are not used to prepare earlier validation cases. Sampling and market-structure construction are confined to their permitted training folds. A candidate must demonstrate ranking value across held-out periods rather than merely fitting the historical sample.',
          'Evaluation is centred on rank correlation and the realised separation between the upper and lower parts of the predicted ordering. The same question is examined globally and within sector and liquidity groupings to test whether apparent performance is only a disguised exposure to market composition. Directional diagnostics, model-runtime parity, package integrity and bounded deployment size provide additional sanity gates.',
          'A candidate that fails any required gate remains diagnostic material. Promotion is governed separately and requires explicit review; the existence of a trained model is not treated as evidence that it is ready for live use.'
        ])}

        ${section('6', 'Live inference and public signal production', [
          'After the EGX close-stabilisation period, the private workflow observes the market, prepares the eligible research frame, enforces the active model contract and runs the compact ranking model. Securities that fail freshness, history, universe, structural-context or package checks are excluded before inference.',
          'The ranked result remains private. A separate publication component selects the bounded public signal according to the active public policy, converts technical states into plain-language context, attaches publication timing and integrity metadata, and exports a schema-limited public wire. The public website renders that wire; it does not query or reproduce the private model.'
        ])}

        ${section('7', 'Matured-outcome follow-up, evidence state and drift', [
          'A forecast is evaluated only after its stated number of future valid trading observations exists. Immature forecasts remain pending, while missing, suspended or invalid future observations are recorded as unresolved rather than converted into artificial zero returns.',
          'Matured forecasts contribute to a compact evidence state that follows ranking correlation, realised separation and directional consistency through time. Recent evidence is compared with the longer record to distinguish insufficient history, gradual decay, a possible regime break and a source-quality failure. These states may request a bounded human-reviewed challenger process, but they do not automatically retrain or replace the live model.'
        ], note('Source degradation and model degradation are deliberately separated. Poor observation coverage cannot be treated as proof that the forecasting model has failed.'))}

        ${section('8', 'Public-wire publication layer', [
          'The public wire is a one-way disclosure object. It contains the selected asset, rank label, direction category, evaluation window, permitted market snapshot, publication context, research disclaimer and integrity references. The public repository validates this schema and rejects private or subscriber fields before building the site.',
          'The boundary allows each published signal to become a permanent dated record that can be searched and revisited. It also prevents the website from becoming an accidental replica of the private intelligence system.'
        ])}

        ${section('9', 'Interpretation and limitations', [
          'EGX /Alpha is a research-ranking system operating under changing market regimes and imperfect source availability. A rank is conditional on the eligible universe, the information available at the cutoff and the current reviewed model package. It is not a guarantee of return, a valuation opinion or an execution instruction.',
          'The public signal should be interpreted as a documented object for follow-up over its stated window. Position sizing, liquidity constraints, transaction costs, individual suitability and portfolio context remain outside the public signal. Evidence accumulates gradually, and early live-tracking states should be read as limited evidence rather than mature validation.'
        ])}
      </div>

      <section class="paper-disclosure paper-boundary" aria-labelledby="disclosure-title">
        <p class="paper-label">What remains private</p>
        <h2 id="disclosure-title">What is explained and what remains private</h2>
        <p>Technical credibility requires enough information to assess the research logic. Reproducible public communication does not require publishing the proprietary transformations or the full commercial intelligence output.</p>
        <div class="paper-disclosure-grid">
          <article class="paper-disclosure-card">
            <h3>Disclosed in this paper</h3>
            <p>The ranking-first objective, availability discipline, information families, validation logic, inference safeguards, matured-outcome evidence loop and public-wire controls.</p>
          </article>
          <article class="paper-disclosure-card">
            <h3>Retained in the private system</h3>
            <p>Raw source records, exact feature recipes, embedding construction, model dimensions, objective coefficients, hyperparameters, trained weights, thresholds, complete daily rankings, private scores, diagnostics and operational paths.</p>
          </article>
        </div>
      </section>

      <footer class="paper-rights">
        <p class="paper-label">Rights and disclaimer</p>
        <h2>Research publication boundary</h2>
        <p>© EGX Research LLP. All rights reserved. EGX /Alpha, EGXResearch, the public signal publication layer, methodology descriptions and visual presentation are copyright EGX Research LLP unless otherwise stated. IP management rights, technical governance, research commercialisation support and disclaimer administration are managed by KNOWDYN LTD (UK).</p>
        <p>Research-only. Not personalised investment advice. No buy, sell or hold instruction. Public materials are provided for information, research and market-follow-up purposes only.</p>
        <a class="button button-primary" href="${accessHref}">Get early access</a>
      </footer>
    </article>
    ${megaFooter()}
  </main>`;
}
