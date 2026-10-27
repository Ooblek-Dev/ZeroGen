import { useEffect, useState, useRef } from 'react';
import { 
  Zap, ShieldCheck, Package, Activity, 
  Timer, Layers, GitBranch, Cpu,
  Code2, FileCheck, Rocket, Database,
  Lock, Palette, Terminal, BookOpen,
  Check, ChevronRight, Sparkles
} from 'lucide-react';

// ─── Animated Counter Hook ───
function useAnimatedValue(target: number, duration = 1200, decimals = 1) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const progress = Math.min((t - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(target * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return decimals === 0 ? Math.round(value) : parseFloat(value.toFixed(decimals));
}

function useLiveJitter(base: number, range: number, interval = 3000) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setV(base + (Math.random() * 2 - 1) * range);
    }, interval);
    return () => clearInterval(id);
  }, [base, range, interval]);
  return v;
}

export default function App() {
  // Live metrics states
  const buildTimeLive = useLiveJitter(1.24, 0.18, 2800);
  const scanLive = useLiveJitter(14, 1.2, 3500);
  const responseLive = useLiveJitter(42, 8, 2200);
  const bundleLive = useLiveJitter(18.4, 0.6, 3200);
  const coverageLive = useLiveJitter(94.2, 0.8, 2900);
  const uptimeLive = useLiveJitter(99.94, 0.04, 2000);

  const buildDisplay = useAnimatedValue(1.2, 1400, 2);
  const secDisplay = useAnimatedValue(14, 1000, 0);
  const compDisplay = useAnimatedValue(3, 800, 0);
  const upDisplay = useAnimatedValue(99.9, 1600, 1);

  // Tiny chart bars live
  const [chartA, setChartA] = useState<number[]>(() => Array.from({length:12},()=> 30 + Math.random()*70));
  const [chartB, setChartB] = useState<number[]>(() => Array.from({length:12},()=> 20 + Math.random()*60));
  const [chartC, setChartC] = useState<number[]>(() => Array.from({length:12},()=> 40 + Math.random()*50));
  const [chartD, setChartD] = useState<number[]>(() => Array.from({length:10},()=> 35 + Math.random()*65));

  useEffect(()=>{
    const id = setInterval(()=>{
      setChartA(prev=> prev.map(v=> Math.max(12, Math.min(100, v + (Math.random()*2-1)*18))));
      setChartB(prev=> prev.map(v=> Math.max(10, Math.min(100, v + (Math.random()*2-1)*22))));
      setChartC(prev=> prev.map(v=> Math.max(20, Math.min(100, v + (Math.random()*2-1)*15))));
      setChartD(prev=> prev.map(v=> Math.max(15, Math.min(100, v + (Math.random()*2-1)*20))));
    }, 1200);
    return ()=> clearInterval(id);
  },[]);

  // Build log typing
  const logLines = [
    { ts: '00:00:00.120', text: 'ZeroGen init • zero-config detected', ok: true },
    { ts: '00:00:00.340', text: 'TypeScript strict mode • enabled', ok: true },
    { ts: '00:00:00.512', text: 'Security audit • 14 files scanned', ok: true },
    { ts: '00:00:00.743', text: 'Bundle analysis • tree-shake optimized', ok: true },
    { ts: '00:00:00.891', text: 'SBOM CycloneDX 1.5 • generated', ok: true },
    { ts: '00:00:01.024', text: 'Edge runtime • configured', ok: true },
    { ts: '00:00:01.180', text: 'GitHub Actions • workflow emitted', ok: true },
    { ts: '00:00:01.240', text: 'Production ready • all checks passed', ok: true },
  ];
  const [visibleLogs, setVisibleLogs] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=>{
      setVisibleLogs(v=> v < logLines.length ? v+1 : v);
    }, 380);
    return ()=> clearInterval(id);
  },[]);

  const skills = [
    { id:1, name:'TypeScript Strict', desc:'Strictest checks, no any', icon: Code2, status:'Active', color:'#00D9FF' },
    { id:2, name:'Security Audit', desc:'14 files • 0 issues', icon: Lock, status:'Passed', color:'#00FF88' },
    { id:3, name:'Bundle Optimize', desc:'Tree-shake • minify • compress', icon: Package, status:'Live', color:'#FFB800' },
    { id:4, name:'Test Runner', desc:'Unit • integration ready', icon: FileCheck, status:'Verified', color:'#A855F7' },
    { id:5, name:'Deploy Pipeline', desc:'Edge • zero config', icon: Rocket, status:'Active', color:'#FF5A5A' },
    { id:6, name:'API Generator', desc:'REST • type-safe', icon: GitBranch, status:'Active', color:'#00D9FF' },
    { id:7, name:'UI Components', desc:'Design system aware', icon: Palette, status:'Live', color:'#FF8A00' },
    { id:8, name:'DB Schema', desc:'Prisma • Drizzle compatible', icon: Database, status:'Auto', color:'#00FF88' },
    { id:9, name:'Auth Flow', desc:'JWT • OAuth ready', icon: ShieldCheck, status:'Verified', color:'#A855F7' },
    { id:10, name:'Lint & Format', desc:'Biome • ESLint • Prettier', icon: Terminal, status:'Passed', color:'#8A8A8A' },
    { id:11, name:'Docs Sync', desc:'README • API docs', icon: BookOpen, status:'Live', color:'#FFB800' },
  ];

  return (
    <div 
      data-safe-area-inset-root
      style={{ boxSizing:'border-box', paddingTop:'var(--safe-area-inset-top)', background:'#000', minHeight:'100vh' }}
      className="w-full overflow-x-clip text-white selection:bg-white selection:text-black"
    >
      <style>{`
        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.85); }
        }
        @keyframes pulseRing {
          0% { transform:scale(0.8); opacity:0.8; }
          100% { transform:scale(2.2); opacity:0; }
        }
        @keyframes shimmer {
          0% { transform:translateX(-100%); }
          100% { transform:translateX(200%); }
        }
        @keyframes glowShift {
          0% { opacity:0.15; }
          50% { opacity:0.28; }
          100% { opacity:0.15; }
        }
        .card-premium {
          background:#0a0a0a;
          border:1px solid #1a1a1a;
          border-radius:20px;
          position:relative;
          overflow:hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .card-premium::before {
          content:'';
          position:absolute;
          inset:0;
          border-radius:20px;
          padding:1px;
          background: radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.12), transparent 40%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events:none;
          opacity:0;
          transition:opacity 0.4s;
        }
        .card-premium:hover::before { opacity:1; }
        .card-premium:hover {
          border-color:#2a2a2a;
          transform:translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06) inset;
        }
      `}</style>

      {/* Container */}
      <div className="mx-auto w-full max-w-[1320px] px-[20px] md:px-[32px] pb-[80px]">

        {/* Header */}
        <header className="pt-[36px] md:pt-[56px] pb-[32px] flex flex-col gap-[28px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-[24px]">
            <div className="flex items-center gap-[16px]">
              <div className="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                <span className="font-black text-[22px] tracking-[-0.04em] text-black" style={{fontFamily:'Inter, sans-serif', fontWeight:900}}>0</span>
              </div>
              <div>
                <h1 className="text-[24px] md:text-[28px] font-black tracking-[-0.04em] leading-none" style={{fontFamily:'Inter, sans-serif', fontWeight:900}}>ZeroGen</h1>
                <div className="flex items-center gap-[8px] mt-[2px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#00FF88] animate-[pulseDot_1.6s_infinite] inline-block" />
                  <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#8a8a8a]" style={{fontFamily:'JetBrains Mono, monospace'}}>System Operational</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-[8px]">
              {[
                {label:'Live', live:true},
                {label:'11 Skills', live:false},
                {label:'Fullstack', live:false},
                {label:'GitHub Ready', live:false},
              ].map(b=>(
                <div key={b.label} className="h-[28px] px-[12px] rounded-full bg-[#0a0a0a] border border-[#1a1a1a] flex items-center gap-[6px] text-[11px] font-medium tracking-[0.02em] text-[#d0d0d0]" style={{fontFamily:'JetBrains Mono, monospace'}}>
                  {b.live && (
                    <span className="relative flex h-[8px] w-[8px]">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75 animate-[pulseRing_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
                      <span className="relative inline-flex rounded-full h-[8px] w-[8px] bg-[#00FF88]"></span>
                    </span>
                  )}
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-[560px]">
            <h2 className="text-[32px] md:text-[48px] font-black tracking-[-0.05em] leading-[0.92] text-white" style={{fontFamily:'Inter, sans-serif', fontWeight:900}}>
              Zero-config generation.<br/>
              <span className="text-[#6a6a6a]">From zero to production in one action.</span>
            </h2>
          </div>
        </header>

        {/* LIVE METRICS ROW */}
        <section className="mb-[20px]">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div className="h-[22px] px-[10px] rounded-full bg-[#00FF88] text-black text-[10px] font-bold tracking-[0.12em] flex items-center gap-[6px]" style={{fontFamily:'Inter, sans-serif'}}>
              <span className="w-[6px] h-[6px] rounded-full bg-black animate-[pulseDot_1s_infinite]" /> LIVE METRICS
            </div>
            <span className="text-[11px] text-[#555] tracking-[0.06em]" style={{fontFamily:'JetBrains Mono, monospace'}}>UPDATED JUST NOW • STREAMING</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[12px]">
            {/* Build */}
            <div className="card-premium p-[20px] group" onMouseMove={(e)=>{
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
            }}>
              <div className="flex items-center justify-between mb-[18px]">
                <div className="flex items-center gap-[8px]">
                  <div className="w-[28px] h-[28px] rounded-[10px] bg-[#151515] border border-[#222] flex items-center justify-center"><Zap className="w-[14px] h-[14px] text-[#FFB800]" /></div>
                  <span className="text-[10px] tracking-[0.14em] text-[#666] font-semibold" style={{fontFamily:'JetBrains Mono, monospace'}}>BUILD</span>
                </div>
                <div className="flex items-center gap-[5px] text-[10px] text-[#00FF88]" style={{fontFamily:'JetBrains Mono, monospace'}}>
                  <span className="w-[5px] h-[5px] bg-[#00FF88] rounded-full animate-[pulseDot_1.2s_infinite]" /> Active
                </div>
              </div>
              <div className="flex items-baseline gap-[6px] mb-[6px]">
                <span className="text-[36px] font-black tracking-[-0.05em] leading-none" style={{fontFamily:'Inter, sans-serif', fontWeight:900}}>{buildDisplay.toFixed(2)}s</span>
                <span className="text-[12px] text-[#666]" style={{fontFamily:'JetBrains Mono, monospace'}}>• target &lt;2s</span>
              </div>
              <div className="text-[11px] text-[#777] mb-[18px] tracking-[-0.01em]" style={{fontFamily:'Inter, sans-serif'}}>Live compile • {buildTimeLive.toFixed(2)}s last</div>
              <div className="h-[3px] w-full bg-[#1a1a1a] rounded-full overflow-hidden mb-[14px] relative">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{width:'90%'}} />
                <div className="absolute inset-0 overflow-hidden">
                  <div className="h-full w-[40%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.8s_infinite]" />
                </div>
              </div>
              <div className="flex items-end gap-[3px] h-[22px]">
                {chartA.map((h,i)=>(
                  <div key={i} className="flex-1 rounded-[2px] bg-[#222] transition-all duration-700" style={{height:`${h}%`, background: i===chartA.length-1 ? '#fff' : '#222'}} />
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="card-premium p-[20px] group" onMouseMove={(e)=>{
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
            }}>
              <div className="flex items-center justify-between mb-[18px]">
                <div className="flex items-center gap-[8px]">
                  <div className="w-[28px] h-[28px] rounded-[10px] bg-[#151515] border border-[#222] flex items-center justify-center"><ShieldCheck className="w-[14px] h-[14px] text-[#00FF88]" /></div>
                  <span className="text-[10px] tracking-[0.14em] text-[#666] font-semibold" style={{fontFamily:'JetBrains Mono, monospace'}}>SECURITY</span>
                </div>
                <div className="flex items-center gap-[5px] text-[10px] text-[#00FF88]" style={{fontFamily:'JetBrains Mono, monospace'}}>
                  <span className="w-[5px] h-[5px] bg-[#00FF88] rounded-full animate-[pulseDot_1.2s_infinite]" /> Scanning
                </div>
              </div>
              <div className="flex items-baseline gap-[6px] mb-[6px]">
                <span className="text-[36px] font-black tracking-[-0.05em] leading-none" style={{fontFamily:'Inter, sans-serif', fontWeight:900}}>{secDisplay}</span>
                <span className="text-[14px] font-medium text-[#666]">files</span>
              </div>
              <div className="flex items-center gap-[8px] mb-[18px]">
                <span className="text-[11px] text-[#777]" style={{fontFamily:'Inter, sans-serif'}}>{scanLive.toFixed(0)} scanned</span>
                <span className="px-[6px] h-[16px] rounded-full bg-[#00FF88]/15 border border-[#00FF88]/20 text-[10px] text-[#00FF88] flex items-center" style={{fontFamily:'JetBrains Mono, monospace'}}>0 issues</span>
              </div>
              <div className="grid grid-cols-3 gap-[6px] mb-[14px]">
                {[92, 88, 96].map((p,i)=>(
                  <div key={i} className="h-[3px] bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00FF88] rounded-full" style={{width:`${p}%`}} />
                  </div>
                ))}
              </div>
              <div className="flex items-end gap-[3px] h-[22px]">
                {chartB.map((h,i)=>(
                  <div key={i} className="flex-1 rounded-[2px] transition-all duration-700" style={{height:`${h}%`, background: h>80 ? '#00FF88' : '#222'}} />
                ))}
              </div>
            </div>

            {/* Components */}
            <div className="card-premium p-[20px] group" onMouseMove={(e)=>{
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
            }}>
              <div className="flex items-center justify-between mb-[18px]">
                <div className="flex items-center gap-[8px]">
                  <div className="w-[28px] h-[28px] rounded-[10px] bg-[#151515] border border-[#222] flex items-center justify-center"><Package className="w-[14px] h-[14px] text-[#A855F7]" /></div>
                  <span className="text-[10px] tracking-[0.14em] text-[#666] font-semibold" style={{fontFamily:'JetBrains Mono, monospace'}}>SBOM</span>
                </div>
                <span className="px-[7px] h-[18px] rounded-full bg-white text-black text-[10px] font-bold tracking-[0.04em] flex items-center" style={{fontFamily:'Inter, sans-serif'}}>VERIFIED</span>
              </div>
              <div className="flex items-baseline gap-[6px] mb-[6px]">
                <span className="text-[36px] font-black tracking-[-0.05em] leading-none" style={{fontFamily:'Inter, sans-serif', fontWeight:900}}>{compDisplay}</span>
                <span className="text-[14px] font-medium text-[#666]">artifacts</span>
              </div>
              <div className="text-[11px] text-[#777] mb-[18px]" style={{fontFamily:'Inter, sans-serif'}}>CycloneDX 1.5 • valid • signed</div>
              <div className="flex gap-[6px] mb-[14px]">
                {['CycloneDX','SPDX','Provenance'].map(t=>(
                  <div key={t} className="h-[22px] px-[8px] rounded-full bg-[#111] border border-[#222] text-[10px] text-[#777] flex items-center" style={{fontFamily:'JetBrains Mono, monospace'}}>{t}</div>
                ))}
              </div>
              <div className="flex items-end gap-[3px] h-[22px]">
                {chartC.map((h,i)=>(
                  <div key={i} className="flex-1 rounded-[2px] transition-all duration-700" style={{height:`${h}%`, background: i%2===0 ? '#A855F7' : '#222'}} />
                ))}
              </div>
            </div>

            {/* Uptime */}
            <div className="card-premium p-[20px] group" onMouseMove={(e)=>{
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
            }}>
              <div className="flex items-center justify-between mb-[18px]">
                <div className="flex items-center gap-[8px]">
                  <div className="w-[28px] h-[28px] rounded-[10px] bg-[#151515] border border-[#222] flex items-center justify-center"><Activity className="w-[14px] h-[14px] text-[#00D9FF]" /></div>
                  <span className="text-[10px] tracking-[0.14em] text-[#666] font-semibold" style={{fontFamily:'JetBrains Mono, monospace'}}>UPTIME</span>
                </div>
                <div className="flex items-center gap-[5px] text-[10px] text-[#00D9FF]" style={{fontFamily:'JetBrains Mono, monospace'}}>
                  <span className="w-[5px] h-[5px] bg-[#00D9FF] rounded-full animate-[pulseDot_1.2s_infinite]" /> Live
                </div>
              </div>
              <div className="flex items-baseline gap-[6px] mb-[6px]">
                <span className="text-[36px] font-black tracking-[-0.05em] leading-none" style={{fontFamily:'Inter, sans-serif', fontWeight:900}}>{upDisplay.toFixed(1)}%</span>
                <span className="text-[12px] text-[#00D9FF] font-medium" style={{fontFamily:'JetBrains Mono, monospace'}}>• {uptimeLive.toFixed(2)}% now</span>
              </div>
              <div className="text-[11px] text-[#777] mb-[18px]" style={{fontFamily:'Inter, sans-serif'}}>Edge global • 24 regions</div>
              <div className="h-[3px] w-full bg-[#1a1a1a] rounded-full overflow-hidden mb-[14px]">
                <div className="h-full bg-[#00D9FF] rounded-full transition-all duration-1000" style={{width:`${upDisplay}%`}} />
              </div>
              <div className="flex items-end gap-[3px] h-[22px]">
                {chartD.map((h,i)=>(
                  <div key={i} className="flex-1 rounded-[2px] transition-all duration-700" style={{height:`${h}%`, background: '#00D9FF'}} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PERFORMANCE METRICS */}
        <section className="mb-[20px] grid grid-cols-1 lg:grid-cols-12 gap-[12px]">
          <div className="lg:col-span-8 card-premium p-[20px] md:p-[24px]">
            <div className="flex items-center justify-between mb-[22px]">
              <div className="flex items-center gap-[10px]">
                <span className="text-[11px] tracking-[0.16em] font-bold text-[#666]" style={{fontFamily:'JetBrains Mono, monospace'}}>PERFORMANCE • LIVE</span>
                <span className="w-[5px] h-[5px] rounded-full bg-[#00FF88] animate-[pulseDot_1s_infinite]" />
              </div>
              <div className="text-[10px] text-[#444]" style={{fontFamily:'JetBrains Mono, monospace'}}>AUTO-REFRESH 3S</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
              {[
                {label:'Response time', value:`${responseLive.toFixed(0)}ms`, base:responseLive, max:120, icon:Timer, sub:'p95 edge'},
                {label:'Bundle size', value:`${bundleLive.toFixed(1)}kb`, base:bundleLive*3, max:100, icon:Layers, sub:'gzipped'},
                {label:'Dependencies', value:'0 vuln', base:100, max:100, icon:GitBranch, sub:'locked'},
                {label:'Coverage', value:`${coverageLive.toFixed(1)}%`, base:coverageLive, max:100, icon:Cpu, sub:'statements'},
              ].map(item=>(
                <div key={item.label} className="group/item">
                  <div className="flex items-center justify-between mb-[10px]">
                    <div className="flex items-center gap-[8px]">
                      <item.icon className="w-[14px] h-[14px] text-[#555] group-hover/item:text-[#999] transition-colors" />
                      <span className="text-[12px] font-medium text-[#aaa] tracking-[-0.01em]" style={{fontFamily:'Inter, sans-serif'}}>{item.label}</span>
                    </div>
                    <span className="text-[12px] font-bold text-white tracking-[-0.02em]" style={{fontFamily:'JetBrains Mono, monospace'}}>{item.value}</span>
                  </div>
                  <div className="h-[32px] rounded-[10px] bg-[#0f0f0f] border border-[#1a1a1a] p-[3px] flex items-center gap-[2px] overflow-hidden">
                    <div className="h-full rounded-[7px] bg-white transition-all duration-1000 ease-out relative overflow-hidden" style={{width:`${Math.min(100, (item.base/item.max)*100)}%`}}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent animate-[shimmer_2s_infinite]" />
                    </div>
                    <div className="flex-1 flex gap-[2px] h-full items-center pl-[2px]">
                      {Array.from({length:8}).map((_,i)=>(
                        <div key={i} className="flex-1 h-[60%] rounded-full bg-[#1e1e1e]" style={{opacity: 0.3 + Math.random()*0.7}} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-[6px] text-[10px] text-[#444]" style={{fontFamily:'JetBrains Mono, monospace'}}>{item.sub} • live</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 card-premium p-[20px] md:p-[24px] flex flex-col">
            <div className="flex items-center gap-[8px] mb-[18px]">
              <Sparkles className="w-[14px] h-[14px] text-[#FFB800]" />
              <span className="text-[11px] tracking-[0.14em] font-bold text-[#666]" style={{fontFamily:'JetBrains Mono, monospace'}}>BUILD LOG</span>
              <span className="ml-auto w-[5px] h-[5px] bg-[#00FF88] rounded-full animate-[pulseDot_1s_infinite]" />
            </div>

            <div className="rounded-[16px] bg-[#050505] border border-[#111] p-[14px] font-mono text-[11px] leading-[18px] flex-1 overflow-hidden" style={{fontFamily:'JetBrains Mono, monospace'}}>
              <div className="flex flex-col gap-[8px]">
                {logLines.slice(0, visibleLogs).map((l,i)=>(
                  <div key={i} className="flex gap-[10px] items-start opacity-0 animate-[fadeIn_0.4s_forwards]" style={{animationDelay:`${i*40}ms`} as any}>
                    <span className="text-[#333] shrink-0">{l.ts}</span>
                    <span className="text-[#888] leading-[1.4]">{l.text}</span>
                    {l.ok && <Check className="w-[12px] h-[12px] text-[#00FF88] mt-[2px] shrink-0" />}
                  </div>
                ))}
                {visibleLogs < logLines.length && (
                  <div className="flex items-center gap-[6px] text-[#444] mt-[4px]">
                    <span className="w-[8px] h-[2px] bg-white animate-[pulseDot_0.8s_infinite]" />
                    <span>processing…</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-[16px] flex items-center justify-between">
              <div className="flex items-center gap-[6px] text-[10px] text-[#555]" style={{fontFamily:'JetBrains Mono, monospace'}}>
                <div className="w-[16px] h-[16px] rounded-full bg-[#111] border border-[#222] flex items-center justify-center">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#00FF88]" />
                </div>
                All systems pass
              </div>
              <div className="text-[10px] text-[#333]" style={{fontFamily:'JetBrains Mono, monospace'}}>{visibleLogs}/{logLines.length}</div>
            </div>
          </div>
        </section>

        {/* 11 SKILLS GRID */}
        <section className="mb-[20px]">
          <div className="flex items-end justify-between mb-[16px] gap-[12px]">
            <div>
              <h3 className="text-[14px] font-bold tracking-[-0.02em] text-white flex items-center gap-[8px]" style={{fontFamily:'Inter, sans-serif'}}>
                <span className="w-[24px] h-[24px] rounded-[8px] bg-white text-black flex items-center justify-center text-[11px] font-black">11</span>
                SKILLS ENGINE
              </h3>
              <div className="text-[11px] text-[#666] mt-[6px]" style={{fontFamily:'JetBrains Mono, monospace'}}>ZeroGen capability matrix • live status</div>
            </div>
            <div className="hidden md:flex items-center gap-[8px] text-[10px] text-[#444]" style={{fontFamily:'JetBrains Mono, monospace'}}>
              <span className="flex items-center gap-[4px]"><span className="w-[6px] h-[6px] rounded-full bg-[#00FF88]" /> Active</span>
              <span className="flex items-center gap-[4px]"><span className="w-[6px] h-[6px] rounded-full bg-[#A855F7]" /> Verified</span>
              <span className="flex items-center gap-[4px]"><span className="w-[6px] h-[6px] rounded-full bg-[#00D9FF]" /> Live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
            {skills.map(s=>(
              <div key={s.id} className="card-premium p-[18px] group" onMouseMove={(e)=>{
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
              }}>
                <div className="flex items-start justify-between mb-[14px]">
                  <div className="w-[36px] h-[36px] rounded-[12px] bg-[#111] border border-[#1e1e1e] flex items-center justify-center group-hover:border-[#2a2a2a] transition-colors">
                    <s.icon className="w-[18px] h-[18px]" style={{color:s.color}} />
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <span className="w-[5px] h-[5px] rounded-full animate-[pulseDot_1.6s_infinite]" style={{background:s.color}} />
                    <span className="text-[10px] font-bold tracking-[0.08em] px-[8px] h-[20px] rounded-full bg-[#111] border border-[#1e1e1e] flex items-center" style={{color:s.color, fontFamily:'JetBrains Mono, monospace'}}>{s.status}</span>
                  </div>
                </div>
                <h4 className="text-[14px] font-semibold tracking-[-0.02em] text-white mb-[4px]" style={{fontFamily:'Inter, sans-serif'}}>{s.name}</h4>
                <p className="text-[11px] text-[#666] leading-[1.4] mb-[14px]" style={{fontFamily:'JetBrains Mono, monospace'}}>{s.desc}</p>
                <div className="flex items-center gap-[8px]">
                  <div className="flex-1 h-[2px] bg-[#151515] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{width:`${70 + (s.id*7)%30}%`, background:s.color}} />
                  </div>
                  <ChevronRight className="w-[12px] h-[12px] text-[#333] group-hover:text-[#666] group-hover:translate-x-[2px] transition-all" />
                </div>
              </div>
            ))}
            {/* CTA card */}
            <div className="card-premium p-[18px] bg-[#0a0a0a] border-dashed border-[#222] flex flex-col justify-center min-h-[134px] group hover:border-[#333]">
              <div className="w-[36px] h-[36px] rounded-[12px] bg-white text-black flex items-center justify-center mb-[12px] font-black text-[16px]" style={{fontFamily:'Inter, sans-serif'}}>＋</div>
              <h4 className="text-[13px] font-semibold text-[#888] group-hover:text-white transition-colors" style={{fontFamily:'Inter, sans-serif'}}>Add custom skill</h4>
              <p className="text-[11px] text-[#444] mt-[4px]" style={{fontFamily:'JetBrains Mono, monospace'}}>Extend matrix • plug-in system</p>
            </div>
          </div>
        </section>

        {/* FULLSTACK + DEPLOY */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-[12px] mb-[20px]">
          <div className="lg:col-span-7 card-premium p-[22px] md:p-[28px]">
            <div className="flex items-center gap-[10px] mb-[20px]">
              <div className="w-[28px] h-[28px] rounded-[10px] bg-[#151515] border border-[#222] flex items-center justify-center"><Layers className="w-[14px] h-[14px] text-white" /></div>
              <span className="text-[11px] tracking-[0.14em] font-bold text-[#666]" style={{fontFamily:'JetBrains Mono, monospace'}}>FULLSTACK ARCHITECTURE</span>
              <span className="ml-auto text-[10px] px-[8px] h-[20px] rounded-full bg-white text-black font-bold flex items-center">PRODUCTION</span>
            </div>
            <div className="grid grid-cols-3 gap-[12px] mb-[20px]">
              {[
                {k:'Frontend', v:'Next.js 15 • RSC • Edge'},
                {k:'Backend', v:'Hono • tRPC • Zod'},
                {k:'Data', v:'Postgres • Redis • S3'},
              ].map(b=>(
                <div key={b.k} className="rounded-[14px] bg-[#050505] border border-[#141414] p-[14px]">
                  <div className="text-[10px] tracking-[0.1em] text-[#555] font-bold mb-[6px]" style={{fontFamily:'JetBrains Mono, monospace'}}>{b.k}</div>
                  <div className="text-[12px] leading-[1.3] text-[#aaa]" style={{fontFamily:'Inter, sans-serif'}}>{b.v}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {['Zero config','Type safe','Edge first','Auto deploy'].map(t=>(
                <div key={t} className="h-[26px] px-[12px] rounded-full bg-[#111] border border-[#1e1e1e] text-[11px] text-[#777] flex items-center gap-[6px]" style={{fontFamily:'Inter, sans-serif'}}>
                  <span className="w-[4px] h-[4px] rounded-full bg-white" /> {t}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 card-premium p-[22px] md:p-[28px] relative overflow-hidden">
            <div className="absolute -right-[40px] -top-[40px] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-white/[0.06] to-transparent blur-[20px] pointer-events-none" style={{animation:'glowShift 4s infinite'}} />
            <div className="flex items-center gap-[10px] mb-[20px]">
              <div className="w-[28px] h-[28px] rounded-[10px] bg-white text-black flex items-center justify-center"><Rocket className="w-[14px] h-[14px]" /></div>
              <span className="text-[11px] tracking-[0.14em] font-bold text-[#666]" style={{fontFamily:'JetBrains Mono, monospace'}}>DEPLOY • GITHUB READY</span>
              <span className="ml-auto flex items-center gap-[5px] text-[10px] text-[#00FF88]" style={{fontFamily:'JetBrains Mono, monospace'}}>
                <span className="w-[5px] h-[5px] bg-[#00FF88] rounded-full animate-[pulseDot_1s_infinite]" /> Live
              </span>
            </div>
            <div className="space-y-[12px] mb-[20px]">
              {[
                {step:'01', title:'Push to main', desc:'Workflow triggers automatically'},
                {step:'02', title:'ZeroGen action runs', desc:'Build • audit • SBOM • deploy'},
                {step:'03', title:'Production live', desc:'Edge deployed in 1.2s avg'},
              ].map(r=>(
                <div key={r.step} className="flex gap-[14px] group">
                  <div className="text-[10px] font-bold text-[#333] group-hover:text-[#666] transition-colors mt-[2px]" style={{fontFamily:'JetBrains Mono, monospace'}}>{r.step}</div>
                  <div>
                    <div className="text-[13px] font-medium text-white tracking-[-0.01em]" style={{fontFamily:'Inter, sans-serif'}}>{r.title}</div>
                    <div className="text-[11px] text-[#666]" style={{fontFamily:'Inter, sans-serif'}}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-[12px] bg-[#050505] border border-[#151515] p-[12px] flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <div className="w-[32px] h-[32px] rounded-[10px] bg-[#111] border border-[#1e1e1e] flex items-center justify-center">
                  <GitBranch className="w-[14px] h-[14px] text-[#777]" />
                </div>
                <div>
                  <div className="text-[12px] font-medium text-white" style={{fontFamily:'Inter, sans-serif'}}>ooblek-dev/ZeroGen</div>
                  <div className="text-[10px] text-[#555]" style={{fontFamily:'JetBrains Mono, monospace'}}>main • 1 commit ahead</div>
                </div>
              </div>
              <div className="w-[28px] h-[28px] rounded-full bg-white flex items-center justify-center">
                <ChevronRight className="w-[14px] h-[14px] text-black" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-[24px] border-t border-[#111] flex flex-col md:flex-row items-start md:items-center justify-between gap-[12px]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[28px] h-[28px] rounded-full bg-white flex items-center justify-center text-[14px] font-black text-black" style={{fontFamily:'Inter, sans-serif'}}>0</div>
            <span className="text-[12px] text-[#666] tracking-[-0.01em]" style={{fontFamily:'Inter, sans-serif'}}>ZeroGen — Zero config, full power. 2026</span>
          </div>
          <div className="flex items-center gap-[16px] text-[10px] tracking-[0.08em] text-[#444]" style={{fontFamily:'JetBrains Mono, monospace'}}>
            <span className="flex items-center gap-[6px]"><span className="w-[5px] h-[5px] rounded-full bg-[#00FF88] animate-[pulseDot_1.2s_infinite]" /> ALL SYSTEMS OPERATIONAL</span>
            <span>•</span>
            <span>BUILT FOR GITHUB PAGES</span>
            <span>•</span>
            <span>index.html</span>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(4px); }
          to { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}
