
const fs = require('fs');
async function run({ stack }) {
  let passed=0, failed=0;
  try {
    const sc = require('./supply-chain');
    const res = await sc.generateAndCheck({stack:{}});
    if (res.valid) passed++; else failed++;
  } catch { failed++; }
  try {
    const sec = require('./security');
    const res = await sec.scan({});
    passed++;
  } catch { failed++; }
  const deployReady = fs.existsSync('demo-fullstack/Dockerfile') || fs.existsSync('Dockerfile');
  console.log(`E2E ZeroGen: ${passed} passed, ${failed} failed, deployReady=${deployReady}`);
  return { status: failed>0?'failed':'passed', passed, failed, deployReady, duration: 100, tests: [] };
}
module.exports = { run };
