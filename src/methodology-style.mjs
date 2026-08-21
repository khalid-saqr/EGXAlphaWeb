export const METHODOLOGY_CSS = String.raw`
.page-methodology .methodology-story{width:min(100%,1120px);margin:34px auto 0}
.page-methodology .methodology-hero{padding:clamp(34px,6vw,76px) 0 clamp(34px,5vw,58px);border-bottom:1px solid var(--line)}
.page-methodology .methodology-hero h1{max-width:16ch;margin:12px 0 22px;font-size:clamp(2.55rem,6vw,5.35rem);line-height:.98;letter-spacing:-.052em}
.page-methodology .methodology-hero .lede{max-width:76ch;margin:0;color:var(--soft);font-size:clamp(1.02rem,1.45vw,1.2rem);line-height:1.78}
.page-methodology .methodology-question{display:grid;grid-template-columns:minmax(170px,.55fr) minmax(0,1.45fr);gap:24px;margin-top:34px;padding:22px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.page-methodology .methodology-question span{color:var(--brand);font-family:var(--mono);font-size:.62rem;font-weight:900;letter-spacing:.09em}
.page-methodology .methodology-question strong{max-width:42ch;color:var(--text);font-size:clamp(1.12rem,2vw,1.55rem);line-height:1.38}
.page-methodology .methodology-section{display:grid;grid-template-columns:92px minmax(0,1fr);gap:28px;padding:clamp(42px,6vw,72px) 0;border-bottom:1px solid var(--line)}
.page-methodology .methodology-section:last-of-type{border-bottom:0}
.page-methodology .methodology-index{padding-top:6px;color:var(--brand);font-family:var(--mono);font-size:.66rem;font-weight:900;letter-spacing:.1em}
.page-methodology .methodology-copy{max-width:82ch}
.page-methodology .methodology-copy h2{max-width:21ch;margin:0 0 22px;font-size:clamp(1.7rem,3vw,2.7rem);line-height:1.08}
.page-methodology .methodology-copy p{margin:0 0 18px;color:var(--soft);font-size:.98rem;line-height:1.82}
.page-methodology .methodology-copy p:last-child{margin-bottom:0}
.page-methodology .methodology-copy a{color:var(--text);text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--brand) 58%,transparent);text-underline-offset:3px}
.page-methodology .methodology-copy a:hover{color:var(--brand)}
.page-methodology .priority-grid,.page-methodology .capability-grid,.page-methodology .agenda-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:28px}
.page-methodology .priority-card,.page-methodology .capability-card,.page-methodology .agenda-card{min-width:0;padding:20px;border:1px solid var(--line);border-radius:10px;background:var(--surface)}
.page-methodology .priority-card span,.page-methodology .capability-card span,.page-methodology .agenda-card span{display:block;color:var(--brand);font-family:var(--mono);font-size:.56rem;font-weight:900;letter-spacing:.08em}
.page-methodology .priority-card strong,.page-methodology .capability-card strong,.page-methodology .agenda-card strong{display:block;margin-top:10px;color:var(--text);font-size:.9rem;line-height:1.35}
.page-methodology .priority-card p,.page-methodology .capability-card p,.page-methodology .agenda-card p{margin:8px 0 0;color:var(--muted);font-size:.76rem;line-height:1.6}
.page-methodology .horizon-line{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
.page-methodology .horizon-line span{min-width:62px;padding:9px 12px;border:1px solid var(--line);border-radius:8px;color:var(--brand);font-family:var(--mono);font-size:.7rem;font-weight:900;text-align:center}
.page-methodology .learning-loop{display:flex;gap:6px;margin-top:28px;align-items:stretch}
.page-methodology .learning-step{display:grid;place-items:center;flex:1 1 92px;min-height:82px;padding:10px;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--soft);font-family:var(--mono);font-size:.58rem;font-weight:850;letter-spacing:.045em;text-align:center}
.page-methodology .learning-arrow{display:grid;place-items:center;color:var(--brand);font-family:var(--mono);font-size:.9rem}
.page-methodology .methodology-note{margin-top:24px;padding:17px 18px;border-inline-start:3px solid var(--brand);background:var(--surface);color:var(--muted);font-size:.82rem;line-height:1.7}
.page-methodology .public-private{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:28px}
.page-methodology .public-private article{padding:22px;border:1px solid var(--line);border-radius:10px;background:var(--surface)}
.page-methodology .public-private span{display:block;color:var(--brand);font-family:var(--mono);font-size:.56rem;font-weight:900;letter-spacing:.08em}
.page-methodology .public-private h3{margin:10px 0 10px;font-size:1rem}
.page-methodology .public-private p{margin:0;color:var(--muted);font-size:.78rem;line-height:1.65}
.page-methodology .methodology-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.page-methodology .methodology-actions a{display:inline-flex;align-items:center;min-height:42px;padding:0 14px;border:1px solid var(--line);border-radius:8px;color:var(--soft);font-family:var(--mono);font-size:.62rem;font-weight:850;letter-spacing:.045em;text-decoration:none}
.page-methodology .methodology-actions a:hover{border-color:var(--brand);color:var(--brand)}
.page-methodology .reference-block{padding:clamp(36px,5vw,56px) 0;border-top:1px solid var(--line)}
.page-methodology .reference-block h2{margin:0 0 10px;font-size:clamp(1.45rem,2.4vw,2.1rem)}
.page-methodology .reference-block>p{max-width:78ch;margin:0;color:var(--muted);font-size:.82rem;line-height:1.7}
.page-methodology .reference-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:24px}
.page-methodology .reference-card{display:block;padding:17px 18px;border:1px solid var(--line);border-radius:9px;background:var(--surface);text-decoration:none}
.page-methodology .reference-card span{display:block;color:var(--brand);font-family:var(--mono);font-size:.54rem;font-weight:900;letter-spacing:.08em}
.page-methodology .reference-card strong{display:block;margin-top:7px;color:var(--text);font-size:.83rem;line-height:1.45}
.page-methodology .reference-card small{display:block;margin-top:6px;color:var(--muted);font-size:.7rem;line-height:1.5}
.page-methodology .reference-card:hover{border-color:var(--brand)}
.page-methodology .methodology-closing{margin:0 0 12px;padding:clamp(28px,4vw,42px);border:1px solid var(--line);border-radius:12px;background:color-mix(in srgb,var(--brand) 3%,var(--surface))}
.page-methodology .methodology-hero>.methodology-case-studies{margin-top:clamp(24px,3vw,34px);margin-bottom:0}
.page-methodology .case-study-head{max-width:82ch}
.page-methodology .case-study-kicker{display:block;color:var(--brand);font-family:var(--mono);font-size:.58rem;font-weight:900;letter-spacing:.09em}
.page-methodology .case-study-head h2{max-width:20ch;margin:10px 0 0;color:var(--text);font-size:clamp(1.55rem,3vw,2.5rem);line-height:1.1;letter-spacing:-.025em}
.page-methodology .case-study-head .case-study-intro{max-width:75ch;margin:14px 0 0;color:var(--soft);font-size:.88rem;line-height:1.72}
.page-methodology .case-study-list{margin-top:clamp(24px,3vw,34px);border-top:1px solid var(--line)}
.page-methodology .case-study-record{border-bottom:1px solid var(--line)}
.page-methodology .case-study-record summary{display:grid;grid-template-columns:42px minmax(0,1fr) 28px;gap:14px;align-items:start;padding:20px 0;list-style:none;cursor:pointer;color:var(--text)}
.page-methodology .case-study-record summary::-webkit-details-marker{display:none}
.page-methodology .case-study-record summary:focus-visible{outline:2px solid var(--brand);outline-offset:6px;border-radius:4px}
.page-methodology .case-study-number{padding-top:3px;color:var(--brand);font-family:var(--mono);font-size:.58rem;font-weight:900;letter-spacing:.08em}
.page-methodology .case-study-record summary strong{display:block;max-width:68ch;font-size:clamp(.94rem,1.55vw,1.08rem);line-height:1.5}
.page-methodology .case-study-toggle{display:grid;place-items:center;width:28px;height:28px;border:1px solid var(--line);border-radius:50%;color:var(--brand);font-family:var(--mono);font-size:1rem;font-weight:700;line-height:1}
.page-methodology .case-study-toggle::before{content:'+'}
.page-methodology .case-study-record[open] .case-study-toggle::before{content:'−'}
.page-methodology .case-study-record[open] summary{padding-bottom:12px}
.page-methodology .case-study-panel{padding-block:0 24px;padding-inline:56px 42px}
.page-methodology .case-study-panel p{max-width:72ch;margin:0;color:var(--soft);font-size:.86rem;line-height:1.72}
.page-methodology .case-study-panel p strong{color:var(--text);font-weight:850}
.page-methodology .case-study-download{display:inline-flex;align-items:center;gap:8px;min-height:40px;margin-top:16px;padding:0 13px;border:1px solid var(--line);border-radius:8px;color:var(--soft);font-family:var(--mono);font-size:.6rem;font-weight:900;letter-spacing:.05em;text-decoration:none}
.page-methodology .case-study-download:hover{border-color:var(--brand);color:var(--brand)}
.page-methodology .case-study-download span{font-size:.8rem}
@media(max-width:900px){.page-methodology .priority-grid,.page-methodology .capability-grid,.page-methodology .agenda-grid{grid-template-columns:1fr 1fr}.page-methodology .learning-loop{flex-wrap:wrap}.page-methodology .learning-arrow{min-width:18px}}
@media(max-width:700px){.page-methodology .methodology-question,.page-methodology .methodology-section{grid-template-columns:1fr;gap:12px}.page-methodology .methodology-index{padding-top:0}.page-methodology .public-private,.page-methodology .reference-grid{grid-template-columns:1fr}.page-methodology .methodology-hero h1{max-width:none}}
@media(max-width:520px){.page-methodology .priority-grid,.page-methodology .capability-grid,.page-methodology .agenda-grid{grid-template-columns:1fr}.page-methodology .learning-loop{flex-direction:column}.page-methodology .learning-step{flex-basis:auto;min-height:58px}.page-methodology .learning-arrow{min-height:20px;transform:rotate(90deg)}.page-methodology .methodology-actions{display:grid}.page-methodology .methodology-actions a{width:100%;justify-content:center}.page-methodology .case-study-record summary{grid-template-columns:30px minmax(0,1fr) 26px;gap:10px;padding:18px 0}.page-methodology .case-study-toggle{width:26px;height:26px}.page-methodology .case-study-panel{padding-inline:40px 0}.page-methodology .case-study-download{width:100%;justify-content:center;text-align:center}}
@media print{@page{size:A4;margin:14mm}.page-methodology .topbar,.page-methodology .site-footer{display:none!important}.page-methodology .site-shell{width:100%;padding:0}.page-methodology .methodology-story{width:100%;margin:0}.page-methodology .methodology-section,.page-methodology .priority-grid,.page-methodology .public-private,.page-methodology .reference-block,.page-methodology .methodology-case-studies{break-inside:avoid}.page-methodology .case-study-record:not([open])>.case-study-panel{display:block}.page-methodology .case-study-toggle{display:none}}
`;
