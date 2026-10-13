# Design basis, standards and supported dimensions

Reviewed 2026-10-13. This is a hydraulic sizing aid, not a declaration of code compliance.

## Source roles

- [ASME B36.10 — welded and seamless wrought steel pipe](https://www.asme.org/codes-standards/find-codes-standards/b36-10m-welded-seamless-wrought-steel-pipe): dimensional standard. Confirm the project's adopted edition and actual pipe tolerances. A schedule is not a pressure rating.
- [ASME B31.1 — Power Piping](https://www.asme.org/codes-standards/find-codes-standards/power-piping) and [ASME B31.3 — Process Piping](https://www.asme.org/codes-standards/find-codes-standards/b31-3-process-piping): select the applicable jurisdiction/service code for mechanical design. This tool does not calculate code wall thickness, allowable stress, corrosion allowance, joint factors, flexibility, supports, inspection or testing.
- [Spirax Sarco — Pipes and Pipe Sizing](https://www.spiraxsarco.com/learn-about-steam/steam-distribution/pipes-and-pipe-sizing?sc_lang=en-GB): steam-specific hydraulic guidance. Size on both velocity and available pressure. Its saturated-steam velocity guidance is a design recommendation, not an ASME mandatory velocity limit. The calculator's 30 m/s default is a configurable project maximum.
- [IAPWS-IF97](https://www.iapws.org/relguide/IF97-Rev.html): thermodynamic properties. Supply density, viscosity and ideally sound speed for the verified operating state from appropriate property references. IF97 alone is not the viscosity formulation. The tool does not implement property tables or infer saturation from rounded temperature.
- [Penn Stainless — Pipe Dimensions](https://www.pennstainless.com/resources/product-resources/pipe-dimensions/): manufacturer nominal OD and wall data used for the bundled catalog. Calculate ID = OD - 2t; source ID/min/max columns contain apparent transcription inconsistencies, so those cells are not imported. No claim that these manufacturer dimensions certify a selected carbon-steel product.

## Diameter coverage

The bundled catalog contains 47 DN/schedule combinations from DN6 to DN600, Sch 40 and Sch 80 where listed. NPS 22 / DN550 Sch 40 is not present in the source and is deliberately unavailable. NPS 3½ / DN90 is included; it may be unavailable in a project's purchasing specification. Automatic selection sorts by internal bore, so its inclusion changes the former default example from DN100 to DN90. Restrict the custom catalog to procurement-approved sizes when needed.

The catalog is a supported subset, not every combination in every standard. Use `--D` for **any positive internal diameter**, or `--catalog` to select from **any verified schedule, material, metric tube or larger diameter series**. There is no silent clamp to the largest built-in pipe.

```json
[
  {"dn": 100, "nps": "4", "schedule": "project", "idMm": 96.8,
   "source": "Project pipe specification / drawing number and revision"},
  {"dn": 1200, "schedule": "project", "idMm": 1160,
   "source": "Approved vendor drawing / revision"}
]
```

Required row fields: positive finite `dn`, positive finite `idMm`, nonempty string `schedule` and `source`. Optional `odMm` and `wallMm` must both be present, positive and agree with ID within 0.11 mm (rounded bore tolerance). Duplicate DN/schedule pairs are rejected. Use full provenance, not the illustrative source descriptions above.

```bash
node tools/calc-vapor.mjs --list-sizes
node tools/calc-vapor.mjs --list-sizes --schedule 80 --json
node tools/calc-vapor.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --K 14.1 --Pabs 9.013 --T 175 --catalog project.json --schedule project --all
```

## Model and acceptance

1. Total **steam** flow is `m + purg` (kg/h); `purg` means an additional steam demand, not boiler-water blowdown or two-phase condensate.
2. `Q = m_total/(3600*rho)`, `A = pi D²/4`, `V = Q/A`, `Re = 4 m_total/(3600 pi D mu)`.
3. Darcy `f = 64/Re` below Re 2300; transition Re 2300–4000 produces no accepted friction result. Above Re 4000 solve Colebrook iteratively. Swamee-Jain/Haaland are supplementary comparisons; do not use them outside their applicability as universal validation.
4. `dp = (f L/D + sum K) rho V²/2`. K is an input for the candidate geometry; if fitting K changes with diameter, run each diameter with its own vendor coefficients. Generic control-valve K is only preliminary; use actual valve data and allocated valve differential pressure.
5. Automatic selection chooses the smallest catalog bore that meets maximum V, all supplied pressure limits and model guards. A forced bore is checked and returns FAIL when it does not meet them; it is never quietly accepted.
6. Supply `Pabs` and either an explicit pressure budget (`dp-max`, `Pout`, `dp-pct`) or consciously accept the default 10% preliminary budget. The 10% value is also a **constant-density model guard**, not a universal normative allowable loss. For stricter process requirements, use the stricter limit. `Pout` is the required absolute outlet pressure, not gauge pressure. No elevation term is included.
7. Supply `a` from steam properties for Mach. Alternatively explicit T and k estimate `a = sqrt(k R T_K)`; this estimate is marked and does not establish real-steam state validity. No hidden 175 °C default remains.
8. Mach >=0.3 or fractional pressure drop >10% requires a validated compressible/segmented treatment; the calculator rejects that candidate. Missing pressure or sound speed leaves a preliminary result. No wet steam, flashing, heat loss, start-up or water-hammer prediction is performed.
9. No API RP 14E erosion limit is applied: the previous `100/sqrt(rho_SI)` incorrectly mixed the customary-unit coefficient with SI density and is not a universal steam criterion. Set a documented steam-service maximum velocity instead.

Use inlet-state density for this constant-density screening calculation; decreasing downstream density can increase velocity and loss. Where margins are narrow, use a validated model with properties along the line before approval. Installation/CLI tests verify arithmetic and behavior, not all thermodynamic states or mechanical standards.
