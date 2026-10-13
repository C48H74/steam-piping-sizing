# Verified example — steam line 8 bar(g), 2,500 kg/h

**Languages:** English · [Português (BR)](steam-8bar-2500kgh.pt-BR.md) · [Español](steam-8bar-2500kgh.es.md)

Reference case from the original sheet of this procedure, **recalculated** with the tool `tools/calc-vapor.mjs`. All the numbers below come from the same calculation chain and are reproducible.

## System data

| Item | Value |
|---|---|
| Steam mass flow rate (ṁ) | 2,500 kg/h |
| Operating pressure | 8 bar(g) → **P_abs = 9.013 bar** |
| Temperature | 175 °C |
| Total straight length (L) | 45 m |
| Material | Carbon steel ASTM A106 Gr. B |
| Absolute roughness (ε) | 0.045 mm |
| Fittings | 6 long-radius 90° elbows, 2 block valves (gate), 1 control valve (globe), 1 Y-strainer, 1 moisture separator |
| Density adopted (ρ) | 4.81 kg/m³ |
| Dynamic viscosity (μ) | 1.34×10⁻⁵ Pa·s |
| Design velocity (V) | 30 m/s |

> **Note on ρ**: at 9.013 bar(a) the steam is **saturated** (T_sat ≈ 175.5 °C), and the table gives ρ ≈ 4.66 kg/m³. The value of 4.81 kg/m³ used here is the one from the original sheet (≈ 3 % above the table) and was kept so that the example is traceable. With 4.66 kg/m³ the volumetric flow rate rises ~3 % and the required diameter as well — the conclusion does not change, but the number does.

## Step 1 — Volumetric flow rate

```
Qv = ṁ/ρ = 2500/4.81 = 519.8 m³/h = 0.1444 m³/s
```

## Step 2 — Diameter required by velocity

```
D = √(4·Qv/(π·V)) = √(4×0.1444/(π×30)) = 0.0783 m = 78.3 mm
```

