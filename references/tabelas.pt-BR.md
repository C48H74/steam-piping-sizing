# Pipe dimensions and property references

Read [design basis](design-basis.md) for source roles, exact coverage and model limits. The prior approximate steam table and universal erosion shortcut have been removed to prevent unsupported property or unit assumptions. Supply density, viscosity and sound speed for the actual operating state from verified steam properties.

## Bundled catalog

Manufacturer nominal OD/wall data; ID = OD - 2t, rounded to 0.1 mm. Sch 40/80 must not be substituted with Sch 40S/80S. Confirm actual product dimensions and mechanical suitability.

| DN | NPS | Sch | ID mm |
|---:|---|---|---:|
| 6 | 1/8 | 40 | 6.8 |
| 6 | 1/8 | 80 | 5.5 |
| 8 | 1/4 | 40 | 9.2 |
| 8 | 1/4 | 80 | 7.7 |
| 10 | 3/8 | 40 | 12.5 |
| 10 | 3/8 | 80 | 10.7 |
| 15 | 1/2 | 40 | 15.8 |
| 15 | 1/2 | 80 | 13.9 |
| 20 | 3/4 | 40 | 20.9 |
| 20 | 3/4 | 80 | 18.8 |
| 25 | 1 | 40 | 26.6 |
| 25 | 1 | 80 | 24.3 |
| 32 | 1 1/4 | 40 | 35.1 |
| 32 | 1 1/4 | 80 | 32.5 |
| 40 | 1 1/2 | 40 | 40.9 |
| 40 | 1 1/2 | 80 | 38.1 |
| 50 | 2 | 40 | 52.5 |
| 50 | 2 | 80 | 49.3 |
| 65 | 2 1/2 | 40 | 62.7 |
| 65 | 2 1/2 | 80 | 59 |
| 80 | 3 | 40 | 77.9 |
| 80 | 3 | 80 | 73.7 |
| 90 | 3 1/2 | 40 | 90.1 |
| 90 | 3 1/2 | 80 | 85.4 |
| 100 | 4 | 40 | 102.3 |
| 100 | 4 | 80 | 97.2 |
| 125 | 5 | 40 | 128.2 |
| 125 | 5 | 80 | 122.3 |
| 150 | 6 | 40 | 154.1 |
| 150 | 6 | 80 | 146.3 |
| 200 | 8 | 40 | 202.7 |
| 200 | 8 | 80 | 193.7 |
| 250 | 10 | 40 | 254.5 |
| 250 | 10 | 80 | 242.9 |
| 300 | 12 | 40 | 303.2 |
| 300 | 12 | 80 | 288.9 |
| 350 | 14 | 40 | 333.3 |
| 350 | 14 | 80 | 317.5 |
| 400 | 16 | 40 | 381 |
| 400 | 16 | 80 | 363.5 |
| 450 | 18 | 40 | 428.7 |
| 450 | 18 | 80 | 409.5 |
| 500 | 20 | 40 | 477.8 |
| 500 | 20 | 80 | 455.6 |
| 550 | 22 | 80 | 501.7 |
| 600 | 24 | 40 | 574.6 |
| 600 | 24 | 80 | 547.7 |

Any other bore: use --D. Any other verified series: use --catalog, with provenance for each row.

## Equations

Q=m/(3600ρ); V=4Q/(πD²); Re=4m/(3600πDμ); ΔP=(fL/D+ΣK)ρV²/2. All internal calculations use SI. Darcy f=64/Re for laminar flow; Colebrook for turbulent flow; transition is rejected.
