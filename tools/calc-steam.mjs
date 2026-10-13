#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {calculate,validateCatalog} from './steam-core.mjs';
import {PIPE_CATALOG} from './pipe-catalog.mjs';
const labels={
 en:['Steam piping hydraulic sizing','Mass flow','Required diameter','Selected pipe','Velocity','Distributed loss','Local loss','Total pressure drop','Outlet pressure','Status','Warnings'],
 pt:['Dimensionamento hidráulico de vapor','Vazão mássica','Diâmetro requerido','Tubo selecionado','Velocidade','Perda distribuída','Perda localizada','Queda de pressão total','Pressão de saída','Estado','Avisos'],
 es:['Dimensionamiento hidráulico de vapor','Caudal másico','Diámetro requerido','Tubo seleccionado','Velocidad','Pérdida distribuida','Pérdida localizada','Caída de presión total','Presión de salida','Estado','Avisos']};
const numeric=new Set(['m','purg','rho','mu','L','eps','K','V','D','dn','Pabs','Pout','dp-max','dp-pct','a','T','k']);
const strings=new Set(['lang','schedule','catalog','properties-source']);
const flags=new Set(['help','json','all','list-sizes']);
function parse(argv) {
 const out={};
 for(let i=0;i<argv.length;i++) {
  const arg=argv[i]==='-h'?'--help':argv[i];if(!arg.startsWith('--'))throw Error(`Unexpected argument ${arg}`);
  const eq=arg.indexOf('='),key=eq<0?arg.slice(2):arg.slice(2,eq);
  if(Object.hasOwn(out,key))throw Error(`Duplicate --${key}`);
  if(flags.has(key)){if(eq>=0)throw Error(`--${key} takes no value`);out[key]=true;continue;}
  if(!numeric.has(key)&&!strings.has(key))throw Error(`Unknown --${key}`);
  const value=eq<0?argv[++i]:arg.slice(eq+1);
  if(value===undefined||value.startsWith('--')||!value.trim())throw Error(`--${key} needs a value`);
  out[key]=numeric.has(key)?Number(value):value;
  if(numeric.has(key)&&!Number.isFinite(out[key]))throw Error(`--${key} must be finite`);
 }
 return out;
}
function help(){console.log(`Steam piping sizing — SI units, Node.js, no dependencies
Required: --m kg/h --rho kg/m3 --mu Pa.s --L m (0 allowed)
Record property provenance: --properties-source "table and operating state"
Geometry: --schedule 40|80 (default 40), [--dn DN], OR --D internal-mm
          --catalog file.json supports any documented size/schedule
Flow: --purg kg/h additional STEAM demand (default 0, not liquid blowdown)
      --V maximum-m/s (default 30, project criterion), --eps mm (default .045)
      --K sum-of-fitting-loss-coefficients (default 0, preliminary if generic)
Pressure: --Pabs inlet-bar-absolute, --Pout required-bar-absolute,
          --dp-max max-drop-bar, --dp-pct max-% (default 10 with Pabs)
          Automatic selection satisfies ALL supplied limits.
Mach: --a sound-speed-m/s from steam properties OR --T Celsius [--k ratio]
      T/k is an ideal-gas approximation, not IAPWS; default k=1.3.
Output: --lang en|pt|es, --json, --all, --list-sizes
Exit: 0 accepted/preliminary; 2 input error; 3 failed/no candidate.
Validity: single-phase steam; constant density; Mach <0.3; dP/Pabs <=10%.
No hidden temperature or viscosity defaults. Missing Mach/pressure => PRELIMINARY.
Not mechanical ASME certification, wall thickness, flexibility, two-phase or transients.
See references/design-basis.md for sources and custom catalog schema.
Example:
node tools/calc-steam.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --K 14.1 --Pabs 9.013 --T 175 --all
`);}
function main(){
 const o=parse(process.argv.slice(2)),lang=o.lang??'en';
 if(!Object.hasOwn(labels,lang))throw Error('--lang must be en, pt or es');
 if(o.help)return help();
 const catalog=o.catalog?validateCatalog(JSON.parse(readFileSync(o.catalog,'utf8'))):PIPE_CATALOG;
 if(o['list-sizes']){
  const rows=catalog.filter(r=>o.schedule===undefined||r.schedule===o.schedule);
  if(!rows.length)throw Error('Schedule unavailable');
  if(o.json)console.log(JSON.stringify(rows,null,2));else console.table(rows.map(({dn,nps,schedule,idMm})=>({DN:dn,NPS:nps,Sch:schedule,ID_mm:idMm})));return;
 }
 const r=calculate(o,catalog),s=r.selected,w=labels[lang];
 if(o.json)console.log(JSON.stringify(r,null,2));else {
  const fmt=(x,n=4)=>x===null?'N/A':x.toLocaleString('en-US',{maximumFractionDigits:n});
  const kv=(k,v)=>console.log(`${k} = ${v}`);
  console.log(w[0]);kv(w[1],`${fmt(r.massFlowKgH)} kg/h`);kv('Qv',`${fmt(r.Qs,6)} m3/s`);kv(w[2],`${fmt(r.DreqMm)} mm`);kv(w[9],r.status);
  if(s){
   kv(w[3],`${s.dn===null?'custom':`DN${s.dn}`} Sch ${s.schedule}; ID ${fmt(s.idMm)} mm`);
   kv(w[4],`${fmt(s.V)} m/s`);kv('Re',s.Re.toExponential(5));kv('f (Darcy)',fmt(s.f,6));kv('regime',s.regime);
   kv(w[5],`${fmt(s.distributed===null?null:s.distributed/1e5,6)} bar`);kv(w[6],`${fmt(s.local/1e5,6)} bar`);kv(w[7],`${fmt(s.dp===null?null:s.dp/1e5,6)} bar`);
   kv(w[8],`${fmt(r.inputs.Pabs===null||s.dp===null?null:r.inputs.Pabs-s.dp/1e5)} bar(a)`);kv('Mach',fmt(s.Mach));
   if(s.failures.length)console.log(s.failures.join('; '));
  }else console.log('No size meets all criteria / Nenhum diâmetro atende / Ningún diámetro cumple');
  kv('dP limit',`${fmt(r.pressureLimitPa===null?null:r.pressureLimitPa/1e5,6)} bar`);kv('a',`${fmt(r.sonic)} m/s (${r.sonicBasis})`);
  if(o.all)console.table(r.candidates.map(c=>({DN:c.dn,Sch:c.schedule,ID_mm:c.idMm,V:+c.V.toFixed(3),dP_bar:c.dp===null?null:+(c.dp/1e5).toFixed(6),result:c.passes?'PASS':'FAIL',reason:c.failures.join('; ')})));
  if(r.warnings.length){console.log(w[10]);r.warnings.forEach(x=>console.log(`- ${x}`));}console.log(r.scope);
 }
 if(['FAIL','NO_SIZE'].includes(r.status))process.exitCode=3;
}
try{main();}catch(e){console.error(`Error / Erro: ${e.message}`);process.exitCode=2;}
