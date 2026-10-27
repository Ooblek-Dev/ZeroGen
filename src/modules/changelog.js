const { execSync } = require('child_process');

function getCommits() {
  try {
    const log = execSync('git log --oneline -20 --pretty=format:"%h %s (%an)"', { encoding: 'utf8' });
    return log.split('\n').filter(Boolean);
  } catch { return []; }
}

function parseConventional(commits) {
  const buckets = { feat: [], fix: [], chore: [], docs: [], refactor: [], perf: [], other: [] };
  commits.forEach(c => {
    const msg = c.toLowerCase();
    if (msg.includes('feat')) buckets.feat.push(c);
    else if (msg.includes('fix')) buckets.fix.push(c);
    else if (msg.includes('docs')) buckets.docs.push(c);
    else if (msg.includes('refactor')) buckets.refactor.push(c);
    else if (msg.includes('perf')) buckets.perf.push(c);
    else if (msg.includes('chore')) buckets.chore.push(c);
    else buckets.other.push(c);
  });
  return buckets;
}

async function generate() {
  const commits = getCommits();
  const buckets = parseConventional(commits);

  let md = `### Changelog (last ${commits.length} commits)\n\n`;
  if (buckets.feat.length) md += `**Features:**\n${buckets.feat.map(c=>`- ${c}`).join('\n')}\n\n`;
  if (buckets.fix.length) md += `**Fixes:**\n${buckets.fix.map(c=>`- ${c}`).join('\n')}\n\n`;
  if (buckets.perf.length) md += `**Perf:**\n${buckets.perf.map(c=>`- ${c}`).join('\n')}\n\n`;
  if (buckets.other.length) md += `**Other:**\n${buckets.other.slice(0,10).map(c=>`- ${c}`).join('\n')}\n\n`;

  const versionBump = buckets.feat.length ? 'minor' : buckets.fix.length ? 'patch' : 'none';

  return { commits, buckets, markdown: md, versionBump, raw: commits.join('\n') };
}

module.exports = { generate };
