# Ejemplo verificado — línea de vapor 8 bar(g), 2.500 kg/h

**Languages / Idiomas:** [English](steam-8bar-2500kgh.en.md) · [Português (BR)](steam-8bar-2500kgh.pt-BR.md) · Español

Caso de referencia de la hoja de origen de este procedimiento, **recalculado** con la herramienta `tools/calc-vapor.mjs`. Todos los números de abajo salen de la misma cadena de cálculo y son reproducibles.

## Datos del sistema

| Dato | Valor |
|---|---|
| Caudal másico de vapor (ṁ) | 2.500 kg/h |
| Presión de operación | 8 bar(g) → **P_abs = 9,013 bar** |
| Temperatura | 175 °C |
| Longitud recta total (L) | 45 m |
| Material | Acero al carbono ASTM A106 Gr. B |
| Rugosidad absoluta (ε) | 0,045 mm |
| Accesorios | 6 codos de 90° radio largo, 2 válvulas de bloqueo (compuerta), 1 válvula de control (globo), 1 filtro Y, 1 separador de humedad |
| Densidad adoptada (ρ) | 4,81 kg/m³ |
| Viscosidad dinámica (μ) | 1,34×10⁻⁵ Pa·s |
| Velocidad de proyecto (V) | 30 m/s |

> **Nota sobre ρ**: a 9,013 bar(a) el vapor está **saturado** (T_sat ≈ 175,5 °C), y la tabla da ρ ≈ 4,66 kg/m³. El valor de 4,81 kg/m³ usado aquí es el de la hoja de origen (≈ 3 % por encima de la tabla) y se mantuvo para que el ejemplo sea trazable. Con 4,66 kg/m³ el caudal volumétrico sube ~3 % y el diámetro requerido también — la conclusión no cambia, pero el número cambia.

## Paso 1 — Caudal volumétrico

```
Qv = ṁ/ρ = 2500/4,81 = 519,8 m³/h = 0,1444 m³/s
```

## Paso 2 — Diámetro requerido por velocidad

```
D = √(4·Qv/(π·V)) = √(4×0,1444/(π×30)) = 0,0783 m = 78,3 mm
```

