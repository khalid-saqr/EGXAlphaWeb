import assert from 'node:assert/strict';
import fs from 'node:fs';

const home = fs.readFileSync('_site/index.html', 'utf8');
const today = fs.readFileSync('_site/today/index.html', 'utf8');
const homeCss = fs.readFileSync('assets/home.css', 'utf8');
const appCss = fs.readFileSync('assets/app.css', 'utf8');

function visibleMain(html) {
  const start = html.indexOf('<main');
  const end = html.lastIndexOf('</main>');
  return start >= 0 && end >= 0 ? html.slice(start, end + 7) : html;
}

for (const page of [home, today]) {
  const html = visibleMain(page);
  for (const required of [
    'LATEST COMPLETED MODEL RUN',
    'EGX /ALPHA',
    'DEEP-LEARNING MARKET RANKING',
    'MODEL OUTPUT',
    'Cross-sectional ranking',
    'PUBLICATION NOTE',
    'OBSERVE',
    'VALIDATE',
    'INFER',
    'RANK',
    'PUBLISH',
    'INSTITUTIONAL'
  ]) assert.ok(html.includes(required), `production V1 compatibility UI should include ${required}`);

  for (const removed of [
    'Today’s free EGX signal',
    'One stock is free',
    'Want the full ranking?',
    'Get the full daily ranking',
    'Get early access',
    'signal-share-card',
    'conversion-rail',
    'PUBLICATION COMPATIBILITY STATE',
    'compatibility wire'
  ]) assert.equal(html.includes(removed), false, `retail or engineering-facing copy/component must be removed: ${removed}`);
}

for (const required of [
  'grid-template-columns: 86px 70px minmax(180px,1fr) 190px',
  '@media (max-width: 620px)',
  'font-variant-numeric: tabular-nums',
  'grid-template-columns: repeat(5, minmax(0, 1fr))',
  'flex-direction: column',
  'overflow: visible'
]) assert.ok(homeCss.includes(required), `institutional home CSS should preserve ${required}`);

for (const required of [
  'grid-template-columns: repeat(4, minmax(0, 1fr)) 36px',
  'font-size: clamp(.52rem, 2.2vw, .62rem)',
  'white-space: nowrap'
]) assert.ok(appCss.includes(required), `mobile navigation CSS should preserve ${required}`);

assert.ok(home.includes('PUBLIC ROW / 88 UNIVERSE'), 'current V1 may use the genuine comparison count supplied by the live wire');
assert.ok(home.includes('<strong>CURRENT</strong><em>single-row public format</em>'), 'temporary V1 publication state should be factual but visually quiet');
console.log('test-homepage-layout passed');
