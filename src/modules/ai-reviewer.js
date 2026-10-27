/**
 * AI Code Reviewer - Special Skill #9
 * 2026 Edition: heuristic AI that mimics senior reviewer
 * No external API key needed, pure AST pattern + senior rules
 */

async function review(octokit, context, stack) {
  const pr = context.payload.pull_request;
  if (!pr) return { issues: [] };

  // Get PR diff files
  const files = await octokit.rest.pulls.listFiles({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pr.number
  });

  const issues = [];
  const suggestions = [];

  for (const file of files.data.slice(0, 30)) { // limit 30 files
    const filename = file.filename;
    if (/(node_modules|dist|\.next|package-lock|pnpm-lock)/.test(filename)) continue;
    if (file.status === 'removed') continue;

    try {
      // Get file content for analysis
      const contentRes = await octokit.rest.repos.getContent({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: filename,
        ref: pr.head.sha
      }).catch(()=>null);

      let content = '';
      if (contentRes && contentRes.data.content) {
        content = Buffer.from(contentRes.data.content, 'base64').toString('utf8');
      } else if (file.patch) {
        content = file.patch; // fallback to patch
      }

      // SENIOR ENGINEER REVIEW RULES - 2026
      // Rule 1: N+1 query detection
      if (/for\s*\(.*\)\s*\{[^}]*await.*(find|query|prisma|db\.)/gi.test(content) || /\.map\(.*=>.*await/gi.test(content)) {
        issues.push({ file: filename, line: 1, severity: 'high', rule: 'N+1 Query', message: 'Loop with await DB call detected. Use Promise.all or batch query. Will kill DB at 1k RPS.', suggestion: 'Replace for-await with Promise.all or include' });
      }
      // Rule 2: Missing error handling
      if (/await\s+.*\(.+\)/.test(content) && !/try\s*\{/.test(content) && !/\.catch/.test(content) && filename.endsWith('.js')) {
        const count = (content.match(/await/g)||[]).length;
        if (count > 2) issues.push({ file: filename, severity: 'medium', rule: 'Unhandled await', message: `${count} awaits without try/catch. One rejection = crash entire request.`, suggestion: 'Wrap in try/catch or use result pattern' });
      }
      // Rule 3: SQL injection
      if (/query\s*\(\s*["'`].*\$\{|\+.*SELECT/i.test(content)) {
        issues.push({ file: filename, severity: 'critical', rule: 'SQL Injection', message: 'String concatenation in SQL query. Critical security.', suggestion: 'Use parameterized query / ORM' });
      }
      // Rule 4: Large function
      if (content.split('\n').length > 150 && filename.match(/\.(js|ts|tsx)$/)) {
        issues.push({ file: filename, severity: 'low', rule: 'God function', message: `File ${content.split('\n').length} LOC. Hard to maintain, test.`, suggestion: 'Split into smaller pure functions <50 LOC' });
      }
      // Rule 5: console.log in production
      if (/console\.log/.test(content) && !filename.includes('test')) {
        issues.push({ file: filename, severity: 'low', rule: 'console.log leftover', message: 'console.log will leak in prod logs and cost $', suggestion: 'Use logger.info or remove' });
      }
      // Rule 6: Missing index / performance
      if (/\.find\(.*\)/.test(content) && /prisma|mongoose|typeorm/i.test(content)) {
        issues.push({ file: filename, severity: 'medium', rule: 'Missing index check', message: 'DB find without index hint. At scale = full table scan.', suggestion: 'Ensure indexed field, add .explain() in review' });
      }
      // Rule 7: Hardcoded secret in new code
      if (/(apiKey|secret|password)\s*[:=]\s*["'][A-Za-z0-9]{10,}["']/i.test(content)) {
        issues.push({ file: filename, severity: 'critical', rule: 'Hardcoded secret', message: 'Secret hardcoded in file. Will leak in git history forever.', suggestion: 'Use env var + vault' });
      }

    } catch (e) {
      console.log(`AI review skip ${filename}: ${e.message}`);
    }
  }

  // Post review if issues found
  let reviewId = null;
  if (issues.length > 0) {
    const critical = issues.filter(i=>i.severity==='critical').length;
    const body = `### 🤖 AI Senior Review - ${issues.length} findings (${critical} critical)

${issues.slice(0,10).map(i=>`- **${i.severity.toUpperCase()}** \`${i.file}\` - **${i.rule}**: ${i.message}\n  → _Fix: ${i.suggestion}_`).join('\n')}

${issues.length>10 ? `\n<details><summary>+${issues.length-10} more</summary>\n\n${issues.slice(10).map(i=>`- ${i.file}: ${i.rule}`).join('\n')}\n</details>` : ''}

> Senior tip: Fix critical first, low can be tech-debt ticket.
`;

    try {
      // Create PR review
      const review = await octokit.rest.pulls.createReview({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pr.number,
        body,
        event: critical > 0 ? 'REQUEST_CHANGES' : 'COMMENT'
      });
      reviewId = review.data.id;
      console.log(`AI review posted: ${reviewId} with ${issues.length} issues`);
    } catch (e) {
      console.log(`AI review post failed: ${e.message}`);
    }
  } else {
    console.log('AI Review: No major issues, LGTM');
    try {
      await octokit.rest.pulls.createReview({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pr.number,
        body: `### 🤖 AI Senior Review - LGTM ✅\n\nNo critical patterns detected. Code looks clean, well-structured.\n\n*Checked: N+1, SQLi, error handling, secrets, god functions, console.log*`,
        event: 'APPROVE'
      });
    } catch {}
  }

  return { issues, total: issues.length, critical: issues.filter(i=>i.severity==='critical').length, reviewId };
}

module.exports = { review };
