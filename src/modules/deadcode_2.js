
const fs = require('fs');
const path = require('path');
const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', 'dist']);
function walk(dir, results, depth=0) {
  if (depth>6) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (IGNORE_DIRS.has(e.name) || e.name.startsWith('.')) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, results, depth+1);
      else if (e.isFile() && /\.(js|ts|tsx)$/.test(e.name)) {
        try {
          const content = fs.readFileSync(full, 'utf8');
          if (/TODO|FIXME/.test(content)) results.todos.push(full);
          if (/console\.log/.test(content)) results.consoleLogs.push(full);
          results.fileCount++;
        } catch {}
      }
    }
  } catch {}
}
async function scan() {
  const results = { todos: [], consoleLogs: [], fileCount: 0 };
  walk('.', results, 0);
  console.log(`Deadcode ZeroGen: ${results.todos.length} TODOs, ${results.fileCount} files`);
  return results;
}
module.exports = { scan };
