# Tablas de apoyo — vapor, tubería, rugosidad y accesorios

**Languages / Idiomas:** [English](tables.en.md) · [Português (BR)](tabelas.pt-BR.md) · Español

Valores usuales de proyecto. **Confirmar siempre** contra la especificación del proyecto y la norma aplicable antes de emitir documento.

## 1. Vapor saturado — propiedades por presión absoluta

| P abs (bar) | P man (bar) | T sat (°C) | v_g (m³/kg) | ρ (kg/m³) | h_f (kJ/kg) | h_fg (kJ/kg) | h_g (kJ/kg) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | ≈ 0 | 99,6 | 1,694 | 0,590 | 417,5 | 2258 | 2676 |
| 2 | ≈ 1 | 120,2 | 0,8857 | 1,129 | 504,7 | 2202 | 2707 |
| 3 | ≈ 2 | 133,5 | 0,6058 | 1,651 | 561,5 | 2163 | 2725 |
| 4 | ≈ 3 | 143,6 | 0,4625 | 2,162 | 604,7 | 2134 | 2738 |
| 5 | ≈ 4 | 151,8 | 0,3749 | 2,667 | 640,2 | 2108 | 2749 |
| 6 | ≈ 5 | 158,8 | 0,3157 | 3,168 | 670,6 | 2086 | 2756 |
| 7 | ≈ 6 | 165,0 | 0,2729 | 3,665 | 697,2 | 2066 | 2763 |
| **8** | **≈ 7** | **170,4** | **0,2404** | **4,160** | 721,1 | 2048 | 2769 |
| **9,013** | **8** | **≈ 175,5** | **≈ 0,2147** | **≈ 4,66** | ≈ 738 | ≈ 2030 | ≈ 2768 |
| **10** | **≈ 9** | **179,9** | **0,1944** | **5,144** | 762,8 | 2015 | 2778 |
| 12 | ≈ 11 | 188,0 | 0,1633 | 6,124 | 798,6 | 1986 | 2785 |
| 14 | ≈ 13 | 195,0 | 0,1408 | 7,102 | 830,1 | 1960 | 2790 |
| 16 | ≈ 15 | 201,4 | 0,1238 | 8,078 | 858,6 | 1940 | 2794 |
| 18 | ≈ 17 | 207,1 | 0,1104 | 9,058 | 884,6 | 1912 | 2797 |
| 20 | ≈ 19 | 212,4 | 0,0996 | 10,04 | 908,6 | 1890 | 2799 |

- `P_abs = P_man + 1,013` (bar) o `P_abs = P_man + 0,981` (kgf/cm²).
- Para vapor **saturado**, ρ y T son función **solo** de la presión (T = T_sat).
- Para vapor **recalentado**, entrar en la tabla de vapor recalentado con P **y** T. Ejemplo: a 9 bar abs y 250 °C, ρ ≈ 4,05 kg/m³ (contra 4,66 kg/m³ en la saturación).
- La interpolación lineal entre filas es adecuada para ρ en este rango.

## 2. Tubos sin costura — diámetros interiores (ASME B36.10M)

| DN | NPS | OD (mm) | Sch 40 — ID (mm) | Sch 40 — pared (mm) | Sch 80 — ID (mm) | Sch 80 — pared (mm) |
|---|---|---|---:|---:|---:|---:|
| DN15 | 1/2" | 21,3 | 15,8 | 2,77 | 13,8 | 3,73 |
| DN20 | 3/4" | 26,7 | 20,9 | 2,87 | 18,9 | 3,91 |
| DN25 | 1" | 33,4 | 26,6 | 3,38 | 24,3 | 4,55 |
| DN32 | 1¼" | 42,2 | 35,1 | 3,56 | 32,5 | 4,85 |
| DN40 | 1½" | 48,3 | 40,9 | 3,68 | 38,1 | 5,08 |
| DN50 | 2" | 60,3 | 52,5 | 3,91 | 49,3 | 5,54 |
| DN65 | 2½" | 73,0 | 62,7 | 5,16 | 59,0 | 7,01 |
| **DN80** | **3"** | **88,9** | **77,9** | **5,49** | 73,7 | 7,62 |
| DN100 | 4" | 114,3 | 102,3 | 6,02 | 97,2 | 8,56 |
| DN125 | 5" | 141,3 | 128,2 | 6,55 | 122,2 | 9,53 |
| DN150 | 6" | 168,3 | 154,1 | 7,11 | 146,4 | 10,97 |
| DN200 | 8" | 219,1 | 202,7 | 8,18 | 193,7 | 12,70 |
| DN250 | 10" | 273,0 | 254,5 | 9,27 | 242,8 | 15,09 |
| DN300 | 12" | 323,8 | 303,2 | 10,31 | 288,8 | 17,48 |

