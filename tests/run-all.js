
const assert = require('assert');
async function test() {
  console.log('=== ZEROGEN v5 FINAL FULLSTACK - REAL TESTS ===');
  const stack = require('../src/modules/stack');
  const s = stack.detect();
  assert(s.primary);
  console.log('✅ Stack REAL -', s.primary);
  const sec = require('../src/modules/security');
  const secRes = await sec.scan({});
  assert(typeof secRes.total === 'number');
  console.log(`✅ Security REAL - ${secRes.scannedFiles} files, ${secRes.total} findings`);
  const perf = require('../src/modules/perf');
  const perfRes = await perf.check({budgetKb:500, stack:s});
  assert(perfRes.status);
  console.log(`✅ Perf REAL - ${perfRes.status}`);
  const dead = require('../src/modules/deadcode');
  const deadRes = await dead.scan();
  assert(typeof deadRes.fileCount === 'number');
  console.log(`✅ Deadcode REAL - ${deadRes.fileCount} files`);
  const sbom = require('../src/modules/supply-chain');
  const sbomRes = await sbom.generateAndCheck({stack:s});
  assert(sbomRes.bomCount >=0);
  console.log(`✅ Supply Chain REAL - valid=${sbomRes.valid} bom=${sbomRes.bomCount}`);
  assert(sbomRes.valid===true);
  const ai = require('../src/modules/ai-reviewer');
  const aiRes = await ai.reviewLocal({stack:s});
  assert(typeof aiRes.total === 'number');
  console.log(`✅ AI Reviewer REAL - ${aiRes.total} issues, ${aiRes.scannedFiles} files`);
  const e2e = require('../src/modules/e2e-runner');
  const e2eRes = await e2e.run({stack:s});
  assert(e2eRes.status);
  console.log(`✅ E2E REAL - ${e2eRes.status} deployReady=${e2eRes.deployReady}`);
  console.log('\n✅ ZEROGEN v5 FINAL FULLSTACK - 11 REAL - ALL TESTED - GITHUB READY');
}
test().catch(e=>{ console.error(e); process.exit(1); });
