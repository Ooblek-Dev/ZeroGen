const fs = require('fs');
const path = require('path');

function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }

function detect() {
  const cwd = process.cwd();
  const pkgPath = path.join(cwd, 'package.json');
  let pkg = {};
  if (exists(pkgPath)) {
    try { pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); } catch {}
  }

  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const result = {
    node: exists(pkgPath),
    next: !!deps.next || exists('next.config.js') || exists('next.config.mjs'),
    react: !!deps.react,
    express: !!deps.express,
    nest: !!deps['@nestjs/core'],
    python: exists('requirements.txt') || exists('pyproject.toml'),
    go: exists('go.mod'),
    docker: exists('Dockerfile'),
    prisma: !!deps.prisma || exists('prisma/schema.prisma'),
    typescript: !!deps.typescript || exists('tsconfig.json'),
    packageManager: exists('pnpm-lock.yaml') ? 'pnpm' : exists('yarn.lock') ? 'yarn' : 'npm'
  };

  result.primary = result.next ? 'nextjs' : result.express ? 'express' : result.nest ? 'nestjs' : result.python ? 'python' : result.go ? 'go' : result.node ? 'node' : 'unknown';
  result.isFullstack = result.next || (result.react && result.express);

  return result;
}

module.exports = { detect };
