import assert from 'node:assert/strict';
import fs from 'node:fs';

const home = fs.readFileSync('_site/index.html', 'utf8');
const today = fs.readFileSync('_site/today/index.html', 'utf8');
const homeCss = fs.readFileSync('assets/home.css', 'utf8');
const appJs = fs.readFileSync('_site/assets/app.js', 'utf8');
const latest = JSON.parse(fs.readFileSync('_site/data/latest.json', 'utf8'));
const displaySymbol = latest.asset?.display_symbol || String(latest.asset?.symbol || latest.public_signal?.stock_symbol || '').split(':').pop();

for (const html of [home, today]) {
  assert.ok(html.includes('See what the ranking surfaced after the EGX close.'), 'hero should pitch the market-wide ranking value');
  assert.ok(html.includes('data-screenshot-card'), 'page should render the screenshot-ready public card');
  assert.ok(html.includes('class="signal-share-card'), 'signal should use the square social-card component');
  assert.ok(html.includes('class="conversion-rail"'), 'full-access explanation should sit outside the public card');
  assert.ok(html.includes('One result is public. The wider ranked market view is not.'), 'conversion rail should explain the missing wider view');
  assert.ok(html.includes('Request the complete ranked view'), 'page should contain the single primary conversion CTA');
  assert.ok(html.includes('Screenshot-ready public card'), 'share controls should be clearly separated from the card');
  assert.ok(html.includes('theme-bulb'), 'theme control should render the bulb icon');
  assert.equal(html.includes('data-theme-label'), false, 'theme control must not contain visible Theme text');
  assert.equal(html.includes('class="investor-hero"'), false, 'failed two-card investor hero must be removed');
  assert.equal(html.includes('class="value-pitch-card"'), false, 'failed narrow pitch card must be removed');
  assert.equal(html.includes('class="investor-signal-card"'), false, 'failed nested investor signal card must be removed');
}

assert.ok(home.includes(displaySymbol), 'homepage should render the current symbol from the incoming payload');
assert.ok(home.includes(latest.trading_date), 'homepage should preserve the incoming trading date in machine-readable markup');
assert.ok(home.includes(latest.public_signal?.plain_direction || latest.public_copy?.investor_read), 'homepage should render the incoming public direction');
assert.ok(home.includes(latest.funnel_context?.full_product_hint), 'conversion rail should use the incoming funnel message');

const toolbarStart = home.indexOf('class="share-card-toolbar"');
const cardStart = home.indexOf('class="signal-share-card');
const cardEnd = home.indexOf('</article>', cardStart);
assert.ok(toolbarStart >= 0 && toolbarStart < cardStart, 'share toolbar should be outside and before the screenshot card');
const cardHtml = home.slice(cardStart, cardEnd);
assert.equal(cardHtml.includes('data-share'), false, 'share control must not appear inside the screenshot card');
assert.equal(cardHtml.includes('data-copy'), false, 'copy control must not appear inside the screenshot card');
assert.equal(cardHtml.includes('mailto:'), false, 'commercial CTA must not appear inside the screenshot card');
assert.ok(cardHtml.includes('EGXRESEARCH.COM'), 'screenshot card should carry the branded domain');
assert.ok(cardHtml.includes('Public position'), 'screenshot card should show the public rank slot');
assert.ok(cardHtml.includes('Evaluation window'), 'screenshot card should show the dynamic horizon slot');
assert.ok(cardHtml.includes('Market context') || !Object.values(latest.market_snapshot || {}).some(value => value !== null), 'market section should render when metrics exist');

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
