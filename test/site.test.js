const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const root = join(__dirname, '..');
const read = (file) => readFileSync(join(root, file), 'utf8');

describe('MaplePrep public information site', () => {
  it('publishes home, privacy, terms, styles, and missing-page files', () => {
    for (const file of ['index.html', 'privacy/index.html', 'terms/index.html', '404.html', 'styles.css', '.nojekyll']) {
      assert.doesNotThrow(() => read(file), `${file} should exist`);
    }
  });

  it('gives every public page responsive metadata and working site navigation', () => {
    for (const file of ['index.html', 'privacy/index.html', 'terms/index.html']) {
      const html = read(file);
      assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
      assert.match(html, /<title>[^<]+MaplePrep[^<]*<\/title>/);
      assert.match(html, /href="\/maple-prep-legal\/privacy\/"/);
      assert.match(html, /href="\/maple-prep-legal\/terms\/"/);
      assert.match(html, /href="https:\/\/github\.com\/apair\/maple-prep-legal\/issues\/new"/);
    }
  });

  it('publishes the required privacy disclosures and contact route', () => {
    const privacy = read('privacy/index.html');
    for (const phrase of ['Information processed by the app', 'Storage, retention, and deletion', 'Service providers', 'rewarded advertisement', 'does not sell personal information']) {
      assert.match(privacy, new RegExp(phrase, 'i'));
    }
  });

  it('publishes energy and one-time purchase terms plus the government-independence disclaimer', () => {
    const terms = read('terms/index.html');
    for (const phrase of ['MaplePrep Pro', '30 practice energy', 'one-time, non-renewing purchase', 'Restore purchases', 'not affiliated with, endorsed by, or operated by']) {
      assert.match(terms, new RegExp(phrase, 'i'));
    }
  });

  it('contains no obsolete generative AI or recurring-subscription claims', () => {
    const site = ['index.html', 'privacy/index.html', 'terms/index.html'].map(read).join('\n');
    assert.doesNotMatch(site, /AI Tutor|Tutor content|OpenAI|renews automatically|weekly subscription|monthly subscription/i);
  });

  it('does not expose private application source or developer placeholders', () => {
    const site = ['index.html', 'privacy/index.html', 'terms/index.html'].map(read).join('\n');
    assert.doesNotMatch(site, /github\.com\/apair\/maple-prep(?:["/])/);
    assert.doesNotMatch(site, /replace-with|your-domain|your-backend/i);
  });
});
