import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize, render, replaceMetrics } from './metrics.mjs';
const repo = (name, extra = {}) => ({ name, owner: { login: 'gazzy-source' }, private: false, fork: false, stargazers_count: 2, forks_count: 1, language: 'Python', ...extra });
test('metrics exclude private work, other owners, profile and inherited fork stars', () => {
  const result = summarize({ followers: 4 }, [
    repo('gazzy-source'), repo('public-project'), repo('private-project', { private: true }),
    repo('fork', { fork: true, stargazers_count: 100 }),
    repo('another-owner', { owner: { login: 'other' } }),
  ], 'gazzy-source');
  assert.deepEqual(result, { repositories: 2, stars: 2, forks: 1, followers: 4, languages: [['Python', 1]] });
});
test('an empty account renders without invalid values', () => {
  const result = summarize({ followers: 0 }, [], 'gazzy-source');
  const svg = render(result, '2026-10-10');
  assert.ok(svg.includes('PUBLIC REPOSITORIES 0'));
  assert.doesNotMatch(svg, /NaN|Infinity|undefined/);
});
test('generated SVG escapes text from GitHub', () => {
  const result = summarize({ followers: 1 }, [repo('project', { language: 'A<&' })], 'gazzy-source');
  assert.ok(render(result, '2026-10-10').includes('A&lt;&amp;'));
});
test('refresh preserves curated profile content and requires markers', () => {
  const metrics = summarize({ followers: 0 }, [], 'gazzy-source');
  const updated = replaceMetrics('Before\n<!-- METRICS:START -->old<!-- METRICS:END -->\nAfter', metrics, '2026-10-10');
  assert.ok(updated.startsWith('Before\n'));
  assert.ok(updated.endsWith('\nAfter'));
  assert.throws(() => replaceMetrics('No markers', metrics, '2026-10-10'), /markers missing/);
});
