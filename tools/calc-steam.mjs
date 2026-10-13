#!/usr/bin/env node
/**
 * calc-steam.mjs — Steam pipe sizing
 *
 * Calculation chain:
 *   Qv = m/rho  ->  D = sqrt(4*Qv/(pi*V))  ->  DN selection (Schedule 40)
 *   ->  actual V  ->  Re  ->  f (Swamee-Jain)  ->  hf (Darcy-Weisbach)
 *   ->  h_loc (Sum K)  ->  total dP  ->  checks
 *
 * Internal SI units. Input in field units.
 * No external dependencies.
 *
 * Language: --lang <en|pt|es> (default: en; accepts --lang pt or --lang=pt).
 * Available languages: en = English, pt = Portuguese, es = Spanish.
 * Numbers are ALWAYS displayed in English format (decimal point, comma
 * thousands separator) regardless of --lang; only the labels are translated.
 *
 * Usage:
 *   node tools/calc-steam.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --eps 0.045 --K 14.1
 *   node tools/calc-steam.mjs --m 2500 --rho 4.81 --L 45 --K 14.1 --D 77.9 --V 30 --lang pt
 *   node tools/calc-steam.mjs --help
 */

const G = 9.80665;

/** Schedule 40 internal diameters (ASME B36.10M), mm. */
const SCH40 = [
  { dn: 'DN15 (1/2")', id: 15.8 },
  { dn: 'DN20 (3/4")', id: 20.9 },
  { dn: 'DN25 (1")', id: 26.6 },
  { dn: 'DN32 (1 1/4")', id: 35.1 },
  { dn: 'DN40 (1 1/2")', id: 40.9 },
  { dn: 'DN50 (2")', id: 52.5 },
  { dn: 'DN65 (2 1/2")', id: 62.7 },
  { dn: 'DN80 (3")', id: 77.9 },
  { dn: 'DN100 (4")', id: 102.3 },
  { dn: 'DN125 (5")', id: 128.2 },
  { dn: 'DN150 (6")', id: 154.1 },
  { dn: 'DN200 (8")', id: 202.7 },
  { dn: 'DN250 (10")', id: 254.5 },
  { dn: 'DN300 (12")', id: 303.2 },
];

/* ------------------------------------------------------------------ *
 * i18n — single label dictionary (labels only; no numbers/units).    *
 * ------------------------------------------------------------------ */

const LANGS = ['en', 'pt', 'es'];

