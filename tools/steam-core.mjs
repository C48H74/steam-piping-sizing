import { PIPE_CATALOG } from './pipe-catalog.mjs';

export function friction(Re,epsD) {
  if (Re < 2300) return {f:64/Re,regime:'laminar',sj:null,haaland:null};
  if (Re < 4000) return {f:null,regime:'transition',sj:null,haaland:null};
  const sj=.25/Math.log10(epsD/3.7+5.74/Re**.9)**2;
  let f=sj;
  for(let i=0;i<200;i++) {
    const next=1/(-2*Math.log10(epsD/3.7+2.51/(Re*Math.sqrt(f))))**2;
    if(Math.abs(next-f)<1e-12) {f=next;break;} f=next;
    if(i===199) throw Error('Colebrook did not converge');
  }
  return {f,regime:'turbulent',sj,haaland:1/(-1.8*Math.log10((epsD/3.7)**1.11+6.9/Re))**2};
}

function number(o,key,fallback,min=0,inclusive=false) {
  const x=o[key]??fallback;
  if(typeof x!=='number'||!Number.isFinite(x)||(inclusive?x<min:x<=min))
    throw Error(`--${key}: expected a finite number ${inclusive?'>=':'>'} ${min}`);
  return x;
}
export function validateCatalog(rows) {
  if(!Array.isArray(rows)||!rows.length) throw Error('Catalog must be a non-empty JSON array');
  const keys=new Set();
  return rows.map(r=>{
    if(!r||typeof r!=='object'||typeof r.schedule!=='string'||!r.schedule.trim()||typeof r.source!=='string'||!r.source.trim())
      throw Error('Each catalog row needs schedule and source strings');
    number({dn:r.dn},'dn');number({idMm:r.idMm},'idMm');
    const key=`${r.dn}/${r.schedule}`;if(keys.has(key)) throw Error(`Duplicate catalog row ${key}`);keys.add(key);
    if(r.odMm!==undefined||r.wallMm!==undefined) {
      number({odMm:r.odMm},'odMm');number({wallMm:r.wallMm},'wallMm');
      if(Math.abs(r.odMm-2*r.wallMm-r.idMm)>.11) throw Error(`OD/wall/ID mismatch ${key}`);
    }
    return {...r};
  });
}
export function calculate(options,catalog=PIPE_CATALOG) {
  const o={...options};
  const m=number(o,'m'),purg=number(o,'purg',0,0,true),rho=number(o,'rho');
  const mu=number(o,'mu'),L=number(o,'L',undefined,0,true),eps=number(o,'eps',.045,0,true)/1000;
  const K=number(o,'K',0,0,true),Vmax=number(o,'V',30);
  const Pabs=o.Pabs===undefined?null:number(o,'Pabs');
  const dpPct=number(o,'dp-pct',10);if(dpPct>10) throw Error('--dp-pct must be <=10 for this constant-density approximation');
  const dpMax=o['dp-max']===undefined?null:number(o,'dp-max')*1e5;
  const Pout=o.Pout===undefined?null:number(o,'Pout');
  if(Pout!==null&&(Pabs===null||Pout>=Pabs)) throw Error('--Pout requires --Pabs > Pout; both in bar absolute');
  if(o['dp-pct']!==undefined&&Pabs===null) throw Error('--dp-pct requires --Pabs');
  if(o.a!==undefined&&(o.T!==undefined||o.k!==undefined)) throw Error('Use --a OR --T/--k');
  if(o.k!==undefined&&o.T===undefined) throw Error('--k requires --T');
  let sonic=null,sonicBasis='not supplied';
  if(o.a!==undefined) {sonic=number(o,'a');sonicBasis='user property';}
  else if(o.T!==undefined) {
    const T=number(o,'T',undefined,-273.15),k=number(o,'k',1.3,1);
    sonic=Math.sqrt(k*461.5*(T+273.15));sonicBasis='ideal-gas estimate; not IAPWS';
  }
  const flow=(m+purg)/3600,Qs=flow/rho,Dreq=Math.sqrt(4*Qs/(Math.PI*Vmax))*1000;
  if(![flow,Qs,Dreq,sonic??1].every(Number.isFinite)||flow<=0||Qs<=0||Dreq<=0)
    throw Error('Input magnitudes exceed the numerical range of the model');
  const limits=[dpMax,Pabs===null?null:Pabs*1e5*dpPct/100,Pout===null?null:(Pabs-Pout)*1e5].filter(x=>x!==null);
  const limit=limits.length?Math.min(...limits):null;
  const warnings=[];
  if(Pabs===null) warnings.push('Absolute pressure absent: fractional pressure-drop validity not checked.');
  if(limit===null) warnings.push('No pressure-drop acceptance criterion supplied: selection is preliminary.');
  if(sonic===null) warnings.push('Mach not checked: supply --a from steam properties or --T for an approximate check.');
  if(o.T!==undefined) warnings.push('Sound speed is an ideal-gas estimate; density/viscosity must still come from verified steam properties.');
  if(!o['properties-source']) warnings.push('Steam property source not recorded.');
  function evaluate(row) {
    const D=row.idMm/1000,A=Math.PI*D*D/4,V=Qs/A,Re=4*flow/(Math.PI*D*mu),epsD=eps/D;
    const ff=friction(Re,epsD),dynamic=rho*V*V/2;
    if(![D,A,V,Re,epsD,dynamic,ff.f??1].every(Number.isFinite)||D<=0||A<=0||Re<=0)
      throw Error('Candidate geometry/inputs exceed the numerical range of the model');
    const distributed=ff.f===null?null:ff.f*L/D*dynamic,local=K*dynamic;
    const dp=distributed===null?null:distributed+local,Mach=sonic===null?null:V/sonic;
    if(![distributed??0,local,dp??0,Mach??0].every(Number.isFinite))
      throw Error('Pressure-loss calculation exceeded the numerical range');
    const failures=[];
    if(V>Vmax*(1+1e-12)) failures.push('velocity');
    if(ff.f===null) failures.push('transition regime: no reliable friction result');
    if(Mach!==null&&Mach>=.3) failures.push('Mach >= 0.3: compressible analysis required');
    if(dp!==null&&limit!==null&&dp>limit*(1+1e-12)) failures.push('pressure drop');
    if(dp!==null&&Pabs!==null&&dp/(Pabs*1e5)>.1*(1+1e-12)) failures.push('pressure drop >10%: variable-density analysis required');
    return {...row,D,A,V,Re,epsD,...ff,distributed,local,dp,Mach,failures,passes:failures.length===0};
  }
  if(o.D!==undefined&&o.dn!==undefined) throw Error('Use --D OR --dn');
  const schedule=String(o.schedule??'40');let rows;
  if(o.D!==undefined) {
    if(o.schedule!==undefined||o.catalog!==undefined) throw Error('--D is an explicit bore; do not also select schedule/catalog');
    rows=[{dn:null,nps:null,schedule:'custom',idMm:number(o,'D'),source:'user internal diameter'}];
  } else {
    rows=validateCatalog(catalog).filter(r=>r.schedule===schedule).sort((a,b)=>a.idMm-b.idMm);
    if(!rows.length) throw Error(`Schedule ${schedule} not in catalog`);
    if(o.dn!==undefined) {number(o,'dn');rows=rows.filter(r=>r.dn===o.dn);if(!rows.length) throw Error('DN/schedule combination unavailable');}
  }
  const candidates=rows.map(evaluate);
  const forced=o.D!==undefined||o.dn!==undefined;
  const selected=forced?candidates[0]:candidates.find(c=>c.passes)??null;
  if(selected&&selected.epsD>=.05) warnings.push('Very large relative roughness: confirm applicability of the friction model.');
  return {inputs:{...o,m,purg,rho,mu,L,K,epsMm:eps*1000,Vmax,Pabs},massFlowKgH:m+purg,Qs,DreqMm:Dreq,
    pressureLimitPa:limit,sonic,sonicBasis,selected,candidates,warnings,
    status:selected===null?'NO_SIZE':!selected.passes?'FAIL':(sonic===null||Pabs===null||limit===null?'PRELIMINARY':'PASS'),
    scope:'Single-phase steam, constant density; hydraulic checks only, not mechanical code compliance'};
}
