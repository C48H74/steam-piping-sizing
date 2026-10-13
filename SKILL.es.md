---
name: "dimensionamento-tubulacao-vapor"
description: "Dimensionamiento y verificación de tubería de vapor: caudal másico y volumétrico, elección de diámetro por velocidad recomendada (20–40 m/s saturado, 35–60 m/s sobrecalentado), número de Reynolds, factor de fricción por Swamee-Jain/Colebrook/Haaland, pérdida de carga distribuida de Darcy-Weisbach, pérdidas localizadas por coeficientes K (codos, válvulas, filtros, separadores), caída de presión total y criterio de ΔP admisible, además de las buenas prácticas constructivas (drenajes de condensado, purgadores, separador de humedad, lira de dilatación, aislamiento, toma de ramal). Usar al dimensionar o revisar una línea de vapor/condensado, elegir el diámetro de una línea de vapor, verificar la velocidad del vapor, calcular la pérdida de carga con accesorios o comprobar si la presión disponible llega al proceso. También en portugués: dimensionar tubulação de vapor, perda de carga de vapor, diâmetro de linha de vapor. También en español: dimensionar tubería de vapor, pérdida de carga de vapor, diámetro de línea de vapor."
---

# Dimensionamiento de Tubería de Vapor

**Languages / Idiomas:** [English](SKILL.md) · [Português (BR)](SKILL.pt-BR.md) · Español

**Fuente**: hoja de cálculo "Tubulação de Vapor" (Tubería de Vapor) proporcionada por el usuario — procedimiento de 10 etapas (datos del sistema → propiedades del vapor → caudal volumétrico → diámetro por velocidad → Reynolds → factor de fricción de Swamee-Jain → pérdida distribuida de Darcy-Weisbach → coeficientes K → pérdida total y ΔP → buenas prácticas), complementada con práctica de proyecto y verificaciones cruzadas de ingeniería. **Generado**: 2026-10-13.

**Herramienta**: `tools/calc-vapor.mjs` (Node, sin dependencias) ejecuta la cadena completa y muestra cada etapa. Acepta `--lang en|pt|es` para seleccionar el idioma de salida.

## Referencias visuales

Para una visión ilustrada, consulte el [flujo de dimensionamiento](assets/images/sizing-workflow.png) y el [sistema de vapor industrial](assets/images/industrial-steam-system.png). Las imágenes en inglés son recursos conceptuales; utilice los procedimientos escritos, las tablas y la calculadora para decisiones numéricas. El esquema no es un diseño de construcción ni de soportación.

## Cómo usar
- "Qué diámetro usar para este caudal de vapor" → framework 1.
- "Cuál es la masa específica / el caudal volumétrico" → framework 2.
- "Cuál es el factor de fricción / la pérdida de carga" → frameworks 3 y 4.
- "La presión llega al proceso / la línea está bien dimensionada" → framework 5.
- "Qué no puede faltar en la línea" → framework 7.
- Errores que producen un resultado erróneo sin avisar → sección **Antipatrones**.

## Frameworks centrales

