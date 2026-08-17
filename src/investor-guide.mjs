import { abs, htmlShell, rel, siteFooter, siteHeader } from './templates.mjs';

const GUIDE_CSS = String.raw`
.page-investor-guide .guide-shell{width:min(100%,980px);margin:34px auto 0}
.page-investor-guide .guide-hero{padding:clamp(30px,6vw,62px);border:1px solid var(--line);border-radius:14px;background:var(--surface)}
.page-investor-guide .guide-hero h1{max-width:18ch;margin:12px 0 18px;font-size:clamp(2.35rem,5.5vw,4.8rem);line-height:.98}
.page-investor-guide .guide-hero .lede{max-width:76ch;margin:0;color:var(--soft);font-size:clamp(1rem,1.3vw,1.14rem);line-height:1.72}
.page-investor-guide .guide-market-context{margin:24px 0 0;padding:14px 16px;border-left:3px solid var(--blue);background:var(--surface-2);color:var(--muted);font-size:.82rem;line-height:1.6}
.page-investor-guide .guide-market-context strong{color:var(--text)}
.page-investor-guide .guide-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
.page-investor-guide .guide-meta a,.page-investor-guide .guide-meta span{padding:8px 10px;border:1px solid var(--line);border-radius:999px;color:var(--soft);font-family:var(--mono);font-size:.62rem;letter-spacing:.04em}
.page-investor-guide .guide-meta a:hover{border-color:var(--blue);color:var(--blue)}
.page-investor-guide .guide-article{margin-top:16px;padding:clamp(26px,5.5vw,58px);border:1px solid var(--line);border-radius:14px;background:var(--surface)}
.page-investor-guide .guide-article p{max-width:78ch;margin:0 auto 1.35em;color:var(--soft);font-size:clamp(.97rem,1.25vw,1.08rem);line-height:1.82}
.page-investor-guide .guide-article p:last-of-type{margin-bottom:0}
.page-investor-guide .guide-article a{color:var(--text);text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--blue) 55%,transparent);text-underline-offset:3px}
.page-investor-guide .guide-article a:hover{color:var(--blue)}
.page-investor-guide .guide-article em{color:var(--muted)}
.page-investor-guide .official-resources{margin-top:16px;padding:22px 24px;border:1px solid var(--line);border-radius:12px;background:var(--surface-2)}
.page-investor-guide .official-resources span{display:block;color:var(--blue);font-family:var(--mono);font-size:.58rem;font-weight:800;letter-spacing:.07em}
.page-investor-guide .official-resources p{margin:8px 0 0;color:var(--muted);font-size:.79rem;line-height:1.6}
.page-investor-guide .official-resources a{color:var(--text);text-decoration:underline;text-underline-offset:3px}
@media(max-width:700px){.page-investor-guide .guide-shell{margin-top:20px}.page-investor-guide .guide-hero,.page-investor-guide .guide-article{padding-left:20px;padding-right:20px}.page-investor-guide .guide-hero h1{max-width:none}}
`;

const SEO_DESCRIPTION = 'How retail investors can use EGX /Alpha for Egyptian Stock Market research, deep-learning stock forecasting and EGX stock analysis, including البورصة المصرية.';

function articleSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How Retail Investors Can Use EGX /Alpha in Their Decision-Making',
    description: SEO_DESCRIPTION,
    mainEntityOfPage: abs('/investor-guide/'),
    url: abs('/investor-guide/'),
    datePublished: '2026-08-17',
    dateModified: '2026-08-17',
    inLanguage: 'en',
    author: { '@type': 'Organization', name: 'EGX Research', url: abs('/') },
    publisher: { '@type': 'Organization', name: 'EGX Research', url: abs('/') },
    keywords: [
      'EGX Research',
      'Egyptian Stock Market',
      'Egyptian Exchange',
      'EGX stocks',
      'deep learning stock forecast',
      'stock forecasting',
      'stock analysis',
      'البورصة المصرية',
      'التنبؤ بالأسهم',
      'تحليل أسهم البورصة'
    ],
    about: [
      { '@type': 'Thing', name: 'Egyptian Stock Market', alternateName: 'البورصة المصرية' },
      { '@type': 'Thing', name: 'Stock forecasting', alternateName: 'التنبؤ بالأسهم' },
      { '@type': 'Thing', name: 'Stock analysis', alternateName: 'تحليل أسهم البورصة' }
    ]
  };
}

