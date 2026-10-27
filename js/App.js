function bars(id){const c=document.getElementById(id);if(!c)return;c.innerHTML='';for(let i=0;i<12;i++){const d=document.createElement('div');d.style.height=(6+Math.random()*14)+'px';d.className=Math.random()>.35?'on':'';c.appendChild(d);}}
['b1','b2','b3','b4'].forEach(bars);
setInterval(()=>{['b1','b2','b3','b4'].forEach(id=>{const c=document.getElementById(id);if(!c)return;[...c.children].forEach(b=>{b.style.height=(6+Math.random()*14)+'px';b.className=Math.random()>.3?'on':'';});});},1800);
const lines=["Stack: node","Security: 14 files","Perf: passed","SBOM: 3 valid","Review: 6 issues","E2E: 2 passed","Build complete"];
let i=0;const tl=document.getElementById('term');function add(){if(i<lines.length){const d=document.createElement('div');d.textContent='✓ '+lines[i];if(tl)tl.appendChild(d);i++;setTimeout(add,200);}}if(tl)add();
setInterval(()=>{const el=document.getElementById('clock');if(el)el.textContent=new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});},1000);
