import assert from 'node:assert/strict';
import fs from 'node:fs';

const home = fs.readFileSync('_site/index.html', 'utf8');
const today = fs.readFileSync('_site/today/index.html', 'utf8');
const homeCss = fs.readFileSync('assets/home.css', 'utf8');
const appJs = fs.readFileSync('_site/assets/app.js', 'utf8');

for (const html of [home, today]) {
  assert.ok(html.includes('Turn the EGX close into a ranked market view.'), 'hero should pitch the ranked-market value');
  assert.ok(html.includes('class="investor-signal-card"'), 'signal should use the investor decision card');
  assert.ok(html.includes('class="investor-decision-grid"'), 'signal should expose rank, horizon and publication in one reading frame');
  assert.ok(html.includes('Model view'), 'signal should lead with the model interpretation');
  assert.ok(html.includes('Public position'), 'public rank should be visible once in the decision frame');
  assert.ok(html.includes('Evaluation window'), 'horizon should be explained for investors');
  assert.ok(html.includes('Unlock the broader ranked view'), 'signal card should carry the conversion CTA');
  assert.ok(html.includes('class="value-proof-grid"'), 'hero should explain the system value without repeating signal facts');
  assert.equal(html.includes('class="mind-summary"'), false, 'old duplicate ticker/signal/window summary must be removed');
  assert.equal(html.includes('class="compact-strip"'), false, 'archive/search/methodology navigation must not be duplicated below the hero');
  assert.equal(html.includes('Track one EGX signal after the close.'), false, 'old weak hero pitch must be removed');
  assert.equal(html.includes('data-theme-label'), false, 'homepage theme control must not contain visible text');
  assert.ok(html.includes('theme-bulb'), 'homepage theme control should render a bulb icon');
}

for (const selector of [
  '.value-pitch-card',
  '.investor-signal-card',
  '.investor-verdict',
  '.decision-cell',
  '.market-context',
  '.market-metric'
]) {
  assert.ok(homeCss.includes(selector), `home CSS should define ${selector}`);
}

assert.ok(homeCss.includes('padding: clamp(30px, 4vw, 52px)'), 'pitch card should retain safe responsive padding');
assert.ok(homeCss.includes('padding: clamp(28px, 3.5vw, 46px)'), 'signal card should retain safe responsive padding');
assert.ok(homeCss.includes('overflow-wrap: anywhere'), 'nested investor content should not collide with card boundaries');
assert.ok(homeCss.includes('min-width: 0'), 'grid children should be allowed to shrink safely');

assert.ok(appJs.includes('installThemeControls'), 'client should normalise icon-only theme controls on every page');
assert.ok(appJs.includes('theme-icon-button'), 'theme control should use the compact icon class');
assert.ok(appJs.includes('theme-bulb'), 'theme control should inject the bulb SVG');
assert.equal(appJs.includes("label.textContent = 'Theme'"), false, 'client must not restore visible Theme text');

console.log('test-homepage-layout passed');
