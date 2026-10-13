---
name: "steam-piping-sizing"
description: "Size and verify single-phase steam piping with documented steam properties, any internal bore or project catalog, Sch 40/80 DN6–DN600, Reynolds/friction, velocity and pressure-drop budgets. Use for steam line hydraulic sizing and review; excludes mechanical code certification and two-phase condensate."
---

# Steam Piping Sizing

[English](SKILL.md) · [Português](SKILL.pt-BR.md) · [Español](SKILL.es.md)

Use this skill for hydraulic screening of single-phase steam. Confirm the operating state and project acceptance criteria before choosing a diameter.

## How to use

1. Obtain mass flow, absolute inlet pressure, density, dynamic viscosity, length, roughness, fittings and outlet-pressure requirement. Record the property source and operating state. Do not infer saturation from rounded temperature or substitute ideal-gas density.

2. Set the documented maximum velocity and pressure budget. The default 30 m/s and 10% pressure budget are configurable preliminary choices, not universal code requirements. Confirm mechanical code jurisdiction independently (ASME B31.1/B31.3).

3. Use the actual internal bore. Select Sch 40/80, a specific DN, any --D bore, or a provenance-bearing project catalog. Exclude non-procurement sizes from the catalog when necessary. Never clamp to the largest available pipe.

4. Run the calculator; automatic selection checks velocity AND all supplied pressure limits for every candidate. DN90 is included; with the historical example and 30 m/s maximum it is selected before DN100. A forced DN80 fails that maximum.

5. Do not approve FAIL, NO_SIZE or PRELIMINARY as a final design. Re >=2300 and <4000 has no accepted friction result. Laminar flow is possible at small flow and uses 64/Re; steam is not always turbulent.

6. Supply real-steam sound speed with --a, or explicit --T/--k for a labelled approximation. No hidden temperature or viscosity defaults. Mach >=0.3 and pressure loss >10% require a validated compressible/segmented model.

7. Use actual vendor fitting/valve losses. --purg adds extra STEAM demand only; liquid blowdown and wet condensate require another model. Recalculate K when the diameter or valve configuration changes.

8. Check pipe material, wall thickness, pressure class, corrosion allowance, flexibility, drainage, traps, insulation and support design separately. No API RP 14E SI erosion shortcut is applied.

## Calculator

```bash
node tools/calc-steam.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --eps 0.045 --K 14.1 --Pabs 9.013 --T 175 --lang en --all
node tools/calc-steam.mjs --list-sizes
node tools/calc-steam.mjs --help
```

Read [design basis and catalog schema](references/design-basis.md) before selecting criteria or using a custom catalog. Review the [worked example](examples/steam-8bar-2500kgh.en.md) to distinguish a historical bore from automatic selection.

## Visual references

[Workflow](assets/images/sizing-workflow.png) · [System](assets/images/industrial-steam-system.png). Conceptual images, not numerical input or construction drawings.

## Scope

This tool uses constant density and does not calculate steam properties, heat loss, elevation, wet steam, flashing, choking, start-up, water hammer, wall thickness or mechanical compliance. A hydraulic PASS is conditional on the input properties and supplied criteria. For narrow margins or significant density variation, use a validated real-steam model.