const T = {
  // Sections
  sec1: {
    en: 'Volumetric flow rate',
    pt: 'Vazão volumétrica',
    es: 'Caudal volumétrico',
  },
  sec2: {
    en: 'Required diameter (by velocity)',
    pt: 'Diâmetro requerido (por velocidade)',
    es: 'Diámetro requerido (por velocidad)',
  },
  sec3: {
    en: 'Reynolds number',
    pt: 'Número de Reynolds',
    es: 'Número de Reynolds',
  },
  sec4: {
    en: 'Friction factor',
    pt: 'Fator de atrito',
    es: 'Factor de fricción',
  },
  sec5: {
    en: 'Distributed head loss (Darcy-Weisbach)',
    pt: 'Perda de carga distribuída (Darcy-Weisbach)',
    es: 'Pérdida de carga distribuida (Darcy-Weisbach)',
  },
  sec6: {
    en: 'Localized losses (Sigma K)',
    pt: 'Perdas localizadas (Sigma K)',
    es: 'Pérdidas localizadas (Sigma K)',
  },
  sec7: {
    en: 'Total',
    pt: 'Total',
    es: 'Total',
  },
  sec8: {
    en: 'Checks',
    pt: 'Verificações',
    es: 'Verificaciones',
  },

  // Field labels
  vDesign: { en: 'Design V', pt: 'V de projeto', es: 'V de diseño' },
  dnAdopted: { en: 'DN adopted', pt: 'DN adotado', es: 'DN adoptado' },
  dInternal: { en: 'Internal D', pt: 'D interno', es: 'D interno' },
  area: { en: 'Area', pt: 'Área', es: 'Área' },
  vReal: { en: 'Actual V', pt: 'V real', es: 'V real' },
  note: { en: 'Note', pt: 'Nota', es: 'Nota' },
  wouldGive: { en: 'would give V', pt: 'daria V', es: 'daría V' },
  aboveTarget: { en: 'above target', pt: 'acima do alvo', es: 'sobre el objetivo' },
  reference: { en: 'reference', pt: 'referência', es: 'referencia' },
  devSjCb: { en: 'deviation SJ vs CB', pt: 'desvio SJ vs CB', es: 'desviación SJ vs CB' },
  vaporColumn: { en: 'm of vapor column', pt: 'm de coluna de vapor', es: 'm de columna de vapor' },
  dpLimit: { en: '(usual limit: up to 10 %)', pt: '(limite usual: ate 10 %)', es: '(límite usual: hasta 10 %)' },
  mca: { en: 'mca (WATER column)', pt: 'mca (coluna de AGUA)', es: 'mca (columna de AGUA)' },
  mcaWarn: { en: '<- caution: not the same unit!', pt: '<- atencao: nao e a mesma unidade!', es: '<- atención: ¡no es la misma unidad!' },
  erosion: { en: 'Erosion (API RP 14E, C=100)', pt: 'Erosao (API RP 14E, C=100)', es: 'Erosión (API RP 14E, C=100)' },
  sonic: {
    en: 'Approx. speed of sound (k=1,3; T=175C)',
    pt: 'Velocidade do som aprox. (com k=1,3; T=175C)',
    es: 'Velocidad del sonido aprox. (con k=1,3; T=175C)',
  },

  // Words / results
  forced: { en: 'forced', pt: 'forçado', es: 'forzado' },
  laminar: { en: 'LAMINAR', pt: 'LAMINAR', es: 'LAMINAR' },
  transition: { en: 'TRANSITION', pt: 'TRANSIÇÃO', es: 'TRANSICIÓN' },
  turbulent: { en: 'TURBULENT', pt: 'TURBULENTO', es: 'TURBULENTO' },
  ok: { en: 'OK', pt: 'OK', es: 'OK' },
  fail: { en: 'FAIL', pt: 'REPROVA', es: 'REPRUEBA' },
  incompressible: { en: 'OK (incompressible)', pt: 'OK (incompressivel)', es: 'OK (incompresible)' },
  compressible: {
    en: 'CAUTION: compressible flow',
    pt: 'ATENCAO: escoamento compressivel',
    es: 'ATENCIÓN: flujo compresible',
  },

  // Errors
  errRequired: {
    en: 'Error: --m, --rho and --L are required. Use --help.',
    pt: 'Erro: --m, --rho e --L são obrigatórios. Use --help.',
    es: 'Error: --m, --rho y --L son obligatorios. Use --help.',
  },
  errLang: {
    en: 'Error: invalid --lang. Expected one of: en, pt, es.',
    pt: 'Erro: --lang inválido. Esperado: en, pt, es.',
    es: 'Error: --lang no válido. Se esperaba: en, pt, es.',
  },
};

let lang = 'en';

/** Translates a dictionary key into the selected language. */
const t = (key) => T[key][lang];

/** Normalizes the value received in --lang; returns null when it is invalid. */
function normLang(value) {
  if (value === undefined || value === true || value === null) return 'en';
  const s = String(value).toLowerCase();
  return LANGS.includes(s) ? s : null;
}

/* ------------------------------------------------------------------ */

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { out.help = true; continue; }
    if (!a.startsWith('--')) continue;
    const eq = a.indexOf('=');
    const key = eq === -1 ? a.slice(2) : a.slice(2, eq);
    let val = eq === -1 ? undefined : a.slice(eq + 1);
    if (val === undefined) {
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) { val = next; i++; }
    }
    if (key === 'lang') { out.lang = val === undefined ? true : val; continue; }
    out[key] = val === undefined ? true : Number(val);
  }
  return out;
}

/** Friction factor — Swamee-Jain (explicit).
 *  Valid for 5e3 < Re < 1e8 and 1e-6 < eps/D < 1e-2.
 *  f = 0.25 / [ log10( eps/(3.7D) + 5.74/Re^0.9 ) ]^2 */
function swameeJain(Re, epsD) {
  const t = Math.log10(epsD / 3.7 + 5.74 / Math.pow(Re, 0.9));
  return 0.25 / (t * t);
}

/** Friction factor — Colebrook-White (implicit, solved by fixed-point iteration).
 *  1/sqrt(f) = -2 log10( eps/(3.7D) + 2.51/(Re sqrt(f)) ) */