export function investorGuidePage() {
  const schema = JSON.stringify(articleSchema()).replaceAll('</script', '<\\/script');
  return htmlShell({
    title: 'How to Use EGX /Alpha | Egyptian Stock Market Decision Support | EGX Research',
    description: SEO_DESCRIPTION,
    canonicalPath: '/investor-guide/',
    pageClass: 'page-investor-guide',
    body: `<style id="investor-guide-styles">${GUIDE_CSS}</style><script type="application/ld+json">${schema}</script><main class="site-shell">${siteHeader('INVESTOR GUIDE', 'guide')}<div class="guide-shell"><header class="guide-hero"><p class="eyebrow">RETAIL INVESTOR GUIDE</p><h1>How Retail Investors Can Use EGX /Alpha in Their Decision-Making</h1><p class="lede">A practical guide to reading the EGX /Alpha rank, direction, forecast horizon and validation evidence as decision support for Egyptian equities.</p><p class="guide-market-context"><strong>EGX Research</strong> focuses on the Egyptian Stock Market — <span lang="ar" dir="rtl">البورصة المصرية</span> — using quantitative stock forecasting (<span lang="ar" dir="rtl">التنبؤ بالأسهم</span>) and systematic stock analysis (<span lang="ar" dir="rtl">تحليل أسهم البورصة</span>).</p><div class="guide-meta"><a href="${rel('/today/')}">LATEST RANKING</a><a href="${rel('/methodology/')}">RESEARCH METHOD</a><a href="${rel('/archive/')}">MODEL HISTORY</a><a href="${rel('/search/')}">SEARCH STOCKS</a></div></header><article class="guide-article">
<p>Egyptian retail investors already have more stock ideas than they can reasonably follow. Brokerage research, company disclosures, technical-analysis pages, investor groups, market rumors and daily price action can easily put ten or twenty names on a watchlist before the session even starts. The difficult part is deciding which of those names deserves serious attention and which can wait. <a href="${rel('/today/')}">EGX /Alpha</a> was built for that part of the process.</p>
<p>EGX /Alpha is a deep-learning forecasting system for Egyptian equities. After each completed EGX session, the engine evaluates the eligible stock universe using the market information available at that point and produces a ranked view of expected relative performance over <a href="${rel('/methodology/')}">1, 3, 5 and 10 trading days</a>. The current public universe contains 91 stocks. The 5-day horizon serves as the main research view, while the shorter horizons help investors understand how immediate or persistent a model preference appears to be.</p>
<p>A rank should be read as a relative position inside that universe. If a stock is ranked third out of 91, the model has placed it near the top of the market for that particular forecast horizon. The percentile shown on the website is simply another way of expressing the same relative position. A stock around the 98th percentile sits close to the top of the ranking; the figure does not represent a probability of profit or an expected return.</p>
<p>That distinction is especially useful for investors who are choosing between several possible positions. If four stocks all look interesting from a fundamental or technical perspective, /Alpha provides an additional way to compare them. A stock near the top of the 5-day ranking has a different model profile from one near the bottom. That information can help determine where to spend more research time before deciding whether a position is worth taking.</p>
<p>The website also publishes a separate directional classification for each stock: Positive, Neutral or Negative. Rank and direction are designed to be read together. A stock may rank highly because the model expects it to perform better than most of the universe, while its directional classification remains Neutral or Negative. This can happen when the overall market backdrop is weak and relative strength does not imply an attractive absolute outlook. The reverse can also occur in a strong market, where a stock receives a Positive signal but still ranks below many peers that the model prefers more strongly.</p>
<p>The <a href="${rel('/archive/2026-08-17/')}">August 17, 2026 public signal</a> illustrates how these pieces work together. MICH ranked first on the 1-day horizon with a Positive signal. For someone concentrating on the next trading session, that is an obvious stock to examine more closely. The picture becomes more cautious over longer windows: MICH was around fourth on the 3-day horizon with a Neutral signal and around fourth on the 5-day horizon with a Negative signal. The model therefore expressed its strongest preference at the shortest horizon, with a weaker directional view as the forecast window extended.</p>
<p>UEGC showed a different pattern. It ranked second and Positive over 1 day, second and Neutral over 3 days, and first and Neutral over 5 days. Its directional classification softened beyond the immediate session, but its relative position remained very strong across several horizons. For a retail investor, that kind of persistence is useful because it identifies a stock that repeatedly sits near the top of the model's ordering rather than appearing there only for a single short-term forecast.</p>
<p>At that point, the usual investment work still matters. An investor considering UEGC would want to look at liquidity, volume, recent disclosures, sector conditions, price structure, portfolio exposure and the amount of downside that would be acceptable if the trade failed. /Alpha narrows the field and provides a quantitative view; the eventual decision still depends on price, risk and the investor's own assessment.</p>
<p>GGCC provides another useful example. On August 17 it ranked third with a Positive 1-day signal, first with a Neutral 3-day signal and fifth with a Neutral 5-day signal. Its movement from the previous run adds another layer of information. GGCC had been around eleventh on the previous 1-day ranking and then moved to third. The website displays that change as Δ, or rank movement.</p>
<p>Rank movement helps investors distinguish between a stock that has remained near the top for several sessions and one whose model position has improved sharply. Two stocks can share the same rank today while having arrived there through very different paths. A rapid move upward in the ranking signals a meaningful change in the model's relative assessment and may justify a closer look.</p>
<p>CEFM is a useful reminder to read the whole output rather than only the first column. It ranked fourth with a Positive signal over 1 day, then fifth with a Negative signal over 3 days and seventh with a Negative signal over 5 days. The immediate forecast was relatively strong, while the multi-session directional view was less favorable. Investors who move between the horizons can see that difference immediately and avoid treating a strong short-term rank as a general bullish view extending across the week.</p>
<p>For most retail investors, the simplest use of /Alpha is as a market filter. There is little value in studying all 91 eligible stocks with equal intensity every evening. The ranking can bring the stronger model candidates to the front, after which the different horizons, directional classifications and rank movements provide additional context. The website also keeps <a href="${rel('/search/')}">public model history for individual stocks</a>, so investors can see whether a current ranking is unusual, persistent or part of a recent change in the model's view.</p>
<p>The <a href="${rel('/archive/')}">dated public forecasts are preserved in the archive</a>, and the stock pages show previous ranks, percentiles, directional classifications and rank movements. That history gives investors a way to evaluate the model using the forecasts that were actually published at the time. A forecasting system becomes much easier to judge when old calls remain visible after the outcome is known.</p>
<p>Chronology is central to the <a href="${rel('/methodology/')}">underlying research process</a>. Each completed EGX session is treated as a defined information state. Data availability, freshness and stock eligibility are resolved before inference, after which the reviewed deep-learning model package produces the cross-sectional rankings. Realized outcomes are evaluated only after the corresponding forecast horizon has matured. This sequencing is important because financial backtests can become misleading when information that was unavailable at the decision point finds its way into the historical simulation.</p>
<p>The published historical evidence currently covers 906 held-out test dates. On the 5-day horizon, the historical mean RankIC is approximately +0.028, with a positive top-minus-bottom spread of about 0.18 percentage points in the held-out test. RankIC measures the relationship between the model's ordering of stocks and the subsequent ordering of their realized performance. In practical terms, the positive historical value indicates that higher-ranked stocks showed some tendency to outperform lower-ranked stocks within the held-out sample.</p>
<p>The size of that relationship should be viewed in the context of financial markets, where useful predictive effects are usually modest. The more relevant question is whether the signal continues to behave consistently outside the historical sample. That is why the public product separates historical validation from live validation.</p>
<p>The current live-validation status is marked as “evidence accumulating.” For the 5-day horizon, the public record contains 23 matured prediction days, while the governance framework requires 60 matured days before the live metrics are treated as ready. This gives investors a clear picture of where the evidence stands today. The historical results are available for inspection, while the production record is still building enough history for a more meaningful live assessment.</p>
<p>A practical routine can remain simple. Investors looking for a new position can start with the horizon that best matches their intended holding period, then compare the neighboring horizons to see how stable the model's preference appears. A strong rank combined with a supportive directional classification and favorable rank movement deserves more attention than a single attractive number viewed in isolation. Once a stock reaches that stage, the decision process moves back to the familiar questions of price, liquidity, disclosures, technical structure, sector exposure and portfolio risk.</p>
<p>The signal can also be useful for stocks that are already in a portfolio. If a holding begins to fall sharply through the 5-day or 10-day ranking, the change can prompt a review of the original thesis. The investor may ultimately decide that nothing material has changed, but the model has introduced a fresh piece of evidence that deserves consideration. The same applies in the other direction when a stock rises steadily through the rankings.</p>
<p>This can be particularly valuable in a market where investment ideas often spread socially. A stock may gain attention because it is moving, because a well-followed investor mentions it, or because discussion around it has become unusually active. The published /Alpha ranking process operates independently of an individual investor's personal attachment to a stock or the opinions circulating in that investor's own trading circles. It therefore offers a consistent quantitative reference point that can either support or challenge the prevailing narrative.</p>
<p>There are still many decisions the model leaves to the investor. A highly ranked stock may open at a price that makes the trade unattractive. Liquidity may be too thin for the intended position size. A new disclosure may arrive after the model's information state was locked. Existing portfolio exposure may make another position in the same sector undesirable. These are ordinary investment considerations, and they remain part of the final decision.</p>
<p>The case for trusting EGX /Alpha rests on what can be examined over time: forecasts are generated from completed market states, the eligible universe is ranked across several native horizons, directional classifications are published separately from rank, dated outputs remain available, historical validation is disclosed and live evidence is allowed to mature before being treated as established performance. Confidence in the signal should grow or weaken with the evidence that accumulates.</p>
<p>For a retail investor, the practical benefit is straightforward. EGX /Alpha reduces a large market universe to a more manageable set of candidates, shows how the model's view changes with the investment horizon and provides a consistent quantitative opinion that can be compared with the investor's own research. The uncertainty of the market remains, but the process of deciding where to look and what to question becomes more structured.</p>
<p><em>EGX /Alpha is published for research and informational purposes. Its rankings and directional classifications are not execution instructions, guarantees of future returns or personalized investment advice.</em></p>
</article><aside class="official-resources"><span>OFFICIAL MARKET RESOURCES</span><p>For official exchange and regulatory information, consult the <a href="https://www.egx.com.eg/en/HomePage.aspx" target="_blank" rel="noopener noreferrer external">Egyptian Exchange (EGX)</a> and the <a href="https://fra.gov.eg/en/%D8%B3%D9%88%D9%82-%D8%A7%D9%84%D9%85%D8%A7%D9%84/" target="_blank" rel="noopener noreferrer external">Financial Regulatory Authority capital-market resources</a>.</p></aside></div>${siteFooter()}</main>`
  });
}
