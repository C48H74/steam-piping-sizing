# Reference tables — steam, pipe, roughness and fittings

**Languages:** English · [Português (BR)](tabelas.pt-BR.md) · [Español](tablas.es.md)

Usual design values. **Always confirm** against the project specification and the applicable standard before issuing a document.

## 1. Saturated steam — properties by absolute pressure

| P abs (bar) | P gauge (bar) | T sat (°C) | v_g (m³/kg) | ρ (kg/m³) | h_f (kJ/kg) | h_fg (kJ/kg) | h_g (kJ/kg) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | ≈ 0 | 99.6 | 1.694 | 0.590 | 417.5 | 2258 | 2676 |
| 2 | ≈ 1 | 120.2 | 0.8857 | 1.129 | 504.7 | 2202 | 2707 |
| 3 | ≈ 2 | 133.5 | 0.6058 | 1.651 | 561.5 | 2163 | 2725 |
| 4 | ≈ 3 | 143.6 | 0.4625 | 2.162 | 604.7 | 2134 | 2738 |
| 5 | ≈ 4 | 151.8 | 0.3749 | 2.667 | 640.2 | 2108 | 2749 |
| 6 | ≈ 5 | 158.8 | 0.3157 | 3.168 | 670.6 | 2086 | 2756 |
| 7 | ≈ 6 | 165.0 | 0.2729 | 3.665 | 697.2 | 2066 | 2763 |
| **8** | **≈ 7** | **170.4** | **0.2404** | **4.160** | 721.1 | 2048 | 2769 |
| **9.013** | **8** | **≈ 175.5** | **≈ 0.2147** | **≈ 4.66** | ≈ 738 | ≈ 2030 | ≈ 2768 |
| **10** | **≈ 9** | **179.9** | **0.1944** | **5.144** | 762.8 | 2015 | 2778 |
| 12 | ≈ 11 | 188.0 | 0.1633 | 6.124 | 798.6 | 1986 | 2785 |
| 14 | ≈ 13 | 195.0 | 0.1408 | 7.102 | 830.1 | 1960 | 2790 |
| 16 | ≈ 15 | 201.4 | 0.1238 | 8.078 | 858.6 | 1940 | 2794 |
| 18 | ≈ 17 | 207.1 | 0.1104 | 9.058 | 884.6 | 1912 | 2797 |
| 20 | ≈ 19 | 212.4 | 0.0996 | 10.04 | 908.6 | 1890 | 2799 |

- `P_abs = P_gauge + 1.013` (bar) or `P_abs = P_gauge + 0.981` (kgf/cm²).
- For **saturated** steam, ρ and T are a function of pressure **only** (T = T_sat).
- For **superheated** steam, use the superheated steam table with P **and** T. Example: at 9 bar abs and 250 °C, ρ ≈ 4.05 kg/m³ (versus 4.66 kg/m³ at saturation).
- Linear interpolation between rows is adequate for ρ in this range.

## 2. Seamless pipe — internal diameters (ASME B36.10M)

| DN | NPS | OD (mm) | Sch 40 — ID (mm) | Sch 40 — wall (mm) | Sch 80 — ID (mm) | Sch 80 — wall (mm) |
|---|---|---|---:|---:|---:|---:|
| DN15 | 1/2" | 21.3 | 15.8 | 2.77 | 13.8 | 3.73 |
| DN20 | 3/4" | 26.7 | 20.9 | 2.87 | 18.9 | 3.91 |
| DN25 | 1" | 33.4 | 26.6 | 3.38 | 24.3 | 4.55 |
| DN32 | 1¼" | 42.2 | 35.1 | 3.56 | 32.5 | 4.85 |
| DN40 | 1½" | 48.3 | 40.9 | 3.68 | 38.1 | 5.08 |
| DN50 | 2" | 60.3 | 52.5 | 3.91 | 49.3 | 5.54 |
| DN65 | 2½" | 73.0 | 62.7 | 5.16 | 59.0 | 7.01 |
| **DN80** | **3"** | **88.9** | **77.9** | **5.49** | 73.7 | 7.62 |
| DN100 | 4" | 114.3 | 102.3 | 6.02 | 97.2 | 8.56 |
| DN125 | 5" | 141.3 | 128.2 | 6.55 | 122.2 | 9.53 |
| DN150 | 6" | 168.3 | 154.1 | 7.11 | 146.4 | 10.97 |
| DN200 | 8" | 219.1 | 202.7 | 8.18 | 193.7 | 12.70 |
| DN250 | 10" | 273.0 | 254.5 | 9.27 | 242.8 | 15.09 |
| DN300 | 12" | 323.8 | 303.2 | 10.31 | 288.8 | 17.48 |