function colebrook(Re, epsD, tol = 1e-12, maxIter = 200) {
  let f = swameeJain(Re, epsD);
  for (let i = 0; i < maxIter; i++) {
    const rhs = -2 * Math.log10(epsD / 3.7 + 2.51 / (Re * Math.sqrt(f)));
    const next = 1 / (rhs * rhs);
    if (Math.abs(next - f) < tol) return next;
    f = next;
  }
  return f;
}

/** Haaland (explicit, good initial estimate).
 *  1/sqrt(f) = -1.8 log10[ (eps/(3.7D))^1.11 + 6.9/Re ] */
function haaland(Re, epsD) {
  const t = -1.8 * Math.log10(Math.pow(epsD / 3.7, 1.11) + 6.9 / Re);
  return 1 / (t * t);
}

/** Numeric display format: always en-US (decimal point, comma thousands
 *  separator), in every language. Only the labels change with --lang;
 *  the computed values are identical in all three languages. */
const fmt = (x, n = 3) => Number(x).toLocaleString('en-US', {
  minimumFractionDigits: n, maximumFractionDigits: n,
});

/** Aligned "label = value" line. */
const kv = (label, value) => console.log(`${String(label).padEnd(20)} = ${value}`);

function reportHelp() {
  console.log(`
calc-steam.mjs — steam pipe sizing (internal SI units, field-unit input)

REQUIRED
  --m <kg/h>        steam mass flow rate
  --rho <kg/m3>     steam density at operating conditions
  --L <m>           total straight length of the line

OPTIONAL
  --mu <Pa.s>       dynamic viscosity               (default 1.34e-5)
  --eps <mm>        absolute roughness              (default 0.045 = carbon steel)
  --K <adim>        sum of the K coefficients       (default 0)
  --V <m/s>         design velocity                 (default 30; used to size D)
  --D <mm>          forces an internal diameter     (skips DN selection)
  --Pabs <bar>      absolute operating pressure     (enables the dP% check)
  --purg <kg/h>     purge/branch flow to add to the main line
  --lang <en|pt|es> output language                 (default en; accepts --lang=pt)

LANGUAGES
  en = English, pt = Portuguese, es = Spanish.
  Numbers are always printed in English format (decimal point, comma thousands
  separator) in all three languages; only the labels are translated.

EXAMPLE
  node tools/calc-steam.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --eps 0.045 --K 14.1 --Pabs 9.013
`);
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  if (a.help) return reportHelp();

  const requested = normLang(a.lang);
  if (requested === null) {
    console.error(`${T.errLang.en} / ${T.errLang.pt} / ${T.errLang.es}`);
    process.exit(2);
  }
  lang = requested;

  const m = a.m;            // kg/h
  const rho = a.rho;        // kg/m3
  const L = a.L;            // m
  const mu = a.mu ?? 1.34e-5;
  const eps = (a.eps ?? 0.045) / 1000; // mm -> m
  const K = a.K ?? 0;
  const Vtarget = a.V ?? 30;
  const Pabs = a.Pabs ?? null;

  if (!m || !rho || !L) {
    console.error(t('errRequired'));
    process.exit(2);
  }

  const Qv = m / rho;                 // m3/h
  const Qs = Qv / 3600;               // m3/s

  console.log(`\n=== 1. ${t('sec1')} ===`);
  kv('m', `${fmt(m, 1)} kg/h`);
  kv('rho', `${fmt(rho)} kg/m3`);
  kv('Qv', `m/rho = ${fmt(Qv, 1)} m3/h = ${fmt(Qs, 4)} m3/s`);

  console.log(`\n=== 2. ${t('sec2')} ===`);
  kv(t('vDesign'), `${fmt(Vtarget, 1)} m/s`);
  const Dreq = Math.sqrt((4 * Qs) / (Math.PI * Vtarget)); // m
  kv('D', `sqrt(4*Qv/(pi*V)) = ${fmt(Dreq * 1000, 1)} mm`);

  let D, dnLabel;
  if (a.D) {
    D = a.D / 1000;
    dnLabel = `${t('forced')} (${fmt(a.D, 1)} mm)`;
  } else {
    const pick = SCH40.find((r) => r.id >= Dreq * 1000) ?? SCH40[SCH40.length - 1];
    D = pick.id / 1000;
    dnLabel = pick.dn;
  }
  kv(t('dnAdopted'), dnLabel);
  kv(t('dInternal'), `${fmt(D * 1000, 1)} mm = ${fmt(D, 4)} m`);

  const A = (Math.PI * D * D) / 4;
  const V = Qs / A;
  kv(t('area'), `${fmt(A * 1e4, 2)} cm2`);
  kv(t('vReal'), `Qv/A = ${fmt(V, 1)} m/s`);

  if (!a.D) {
    const below = [...SCH40].reverse().find((r) => r.id < Dreq * 1000);
    if (below) {
      const Ab = (Math.PI * Math.pow(below.id / 1000, 2)) / 4;
      const Vb = Qs / Ab;
      kv(t('note'), `${below.dn} (ID ${below.id} mm) ${t('wouldGive')} = ${fmt(Vb, 1)} m/s (${fmt((Vb / Vtarget - 1) * 100, 1)} % ${t('aboveTarget')})`);
    }
  }

  console.log(`\n=== 3. ${t('sec3')} ===`);
  const Re = (rho * V * D) / mu;
  kv('Re = rho*V*D/mu', `${fmt(rho)} x ${fmt(V, 1)} x ${fmt(D, 4)} / ${mu.toExponential(2)}`);
  kv('Re', `${Re.toExponential(3)}  ->  ${Re < 2000 ? t('laminar') : Re < 4000 ? t('transition') : t('turbulent')}`);

  const epsD = eps / D;
  console.log(`\n=== 4. ${t('sec4')} ===`);
  kv('eps/D', epsD.toExponential(3));
  const fSJ = swameeJain(Re, epsD);
  const fCB = colebrook(Re, epsD);
  const fH = haaland(Re, epsD);
  kv('f (Swamee-Jain)', fmt(fSJ, 4));
  kv('f (Colebrook)', `${fmt(fCB, 4)}   <- ${t('reference')}`);
  kv('f (Haaland)', fmt(fH, 4));
  kv(t('devSjCb'), `${fmt((Math.abs(fSJ - fCB) / fCB) * 100, 2)} %`);
  const f = fCB;

  console.log(`\n=== 5. ${t('sec5')} ===`);
  const hv = (V * V) / (2 * G);
  const hf = f * (L / D) * hv;
  const dPf = f * (L / D) * ((rho * V * V) / 2);
  kv('V2/2g', `${fmt(hv, 2)} ${t('vaporColumn')}`);
  kv('L/D', fmt(L / D, 1));
  kv('f*L/D', fmt(f * (L / D), 3));
  kv('hf', `${fmt(hf, 1)} ${t('vaporColumn')}`);
  kv('dP_f', `${fmt(dPf, 0)} Pa = ${fmt(dPf / 1e5, 4)} bar`);

  console.log(`\n=== 6. ${t('sec6')} ===`);
  const hloc = K * hv;
  const dPloc = K * ((rho * V * V) / 2);
  kv('Sigma K', fmt(K, 2));
  kv('h_loc', `${fmt(hloc, 1)} ${t('vaporColumn')}`);
  kv('dP_loc', `${fmt(dPloc, 0)} Pa = ${fmt(dPloc / 1e5, 4)} bar`);

  console.log(`\n=== 7. ${t('sec7')} ===`);
  const hTot = hf + hloc;
  const dP = dPf + dPloc;
  kv('h_total', `${fmt(hTot, 1)} ${t('vaporColumn')}`);
  kv('dP', `${fmt(dP, 0)} Pa = ${fmt(dP / 1e5, 4)} bar = ${fmt(dP / 98066.5, 4)} kgf/cm2`);
  if (Pabs) {
    kv('dP/Pabs', `${fmt((dP / (Pabs * 1e5)) * 100, 2)} %  ${t('dpLimit')}`);
  }
  kv(t('mca'), `${fmt(dP / (1000 * G), 3)} mca  ${t('mcaWarn')}`);

  console.log(`\n=== 8. ${t('sec8')} ===`);
  const Ve = 100 / Math.sqrt(rho); // API RP 14E, C=100 continuous service
  kv(t('erosion'), `V_max = ${fmt(Ve, 1)} m/s -> ${V <= Ve ? t('ok') : t('fail')}`);
  const aSonic = Math.sqrt(1.3 * 461.5 * (273.15 + 175));
  kv(t('sonic'), `${fmt(aSonic, 0)} m/s`);
  kv('Mach', `${fmt(V / aSonic, 3)} -> ${V / aSonic < 0.3 ? t('incompressible') : t('compressible')}`);

  console.log(`rho*V2 = ${fmt(rho * V * V, 0)} kg/(m.s2) -> ${rho * V * V < 15000 ? 'OK (< 15000)' : t('fail')}`);

  console.log('');
}

main();
