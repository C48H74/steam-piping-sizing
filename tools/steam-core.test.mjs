import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {calculate,friction,validateCatalog} from './steam-core.mjs';
import {PIPE_CATALOG} from './pipe-catalog.mjs';
const base={m:2500,rho:4.81,mu:1.34e-5,L:45,K:14.1,Pabs:9.013,T:175};
const close=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('Legacy DN80 case reproduces independently evaluated hydraulic equations',()=>{
 const r=calculate({...base,D:77.9,V:40}),s=r.selected;
 const q=2500/3600/4.81,v=q/(Math.PI*.0779**2/4);
 close(s.V,v);close(s.Re,4*(2500/3600)/(Math.PI*.0779*1.34e-5));
 const residual=1/Math.sqrt(s.f)+2*Math.log10(.000045/(3.7*.0779)+2.51/(s.Re*Math.sqrt(s.f)));
 close(residual,0);close(s.dp,(s.f*45/.0779+14.1)*4.81*v*v/2);
 close(s.dp,53795,1e-5);assert.equal(r.status,'PASS');
});
test('Steam branch demand included; pressure budget drives automatic upsizing',()=>{
 const r=calculate({...base,purg:500});close(r.massFlowKgH,3000);
 assert.ok(r.selected.V<=30);
 const tighter=calculate({...base,'dp-max':.1});assert.ok(tighter.selected.dp<=10000);
 assert.ok(tighter.selected.idMm>calculate(base).selected.idMm);
 assert.ok(calculate({...base,Pout:8.95}).selected.dp<=6300+1e-7);
 assert.equal(calculate({...base,D:77.9,V:40,'dp-max':.5}).status,'FAIL');
});
test('Every bundled bore at both schedules executes and dimensions are coherent',()=>{
 assert.equal(PIPE_CATALOG.length,47);validateCatalog(PIPE_CATALOG);
 for(const row of PIPE_CATALOG){
  const m=4.81*Math.PI*(row.idMm/1000)**2/4*20*3600;
  const r=calculate({...base,m,L:0,K:0,dn:row.dn,schedule:row.schedule});
  assert.equal(r.status,'PASS');close(r.selected.V,20);assert.equal(r.selected.dp,0);
 }
});
test('All custom bores, custom schedules and catalog overflow handled explicitly',()=>{
 assert.equal(calculate({...base,D:1200}).selected.idMm,1200);
 const rows=[{dn:1200,idMm:1160,schedule:'project',source:'vendor drawing'}];
 assert.equal(calculate({...base,schedule:'project'},rows).selected.dn,1200);
 assert.equal(calculate({...base,m:1e9}).status,'NO_SIZE');
 assert.throws(()=>calculate({...base,dn:550,schedule:'40'}));
 assert.throws(()=>validateCatalog([...rows,...rows]));
 assert.throws(()=>validateCatalog([{...rows[0],odMm:1200,wallMm:10}]));
});
test('No hidden Mach state; forced failures and valid friction regimes',()=>{
 const o={...base};delete o.T;assert.equal(calculate(o).status,'PRELIMINARY');
 assert.equal(calculate({...base,D:77.9}).status,'FAIL');
 assert.equal(calculate({...base,D:20,a:100,T:undefined}).status,'FAIL');
 close(friction(1000,0).f,.064);assert.equal(friction(3000,0).f,null);
 const qRe3000=3000*Math.PI*.1*base.mu/4*3600;
 const r=calculate({...base,m:qRe3000,D:100});assert.equal(r.status,'FAIL');assert.equal(r.selected.dp,null);
 assert.ok(calculate({...base,a:520,T:undefined}).selected.Mach<.3);
});
test('Invalid physics, conflicts and unsafe budgets rejected',()=>{
 for(const [key,val] of [['m',0],['rho',-1],['mu',0],['L',-1],['K',-1],['eps',-1],['V',0],['purg',-1],['T',-273.15],['Pabs',0],['D',0],['rho',NaN]])
  assert.throws(()=>calculate({...base,[key]:val}),key);
 assert.throws(()=>calculate({...base,'dp-pct':11}));
 assert.throws(()=>calculate({...base,Pout:10}));
 assert.throws(()=>calculate({...base,D:80,dn:80}));
 assert.throws(()=>calculate({...base,a:520}));
 assert.throws(()=>calculate({...base,mu:undefined}));
 assert.throws(()=>calculate({...base,m:1e308,rho:1e-308}));
});
test('CLI languages preserve numeric results and reject unsupported options',()=>{
 for(const lang of ['en','pt','es']){
  const p=spawnSync(process.execPath,['tools/calc-vapor.mjs','--m','2500','--rho','4.81','--mu','1.34e-5','--L','45','--K','14.1','--Pabs','9.013','--T','175','--lang',lang,'--json'],{encoding:'utf8'});
  assert.equal(p.status,0,p.stderr);assert.equal(JSON.parse(p.stdout).selected.dn,90);
 }
 for(const args of [[],['--unknown','3'],['--m','NaN'],['--lang','fr'],['--json=true']]){
  const p=spawnSync(process.execPath,['tools/calc-vapor.mjs',...args],{encoding:'utf8'});assert.equal(p.status,2,p.stdout);
 }
});