**El diámetro nominal NO es el diámetro interior.** DN80 (3" Sch 40) tiene ID = 77,9 mm. Todos los cálculos usan el ID.

## 3. Rugosidad absoluta (ε) — tubo nuevo, salvo indicación

| Material / condición | ε (mm) | ε (m) |
|---|---:|---:|
| Acero al carbono nuevo, sin costura (ASTM A106) | 0,045 | 4,5×10⁻⁵ |
| Acero al carbono comercial | 0,046 | 4,6×10⁻⁵ |
| Acero inoxidable | 0,015 | 1,5×10⁻⁵ |
| Hierro fundido | 0,26 | 2,6×10⁻⁴ |
| Acero galvanizado | 0,15 | 1,5×10⁻⁴ |
| Acero al carbono incrustado / con incrustación | 0,15 – 0,5 | 1,5 – 5×10⁻⁴ |
| Cobre / latón | 0,0015 | 1,5×10⁻⁶ |
| PVC / plásticos | 0,0015 – 0,007 | 1,5 – 7×10⁻⁶ |
| Concreto | 0,3 – 3 | 3×10⁻⁴ – 3×10⁻³ |

Una línea de vapor en operación durante años trabaja con ε de **0,15–0,5 mm**, no con el valor de tubo nuevo. Para línea nueva, usar 0,045 mm.

## 4. Coeficientes de pérdida localizada (K)

Valores típicos para predimensionamiento. K depende del diámetro y de Re — confirmar con **Crane TP-410** o la norma del proyecto.

| Componente | K |
|---|---:|
| Codo 90° radio largo | 0,20 |
| Codo 90° radio corto | 0,90 |
| Codo 45° | 0,20 |
| Curva de retorno (180°) | 2,20 |
| Tee — flujo directo | 0,40 |
| Tee — flujo desviado | 1,00 |
| Válvula de compuerta, abierta | 0,20 |
| Válvula de globo, abierta | 10,0 |
| Válvula de retención (de clapeta) | 2,0 – 2,5 |
| Válvula de mariposa, abierta | 0,3 – 0,6 |
| Válvula de control tipo globo | 10,0 (o el Cv de la válvula) |
| Filtro Y, limpio | 1,5 – 2,5 |
| Separador de humedad | 1,0 – 2,0 |
| Medidor de caudal (placa de orificio) | varía con β — usar el proyecto |
| Entrada de tubería (borde vivo) | 0,50 |
| Salida de tubería | 1,00 |
| Reducción gradual | 0,05 – 0,20 |

**Válvula de control**: no usar un K genérico. La pérdida real depende de la apertura y del caudal — dimensionar con la ecuación de la válvula (Cv) y con la caída de presión de proyecto (skill `valvulas-controle-fisher`). K = 10 sirve solo como orden de magnitud.

Conversión a longitud equivalente: `L_eq = K · D / f`.

## 5. Velocidades recomendadas (confirmar con la especificación del proyecto)

| Servicio | Rango usual (m/s) |
|---|---|
| Vapor saturado — línea principal | 20 – 40 |
| Vapor saturado — ramal / entrada de equipo | 15 – 25 |
| Vapor recalentado — línea principal | 35 – 60 (hasta 75) |
| Vapor de escape de turbina / baja presión | 40 – 75 |
| Condensado (líquido) | 0,5 – 2 |
| Agua / otros líquidos | 1 – 3 |

Límite de erosión (API RP 14E): `V_max = C/√ρ`, C = 100 (continuo) o 125 (intermitente).

## 6. Constantes y conversiones

| Magnitud | Valor |
|---|---|
| g (gravedad estándar) | 9,80665 m/s² |
| ρ del agua (4 °C) | 1000 kg/m³ |
| 1 bar | 10⁵ Pa = 1,0197 kgf/cm² = 14,5038 psi |
| 1 kgf/cm² | 98 066,5 Pa = 0,98066 bar |
| 1 mca | 9806,65 Pa |
| Conversión carga de vapor ↔ mca | factor `ρ_agua/ρ_vapor` (≈ 208 para vapor a 9 bar abs) |
| R del vapor de agua | 461,5 J/(kg·K) |
| k (vapor de agua, ~175 °C) | ≈ 1,3 |
| Velocidad del sonido en el vapor (~175 °C) | ≈ 519 m/s |

## 7. Correlaciones del factor de fricción

```
Swamee-Jain (explícita, 5e3 < Re < 1e8  e  1e-6 < eps/D < 1e-2):
    f = 0,25 / [ log10( eps/(3,7*D) + 5,74/Re^0,9 ) ]^2

Colebrook-White (implícita — referência, resolver por iteração):
    1/sqrt(f) = -2 * log10( eps/(3,7*D) + 2,51/(Re*sqrt(f)) )

Haaland (explícita, boa estimativa inicial):
    1/sqrt(f) = -1,8 * log10[ (eps/(3,7*D))^1,11 + 6,9/Re ]
```

Reynolds: `Re = ρ·V·D/μ = V·D/ν = 4·ṁ/(π·D·μ)` — la última forma es independiente de la velocidad y sirve de verificación.

Darcy-Weisbach: `hf = f·(L/D)·(V²/2g)` o `ΔP_f = f·(L/D)·(ρ·V²/2)`.
Pérdidas localizadas: `h_loc = ΣK·(V²/2g)` o `ΔP_loc = ΣK·(ρ·V²/2)`.
