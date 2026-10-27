
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req,res)=>{
  res.json({ status:'ok', version:'5.0.0', name:'ZeroGen v5 Final Fullstack', node: process.version, timestamp: new Date().toISOString() });
});

app.get('/api/stack', (req,res)=>{
  res.json({ stack:'Node 22 + Express 5 + Vite 6', primary:'node', packageManager:'npm', isFullstack:true, features:11, branding:'ZeroGen v5 Final' });
});

app.get('/api/security', async (req,res)=>{
  try {
    const mod = await import('../../src/modules/security.js');
    const result = await mod.scan({});
    res.json(result);
  } catch(e){ res.json({ error:e.message, scannedFiles:0, total:0 }); }
});

app.get('/api/sbom', (req,res)=>{
  try {
    const p = path.join(process.cwd(), 'sbom.cyclonedx.json');
    if (fs.existsSync(p)) res.json(JSON.parse(fs.readFileSync(p,'utf8')));
    else if (fs.existsSync(path.join(process.cwd(), '../sbom.cyclonedx.json'))) res.json(JSON.parse(fs.readFileSync(path.join(process.cwd(), '../sbom.cyclonedx.json'),'utf8')));
    else res.json({ message:'SBOM not yet generated - run npm test' });
  } catch(e){ res.json({ error:e.message }); }
});

app.get('/api/cost', (req,res)=>{
  try {
    const p = path.join(process.cwd(), 'COST_REPORT.md');
    if (fs.existsSync(p)) res.send(fs.readFileSync(p,'utf8'));
    else res.json({ cost:'$0-1/mo', bundle:'<500KB', deps:3 });
  } catch(e){ res.json({ error:e.message }); }
});

// Serve frontend dist if exists
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req,res)=> res.sendFile(path.join(distPath, 'index.html')));
} else {
  app.get('/', (req,res)=> res.send(`
    <html><head><title>ZeroGen v5 Final Fullstack</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:Inter,system-ui}
      body{background:#000;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
      .card{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:24px;padding:40px;max-width:600px;width:100%}
      h1{font-size:40px;font-weight:900;letter-spacing:-2px;margin-bottom:8px;display:flex;align-items:center;gap:12px}
      h1 span{width:44px;height:44px;background:#fff;color:#000;border-radius:50%;display:flex;align-items:center;justify-content:center}
      p{color:#888;margin:12px 0}
      a{color:#fff} .badge{background:#fff;color:#000;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:800;display:inline-block;margin:4px}
    </style></head><body>
    <div class="card">
      <h1><span>0</span> ZeroGen v5 Final</h1>
      <p>Zero-Config Generation - Fullstack Ready - GitHub Push Ready</p>
      <div><span class="badge">11 REAL Skills</span><span class="badge">E2E REAL</span><span class="badge">FULLSTACK</span></div>
      <p>API: <a href="/api/health">/api/health</a> | <a href="/api/stack">/api/stack</a> | <a href="/api/sbom">/api/sbom</a></p>
      <p>Frontend dist not built. Run: <code>cd frontend && npm run build</code></p>
      <p style="margin-top:20px;color:#555;font-size:11px;text-transform:uppercase;letter-spacing:1px">ZeroGen v5 Final - Zero config, Full power - GitHub Ready</p>
    </div></body></html>
  `));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`⚪ ZeroGen v5 Final Fullstack running on http://localhost:${PORT}`));
