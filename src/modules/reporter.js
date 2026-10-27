
function format(results) {
  let md = `## ⚪ ZeroGen v5 Final - 11 REAL\n\n`;
  if (results.stack) md += `Stack: ${results.stack.primary}\n`;
  if (results.security) md += `Security: ${results.security.total} findings, ${results.security.scannedFiles} files\n`;
  if (results.supplyChain) md += `SBOM: ${results.supplyChain.bomCount} valid=${results.supplyChain.valid}\n`;
  if (results.aiReview) md += `AI: ${results.aiReview.total} issues\n`;
  if (results.e2e) md += `E2E: ${results.e2e.status}\n`;
  return md;
}
async function writeSummary(results) { console.log(format(results)); }
async function postComment(octokit, context, results) { console.log('Would post comment'); }
module.exports = { postComment, writeSummary, formatResults: format };
