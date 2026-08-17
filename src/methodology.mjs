import { escapeHtml, megaFooter, siteHeader } from './templates.mjs';

const METHODOLOGY_CSS = String.raw`
.page-methodology .research-paper{width:min(100%,1080px);margin:36px auto 0;border:1px solid var(--line);border-radius:8px;background:var(--surface);overflow:hidden}
.page-methodology .research-cover{padding:clamp(34px,6vw,72px);border-bottom:1px solid var(--line)}
.page-methodology .research-cover h1{max-width:13ch;margin:12px 0 18px}
.page-methodology .research-cover .lede{margin-bottom:0}
.page-methodology .doc-control{display:grid;grid-template-columns:repeat(4,1fr);margin-top:34px;border:1px solid var(--line)}
.page-methodology .doc-control div{padding:13px;border-right:1px solid var(--line)}
.page-methodology .doc-control div:last-child{border-right:0}
.page-methodology .doc-control span{display:block;color:var(--muted);font-family:var(--mono);font-size:.62rem;letter-spacing:.07em}
.page-methodology .doc-control strong{display:block;margin-top:6px;font-family:var(--mono);font-size:.78rem}
.page-methodology .research-abstract{padding:28px clamp(24px,6vw,68px);border-bottom:1px solid var(--line);background:var(--surface-2)}
.page-methodology .research-abstract p:last-child{margin-bottom:0;max-width:82ch;color:var(--soft)}
.page-methodology .methodology-flow{display:grid;grid-template-columns:repeat(5,1fr);border-bottom:1px solid var(--line)}
.page-methodology .methodology-flow div{min-height:120px;padding:18px;border-right:1px solid var(--line)}
.page-methodology .methodology-flow div:last-child{border-right:0}
.page-methodology .methodology-flow span{color:var(--blue);font-family:var(--mono);font-size:.66rem}
.page-methodology .methodology-flow strong{display:block;margin:17px 0 5px;font-family:var(--mono);font-size:.8rem}
.page-methodology .methodology-flow p{margin:0;color:var(--muted);font-size:.76rem}
.page-methodology .research-body{padding:14px clamp(24px,6vw,68px) 52px}
.page-methodology .paper-section{display:grid;grid-template-columns:68px 1fr;gap:22px;padding:35px 0;border-bottom:1px solid var(--line)}
.page-methodology .paper-section:last-child{border-bottom:0}
.page-methodology .paper-section-index{color:var(--blue);font-family:var(--mono);font-size:.75rem}
.page-methodology .paper-section-copy h2{font-size:1.45rem}
.page-methodology .paper-section-copy p{max-width:80ch;color:var(--soft);font-size:.94rem}
.page-methodology .paper-section-copy p:last-child{margin-bottom:0}
.page-methodology .paper-note{margin-top:18px;padding:15px 17px;border-left:3px solid var(--blue);background:var(--surface-2);color:var(--muted);font-size:.84rem}
.page-methodology .paper-boundary{padding:34px clamp(24px,6vw,68px);border-top:1px solid var(--line);background:var(--surface-2)}
.page-methodology .boundary-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
.page-methodology .boundary-grid article{padding:18px;border:1px solid var(--line);background:var(--surface)}
.page-methodology .boundary-grid p{margin:7px 0 0;color:var(--muted);font-size:.84rem}
@media(max-width:760px){.page-methodology .doc-control,.page-methodology .methodology-flow{grid-template-columns:1fr 1fr}.page-methodology .paper-section{grid-template-columns:1fr;gap:8px}.page-methodology .boundary-grid{grid-template-columns:1fr}}
@media print{@page{size:A4;margin:15mm}.page-methodology .topbar,.page-methodology .mega-footer{display:none!important}.page-methodology .site-shell{width:100%;padding:0}.page-methodology .research-paper{margin:0;border:0}.page-methodology .paper-section,.page-methodology .paper-boundary{break-inside:avoid}}
`;

