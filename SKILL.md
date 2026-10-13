---
name: "steam-piping-sizing"
description: "Steam piping sizing and verification: mass and volumetric flow, diameter selection by recommended velocity (20–40 m/s saturated, 35–60 m/s superheated), Reynolds number, friction factor by Swamee-Jain/Colebrook/Haaland, distributed Darcy-Weisbach pressure drop, local losses by K coefficients (elbows, valves, filters, separators), total pressure drop and allowable ΔP criterion, plus good construction practices (condensate drains, steam traps, moisture separator, expansion loop, insulation, branch connection). Use when sizing or reviewing a steam/condensate line, choosing the diameter of a steam line, checking steam velocity, calculating pressure drop with fittings, or verifying whether the available pressure reaches the process. Também em português: dimensionar tubulação de vapor, perda de carga de vapor, diâmetro de linha de vapor. También en español: dimensionar tubería de vapor, pérdida de carga de vapor."
---

# Steam Piping Sizing

**Languages:** English · [Português (BR)](SKILL.pt-BR.md) · [Español](SKILL.es.md)

**Source**: calculation sheet "Tubulação de Vapor" (Steam Piping) provided by the user — a 10-step procedure (system data → steam properties → volumetric flow → diameter by velocity → Reynolds → Swamee-Jain friction factor → distributed Darcy-Weisbach loss → K coefficients → total loss and ΔP → good practices), supplemented with design practice and engineering cross-checks. **Generated**: 2026-10-13.

**Tool**: `tools/calc-steam.mjs` (Node, no dependencies) runs the entire chain and shows each step. It accepts `--lang en|pt|es` to select the output language.

## How to use
- "What diameter should I use for this steam flow" → framework 1.
- "What is the specific mass / the volumetric flow" → framework 2.
- "What is the friction factor / the pressure drop" → frameworks 3 and 4.
- "Does the pressure reach the process / is the line well sized" → framework 5.
- "What must not be missing from the line" → framework 7.
- Mistakes that produce a wrong result without warning → **Anti-patterns** section.

## Core frameworks

