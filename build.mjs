import fs from 'node:fs';
import path from 'node:path';
import { compile } from 'tailwindcss';

const root=process.cwd();
const input=`@tailwind utilities;\n\n@layer base {\nhtml{scroll-behavior:smooth}\nbody{font-family:Inter,ui-sans-serif,system-ui,sans-serif}\n::selection{background:rgba(59,130,246,.3)}\n:focus-visible{outline:2px solid #60a5fa;outline-offset:2px}\n}\n@layer components {\n.glass{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.045);backdrop-filter:blur(18px)}\n.surface{border-radius:1rem;border:1px solid rgba(255,255,255,.1);background:rgba(15,23,42,.8)}\n.btn-primary{display:inline-flex;align-items:center;justify-content:center;border-radius:.75rem;background:#3b82f6;padding:.625rem 1rem;font-size:.875rem;font-weight:700;color:#fff;box-shadow:0 10px 25px rgba(59,130,246,.2);transition:transform .2s,background .2s}\n.btn-primary:hover{background:#60a5fa;transform:translateY(-1px)}\n.btn-secondary{display:inline-flex;align-items:center;justify-content:center;border-radius:.75rem;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);padding:.625rem 1rem;font-size:.875rem;font-weight:600;color:#f8fafc;transition:background .2s}\n.btn-secondary:hover{background:rgba(255,255,255,.1)}\n}\n@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}\n`;
const files=[];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.name==='node_modules'||e.name.startsWith('.git'))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(/\.(html|js)$/.test(e.name))files.push(p);}}
walk(root);
const source=files.map(f=>fs.readFileSync(f,'utf8')).join('\n');
const candidates=new Set((source.match(/[A-Za-z0-9_:/\\.\-\[\]!%#(),'"=]+/g)||[]).filter(x=>x.length<180));
const compiler=await compile(input,{base:root});
const css=compiler.build([...candidates]);
fs.writeFileSync(path.join(root,'assets/css/tailwind.css'),css+'\n');
console.log(`Built ${files.length} source files, ${candidates.size} candidates, ${css.length} CSS bytes.`);
