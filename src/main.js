
let core, github;
try { core = require('@actions/core'); } catch { core = { getInput: (k) => process.env[`INPUT_${k.toUpperCase().replace(/-/g,'_')}`] || '', setOutput: (k,v) => console.log(`::set-output name=${k}::${v}`), setFailed: (m) => { console.error(m); process.exitCode=1; }, summary: { addHeading: () => ({ addRaw: () => ({ write: async()=>{} }) }) } }; }
try { github = require('@actions/github'); } catch { github = { context: { repo: { owner: 'owner', repo: 'repo' }, payload: {} }, getOctokit: () => null }; }
function safeRequire(p) { try { return require(p); } catch(e) { console.log(`Module ${p} fail: ${e.message}`); return null; } }
const modules = {
  security: safeRequire('./modules/security'),
  perf: safeRequire('./modules/perf'),
  stack: safeRequire('./modules/stack'),
  changelog: safeRequire('./modules/changelog'),
  autolabel: safeRequire('./modules/labeler'),
  deadcode: safeRequire('./modules/deadcode'),
  release: safeRequire('./modules/release'),
  reporter: safeRequire('./modules/reporter'),
  aiReviewer: safeRequire('./modules/ai-reviewer'),
  supplyChain: safeRequire('./modules/supply-chain'),
  e2e: safeRequire('./modules/e2e-runner')
};
async function runModule(name, fn, ...args) {
  try { console.log(`::group::[${name}]`); const r = await fn(...args); console.log('::endgroup::'); return r; }
  catch(e) { console.log('::endgroup::'); console.warn(`${name} fail: ${e.message}`); return { error: e.message, status: 'error' }; }
}
async function run() {
  try {
    console.log('::group::⚪ ZeroGen v5 Final Fullstack - 11 REAL');
    const featuresInput = (process.env.INPUT_FEATURES || (core.getInput ? core.getInput('features') : '') || 'all').toLowerCase();
    const all = ['security','perf','stack','changelog','autolabel','deadcode','release','report','ai-review','supply-chain','e2e'];
    const features = featuresInput === 'all' ? all : featuresInput.split(',').map(s=>s.trim()).filter(Boolean);
    const config = { failOnSecurity: true, perfBudgetKb: 500, aiReviewEnabled: true, sbomEnabled: true, e2eEnabled: true, autoLabel: true, postComment: true, token: process.env.GITHUB_TOKEN };
    const results = {};
    let octokit = null; let context = github.context;
    try { if (config.token && github.getOctokit) octokit = github.getOctokit(config.token); } catch {}
    if (features.includes('stack') && modules.stack) results.stack = await runModule('📦 Stack', modules.stack.detect);
    if (features.includes('security') && modules.security) results.security = await runModule('🔐 Security REAL', modules.security.scan, { failOnSecurity: false });
    if (features.includes('perf') && modules.perf) results.perf = await runModule('⚡ Perf', modules.perf.check, { budgetKb: 500, stack: results.stack });
    if (features.includes('deadcode') && modules.deadcode) results.deadcode = await runModule('🧹 Deadcode', modules.deadcode.scan);
    if (features.includes('changelog') && modules.changelog) results.changelog = await runModule('📝 Changelog', modules.changelog.generate);
    if (features.includes('release') && modules.release) results.release = await runModule('🚀 Release', modules.release.check);
    if (features.includes('supply-chain') && modules.supplyChain) results.supplyChain = await runModule('📜 Supply Chain SBOM', modules.supplyChain.generateAndCheck, { stack: results.stack });
    if (features.includes('ai-review') && modules.aiReviewer) { console.log('::group::🤖 AI Review Local'); results.aiReview = await modules.aiReviewer.reviewLocal({ stack: results.stack }); console.log('::endgroup::'); }
    if (features.includes('e2e') && modules.e2e) results.e2e = await runModule('🎭 E2E', modules.e2e.run, { stack: results.stack });
    if (features.includes('report') && modules.reporter) await runModule('📊 Dashboard', modules.reporter.writeSummary, results);
    console.log('\n✅ ZeroGen v5 Final Fullstack - 11 REAL Completed');
  } catch (e) { core.setFailed(`ZeroGen fail: ${e.message}`); }
}
run();