1. **A steam line is sized by velocity and VERIFIED by pressure drop — both checks are mandatory. Stopping at the diameter calculation is the most common mistake.**
   - `Qv = ṁ/ρ` (volumetric flow) → `D = √(4·Qv/(π·V))` with V set within the recommended range.
   - The calculated diameter is the **internal** one. Never adopt by nominal diameter: DN80 (3") Schedule 40 has ID = 77.9 mm, not 80 mm. The schedule table is what governs — use `references/tables.en.md`.
   - Choose the **smallest DN whose ID is ≥ the calculated D** (the ID immediately above). Recalculate the actual velocity `V = Qv/A` with the adopted ID — it is **not** equal to the design velocity, and it is the one that enters all subsequent steps.
   - Usual velocities (confirm with the project specification — they vary by client/standard):

     | Service | Usual range (m/s) |
     |---|---|
     | Saturated steam — main line | 20 – 40 |
     | Saturated steam — branch / equipment inlet | 15 – 25 |
     | Superheated steam — main line | 35 – 60 (up to 75) |
     | Turbine exhaust steam / low pressure | 40 – 75 |
     | Condensate (liquid) | 0.5 – 2 |
     | Water / other liquids | 1 – 3 |

   - Erosion check (API RP 14E): `V_max = C/√ρ`, with C = 100 for continuous service and 125 for intermittent. For steam at 9 bar abs (ρ ≈ 4.7 kg/m³) → V_max ≈ 46 m/s.
   - Compressibility check: `Ma = V/a < 0.3` (a ≈ 480–520 m/s for steam in the 150–200 °C range). Above that the flow is compressible and Darcy-Weisbach loses validity.
   - Pressure drop criterion: `ΔP ≤ 10 %` of the **absolute** operating pressure is the usual limit; in practice `ΔP ≤ 0.5 bar` is used for a long line and `ΔP ≤ 0.1–0.2 bar` for a short equipment feed line. Steam for a turbine is much more restrictive — the limit comes from the manufacturer.

2. **Specific mass is the most fragile variable in the calculation: steam is compressible and ρ depends on P and T simultaneously. Getting ρ wrong misses the diameter at the root and the entire pressure drop.**
   - Take ρ from a **steam table**, never from ideal gas (at 9 bar abs ideal gas errs ~7 %; at high pressures the error explodes). Saturated steam table in `references/tables.en.md`.
   - **Saturated steam**: ρ is a function of pressure alone (the temperature is the saturation one). **Superheated steam**: ρ depends on P and T.
   - Practical consequence of a common confusion: at 8 bar(g) the saturation temperature is ≈ 175.5 °C. If the design data says "175 °C", the steam is **saturated**, not superheated — calling it superheated does not change the calculation, but it changes the interpretation (there is no degree of superheat to exchange heat).
   - `bar(g)` is **gauge** pressure. The tables and the ΔP% criterion use **absolute** pressure: `P_abs = P_gauge + 1.013` (or +0.981 if the reference is 1 kgf/cm²).
   - Quality/moisture: steam with x < 1 carries droplets — the effective specific mass rises, the liquid velocity is much lower and erosion in the fittings increases. Typical boiler steam leaves with 1–3 % moisture.
   - In a long or low-pressure line, the pressure falls along the stretch and ρ falls with it. For a long line, divide into stretches and **recalculate ρ** for each stretch; using ρ from the average pressure is acceptable only as a first estimate.
   - The mass flow considered must include the **blowdown branches**, the steam tracing heating and the equipment consumption — not only the nominal process flow.

3. **Reynolds and the friction factor are calculated with the real INTERNAL diameter and with the roughness of the piping material — not with generic values.**
   - `Re = ρ·V·D/μ = V·D/ν = 4·ṁ/(π·D·μ)`. The last form is the most useful: it is **independent of velocity**, so it serves to check Re directly from the inputs and to detect propagation error.
   - Regime: laminar `Re < 2000`; transition `2000–4000`; turbulent `Re > 4000`. A steam line is **always** in the turbulent regime (Re ∼ 10⁵–10⁶) — if it comes out laminar, the input data is wrong.
   - Darcy friction factor `f` (the same one that multiplies `L/D`):
     - **Swamee-Jain** (explicit, the one used in the original sheet — valid for `5×10³ < Re < 10⁸` and `10⁻⁶ < ε/D < 10⁻²`): `f = 0.25 / [log₁₀(ε/(3.7·D) + 5.74/Re^0.9)]²`
     - **Colebrook-White** (implicit, it is the reference; solve by iteration): `1/√f = −2·log₁₀(ε/(3.7·D) + 2.51/(Re·√f))`
     - **Haaland** (explicit, excellent initial estimate): `1/√f = −1.8·log₁₀[(ε/(3.7·D))^1.11 + 6.9/Re]`
     - Swamee-Jain typically errs < 1 % against Colebrook in the steam range — using all three and comparing is a cheap check.
   - Typical absolute roughness `ε` (use the one for the material **in the operating condition**, not for new pipe, when the line has a scaling history):

     | Material / condition | ε (mm) |
     |---|---|
     | New carbon steel, seamless (ASTM A106) | 0.045 |
     | Commercial carbon steel | 0.046 |
     | Scaled carbon steel / with scaling | 0.15 – 0.5 |
     | Galvanized steel | 0.15 |
     | Cast iron | 0.26 |
     | Stainless steel | 0.015 |
     | Copper / brass | 0.0015 |
     | PVC / plastics | 0.0015 – 0.007 |
     | Concrete | 0.3 – 3 |

   - `ε/D` is dimensionless and uses D in the same unit as ε. A unit swapped here (mm with m) is a factor-of-1000 error that goes unnoticed.

4. **Pressure drop = distributed (Darcy-Weisbach) + local (ΣK). In steam, the local losses usually DOMINATE — the control valve alone can be half the total.**
   - Distributed: `hf = f·(L/D)·(V²/2g)` in metres of fluid column, or directly in pressure: `ΔP_f = f·(L/D)·(ρ·V²/2)`.
   - Local: `h_loc = ΣK·(V²/2g)`; `ΔP_loc = ΣK·(ρ·V²/2)`.
   - `ρ·V²/2` is the dynamic pressure — calculate it once and reuse it in both terms.
   - Compression into the equivalent-length form (bridge with the fittings table): `L_eq = K·D/f`.
   - Typical K coefficients (usual design values; confirm with Crane TP-410 or the project standard — K varies with diameter and with Re):

     | Component | K |
     |---|---|
     | 90° long-radius elbow | 0.20 |
     | 45° elbow | 0.20 |
     | 90° short-radius elbow | 0.90 |
     | Tee — straight flow | 0.40 |
     | Tee — diverted flow | 1.00 |
     | Gate valve open | 0.20 |
     | Globe valve open | 10.0 |
     | Check valve (swing) | 2.0 – 2.5 |
     | Globe-type control valve | 10.0 (or the valve Cv) |
     | Clean Y strainer | 1.5 – 2.5 |
     | Moisture separator | 1.0 – 2.0 |
     | Pipe inlet / outlet | 0.5 / 1.0 |

   - **Important exception**: for a control valve, do not use a generic K — the loss depends on the opening and on the flow. Size it with the valve equation (Cv) and the design pressure drop (skill `valvulas-controle-fisher`). A K = 10 is only an order of magnitude for pre-sizing.
   - Total: `ΔP_total = ΔP_f + ΔP_loc`; compare with the allowable from framework 1. If it fails: go up one DN and repeat the entire chain (V, Re, f and K all change).

5. **"mca" is metre of WATER column — and the head calculated in a VAPOUR column is not the same thing. Adding or comparing the two is the unit error that most contaminates a steam calculation.**
   - `h` (fluid column) `= ΔP/(ρ_fluid·g)` — for steam it gives large numbers (hundreds of metres) because ρ is small. That is steam head, not mca.
   - `mca = ΔP/(ρ_water·g) = ΔP/9810`. The conversion between the two is the factor `ρ_water/ρ_steam ≈ 208` for steam at 9 bar abs.
   - For steam, work **directly in pressure (Pa, bar, kgf/cm²)** and reserve "mca" for liquid lines. Present steam head only when the project requirement explicitly asks for it.
   - Mandatory consistency check: `ΔP = ρ·g·h` must close with the ρ used. If `ΔP` closes with one ρ and `h` was calculated with another, the result looks plausible and is wrong.

6. **Order-of-magnitude check before delivering the number.**
   - For saturated steam at 8–10 bar, a 3" line with 2,500 kg/h: V ≈ 30 m/s and ΔP ≈ 0.5 bar in ~45 m with heavy fittings. Results an order of magnitude below that almost always come from an arithmetic error, not from an exceptionally good design.
   - Quick independent estimate of ΔP via equivalent length: `L_total = L_straight + Σ(K·D/f)` and then `ΔP = f·(L_total/D)·(ρ·V²/2)`. If the two routes disagree by more than ~10 %, there is an arithmetic error.
   - Re calculated by `4·ṁ/(π·D·μ)` must match `ρ·V·D/μ`. Divergence = inconsistency between ρ, V and D.
   - Pressure drop plausibility check: `ΔP/P_abs` in %.

7. **What makes a steam line work in practice (it does not appear in the calculation and it is what fails most in the field).**
   - **Condensate drains** at low points, at the beginning and at the end of the line, before every block valve and every 30–50 m of horizontal line. Steam without a drain gives water hammer at start-up.
   - **Slope** of 1:100 to 1:250 in the direction of flow (or against it, as the design requires), always toward the drain point.
   - **Steam traps** at the drains and at the retention points (skill `purgadores-vapor-isolamento-tracing-pintura-catodica`).
   - **Moisture separator** upstream of turbine, meter, control valve and exchanger — it is not an optional fitting, it is protection.
   - **Y strainer** upstream of the control valve and of the meter, with a compatible mesh.
   - **Branch connection always from the top** of the main line (never from the bottom or the side), so as not to drag condensate into the branch.
   - **Expansion loop / flexibility**: steam is the hottest line in the plant, thermal expansion defines the routing (skill `flexibilidade-viga-balanco-guiada`).
   - **Thermal insulation** sized by temperature and by allowable loss (skill `aquecimento-isolamento-pintura-tubulacao`).
   - **Material**: ASTM A106 Gr. B is the standard for steam; check thickness with the ASME B31 formula (skill `asme-b31-3-codigo-normativo`).
   - **Blowdown and start-up**: the initial heating flow can be several times the nominal one, with a lot of condensate — the line must drain this without hammer.

## Decision cheatsheet
| Situation | Action |
|---|---|
| New steam line, known flow | Set V within the service range → D by velocity → DN by Schedule 40 ID → recalculate actual V |
| V = 30 m/s gave exactly the ID of a DN | Adopt the DN above; the actual velocity ends up slightly higher than the target |
| D calculated between two commercial DNs | Always the larger one (ID ≥ calculated D); never round down |
| You need the ρ of the steam | Steam table. If you only have gauge P, add 1.013 (or 0.981) before entering the table |
| T given = saturation T of P | Saturated steam. Do not treat it as superheated |
| Re came out < 4000 | Wrong input data — check μ, ρ and D (steam is always turbulent) |
| f between Swamee-Jain and Colebrook differs > 2 % | Check ε/D and Re; outside the validity range of the explicit correlation |
| Local loss > distributed loss | Normal in steam, especially with a control or globe valve in the line |
| Control valve in the line | Do not use a generic K: size by Cv (skill `valvulas-controle-fisher`) |
| ΔP > 10 % of P_abs | Go up one DN and redo the entire chain |
| Result in "mca" for steam | Be suspicious: steam head ≠ mca. Convert with ρ_water, or work in bar |
| ΔP result far below expected | Check whether the local losses were included and whether the dynamic pressure used the correct ρ |
| Long line (> 100 m) or low pressure | Divide into stretches and recalculate ρ with the pressure of each stretch |
| V above 100/√ρ | Fails on erosion — go up a DN |
| Ma > 0.3 | Compressible flow — Darcy-Weisbach does not apply directly |
| Line with a scaling history | Use ε of 0.15–0.5 mm, not 0.045 mm |

## Anti-patterns
- **Stopping at the diameter.** Calculating D by velocity and delivering it as the answer, without verifying ΔP. Velocity only guarantees that the line does not erode; it does not guarantee that the pressure arrives.
- **Using the nominal diameter as the internal diameter.** 3" has ID 77.9 mm. The 3 % error in D becomes ~6 % in velocity and ~13 % in pressure drop.
- **Changing the DN and not recalculating V, Re and f.** The whole chain is coupled: changing D changes V, Re, f and K at the same time.
- **Using ideal-gas ρ.** At 9 bar abs the error is of the order of 7 % and grows with pressure.
- **Forgetting the local losses**, or considering them "small" by analogy with liquid lines. In steam with a control valve, they are the largest term.
- **Adding steam head with mca.** They are different reference fluids; the factor between them is ≈ 208.
- **Confusing bar(g) and bar(a).** The steam table and the ΔP% criterion use absolute pressure.
- **Adopting a fixed f = 0.02** for everything. It serves as an order-of-magnitude estimate; against Colebrook it can err 10–15 %, and the error propagates to ΔP.
- **Adding Re and h with different D values** (one with the nominal, another with the internal) — it is the propagation error that is hardest to see, because each individual number looks reasonable.
- **Not checking erosion or Mach.** In a low-pressure line (small ρ) the velocity rises fast and ρ·V² is what limits.
- **Ignoring the condensate.** Without a drain, slope and trap, a correctly calculated line fails at start-up.

## Glossary
**ṁ** — mass flow (kg/h or kg/s).
**Qv** — volumetric flow at the operating condition (m³/h or m³/s); `Qv = ṁ/ρ`.
**ρ** — specific mass of the steam at the operating condition (kg/m³).
**D** — **internal** diameter of the piping (m); in a table usually in mm.
**ε** — absolute roughness of the wall (mm or m).
**ε/D** — relative roughness (dimensionless).
**Re** — Reynolds number.
**f** — Darcy friction factor (dimensionless); it is the `f` of `f·L/D`, not the Fanning factor.
**hf / ΔP_f** — distributed pressure drop, in head or in pressure.
**K** — local loss coefficient of a fitting (dimensionless).
**L_eq** — equivalent length of a fitting: `L_eq = K·D/f`.
**mca** — metre of water column: `ΔP/9810`.
**bar(g) / bar(a)** — gauge / absolute pressure.
**Ma** — Mach number.
**Expansion loop** — a U-shaped stretch that absorbs the thermal expansion of the line.

## Scope and limits
It covers the hydraulic sizing of a steam line in steady state, adiabatic and incompressible flow (Ma < 0.3), Newtonian fluid, constant circular section — the 10-step procedure of the original sheet, with the checks it does not include.

It does not cover, and needs its own skill/software: flexibility analysis and nozzle reactions (`flexibilidade-viga-balanco-guiada`, CAESAR II); wall thickness and pressure classes (`asme-b31-3-codigo-normativo`, `materiais-tubulacao-refino-transporte-n76`); selection and sizing of steam traps (`purgadores-vapor-isolamento-tracing-pintura-catodica`); thermal insulation and tracing (`aquecimento-isolamento-pintura-tubulacao`); control valve sizing by Cv (`valvulas-controle-fisher`); two-phase flow and condensate flashing; transient analysis and water hammer.

The steam, roughness, K and velocity tables here are usual design values — **always confirm against the project specification and the applicable standard** before issuing a document. To verify a complete case, see `examples/steam-8bar-2500kgh.en.md`.
