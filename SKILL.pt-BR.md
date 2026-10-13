---
name: "steam-piping-sizing"
description: "Dimensionar e verificar linhas de vapor monofásico com propriedades rastreáveis, qualquer diâmetro interno ou catálogo de projeto, Sch 40/80 DN6–DN600, Reynolds, atrito, velocidade e orçamento de perda de pressão. Exclui certificação mecânica e condensado bifásico."
---

# Dimensionamento de Tubulações de Vapor

[English](SKILL.md) · [Português](SKILL.pt-BR.md) · [Español](SKILL.es.md)

Use para avaliação hidráulica preliminar de vapor monofásico. Confirme o estado operacional e os critérios de aceitação do projeto antes de escolher o diâmetro.

## Como usar

1. Obtenha vazão, pressão absoluta, massa específica, viscosidade dinâmica, comprimento, rugosidade, acessórios e pressão mínima de saída. Registre a fonte das propriedades e o estado de operação. Não deduza saturação de temperatura arredondada nem use massa específica de gás ideal.

2. Defina velocidade máxima e orçamento de pressão documentados. Os padrões 30 m/s e 10% são escolhas preliminares configuráveis, não exigências universais de norma. Confirme separadamente o código mecânico aplicável (ASME B31.1/B31.3).

3. Use diâmetro interno real: Sch 40/80, DN específico, qualquer --D ou catálogo com fonte. Restrinja o catálogo aos tamanhos aprovados para compra. Nunca limite silenciosamente ao maior tubo da tabela.

4. Execute a calculadora: a seleção automática verifica velocidade E todos os limites de pressão. DN90 está incluído; no caso histórico com máximo de 30 m/s é escolhido antes de DN100. DN80 informado manualmente reprova esse máximo.

5. Não aprove FAIL, NO_SIZE ou PRELIMINARY como projeto final. Re entre 2300 e 4000 não tem resultado de atrito aceito. Escoamento laminar pode ocorrer em vazões pequenas e usa 64/Re; vapor não é sempre turbulento.

6. Informe velocidade do som de vapor real por --a, ou --T/--k explícitos para uma aproximação identificada. Não há temperatura ou viscosidade ocultas. Mach >=0,3 ou queda >10% exige modelo compressível/segmentado validado.

7. Use perdas de acessórios/válvulas do fabricante. --purg soma apenas consumo adicional de VAPOR; purga líquida e condensado úmido exigem outro modelo. Recalcule K quando mudar o diâmetro ou a configuração.

8. Verifique separadamente material, espessura, classe, corrosão, flexibilidade, drenagem, purgadores, isolamento e suportes. Não se aplica o antigo atalho de erosão API RP 14E com unidades SI incorretas.

## Calculator

```bash
node tools/calc-vapor.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --eps 0.045 --K 14.1 --Pabs 9.013 --T 175 --lang pt --all
node tools/calc-vapor.mjs --list-sizes
node tools/calc-vapor.mjs --help
```

Read [design basis and catalog schema](references/design-basis.md) before selecting criteria or using a custom catalog. Review the [worked example](examples/steam-8bar-2500kgh.pt-BR.md) to distinguish a historical bore from automatic selection.

## Visual references

[Workflow](assets/images/sizing-workflow.png) · [System](assets/images/industrial-steam-system.png). Conceptual images, not numerical input or construction drawings.

## Scope

O modelo usa densidade constante e não calcula propriedades, perda térmica, elevação, vapor úmido, flash, bloqueio sônico, partida, golpe de aríete, espessura ou conformidade mecânica. PASS hidráulico depende das propriedades e critérios informados. Margens pequenas ou variação significativa de densidade exigem modelo de vapor real validado.
