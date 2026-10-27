const fs = require('fs');
const { execSync } = require('child_process');

async function check() {
  const result = { branchOk: true, conventionalOk: true, versionFile: null, issues: [] };

  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    // Branch naming guard
    const allowedPatterns = [/^main$/, /^master$/, /^develop$/, /^feature\//, /^fix\//, /^release\//, /^hotfix\//];
    if (!allowedPatterns.some(rx => rx.test(branch))) {
      result.branchOk = false;
      result.issues.push(`Branch \`${branch}\` tidak pakai conventional naming (feature/, fix/, release/)`);
    }

    // Check package.json version exists
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
      result.versionFile = pkg.version || '0.0.0';
    }

    // Conventional commits check last 5
    const lastMsgs = execSync('git log --pretty=format:"%s" -5', { encoding: 'utf8' }).split('\n');
    const conventionalRx = /^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\(.+\))?: .+/;
    const bad = lastMsgs.filter(m => m && !conventionalRx.test(m));
    if (bad.length > 2) {
      result.conventionalOk = false;
      result.issues.push(`${bad.length} commit tidak conventional: ${bad.slice(0,3).join(', ')}`);
    }

  } catch (e) { result.issues.push(e.message); }

  return result;
}

module.exports = { check };
