---
name: "steam-piping-sizing"
description: "Dimensionar y verificar vapor monofásico con propiedades trazables, cualquier diámetro interior o catálogo de proyecto, Sch 40/80 DN6–DN600, Reynolds, fricción, velocidad y presupuesto de caída de presión. Excluye certificación mecánica y condensado bifásico."
---

# Dimensionamiento de Tuberías de Vapor

[English](SKILL.md) · [Português](SKILL.pt-BR.md) · [Español](SKILL.es.md)

Utilice para evaluación hidráulica preliminar de vapor monofásico. Confirme el estado operativo y los criterios de aceptación del proyecto antes de seleccionar el diámetro.

## Cómo usar

1. Obtenga caudal, presión absoluta, densidad, viscosidad dinámica, longitud, rugosidad, accesorios y presión mínima de salida. Registre la fuente de propiedades y el estado. No deduzca saturación de una temperatura redondeada ni utilice densidad de gas ideal.

2. Defina velocidad máxima y presupuesto de presión documentados. Los valores 30 m/s y 10% son elecciones preliminares configurables, no exigencias universales de norma. Confirme por separado el código mecánico (ASME B31.1/B31.3).

3. Utilice diámetro interior real: Sch 40/80, DN concreto, cualquier --D o catálogo con fuente. Restrinja el catálogo a tamaños aprobados para compra. Nunca limite silenciosamente al tubo más grande de la tabla.

4. Ejecute la calculadora: selección automática por velocidad Y todos los límites de presión. DN90 está incluido; con el caso histórico y máximo 30 m/s se elige antes de DN100. DN80 forzado incumple ese máximo.

5. No apruebe FAIL, NO_SIZE o PRELIMINARY como diseño final. Re entre 2300 y 4000 no tiene fricción aceptada. El flujo laminar es posible con pequeños caudales y utiliza 64/Re; el vapor no siempre es turbulento.

6. Indique velocidad del sonido de vapor real mediante --a, o --T/--k explícitos para una aproximación identificada. Sin temperatura ni viscosidad ocultas. Mach >=0,3 o caída >10% requiere modelo compresible/segmentado validado.

7. Use pérdidas de accesorios/válvulas del fabricante. --purg añade consumo adicional de VAPOR solamente; purga líquida y condensado húmedo requieren otro modelo. Recalcule K al cambiar diámetro/configuración.

8. Compruebe por separado material, espesor, clase, corrosión, flexibilidad, drenaje, purgadores, aislamiento y soportes. No se aplica el antiguo atajo API RP 14E con unidades SI incorrectas.

## Calculator

```bash
node tools/calc-vapor.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --eps 0.045 --K 14.1 --Pabs 9.013 --T 175 --lang es --all
node tools/calc-vapor.mjs --list-sizes
node tools/calc-vapor.mjs --help
```

Read [design basis and catalog schema](references/design-basis.md) before selecting criteria or using a custom catalog. Review the [worked example](examples/steam-8bar-2500kgh.es.md) to distinguish a historical bore from automatic selection.

## Visual references

[Workflow](assets/images/sizing-workflow.png) · [System](assets/images/industrial-steam-system.png). Conceptual images, not numerical input or construction drawings.

## Scope

El modelo utiliza densidad constante; no calcula propiedades, pérdida térmica, elevación, vapor húmedo, flash, bloqueo sónico, arranque, golpe de ariete, espesor ni conformidad mecánica. PASS hidráulico depende de propiedades y criterios. Para márgenes pequeños o cambios importantes de densidad utilice un modelo validado de vapor real.
