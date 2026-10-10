export function summarize(user, repositories, owner) {
  const repos = repositories.filter(r => !r.private && r.owner?.login?.toLowerCase() === owner.toLowerCase() && r.name.toLowerCase() !== owner.toLowerCase());
  const original = repos.filter(r => !r.fork);
  const languages = {};
  for (const repo of original) if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
  return {
    repositories: repos.length,
    stars: original.reduce((n, r) => n + (r.stargazers_count || 0), 0),
    forks: original.reduce((n, r) => n + (r.forks_count || 0), 0),
    followers: user.followers,
    languages: Object.entries(languages).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
  };
}
export const xml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function render(metrics, date) {
  const cells = [
    ['PUBLIC REPOSITORIES', metrics.repositories],
    ['STARS · ORIGINAL REPOS', metrics.stars],
    ['FORKS · ORIGINAL REPOS', metrics.forks],
    ['GITHUB FOLLOWERS', metrics.followers],
  ];
  const shown = metrics.languages.slice(0, 5);
  const height = shown.length ? 306 : 206;
  const totals = cells.map(([label, count], i) => '<g transform="translate(' + (36 + i * 294) + ',0)"><text y="108" fill="#f0f6fa" font-size="44" font-weight="700">' + count.toLocaleString('en-US') + '</text><text y="140" fill="#b5c7d8" font-size="11" letter-spacing=".6">' + label + '</text></g>').join('');
  const colors = ['#b6ffd4','#79dfdb','#b7b9ff','#ffcaa2','#c1d2e6'];
  const total = metrics.languages.reduce((sum, item) => sum + item[1], 0);
  let offset = 36;
  const bars = shown.map(([language, count], i) => {
    const width = count / total * 1128;
    const bar = '<rect x="' + offset + '" y="217" width="' + width + '" height="10" fill="' + colors[i] + '"/>';
    offset += width;
    return bar;
  }).join('');
  const remainder = total - shown.reduce((sum, item) => sum + item[1], 0);
  const other = remainder ? '<rect x="' + offset + '" y="217" width="' + (remainder / total * 1128) + '" height="10" fill="#64748b"/>' : '';
  const languageLabels = shown.map(([language, count], i) => '<circle cx="' + (42 + i * 225) + '" cy="254" r="4" fill="' + colors[i] + '"/><text x="' + (54 + i * 225) + '" y="259" fill="#c8d7e6" font-size="13">' + xml(language.slice(0, 20)) + ' · ' + count + '</text>').join('');
  const languages = shown.length ? '<path d="M36 168H1164" stroke="#2a3b4d"/><text x="36" y="198" fill="#9eb4c9" font-size="11" letter-spacing="1.2">PRIMARY LANGUAGES · ORIGINAL REPOSITORY COUNT</text>' + bars + other + languageLabels : '';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="' + height + '" viewBox="0 0 1200 ' + height + '" role="img" aria-labelledby="title"><title id="title">GitHub metrics updated ' + xml(date) + ': ' + cells.map(([label, count]) => label + ' ' + count).join(', ') + '</title><rect width="1200" height="' + height + '" rx="20" fill="#101b29"/><g font-family="Segoe UI,Arial,sans-serif"><text x="36" y="35" fill="#b6ffd4" font-size="12" letter-spacing="2">THE PUBLIC FOOTPRINT</text><text x="1164" y="35" text-anchor="end" fill="#9eb4c9" font-size="12">' + xml(date) + ' UTC</text>' + totals + languages + '<text x="36" y="' + (height - 16) + '" fill="#9eb4c9" font-size="11">Public data only · Profile repository excluded · Refreshed daily' + (remainder ? ' · Gray = other languages' : '') + '</text></g></svg>\n';
}
export function replaceMetrics(readme, metrics, date) {
  const pattern = /<!-- METRICS:START -->[\s\S]*?<!-- METRICS:END -->/;
  if (!pattern.test(readme)) throw new Error('README metrics markers missing');
  const languages = metrics.languages.map(([name, count]) => xml(name) + ': ' + count).join(' · ') || 'No primary languages reported yet';
  const text = '**' + metrics.repositories + ' public repositories** · **' + metrics.stars + ' stars** · **' + metrics.forks + ' forks** · **' + metrics.followers + ' followers**\n\n<sub>' + languages + '. Updated ' + date + ' UTC.</sub>';
  return readme.replace(pattern, () => '<!-- METRICS:START -->\n' + text + '\n<!-- METRICS:END -->');
}
