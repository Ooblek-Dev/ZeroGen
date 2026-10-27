const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SECRET_PATTERNS = [
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g, critical: true },
  { name: 'AWS Secret', regex: /aws.{0,20}secret.{0,20}[A-Za-z0-9\/+=]{40}/gi, critical: true },
  { name: 'GitHub Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,255}/g, critical: true },
  { name: 'Private Key', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/g, critical: true },
  { name: 'Generic API Key', regex: /api[_-]?key\s*[:=]\s*['"][A-Za-z0-9-_]{20,}['"]/gi, critical: false },
  { name: 'Env file committed', regex: null, critical: true, fileCheck: true }
];

function getGitDiffFiles() {
  try {
    const out = execSync('git diff --name-only --cached || git diff --name-only HEAD~1 HEAD || git ls-files', { encoding: 'utf8' });
    return out.split('\n').filter(Boolean);
  } catch { return []; }
}

async function scan({ failOnSecurity }) {
  const findings = [];
  let critical = 0;

  // 1. Check for .env committed
  const tracked = (() => { try { return execSync('git ls-files', {encoding:'utf8'}).split('\n'); } catch { return []; } })();
  const envFiles = tracked.filter(f => /\.env(\.|$)/.test(f) && !f.includes('.example'));
  if (envFiles.length) {
    findings.push({ type: 'Env file committed', files: envFiles, critical: true });
    critical++;
  }

  // 2. Regex scan on staged + recent files
  const filesToScan = getGitDiffFiles().slice(0, 100); // limit 100 files for perf
  for (const file of filesToScan) {
    if (!fs.existsSync(file)) continue;
    if (/(node_modules|dist|\.git|\.next|package-lock)/.test(file)) continue;
    if (fs.statSync(file).size > 1024*1024) continue; // skip >1MB
    try {
      const content = fs.readFileSync(file, 'utf8');
      for (const pat of SECRET_PATTERNS) {
        if (pat.fileCheck) continue;
        const matches = content.match(pat.regex);
        if (matches) {
          findings.push({ type: pat.name, file, matches: matches.slice(0,3), critical: pat.critical });
          if (pat.critical) critical++;
        }
      }
    } catch {}
  }

  // 3. npm audit if Node project
  let audit = null;
  if (fs.existsSync('package.json')) {
    try {
      const out = execSync('npm audit --json || true', { encoding: 'utf8', maxBuffer: 10*1024*1024 });
      const data = JSON.parse(out);
      audit = {
        vulnerabilities: data.metadata?.vulnerabilities || {},
        total: Object.values(data.metadata?.vulnerabilities || {}).reduce((a,b)=>a+b,0)
      };
    } catch {}
  }

  console.log(`Security: ${findings.length} findings, ${critical} critical`);
  findings.forEach(f => console.log(` - [${f.critical?'CRITICAL':'WARN'}] ${f.type} in ${f.file || f.files}`));

  return { findings, critical, total: findings.length, audit };
}

module.exports = { scan };
