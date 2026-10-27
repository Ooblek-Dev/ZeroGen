
const fs = require('fs');
const path = require('path');
const SECRET_PATTERNS = [
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/, critical: true },
  { name: 'GitHub Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,}/, critical: true },
  { name: 'OpenAI Key', regex: /sk-(proj-)?[A-Za-z0-9-_]{20,}/, critical: true },
  { name: 'Private Key', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, critical: true },
];
const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'coverage']);
const IGNORE_FILES = ['package-lock.json', 'sbom.cyclonedx.json'];
function walkFiles(dir, files = [], depth = 0) {
  if (depth > 6 || files.length >= 200) return files;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (files.length >= 200) break;
      if (entry.name.startsWith('.') && entry.name !== '.env') continue;
      if (IGNORE_DIRS.has(entry.name)) continue;
      if (IGNORE_FILES.includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkFiles(full, files, depth+1);
      else if (entry.isFile() && /\.(js|ts|tsx|jsx|json)$/i.test(entry.name)) {
        try { const stat = fs.statSync(full); if (stat.size <= 1024*1024) files.push(full); } catch {}
      }
    }
  } catch {}
  return files;
}
async function scan({ failOnSecurity }) {
  const findings = []; let critical = 0;
  const filesToScan = walkFiles('.', [], 0);
  console.log(`Security scanning ${filesToScan.length} files...`);
  for (const file of filesToScan) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.length > 500000) continue;
      for (const pat of SECRET_PATTERNS) {
        if (pat.regex.test(content)) {
          findings.push({ type: pat.name, file, critical: pat.critical });
          if (pat.critical) critical++;
          break;
        }
      }
    } catch {}
  }
  console.log(`Security: ${findings.length} findings, ${critical} critical`);
  return { findings, critical, total: findings.length, scannedFiles: filesToScan.length };
}
module.exports = { scan };
