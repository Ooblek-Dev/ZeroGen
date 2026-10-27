
const fs = require('fs');
function safeExists(p) { try { return fs.existsSync(p); } catch { return false; } }
function detect() {
  let pkg = {};
  if (safeExists('package.json')) { try { pkg = JSON.parse(fs.readFileSync('package.json','utf8')); } catch {} }
  const deps = { ...(pkg.dependencies||{}), ...(pkg.devDependencies||{}) };
  const result = {
    node: safeExists('package.json'),
    next: !!deps.next,
    react: !!deps.react,
    express: !!deps.express,
    docker: safeExists('Dockerfile'),
    typescript: !!deps.typescript,
    packageManager: 'npm',
    primary: deps.next ? 'nextjs' : deps.express ? 'express' : 'node',
    isFullstack: !!(deps.next),
    confidence: 'high'
  };
  console.log(`ZeroGen Stack: ${result.primary}`);
  return result;
}
module.exports = { detect };
