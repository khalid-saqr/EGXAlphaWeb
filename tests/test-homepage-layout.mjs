import assert from 'node:assert/strict';
import fs from 'node:fs';

const home = fs.readFileSync('_site/index.html', 'utf8');
const today = fs.readFileSync('_site/today/index.html', 'utf8');
const homeCss = fs.readFileSync('assets/home.css', 'utf8');
const appJs = fs.readFileSync('_site/assets/app.js', 'utf8');
const latest = JSON.parse(fs.readFileSync('_site/data/latest.json', 'utf8'));
const displaySymbol = latest.asset?.display_symbol || String(latest.asset?.symbol || latest.public_signal?.stock_symbol || '').split(':').pop();
const rank = latest.public_signal?.rank_within_horizon ?? latest.signal?.rank_within_horizon;

function visibleMain(html) {
  const start = html.indexOf('<main');
  const end = html.lastIndexOf('</main>');
  return start >= 0 && end >= 0 ? html.slice(start, end + 7) : html;
}

const rejectedVisibleCopy = [
  'One free signal from today’s complete EGX ranking',
  'See the share EGX /Alpha ranked',
  'eligible Egyptian shares',
  'defined model horizon',
  'relative rank',
  'Direction signal',
  'Rank in today’s model',
  'Model horizon',
  'Market context',
  'not a suggested holding period',
  'How to use this signal',
  'Request access to the complete daily ranking',
  'Screenshot-ready public card',
  'Rank and direction are separate model outputs.',
  'EGXRESEARCH.COM',
  'Clear model context',
  'Trackable history'
];

for (const html of [home, today]) {
  const visible = visibleMain(html);
  assert.ok(visible.includes('Today’s free EGX signal'), 'hero should identify the free daily signal immediately');
  assert.ok(visible.includes(`See the stock ranked #${rank} after today’s close.`), 'hero should state the rank in plain language');
  assert.ok(visible.includes('One stock is free. The full ranking shows the rest.'), 'hero should explain the commercial hook simply');
  assert.ok(visible.includes('data-screenshot-card'), 'page should render the screenshot-ready public card');
  assert.ok(visible.includes('class="signal-share-card'), 'signal should use the square social-card component');
  assert.ok(visible.includes('class="conversion-rail"'), 'full-ranking prompt should sit outside the public card');
  assert.ok(visible.includes('Want the full ranking?'), 'conversion rail should use a direct question');
  assert.ok(visible.includes('What should you do?'), 'page should give a simple next step');
  assert.ok(visible.includes('Get the full daily ranking'), 'page should contain a short primary CTA');
  assert.ok(visible.includes('Share today’s card'), 'share toolbar should use simple language');
  assert.ok(visible.includes('theme-bulb'), 'theme control should render the bulb icon');
  assert.equal(visible.includes('data-theme-label'), false, 'theme control must not contain visible Theme text');
  for (const rejected of rejectedVisibleCopy) {
    assert.equal(visible.includes(rejected), false, `technical or removed homepage copy must stay absent: ${rejected}`);
  }
}

assert.ok(home.includes(displaySymbol), 'homepage should render the current symbol from the incoming payload');
assert.ok(home.includes(latest.trading_date), 'homepage should preserve the incoming trading date in machine-readable markup');
assert.ok(visibleMain(home).includes('Copyright © EGX Research. All rights reserved.'), 'homepage should retain the copyright line');

const toolbarStart = home.indexOf('class="share-card-toolbar"');
const cardStart = home.indexOf('class="signal-share-card');
const cardEnd = home.indexOf('</article>', cardStart);
assert.ok(toolbarStart >= 0 && toolbarStart < cardStart, 'share toolbar should be outside and before the screenshot card');
const cardHtml = home.slice(cardStart, cardEnd);
assert.equal(cardHtml.includes('data-share'), false, 'share control must not appear inside the screenshot card');
assert.equal(cardHtml.includes('data-copy'), false, 'copy control must not appear inside the screenshot card');
assert.equal(cardHtml.includes('mailto:'), false, 'commercial CTA must not appear inside the screenshot card');
assert.ok(cardHtml.includes('TODAY’S SIGNAL'), 'card should identify itself in plain language');
assert.ok(cardHtml.includes('>Signal<'), 'card should use the short signal label');
assert.ok(cardHtml.includes('Rank today'), 'card should use the short rank label');
assert.ok(cardHtml.includes('Time frame'), 'card should use the short horizon label');
assert.ok(cardHtml.includes('Today’s numbers') || !Object.values(latest.market_snapshot || {}).some(value => value !== null), 'market data should use a plain heading');
assert.ok(cardHtml.includes('Latest price') || latest.market_snapshot?.latest_close == null, 'close should be labelled as a price');

for (const required of [
  'grid-template-columns: minmax(0, 720px) minmax(300px, 1fr)',
  'aspect-ratio: 1 / 1',
  '.signal-share-card',
  '.conversion-rail',
  '.recent-public-records',
  'overflow-wrap: anywhere',
  'min-width: 0'
]) {
  assert.ok(homeCss.includes(required), `home CSS should preserve: ${required}`);
}

assert.equal(homeCss.includes('text-overflow: ellipsis'), false, 'ticker must never be truncated with an ellipsis');
assert.ok(homeCss.includes('@media (max-width: 759px)'), 'mobile card should have a deliberate non-square layout');
assert.ok(homeCss.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'mobile market metrics should use a readable two-column layout');

assert.ok(appJs.includes('installThemeControls'), 'client should normalise icon-only theme controls on every page');
assert.ok(appJs.includes('theme-icon-button'), 'theme control should use the compact icon class');
assert.ok(appJs.includes('theme-bulb'), 'theme control should inject the bulb SVG');
assert.equal(appJs.includes("label.textContent = 'Theme'"), false, 'client must not restore visible Theme text');

const recentRows = (home.match(/class="recent-record"/g) || []).length;
assert.ok(recentRows <= 3, 'homepage should show no more than three recent public records');

console.log('test-homepage-layout passed');
