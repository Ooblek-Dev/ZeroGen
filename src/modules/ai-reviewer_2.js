
const fs = require('fs');
const path = require('path');
const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build']);
const CODE_EXTS = new Set(['.js','.ts','.tsx','.jsx']);
const RULES = [
  { id: 'n-plus-one', severity: 'high', message: 'Loop with await DB - N+1', suggestion: 'Use Promise.all', check: (c) => /for\s*\(/.test(c) && /await/.test(c) && /prisma|db/.test(c) },
  { id: 'hardcoded-secret', severity: 'critical', pattern: /apiKey\s*[:=]\s*["'][A-Za-z0-9-_]{10,}["']/i, message: 'Hardcoded secret', suggestion: 'Use env var' },
  { id: 'console-leak', severity: 'low', message: 'console.log left', suggestion: 'Remove', check: (c,f) => /console\.log/.test(c) && (c.match(/console\.log/g)||[]).length>=2 },
];
function walkFiles(dir, files=[], depth=0) {
  if (depth>5 || files.length>=50) return files;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (IGNORE_DIRS.has(e.name) || e.name.startsWith('.')) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walkFiles(full, files, depth+1);
      else if (e.isFile() && CODE_EXTS.has(path.extname(e.name))) {
        try { if (fs.statSync(full).size<500*1024) files.push(full); } catch {}
      }
    }
  } catch {}
  return files;
}
function analyzeFile(filePath, content) {
  const issues = [];
  for (const rule of RULES) {
    try {
      let matched = false;
      if (rule.check) matched = rule.check(content, filePath);
      else if (rule.pattern) matched = rule.pattern.test(content);
      if (matched) issues.push({ file: filePath, rule: rule.id, severity: rule.severity, message: rule.message, suggestion: rule.suggestion });
    } catch {}
  }
  return issues;
}
async function reviewLocal({ stack }) {
  const files = walkFiles('.', [], 0);
  const allIssues = [];
  console.log(`AI Reviewer ZeroGen scanning ${files.length} files...`);
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.length>200000) continue;
      allIssues.push(...analyzeFile(file, content));
    } catch {}
  }
  const unique = []; const seen = new Set();
  for (const iss of allIssues) {
    const key = `${iss.file}:${iss.rule}`;
    if (!seen.has(key)) { seen.add(key); unique.push(iss); }
  }
  console.log(`AI Review Local: ${unique.length} issues`);
  return { issues: unique, total: unique.length, critical: unique.filter(i=>i.severity==='critical').length, high: unique.filter(i=>i.severity==='high').length, scannedFiles: files.length, mode: 'local' };
}
async function review(octokit, context, stack) { return reviewLocal({ stack }); }
module.exports = { review, reviewLocal, RULES };