Adopting the smallest Schedule 40 with **ID ≥ 78.3 mm** → **DN80 (3")**, ID = **77.9 mm**.
(77.9 < 78.3, so the actual velocity ends up slightly above the target — acceptable. The next one would be DN100, ID 102.3 mm, which would give V = 17.6 m/s, far below the economical range.)

```
V real = Qv/A = 0.1444/(π×0.0779²/4) = 30.3 m/s
```

Velocity checks:

| Check | Value | Status |
|---|---|---|
| Usual range (saturated steam, main line) | 20 – 40 m/s | **OK** |
| API RP 14E erosion (C = 100): V_max = 100/√4.81 | 45.6 m/s | **OK** |
| Mach = 30.3/519 | 0.058 | **OK** (< 0.3, incompressible) |
| ρ·V² | 4,414 kg/(m·s²) | **OK** (< 15,000) |

## Step 3 — Reynolds number

```
Re = ρ·V·D/μ = 4.81 × 30.3 × 0.0779 / 1.34×10⁻⁵ = 8.47×10⁵
```

Cross-check by the form independent of velocity:

```
Re = 4·ṁ/(π·D·μ) = 4×(2500/3600)/(π×0.0779×1.34×10⁻⁵) = 8.47×10⁵  ✓
```

Regime: **turbulent** (as expected for steam).

## Step 4 — Friction factor

```
ε/D = 0.045×10⁻³/0.0779 = 5.78×10⁻⁴

Swamee-Jain:
f = 0.25 / [log₁₀(5.78×10⁻⁴/3.7 + 5.74/(8.47×10⁵)^0.9)]²
f = 0.25 / [log₁₀(1.561×10⁻⁴ + 2.65×10⁻⁵)]²
f = 0.0179
```

| Correlation | f |
|---|---:|
| Swamee-Jain (explicit) | 0.0179 |
| Colebrook-White (reference) | 0.0178 |
| Haaland (explicit) | 0.0178 |
| Swamee-Jain × Colebrook deviation | 0.56 % |

The three agree within 1 % — the explicit correlation is safe in this range.

## Step 5 — Distributed head loss (Darcy-Weisbach)

```
V²/2g = 30.3²/(2×9.80665) = 46.78 m of steam column
L/D   = 45/0.0779 = 577.7
f·L/D = 0.0178 × 577.7 = 10.276

hf   = 10.276 × 46.78 = 480.8 m of steam column
ΔP_f = f·(L/D)·(ρ·V²/2) = 10.276 × (4.81×30.3²/2) = 22,678 Pa = 0.2268 bar
```

## Step 6 — Local losses (ΣK)

| Component | Qty | K unit | Qty × K |
|---|---:|---:|---:|
| Long-radius 90° elbow | 6 | 0.20 | 1.20 |
| Block valve (gate) | 2 | 0.20 | 0.40 |
| Control valve (globe) | 1 | 10.0 | 10.00 |
| Y-strainer | 1 | 1.50 | 1.50 |
| Moisture separator | 1 | 1.00 | 1.00 |
| **ΣK** | | | **14.10** |

```
h_loc   = ΣK·(V²/2g) = 14.10 × 46.78 = 659.7 m of steam column
ΔP_loc  = ΣK·(ρ·V²/2) = 14.10 × (4.81×30.3²/2) = 31,116 Pa = 0.3112 bar
```

The control valve alone accounts for **71 %** of the local losses.

## Step 7 — Total loss and verification

```
h_total = 480.8 + 659.7 = 1,140.4 m of steam column
ΔP      = 22,678 + 31,116 = 53,795 Pa = 0.5379 bar = 0.5486 kgf/cm²
ΔP/P_abs = 0.5379/9.013 = 5.97 %
```

| Criterion | Value | Status |
|---|---|---|
| ΔP ≤ 10 % of P_abs | 5.97 % | **OK** |
| ΔP ≤ 0.5 bar (long line) | 0.538 bar | **Limit** — slightly above, acceptable in practice due to the dominance of the control valve |

**Result: DN80 (3") Schedule 40 is adequate**, with ΔP ≈ 0.54 bar (6 % of the absolute pressure).

## Independent cross-check (via equivalent length)

```
L_eq = ΣK·D/f = 14.10 × 0.0779/0.0178 = 61.7 m
L_total = 45 + 61.7 = 106.7 m
ΔP = f·(L_total/D)·(ρ·V²/2) = 0.0178 × (106.7/0.0779) × 2,204.7 = 53,800 Pa = 0.538 bar  ✓
```

Both routes close — the result is reliable.

## Cross-check against the original sheet

When reproducing the sheet, three steps **do not close with its own inputs**. Recorded here because it is exactly the check that this procedure requires before issuing any number:

| Step | Original sheet | Recalculated | Remark |
|---|---|---|---|
| Reynolds | 1.06×10⁶ | 8.47×10⁵ | With ρ, V, D and μ from the sheet itself, Re = 8.5×10⁵. It does not change the conclusion (turbulent), but the value is not reproducible |
| Distributed hf | 38.3 m | 480.8 m | `f·(L/D)·(V²/2g)` with the sheet data gives ~481 m of steam column. There is a factor ~12 of difference |
| Local h_loc | 64.1 m | 659.7 m | `ΣK·(V²/2g)` with ΣK = 14.10 gives ~660 m. There is a factor ~10 of difference |
| Total ΔP | 4,830 Pa = 0.049 bar | 53,795 Pa = 0.538 bar | Consequence of the previous ones |

The **engineering conclusion coincides** (DN80 / 3" is adequate, ΔP in the order of 0.5 bar), but the intermediate values of the sheet are not reproducible. The most likely error is mixing head in a column of **steam** with **mca** (metres of water column) — the factor between the two is ρ_water/ρ_vapor ≈ 208, and it is the most common unit error in steam calculation.

## Reproduce

```bash
node tools/calc-vapor.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --eps 0.045 --K 14.1 --Pabs 9.013 --D 77.9 --lang en
```

Without `--D`, the tool chooses the smallest Schedule 40 DN with ID ≥ required D and recalculates the actual velocity.
