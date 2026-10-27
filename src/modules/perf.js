const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function check({ budgetKb, stack }) {
  const results = { checks: [], status: 'passed', totalSizeKb: 0 };

  // 1. Large files guard (>1MB in repo)
  try {
    const large = execSync('find . -type f -size +1M -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.next/*" -not -path "./dist/*" | head -20', { encoding: 'utf8' });
    const largeFiles = large.split('\n').filter(Boolean);
    if (largeFiles.length) {
      results.checks.push({ name: 'Large files', status: 'warn', details: largeFiles });
    }
  } catch {}

  // 2. Bundle size if Next.js / Node
  if (fs.existsSync('package.json')) {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
      // Check dependencies count - bloat detection
      const depCount = Object.keys(pkg.dependencies || {}).length;
      results.checks.push({ name: 'Dependency count', status: depCount > 50 ? 'warn' : 'passed', value: depCount });

      // If .next exists, check its size
      if (fs.existsSync('.next')) {
        const sizeOut = execSync('du -sk .next | cut -f1', { encoding: 'utf8' });
        const sizeKb = parseInt(sizeOut.trim(), 10);
        results.totalSizeKb = sizeKb;
        results.checks.push({ 
          name: 'Next.js build size', 
          status: sizeKb > budgetKb ? 'failed' : 'passed', 
          value: `${sizeKb}KB / ${budgetKb}KB budget` 
        });
        if (sizeKb > budgetKb) results.status = 'failed';
      }

      // Check for heavy deps
      const heavy = ['moment','lodash','@mui/material','aws-sdk'];
      const foundHeavy = heavy.filter(h => pkg.dependencies && pkg.dependencies[h]);
      if (foundHeavy.length) {
        results.checks.push({ name: 'Heavy deps detected', status: 'warn', details: foundHeavy, suggestion: 'Consider dayjs, lodash-es, @mui/material treeshaking' });
      }
    } catch (e) { results.checks.push({ name: 'Perf check error', status: 'error', error: e.message }); }
  }

  // 3. Docker image size hint
  if (fs.existsSync('Dockerfile')) {
    const dockerfile = fs.readFileSync('Dockerfile','utf8');
    const hasMultiStage = (dockerfile.match(/FROM/g) || []).length > 1;
    results.checks.push({ name: 'Docker multi-stage', status: hasMultiStage ? 'passed' : 'warn', suggestion: hasMultiStage ? null : 'Use multi-stage build to reduce image size 70%' });
  }

  console.log(`Perf status: ${results.status}, checks: ${results.checks.length}`);
  return results;
}

module.exports = { check };