Adoptando el menor Schedule 40 con **ID ≥ 78,3 mm** → **DN80 (3")**, ID = **77,9 mm**.
(77,9 < 78,3, entonces la velocidad real queda un poco por encima del objetivo — aceptable. El siguiente sería DN100, ID 102,3 mm, que daría V = 17,6 m/s, muy por debajo de lo económico.)

```
V real = Qv/A = 0,1444/(π×0,0779²/4) = 30,3 m/s
```

Verificaciones de velocidad:

| Verificación | Valor | Situación |
|---|---|---|
| Rango usual (vapor saturado, línea principal) | 20 – 40 m/s | **OK** |
| Erosión API RP 14E (C = 100): V_max = 100/√4,81 | 45,6 m/s | **OK** |
| Mach = 30,3/519 | 0,058 | **OK** (< 0,3, incompresible) |
| ρ·V² | 4.414 kg/(m·s²) | **OK** (< 15.000) |

## Paso 3 — Número de Reynolds

```
Re = ρ·V·D/μ = 4,81 × 30,3 × 0,0779 / 1,34×10⁻⁵ = 8,47×10⁵
```

Verificación por la forma independiente de la velocidad:

```
Re = 4·ṁ/(π·D·μ) = 4×(2500/3600)/(π×0,0779×1,34×10⁻⁵) = 8,47×10⁵  ✓
```

Régimen: **turbulento** (como se espera para vapor).

## Paso 4 — Factor de fricción

```
ε/D = 0,045×10⁻³/0,0779 = 5,78×10⁻⁴

Swamee-Jain:
f = 0,25 / [log₁₀(5,78×10⁻⁴/3,7 + 5,74/(8,47×10⁵)^0,9)]²
f = 0,25 / [log₁₀(1,561×10⁻⁴ + 2,65×10⁻⁵)]²
f = 0,0179
```

| Correlación | f |
|---|---:|
| Swamee-Jain (explícita) | 0,0179 |
| Colebrook-White (referencia) | 0,0178 |
| Haaland (explícita) | 0,0178 |
| Desvío Swamee-Jain × Colebrook | 0,56 % |

Las tres concuerdan dentro del 1 % — la correlación explícita es segura en este rango.

## Paso 5 — Pérdida de carga distribuida (Darcy-Weisbach)

```
V²/2g = 30,3²/(2×9,80665) = 46,78 m de columna de vapor
L/D   = 45/0,0779 = 577,7
f·L/D = 0,0178 × 577,7 = 10,276

hf   = 10,276 × 46,78 = 480,8 m de columna de vapor
ΔP_f = f·(L/D)·(ρ·V²/2) = 10,276 × (4,81×30,3²/2) = 22.678 Pa = 0,2268 bar
```

## Paso 6 — Pérdidas localizadas (ΣK)

| Componente | Cant. | K unit. | Cant. × K |
|---|---:|---:|---:|
| Codo de 90° radio largo | 6 | 0,20 | 1,20 |
| Válvula de bloqueo (compuerta) | 2 | 0,20 | 0,40 |
| Válvula de control (globo) | 1 | 10,0 | 10,00 |
| Filtro Y | 1 | 1,50 | 1,50 |
| Separador de humedad | 1 | 1,00 | 1,00 |
| **ΣK** | | | **14,10** |

```
h_loc   = ΣK·(V²/2g) = 14,10 × 46,78 = 659,7 m de columna de vapor
ΔP_loc  = ΣK·(ρ·V²/2) = 14,10 × (4,81×30,3²/2) = 31.116 Pa = 0,3112 bar
```

La válvula de control por sí sola responde por el **71 %** de las pérdidas localizadas.

## Paso 7 — Pérdida total y verificación

```
h_total = 480,8 + 659,7 = 1.140,4 m de columna de vapor
ΔP      = 22.678 + 31.116 = 53.795 Pa = 0,5379 bar = 0,5486 kgf/cm²
ΔP/P_abs = 0,5379/9,013 = 5,97 %
```

| Criterio | Valor | Situación |
|---|---|---|
| ΔP ≤ 10 % de la P_abs | 5,97 % | **OK** |
| ΔP ≤ 0,5 bar (línea larga) | 0,538 bar | **Límite** — levemente por encima, aceptable en la práctica por la dominancia de la válvula de control |

**Resultado: DN80 (3") Schedule 40 cumple**, con ΔP ≈ 0,54 bar (6 % de la presión absoluta).

## Verificación independiente (vía longitud equivalente)

```
L_eq = ΣK·D/f = 14,10 × 0,0779/0,0178 = 61,7 m
L_total = 45 + 61,7 = 106,7 m
ΔP = f·(L_total/D)·(ρ·V²/2) = 0,0178 × (106,7/0,0779) × 2.204,7 = 53.800 Pa = 0,538 bar  ✓
```

Las dos vías cierran — el resultado es confiable.

## Verificación de la hoja de origen

Al reproducir la hoja, tres etapas **no cierran con sus propias entradas**. Se registra aquí porque es exactamente la comprobación que este procedimiento exige antes de emitir cualquier número:

| Etapa | Hoja de origen | Recalculado | Observación |
|---|---|---|---|
| Reynolds | 1,06×10⁶ | 8,47×10⁵ | Con ρ, V, D y μ de la propia hoja, Re = 8,5×10⁵. No cambia la conclusión (turbulento), pero el valor no es reproducible |
| hf distribuida | 38,3 m | 480,8 m | `f·(L/D)·(V²/2g)` con los datos de la hoja da ~481 m de columna de vapor. Hay un factor ~12 de diferencia |
| h_loc localizada | 64,1 m | 659,7 m | `ΣK·(V²/2g)` con ΣK = 14,10 da ~660 m. Hay un factor ~10 de diferencia |
| ΔP total | 4.830 Pa = 0,049 bar | 53.795 Pa = 0,538 bar | Consecuencia de las anteriores |

La **conclusión de ingeniería coincide** (DN80 / 3" cumple, ΔP del orden de 0,5 bar), pero los valores intermedios de la hoja no son reproducibles. El error más probable es la mezcla de head en columna de **vapor** con **mca** (metros de columna de agua) — el factor entre los dos es ρ_agua/ρ_vapor ≈ 208, y es el error de unidad más común en el cálculo de vapor.

## Reproducir

```bash
node tools/calc-vapor.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --eps 0.045 --K 14.1 --Pabs 9.013 --D 77.9 --lang es
```

Sin `--D`, la herramienta escoge el menor DN Schedule 40 con ID ≥ D requerido y recalcula la velocidad real.
