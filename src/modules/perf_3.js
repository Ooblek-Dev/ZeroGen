
const fs = require('fs');
const path = require('path');
async function check({ budgetKb, stack }) {
  const results = { checks: [], status: 'passed', totalSizeKb: 0 };
  if (fs.existsSync('package.json')) {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
      const depCount = Object.keys(pkg.dependencies||{}).length;
      results.checks.push({ name: 'Dependency count', status: depCount>100?'failed':depCount>60?'warn':'passed', value: `${depCount} deps` });
    } catch {}
  }
  console.log(`Perf ZeroGen: ${results.status}`);
  return results;
}
module.exports = { check };
