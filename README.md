# Steam Piping Sizing

![Steam piping sizing cover showing a boiler, valves, strainer, moisture separator and expansion loop](assets/images/steam-piping-sizing-cover.png)

**Languages:** English · [Português (BR)](#português-br) · [Español](#español)

A trilingual agent skill for **sizing and verifying steam piping**: diameter from velocity, Reynolds number, friction factor, Darcy-Weisbach distributed loss, local losses via K coefficients, total pressure drop, and the field practice that makes a steam line actually work.

Uma skill de agente trilíngue para **dimensionar e verificar tubulação de vapor**: diâmetro por velocidade, Reynolds, fator de atrito, perda distribuída de Darcy-Weisbach, perdas localizadas por coeficientes K, queda de pressão total e a prática de campo que faz a linha funcionar.

Una skill de agente trilingüe para **dimensionar y verificar tubería de vapor**: diámetro por velocidad, Reynolds, factor de fricción, pérdida distribuida de Darcy-Weisbach, pérdidas locales por coeficientes K, caída de presión total y la práctica de campo que hace funcionar la línea.

## Sizing workflow

![Six stages of steam piping sizing: input data, steam properties, preliminary diameter, flow regime, pressure losses and final verification](assets/images/sizing-workflow.png)

The six stages summarize the procedure; see the corrected [design basis](references/design-basis.md) for dimensions, property provenance, criteria and model validity.

## Industrial steam system

![Conceptual industrial steam system with boiler, isolation valve, Y strainer, moisture separator, condensate drain, expansion loop, supports and control valve](assets/images/industrial-steam-system.png)

Conceptual illustration, not to scale: component quantities, routing and support details do not define a construction design. The worked example specifies its own fittings and operating data: [English](examples/steam-8bar-2500kgh.en.md), [Português (BR)](examples/steam-8bar-2500kgh.pt-BR.md), [Español](examples/steam-8bar-2500kgh.es.md).

## Coverage and verification

- **47 catalog combinations:** DN6–DN600, Sch 40/80 where documented. Any other internal diameter via `--D`; any schedule/series via a sourced `--catalog`.
- `--purg` adds steam demand; viscosity is required; sound speed uses `--a` or an explicit, labelled `--T` estimate.
- `--dp-max`, `--Pout`, `--dp-pct` and `--V` control acceptance. No silently oversized/undersized fallback; failed checks return exit code 3.
- `--json`, `--all`, `--list-sizes` and English/Portuguese/Spanish labels are available.
- Consult [standards, sources and limits](references/design-basis.md). This is not ASME mechanical certification.

```bash
node tools/calc-vapor.mjs --list-sizes
node --test tools/steam-core.test.mjs
```

## Repository contents / Conteúdo / Contenido

| Content | English | Português (BR) | Español |
|---|---|---|---|
| Skill | [`SKILL.md`](SKILL.md) | [`SKILL.pt-BR.md`](SKILL.pt-BR.md) | [`SKILL.es.md`](SKILL.es.md) |
| Reference tables | [`references/tables.en.md`](references/tables.en.md) | [`references/tabelas.pt-BR.md`](references/tabelas.pt-BR.md) | [`references/tablas.es.md`](references/tablas.es.md) |
| Worked example | [`examples/steam-8bar-2500kgh.en.md`](examples/steam-8bar-2500kgh.en.md) | [`examples/steam-8bar-2500kgh.pt-BR.md`](examples/steam-8bar-2500kgh.pt-BR.md) | [`examples/steam-8bar-2500kgh.es.md`](examples/steam-8bar-2500kgh.es.md) |
| Calculator | `tools/calc-vapor.mjs` — CLI entrypoint, all languages via `--lang en\|pt\|es`; shared core and dimension catalog in `tools/` | | |

The three skill documents are **equivalent translations**: same frameworks, same numbers, same tables. Read whichever you prefer; the calculator serves all three.

---

## English

### What this is

A steam-pipe hydraulic sizing procedure with simultaneous velocity and pressure-budget checks. Supports Sch 40/80 through DN600, any explicit bore and custom project catalogs; separates hydraulic criteria from mechanical code compliance.

### Install as a skill

```bash
git clone https://github.com/C48H74/steam-piping-sizing.git \
  ~/.agents/skills/steam-piping-sizing
```

Windows:

```powershell
git clone https://github.com/C48H74/steam-piping-sizing.git "$env:USERPROFILE\.agents\skills\steam-piping-sizing"
```

Then ask your agent something like *"size the steam line: 2,500 kg/h at 8 bar(g), 45 m, 6 long-radius elbows, 2 gate valves, 1 control valve, 1 Y-strainer and 1 moisture separator."*

### Use the calculator

```bash
node tools/calc-vapor.mjs --lang en --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --eps 0.045 --K 14.1 --Pabs 9.013 --T 175
```

`--lang` accepts `en` (default), `pt` or `es` and changes only the labels — the numbers are identical in all three.

To force a known diameter (and reproduce an existing case), pass `--D` in mm:

```bash
node tools/calc-vapor.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --K 14.1 --Pabs 9.013 --T 175 --D 77.9 --V 40
```

Run with `--help` for every option. Density is **never** computed from P and T on purpose: take it from a steam table (`references/tables.en.md`).

### Scope and limits

Steady state, incompressible flow (Ma < 0.3), Newtonian fluid, constant circular section.

**Not** covered: flexibility analysis and nozzle reactions; wall thickness and pressure classes (ASME B31.3); steam trap sizing; thermal insulation and tracing; control valve Cv sizing; two-phase flow and condensate flashing; transients and water hammer.

All tables are **typical design values** — confirm against the project specification and the applicable code before issuing any document.

---

## Português (BR)

### O que é

Procedimento hidráulico com verificação simultânea de velocidade e pressão. Sch 40/80 até DN600, qualquer diâmetro interno e catálogos de projeto; critérios hidráulicos separados da conformidade mecânica.

### Instalar como skill

```powershell
git clone https://github.com/C48H74/steam-piping-sizing.git "$env:USERPROFILE\.agents\skills\steam-piping-sizing"
```

Depois peça ao agente algo como *"dimensione a linha de vapor: 2.500 kg/h a 8 bar(g), 45 m, 6 curvas de raio longo, 2 gavetas, 1 válvula de controle, 1 filtro Y e 1 separador de umidade"*.

### Usar a calculadora

```bash
node tools/calc-vapor.mjs --lang pt --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --eps 0.045 --K 14.1 --Pabs 9.013 --T 175
```

`--lang` aceita `en` (padrão), `pt` ou `es` e altera apenas os rótulos — os números são idênticos nos três.

Para forçar um diâmetro conhecido (e reproduzir um caso existente), use `--D` em mm:

```bash
node tools/calc-vapor.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --K 14.1 --Pabs 9.013 --T 175 --D 77.9 --V 40
```

`--help` lista todas as opções. A massa específica **não** é calculada a partir de P e T de propósito: ela deve vir de tabela de vapor (`references/tabelas.pt-BR.md`).

### Escopo e limites

Regime permanente, escoamento incompressível (Ma < 0,3), fluido newtoniano, seção circular constante.

**Não** cobre: análise de flexibilidade e reações em bocais; espessura de parede e classes de pressão (ASME B31.3); dimensionamento de purgadores; isolamento térmico e traçamento; dimensionamento de válvula de controle por Cv; escoamento bifásico e flash de condensado; transientes e golpe de aríete.

As tabelas são **valores usuais de projeto** — confirme contra a especificação do projeto e a norma aplicável antes de emitir documento.

---

## Español

### Qué es

Procedimiento hidráulico con verificación simultánea de velocidad y presión. Sch 40/80 hasta DN600, cualquier diámetro interior y catálogos de proyecto; criterios hidráulicos separados de la conformidad mecánica.

### Instalar como skill

```bash
git clone https://github.com/C48H74/steam-piping-sizing.git \
  ~/.agents/skills/steam-piping-sizing
```

Windows:

```powershell
git clone https://github.com/C48H74/steam-piping-sizing.git "$env:USERPROFILE\.agents\skills\steam-piping-sizing"
```

Luego pida a su agente algo como *"dimensiona la línea de vapor: 2.500 kg/h a 8 bar(g), 45 m, 6 codos de radio largo, 2 válvulas de compuerta, 1 válvula de control, 1 filtro Y y 1 separador de humedad"*.

### Usar la calculadora

```bash
node tools/calc-vapor.mjs --lang es --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --eps 0.045 --K 14.1 --Pabs 9.013 --T 175
```

`--lang` acepta `en` (por defecto), `pt` o `es` y cambia solo las etiquetas — los números son idénticos en los tres.

Para forzar un diámetro conocido (y reproducir un caso existente), use `--D` en mm:

```bash
node tools/calc-vapor.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --K 14.1 --Pabs 9.013 --T 175 --D 77.9 --V 40
```

`--help` lista todas las opciones. La densidad **no** se calcula a partir de P y T a propósito: debe tomarse de una tabla de vapor (`references/tablas.es.md`).

### Alcance y límites

Régimen permanente, flujo incompresible (Ma < 0,3), fluido newtoniano, sección circular constante.

**No** cubre: análisis de flexibilidad y reacciones en boquillas; espesor de pared y clases de presión (ASME B31.3); dimensionamiento de purgadores; aislamiento térmico y trazado; dimensionamiento de válvula de control por Cv; flujo bifásico y flash de condensado; transitorios y golpe de ariete.

Las tablas son **valores usuales de proyecto** — confirme contra la especificación del proyecto y la norma aplicable antes de emitir documento.

---

## License / Licença / Licencia

MIT — see [`LICENSE`](LICENSE).
