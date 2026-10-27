async function run(octokit, context, stack) {
  const pr = context.payload.pull_request;
  if (!pr) return [];

  const files = await octokit.rest.pulls.listFiles({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pr.number
  });

  const labels = new Set();
  const filenames = files.data.map(f => f.filename);

  // Heuristic labeling - Senior Engineer logic
  if (filenames.some(f => f.startsWith('src/') || f.startsWith('app/') || f.endsWith('.ts') || f.endsWith('.js'))) labels.add('area:backend');
  if (filenames.some(f => f.includes('frontend') || f.includes('components') || f.endsWith('.tsx') || f.endsWith('.css'))) labels.add('area:frontend');
  if (filenames.some(f => f.includes('Dockerfile') || f.includes('docker-compose') || f.includes('.github'))) labels.add('area:devops');
  if (filenames.some(f => f.includes('test') || f.includes('__tests__'))) labels.add('area:test');
  if (filenames.some(f => f.includes('prisma') || f.includes('migration') || f.includes('.sql'))) labels.add('area:database');
  if (filenames.some(f => f.includes('package.json') || f.includes('requirements.txt'))) labels.add('dependencies');

  const totalChanges = files.data.reduce((s,f)=>s+f.changes,0);
  if (totalChanges > 500) labels.add('size:xl');
  else if (totalChanges > 200) labels.add('size:l');
  else if (totalChanges > 50) labels.add('size:m');
  else labels.add('size:s');

  if (stack?.isFullstack) labels.add('fullstack');
  if (stack?.next) labels.add('nextjs');
  if (stack?.docker) labels.add('docker');

  const labelArray = Array.from(labels);

  try {
    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
      labels: labelArray
    });
    console.log(`Labels applied: ${labelArray.join(', ')}`);
  } catch (e) {
    console.log(`Labeling skipped (labels may not exist): ${e.message}`);
    // Try to create labels first? For now skip fail
  }

  return labelArray;
}

module.exports = { run };
