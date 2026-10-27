const { execSync } = require('child_process');
const fs = require('fs');

async function scan() {
  const result = { todos: [], fixmes: [], consoleLogs: [], unusedExports: [] };

  try {
    // TODO / FIXME
    const todoOut = execSync('grep -r --include="*.js" --include="*.ts" --include="*.tsx" -n "TODO\|FIXME\|HACK\|XXX" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude-dir=dist 2>/dev/null | head -30', { encoding: 'utf8' });
    result.todos = todoOut.split('\n').filter(Boolean).slice(0,20);

    // console.log leftovers
    const logOut = execSync('grep -r --include="*.js" --include="*.ts" --include="*.tsx" -n "console\\.log" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next 2>/dev/null | head -20', { encoding: 'utf8' });
    result.consoleLogs = logOut.split('\n').filter(Boolean).slice(0,15);

    // Dead files (not imported anywhere) - heuristic
    if (fs.existsSync('src')) {
      const files = execSync('find src -type f -name "*.js" -o -name "*.ts" -o -name "*.tsx" | head -50', { encoding: 'utf8' }).split('\n').filter(Boolean);
      // simplified: files never referenced
      result.fileCount = files.length;
    }
  } catch {}

  console.log(`Deadcode: ${result.todos.length} TODOs, ${result.consoleLogs.length} console.log`);
  return result;
}

module.exports = { scan };