function control(label, value) { return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`; }
function step(n,title,body){return `<div><span>${escapeHtml(n)}</span><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></div>`;}
function section(n,title,paragraphs,note=''){return `<section class="paper-section" id="r${n}"><div class="paper-section-index">${escapeHtml(n)}</div><div class="paper-section-copy"><h2>${escapeHtml(title)}</h2>${paragraphs.map(p=>`<p>${escapeHtml(p)}</p>`).join('')}${note?`<aside class="paper-note">${escapeHtml(note)}</aside>`:''}</div></section>`;}

export function methodologyPage() {
  return `<style id="methodology-document-styles">${METHODOLOGY_CSS}</style><main class="site-shell page-methodology" data-page="methodology">
    ${siteHeader('RESEARCH', 'research')}
    <article class="research-paper paper-document">
      <header class="research-cover paper-cover"><p class="eyebrow">PUBLIC RESEARCH NOTE</p><h1>EGX /Alpha Methodology</h1><p class="lede">A ranking-first deep-learning research system for Egyptian listed equities, described at the level needed to understand its scientific and operational discipline without disclosing proprietary model implementation.</p><div class="doc-control">${control('MARKET','EGYPTIAN EXCHANGE')}${control('PUBLIC WINDOWS','1 / 3 / 5 / 10 S')}${control('DEFAULT VIEW','5 SESSIONS')}${control('USE','RESEARCH ONLY')}</div></header>
      <section class="research-abstract paper-abstract"><p class="eyebrow">ABSTRACT</p><p>EGX /Alpha converts time-locked post-close market observations into relative rankings of the eligible domestic equity universe across 1, 3, 5 and 10-session research windows. The five-session window remains the default public view. The production system validates source freshness, applies a reviewed deep-learning inference package, ranks eligible securities for each forward research horizon, stores dated model memory and publishes a sanitized public research record. Exact features, trained parameters, private scores and internal diagnostics remain outside the public boundary.</p></section>
      <section class="methodology-flow" aria-label="EGX Alpha research workflow">${step('01','OBSERVE','Acquire eligible post-close observations.')}${step('02','VALIDATE','Enforce freshness and time availability.')}${step('03','INFER','Apply the reviewed deep-learning package.')}${step('04','RANK','Order the eligible domestic universe.')}${step('05','PUBLISH','Release the sanitized research record.')}</section>
      <div class="research-body">
        ${section('01','Research objective: relative opportunity', ['The central problem is cross-sectional. On each eligible trading date the system compares Egyptian listed securities with one another and estimates their relative forward position. The public rank should therefore be read as a position within that day’s eligible comparison set, not as a guaranteed return or valuation target.','The public research surface exposes native 1, 3, 5 and 10-session forecast windows. Five sessions remains the default presentation. Rank and directional interpretation are distinct outputs and should be read together.'])}
        ${section('02','Observation discipline and time lock', ['Live inference begins with source-aware market observation. Only information demonstrably available by the Cairo-time decision cutoff can enter the research frame. Freshness, valid prices, active trading and adequate history are eligibility conditions.','Missing or stale observations lead to explicit exclusion rather than invented replacement data.'], 'The time lock separates a reproducible post-close forecast from hindsight.')}
        ${section('03','Market representation', ['The private engine converts the accepted history into a model-ready representation of temporal behaviour, structural market context and prevailing regime conditions. The public methodology identifies these information families but does not disclose exact transformations, feature recipes or tensor contracts.'])}
        ${section('04','Deep-learning ranking layer', ['A reviewed neural ranking model produces comparable estimates across the eligible securities and orders the universe independently for the 1, 3, 5 and 10-session forward research windows. Production inference applies the fixed reviewed package; it does not retrain the network or relax data-quality requirements during the daily run.'])}
        ${section('05','Validation and deployment discipline', ['Model development uses date-ordered separation and held-out evaluation. Candidate packages are evaluated for ranking behaviour, robustness, runtime parity and operational integrity before promotion. Training success alone is not treated as permission to deploy.'])}
        ${section('06','Public publication boundary', ['The public layer is a one-way disclosure boundary. It publishes sanitized full-universe rankings for the native 1, 3, 5 and 10-session windows together with date, rank, direction, source state, provenance, bounded research evidence and a research disclaimer while withholding private numerical scores and implementation details.','Historical records remain date-addressable so the system can be inspected longitudinally without rewriting past model outputs.'])}
        ${section('07','Interpretation limits', ['EGX /Alpha is a research-ranking engine operating under changing market regimes and source availability. A rank is conditional on the eligible universe, selected forecast window and information available at the cutoff. It is not personalised investment advice, a target price or an execution instruction.'])}
      </div>
      <section class="paper-boundary"><p class="eyebrow">DISCLOSURE BOUNDARY</p><h2>What is public and what remains private</h2><div class="boundary-grid"><article><strong>Public research surface</strong><p>Completed analysis date, eligible-universe context, 1 / 3 / 5 / 10-session rank windows, public direction category, source/publication state, bounded model evidence, archive provenance and methodology.</p></article><article><strong>Private research implementation</strong><p>Raw source records, exact feature construction, model dimensions, objective coefficients, trained weights, private numerical scores, internal diagnostics and operational paths.</p></article></div></section>
    </article>${megaFooter()}
  </main>`;
}
