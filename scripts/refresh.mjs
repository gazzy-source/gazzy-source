import { readFile, writeFile } from 'node:fs/promises';
import { summarize, render, replaceMetrics } from './metrics.mjs';

const owner = 'gazzy-source';
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'GazzyLabs-profile', 'X-GitHub-Api-Version': '2022-11-28' };
if (process.env.GH_TOKEN) headers.Authorization = 'Bearer ' + process.env.GH_TOKEN;
async function get(path) {
  const response = await fetch('https://api.github.com' + path, { headers, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error('GitHub returned ' + response.status + ' for ' + path);
  return response.json();
}
const user = await get('/users/' + owner);
if (!Number.isInteger(user.followers)) throw new Error('Invalid user response');
const repositories = [];
for (let page = 1; ; page++) {
  const batch = await get('/users/' + owner + '/repos?type=owner&per_page=100&page=' + page);
  if (!Array.isArray(batch)) throw new Error('Invalid repository response');
  repositories.push(...batch);
  if (batch.length < 100) break;
}
const metrics = summarize(user, repositories, owner);
const date = new Date().toISOString().slice(0, 10);
const readme = replaceMetrics(await readFile('README.md', 'utf8'), metrics, date);
const svg = render(metrics, date);
// All network calls and validation finish before any artifact is written.
// The workflow commits only if every step succeeds.
await writeFile('README.md', readme);
await writeFile('assets/metrics.svg', svg);
console.log(JSON.stringify({ updated: date, ...metrics }));
