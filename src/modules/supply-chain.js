/**
 * Supply Chain Guard + SBOM + Cost Optimizer - Special Skill #10
 * Generates CycloneDX SBOM, license compliance, cost estimation, preview deploy readiness
 * 2026 standard: SBOM required for enterprise
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FORBIDDEN_LICENSES = ['GPL-3.0', 'AGPL-3.0', 'GPL-2.0']; // copyleft = legal risk
const HEAVY_COST_DEPS = { 'aws-sdk': 120, 'firebase': 80, 'moment': 20, '@mui/material': 40 }; // KB cost

async function generateAndCheck({ stack }) {
  const result = { sbomPath: null, licenses: [], forbidden: [], cost: {}, bomCount: 0, deployReady: false };

  // 1. Generate SBOM CycloneDX
  if (fs.existsSync('package.json')) {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

      const components = Object.entries(allDeps).map(([name, version]) => ({
        type: 'library',
        name,
        version: String(version).replace(/[^\d.]/g,'').slice(0,20) || version,
        purl: `pkg:npm/${name}@${version}`,
        licenses: [{ license: { id: 'unknown' } }]
      }));

      const sbom = {
        bomFormat: 'CycloneDX',
        specVersion: '1.5',
        serialNumber: `urn:uuid:${Date.now()}`,
        version: 1,
        metadata: {
          timestamp: new Date().toISOString(),
          component: { name: pkg.name || 'app', version: pkg.version || '1.0.0', type: 'application' },
          tools: [{ vendor: 'OmniStack', name: 'Surgeon v2', version: '2.0.0' }]
        },
        components
      };

      const sbomPath = path.join(process.cwd(), 'sbom.cyclonedx.json');
      fs.writeFileSync(sbomPath, JSON.stringify(sbom, null, 2));
      result.sbomPath = sbomPath;
      result.bomCount = components.length;
      console.log(`SBOM generated: ${components.length} components`);

      // 2. License check (read from node_modules if exists, fallback heuristic)
      const licenses = [];
      for (const dep of Object.keys(allDeps).slice(0,50)) {
        const licPath = path.join('node_modules', dep, 'package.json');
        if (fs.existsSync(licPath)) {
          try {
            const depPkg = JSON.parse(fs.readFileSync(licPath, 'utf8'));
            const lic = depPkg.license || depPkg.licenses || 'unknown';
            licenses.push({ name: dep, license: typeof lic === 'string' ? lic : lic[0]?.type || 'unknown' });
          } catch {}
        }
      }
      result.licenses = licenses;
      result.forbidden = licenses.filter(l => FORBIDDEN_LICENSES.some(f => l.license.includes(f)));
      if (result.forbidden.length) {
        console.log(`⚠️ Forbidden licenses: ${result.forbidden.map(f=>`${f.name}:${f.license}`).join(', ')}`);
      }

      // 3. Cost estimation
      let totalKb = 0;
      let costScore = 0;
      for (const [dep, kb] of Object.entries(HEAVY_COST_DEPS)) {
        if (allDeps[dep]) { totalKb += kb; costScore += kb * 0.1; }
      }
      totalKb += Object.keys(allDeps).length * 5; // avg 5KB per dep overhead

      // Bundle size if .next exists
      try {
        if (fs.existsSync('.next')) {
          const du = execSync('du -sk .next | cut -f1', { encoding: 'utf8' }).trim();
          totalKb += parseInt(du,10);
        }
      } catch {}

      const estimatedHostingCost = totalKb > 1000 ? '$15-25/mo' : totalKb > 500 ? '$5-12/mo' : '$0-5/mo';
      const coldStartImpact = Object.keys(allDeps).length > 80 ? 'High - >2s cold start' : Object.keys(allDeps).length > 40 ? 'Medium' : 'Low';

      result.cost = {
        totalKb,
        depCount: Object.keys(allDeps).length,
        heavyDeps: Object.keys(HEAVY_COST_DEPS).filter(d=>allDeps[d]),
        estimated: estimatedHostingCost,
        coldStart: coldStartImpact,
        score: costScore,
        suggestion: totalKb > 800 ? 'Enable tree-shaking, use dynamic import, consider edge runtime' : 'Cost optimal'
      };

      // Write cost report
      const costReport = `# Cost & Deploy Report\n\n- **Bundle:** ${totalKb}KB\n- **Deps:** ${result.bomCount}\n- **Est. Hosting:** ${estimatedHostingCost}\n- **Cold Start:** ${coldStartImpact}\n- **Heavy:** ${result.cost.heavyDeps.join(', ')||'none'}\n- **SBOM:** ${result.bomCount} components\n- **Forbidden Licenses:** ${result.forbidden.length}\n\n## Suggestion\n${result.cost.suggestion}\n`;
      fs.writeFileSync('COST_REPORT.md', costReport);

      // 4. Deploy readiness check
      result.deployReady = fs.existsSync('Dockerfile') || fs.existsSync('demo-fullstack/package.json') || fs.existsSync('next.config.js');

    } catch (e) {
      console.log(`Supply chain error: ${e.message}`);
      result.error = e.message;
    }
  }

  return result;
}

module.exports = { generateAndCheck };
