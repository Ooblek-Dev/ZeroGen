
async function generate() {
  console.log('Changelog ZeroGen: 0 commits (shallow)');
  return { commits: [], markdown: '### Changelog\nNo history', versionBump: 'none' };
}
module.exports = { generate };