**The nominal diameter is NOT the internal diameter.** DN80 (3" Sch 40) has ID = 77.9 mm. All calculations use the ID.

## 3. Absolute roughness (ε) — new pipe, unless otherwise stated

| Material / condition | ε (mm) | ε (m) |
|---|---:|---:|
| New seamless carbon steel (ASTM A106) | 0.045 | 4.5×10⁻⁵ |
| Commercial carbon steel | 0.046 | 4.6×10⁻⁵ |
| Stainless steel | 0.015 | 1.5×10⁻⁵ |
| Cast iron | 0.26 | 2.6×10⁻⁴ |
| Galvanized steel | 0.15 | 1.5×10⁻⁴ |
| Scaled / fouled carbon steel | 0.15 – 0.5 | 1.5 – 5×10⁻⁴ |
| Copper / brass | 0.0015 | 1.5×10⁻⁶ |
| PVC / plastics | 0.0015 – 0.007 | 1.5 – 7×10⁻⁶ |
| Concrete | 0.3 – 3 | 3×10⁻⁴ – 3×10⁻³ |

A steam line that has been in service for years works with an ε of **0.15–0.5 mm**, not with the new-pipe value. For a new line, use 0.045 mm.

## 4. Localized loss coefficients (K)

Typical values for preliminary sizing. K depends on diameter and on Re — confirm with **Crane TP-410** or the project standard.

| Component | K |
|---|---:|
| 90° long-radius elbow | 0.20 |
| 90° short-radius elbow | 0.90 |
| 45° elbow | 0.20 |
| Return bend (180°) | 2.20 |
| Tee — straight-through flow | 0.40 |
| Tee — branch flow | 1.00 |
| Gate valve, open | 0.20 |
| Globe valve, open | 10.0 |
| Check valve (swing, hinged disc) | 2.0 – 2.5 |
| Butterfly valve, open | 0.3 – 0.6 |
| Globe-type control valve | 10.0 (or the Cv of the valve) |
| Y-strainer, clean | 1.5 – 2.5 |
| Moisture separator | 1.0 – 2.0 |
| Flow meter (orifice plate) | varies with β — use the project data |
| Pipe inlet (sharp-edged) | 0.50 |
| Pipe outlet | 1.00 |
| Gradual contraction | 0.05 – 0.20 |

**Control valve**: do not use a generic K. The actual loss depends on the opening and on the flow rate — size it with the valve equation (Cv) and the design pressure drop (skill `valvulas-controle-fisher`). K = 10 serves only as an order of magnitude.

Conversion to equivalent length: `L_eq = K · D / f`.

## 5. Recommended velocities (confirm with the project specification)

| Service | Usual range (m/s) |
|---|---|
| Saturated steam — main line | 20 – 40 |
| Saturated steam — branch / equipment inlet | 15 – 25 |
| Superheated steam — main line | 35 – 60 (up to 75) |
| Turbine exhaust steam / low pressure | 40 – 75 |
| Condensate (liquid) | 0.5 – 2 |
| Water / other liquids | 1 – 3 |

Erosion limit (API RP 14E): `V_max = C/√ρ`, C = 100 (continuous) or 125 (intermittent).

## 6. Constants and conversions

| Quantity | Value |
|---|---|
| g (standard gravity) | 9.80665 m/s² |
| ρ of water (4 °C) | 1000 kg/m³ |
| 1 bar | 10⁵ Pa = 1.0197 kgf/cm² = 14.5038 psi |
| 1 kgf/cm² | 98,066.5 Pa = 0.98066 bar |
| 1 mca | 9806.65 Pa |
| Steam head ↔ mca conversion | factor `ρ_water/ρ_vapor` (≈ 208 for steam at 9 bar abs) |
| R of steam | 461.5 J/(kg·K) |
| k (steam, ~175 °C) | ≈ 1.3 |
| Speed of sound in steam (~175 °C) | ≈ 519 m/s |

## 7. Friction factor correlations

```
Swamee-Jain (explícita, 5e3 < Re < 1e8  e  1e-6 < eps/D < 1e-2):
    f = 0.25 / [ log10( eps/(3.7*D) + 5.74/Re^0.9 ) ]^2

Colebrook-White (implícita — referência, resolver por iteração):
    1/sqrt(f) = -2 * log10( eps/(3.7*D) + 2.51/(Re*sqrt(f)) )

Haaland (explícita, boa estimativa inicial):
    1/sqrt(f) = -1.8 * log10[ (eps/(3.7*D))^1.11 + 6.9/Re ]
```

Reynolds: `Re = ρ·V·D/μ = V·D/ν = 4·ṁ/(π·D·μ)` — the last form is independent of velocity and serves as a cross-check.

Darcy-Weisbach: `hf = f·(L/D)·(V²/2g)` or `ΔP_f = f·(L/D)·(ρ·V²/2)`.
Localized losses: `h_loc = ΣK·(V²/2g)` or `ΔP_loc = ΣK·(ρ·V²/2)`.