1. **La línea de vapor se dimensiona por la velocidad y se VERIFICA por la pérdida de carga — las dos comprobaciones son obligatorias. Detenerse en el cálculo del diámetro es el error más común.**
   - `Qv = ṁ/ρ` (caudal volumétrico) → `D = √(4·Qv/(π·V))` con V fijado dentro del rango recomendado.
   - El diámetro calculado es el **interno**. Nunca adoptar por el diámetro nominal: DN80 (3") Schedule 40 tiene ID = 77,9 mm, no 80 mm. La tabla de schedule es la que manda — usar `references/tablas.es.md`.
   - Elegir el **menor DN cuyo ID sea ≥ D calculado** (el ID inmediatamente superior). Recalcular la velocidad real `V = Qv/A` con el ID adoptado — **no** es igual a la velocidad de proyecto, y es ella la que entra en todas las etapas siguientes.
   - Velocidades usuales (confirmar con la especificación del proyecto — varían por cliente/norma):

     | Servicio | Rango usual (m/s) |
     |---|---|
     | Vapor saturado — línea principal | 20 – 40 |
     | Vapor saturado — ramal / entrada de equipo | 15 – 25 |
     | Vapor sobrecalentado — línea principal | 35 – 60 (hasta 75) |
     | Vapor de escape de turbina / baja presión | 40 – 75 |
     | Condensado (líquido) | 0,5 – 2 |
     | Agua / otros líquidos | 1 – 3 |

   - Verificación de erosión (API RP 14E): `V_max = C/√ρ`, con C = 100 para servicio continuo y 125 para intermitente. Para vapor a 9 bar abs (ρ ≈ 4,7 kg/m³) → V_max ≈ 46 m/s.
   - Verificación de compresibilidad: `Ma = V/a < 0,3` (a ≈ 480–520 m/s para vapor en el rango de 150–200 °C). Por encima de eso el flujo es compresible y Darcy-Weisbach pierde validez.
   - Criterio de caída de presión: `ΔP ≤ 10 %` de la presión **absoluta** de operación es el límite usual; en la práctica se usa `ΔP ≤ 0,5 bar` para línea larga y `ΔP ≤ 0,1–0,2 bar` para línea corta de alimentación de equipo. El vapor para turbina es mucho más restrictivo — el límite viene del fabricante.

2. **La masa específica es la variable más frágil del cálculo: el vapor es compresible y ρ depende de P y T simultáneamente. Errar ρ erra el diámetro en la raíz y la pérdida de carga entera.**
   - Tomar ρ de **tabla de vapor**, nunca de gas ideal (a 9 bar abs el gas ideal yerra ~7 %; a presiones altas el error explota). Tabla de vapor saturado en `references/tablas.es.md`.
   - **Vapor saturado**: ρ es función solo de la presión (la temperatura es la de saturación). **Vapor sobrecalentado**: ρ depende de P y T.
   - Consecuencia práctica de una confusión común: a 8 bar(g) la temperatura de saturación es ≈ 175,5 °C. Si el dato de proyecto dice "175 °C", el vapor es **saturado**, no sobrecalentado — llamarlo sobrecalentado no cambia el cálculo, pero cambia la interpretación (no hay grado de sobrecalentamiento para intercambiar calor).
   - `bar(g)` es presión **manométrica**. Las tablas y el criterio de ΔP% usan presión **absoluta**: `P_abs = P_man + 1,013` (o +0,981 si la referencia es 1 kgf/cm²).
   - Título/humedad: vapor con x < 1 arrastra gotas — la masa específica efectiva sube, la velocidad del líquido es mucho menor y la erosión en los accesorios aumenta. El vapor de caldera típico sale con 1–3 % de humedad.
   - En línea larga o de baja presión, la presión cae a lo largo del tramo y ρ cae con ella. Para línea larga, dividir en tramos y **recalcular ρ** en cada tramo; usar ρ de la presión media es aceptable solo como primera estimación.
   - El caudal másico considerado debe incluir las **derivaciones de purga**, el calentamiento de traza de vapor y el consumo del equipo — no solo el caudal nominal del proceso.

3. **Reynolds y el factor de fricción se calculan con el diámetro INTERNO real y con la rugosidad del material de la tubería — no con valores genéricos.**
   - `Re = ρ·V·D/μ = V·D/ν = 4·ṁ/(π·D·μ)`. La última forma es la más útil: **no depende de la velocidad**, así que sirve para comprobar Re directamente desde las entradas y detectar error de propagación.
   - Régimen: laminar `Re < 2000`; transición `2000–4000`; turbulento `Re > 4000`. La línea de vapor está **siempre** en régimen turbulento (Re ∼ 10⁵–10⁶) — si sale laminar, el dato de entrada está mal.
   - Factor de fricción de Darcy `f` (el mismo que multiplica `L/D`):
     - **Swamee-Jain** (explícita, la usada en la hoja de origen — válida para `5×10³ < Re < 10⁸` y `10⁻⁶ < ε/D < 10⁻²`): `f = 0,25 / [log₁₀(ε/(3,7·D) + 5,74/Re^0,9)]²`
     - **Colebrook-White** (implícita, es la referencia; resolver por iteración): `1/√f = −2·log₁₀(ε/(3,7·D) + 2,51/(Re·√f))`
     - **Haaland** (explícita, excelente estimación inicial): `1/√f = −1,8·log₁₀[(ε/(3,7·D))^1,11 + 6,9/Re]`
     - Swamee-Jain yerra típicamente < 1 % contra Colebrook en el rango de vapor — usar las tres y comparar es una comprobación barata.
   - Rugosidad absoluta `ε` típica (usar la del material **en la condición de operación**, no la del tubo nuevo, cuando la línea tiene historial de incrustación):

     | Material / condición | ε (mm) |
     |---|---|
     | Acero al carbono nuevo, sin costura (ASTM A106) | 0,045 |
     | Acero al carbono comercial | 0,046 |
     | Acero al carbono incrustado / con incrustación | 0,15 – 0,5 |
     | Acero galvanizado | 0,15 |
     | Fundición de hierro | 0,26 |
     | Acero inoxidable | 0,015 |
     | Cobre / latón | 0,0015 |
     | PVC / plásticos | 0,0015 – 0,007 |
     | Hormigón | 0,3 – 3 |

   - `ε/D` es adimensional y usa D en la misma unidad que ε. Una unidad cambiada aquí (mm con m) es un error de factor 1000 que pasa desapercibido.

4. **Pérdida de carga = distribuida (Darcy-Weisbach) + localizada (ΣK). En vapor, las pérdidas localizadas suelen DOMINAR — la válvula de control sola puede ser la mitad del total.**
   - Distribuida: `hf = f·(L/D)·(V²/2g)` en metros de columna del fluido, o directo en presión: `ΔP_f = f·(L/D)·(ρ·V²/2)`.
   - Localizada: `h_loc = ΣK·(V²/2g)`; `ΔP_loc = ΣK·(ρ·V²/2)`.
   - `ρ·V²/2` es la presión dinámica — calcularla una vez y reutilizarla en los dos términos.
   - Compresión a la forma de longitud equivalente (puente con la tabla de accesorios): `L_eq = K·D/f`.
   - Coeficientes K típicos (valores de proyecto usuales; confirmar con Crane TP-410 o la norma del proyecto — K varía con el diámetro y con Re):

     | Componente | K |
     |---|---|
     | Codo 90° radio largo | 0,20 |
     | Codo 45° | 0,20 |
     | Codo 90° radio corto | 0,90 |
     | Te — flujo directo | 0,40 |
     | Te — flujo desviado | 1,00 |
     | Válvula de compuerta abierta | 0,20 |
     | Válvula de globo abierta | 10,0 |
     | Válvula de retención (de clapeta) | 2,0 – 2,5 |
     | Válvula de control tipo globo | 10,0 (o el Cv de la válvula) |
     | Filtro Y limpio | 1,5 – 2,5 |
     | Separador de humedad | 1,0 – 2,0 |
     | Entrada de tubería / salida | 0,5 / 1,0 |

   - **Excepción importante**: para válvula de control, no usar K genérico — la pérdida depende de la apertura y del caudal. Dimensionar con la ecuación de la válvula (Cv) y la caída de presión de proyecto (skill `valvulas-controle-fisher`). Un K = 10 es solo orden de magnitud para predimensionamiento.
   - Total: `ΔP_total = ΔP_f + ΔP_loc`; comparar con el admisible del framework 1. Si reprueba: subir un DN y repetir la cadena entera (V, Re, f y K cambian todos).

5. **"mca" es metro de columna de AGUA — y el head calculado en columna de VAPOR no es lo mismo. Sumar o comparar los dos es el error de unidad que más contamina el cálculo de vapor.**
   - `h` (columna del fluido) `= ΔP/(ρ_fluido·g)` — para vapor da números grandes (centenas de metros) porque ρ es pequeño. Eso es head de vapor, no mca.
   - `mca = ΔP/(ρ_agua·g) = ΔP/9810`. La conversión entre los dos es el factor `ρ_agua/ρ_vapor ≈ 208` para vapor a 9 bar abs.
   - Para vapor, trabajar **directo en presión (Pa, bar, kgf/cm²)** y reservar "mca" para las líneas de líquido. Presentar head de vapor solo cuando el requisito del proyecto lo pida explícitamente.
   - Comprobación de consistencia obligatoria: `ΔP = ρ·g·h` tiene que cerrar con el ρ usado. Si `ΔP` cierra con un ρ y el `h` se calculó con otro, el resultado parece plausible y está mal.

6. **Comprobación de orden de magnitud antes de entregar el número.**
   - Para vapor saturado a 8–10 bar, línea de 3" con 2.500 kg/h: V ≈ 30 m/s y ΔP ≈ 0,5 bar en ~45 m con accesorios pesados. Resultados un orden de magnitud por debajo de eso casi siempre vienen de un error aritmético, no de un proyecto excepcionalmente bueno.
   - Estimación independiente rápida de ΔP por la vía de la longitud equivalente: `L_total = L_recto + Σ(K·D/f)` y después `ΔP = f·(L_total/D)·(ρ·V²/2)`. Si las dos vías discrepan más de ~10 %, hay error de aritmética.
   - Re calculado por `4·ṁ/(π·D·μ)` debe coincidir con `ρ·V·D/μ`. Divergencia = inconsistencia entre ρ, V y D.
   - Comprobación de plausibilidad de la caída de presión: `ΔP/P_abs` en %.

7. **Lo que hace funcionar la línea de vapor en la práctica (no aparece en el cálculo y es lo que más falla en campo).**
   - **Drenajes de condensado** en los puntos bajos, al inicio y al final de la línea, antes de cada válvula de bloqueo y cada 30–50 m de línea horizontal. Vapor sin drenaje da golpe de ariete en el arranque.
   - **Inclinación** de 1:100 a 1:250 en el sentido del flujo (o en contra, según el proyecto), siempre hacia el punto de drenaje.
   - **Purgadores de vapor** en los drenajes y en los puntos de retención (skill `purgadores-vapor-isolamento-tracing-pintura-catodica`).
   - **Separador de humedad** aguas arriba de turbina, medidor, válvula de control e intercambiador — no es accesorio opcional, es protección.
   - **Filtro Y** aguas arriba de válvula de control y de medidor, con malla compatible.
   - **Toma de ramal siempre por arriba** de la línea principal (nunca por abajo o por el lado), para no arrastrar condensado hacia el ramal.
   - **Lira de dilatación / flexibilidad**: el vapor es la línea más caliente de la planta, la dilatación térmica define el trazado (skill `flexibilidade-viga-balanco-guiada`).
   - **Aislamiento térmico** dimensionado por temperatura y por pérdida admisible (skill `aquecimento-isolamento-pintura-tubulacao`).
   - **Material**: ASTM A106 Gr. B es el estándar para vapor; verificar espesor con la fórmula ASME B31 (skill `asme-b31-3-codigo-normativo`).
   - **Purga y arranque**: el caudal de calentamiento inicial puede ser varias veces el nominal, con mucho condensado — la línea necesita drenar eso sin golpe.

## Cheatsheet de decisión
| Situación | Acción |
|---|---|
| Línea de vapor nueva, caudal conocido | Fijar V en el rango del servicio → D por velocidad → DN por ID de Schedule 40 → recalcular V real |
| V = 30 m/s dio exactamente el ID de un DN | Adoptar el DN superior; la velocidad real queda ligeramente mayor que el objetivo |
| D calculado entre dos DN comerciales | Siempre el mayor (ID ≥ D calculado); nunca redondear hacia abajo |
| Se necesita el ρ del vapor | Tabla de vapor. Si solo se tiene P manométrica, sumar 1,013 (o 0,981) antes de entrar en la tabla |
| T informada = T de saturación de la P | Vapor saturado. No tratarlo como sobrecalentado |
| Re dio < 4000 | Dato de entrada erróneo — comprobar μ, ρ y D (el vapor siempre es turbulento) |
| f entre Swamee-Jain y Colebrook difiere > 2 % | Comprobar ε/D y Re; fuera del rango de validez de la correlación explícita |
| Pérdida localizada > pérdida distribuida | Normal en vapor, principalmente con válvula de control o de globo en la línea |
| Válvula de control en la línea | No usar K genérico: dimensionar por Cv (skill `valvulas-controle-fisher`) |
| ΔP > 10 % de la P_abs | Subir un DN y rehacer la cadena entera |
| Resultado en "mca" para vapor | Sospechar: head de vapor ≠ mca. Convertir con ρ_agua, o trabajar en bar |
| Resultado de ΔP muy por debajo de lo esperado | Comprobar si entraron las pérdidas localizadas y si la presión dinámica usó el ρ correcto |
| Línea larga (> 100 m) o baja presión | Dividir en tramos y recalcular ρ con la presión de cada tramo |
| V por encima de 100/√ρ | Reprueba por erosión — subir DN |
| Ma > 0,3 | Flujo compresible — Darcy-Weisbach no se aplica directo |
| Línea con historial de incrustación | Usar ε de 0,15–0,5 mm, no 0,045 mm |

## Antipatrones
- **Detenerse en el diámetro.** Calcular D por la velocidad y entregarlo como respuesta, sin verificar ΔP. La velocidad solo garantiza que la línea no erosiona; no garantiza que la presión llegue.
- **Usar el diámetro nominal como diámetro interno.** 3" tiene ID 77,9 mm. El error de 3 % en D se vuelve ~6 % en la velocidad y ~13 % en la pérdida de carga.
- **Cambiar el DN y no recalcular V, Re y f.** Toda la cadena es acoplada: cambiar D cambia V, Re, f y K al mismo tiempo.
- **Usar ρ de gas ideal.** A 9 bar abs el error es del orden de 7 % y crece con la presión.
- **Olvidar las pérdidas localizadas**, o considerarlas "pequeñas" por analogía con líneas de líquido. En vapor con válvula de control, son la mayor fracción.
- **Sumar head de vapor con mca.** Son fluidos de referencia diferentes; el factor entre ellos es ≈ 208.
- **Confundir bar(g) y bar(a).** La tabla de vapor y el criterio de ΔP% usan presión absoluta.
- **Adoptar f = 0,02 fijo** para todo. Sirve como estimación de orden de magnitud; contra Colebrook llega a errar 10–15 %, y el error se propaga a ΔP.
- **Sumar Re y h con valores de D diferentes** (uno con el nominal, otro con el interno) — es el error de propagación más difícil de ver, porque cada número aislado parece razonable.
- **No comprobar erosión ni Mach.** En línea de baja presión (ρ pequeño) la velocidad sube rápido y ρ·V² es lo que limita.
- **Ignorar el condensado.** Sin drenaje, inclinación y purgador, la línea calculada correctamente falla en el arranque.

## Glosario
**ṁ** — caudal de masa (kg/h o kg/s).
**Qv** — caudal volumétrico en la condición de operación (m³/h o m³/s); `Qv = ṁ/ρ`.
**ρ** — masa específica del vapor en la condición de operación (kg/m³).
**D** — diámetro **interno** de la tubería (m); en tabla normalmente en mm.
**ε** — rugosidad absoluta de la pared (mm o m).
**ε/D** — rugosidad relativa (adimensional).
**Re** — número de Reynolds.
**f** — factor de fricción de Darcy (adimensional); es el `f` de `f·L/D`, no el factor de Fanning.
**hf / ΔP_f** — pérdida de carga distribuida, en head o en presión.
**K** — coeficiente de pérdida localizada de un accesorio (adimensional).
**L_eq** — longitud equivalente de un accesorio: `L_eq = K·D/f`.
**mca** — metro de columna de agua: `ΔP/9810`.
**bar(g) / bar(a)** — presión manométrica / absoluta.
**Ma** — número de Mach.
**Lira de dilatación** — tramo en U que absorbe la dilatación térmica de la línea.

## Alcance y límites
Cubre el dimensionamiento hidráulico de línea de vapor en régimen permanente, flujo adiabático e incompresible (Ma < 0,3), fluido newtoniano, sección circular constante — el procedimiento de 10 etapas de la hoja de origen, con las verificaciones que él no incluye.

No cubre, y necesita skill/software propio: análisis de flexibilidad y reacciones en boquillas (`flexibilidade-viga-balanco-guiada`, CAESAR II); espesor de pared y clases de presión (`asme-b31-3-codigo-normativo`, `materiais-tubulacao-refino-transporte-n76`); selección y dimensionamiento de purgadores (`purgadores-vapor-isolamento-tracing-pintura-catodica`); aislamiento térmico y trazado (`aquecimento-isolamento-pintura-tubulacao`); dimensionamiento de válvula de control por Cv (`valvulas-controle-fisher`); flujo bifásico y flash de condensado; análisis transitorio y golpe de ariete.

Las tablas de vapor, rugosidades, K y velocidades aquí son valores usuales de proyecto — **confirmar siempre contra la especificación del proyecto y la norma aplicable** antes de emitir documento. Para verificación de un caso completo, ver `examples/steam-8bar-2500kgh.es.md`.
