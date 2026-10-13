---
name: "steam-piping-sizing"
description: "Dimensionamento e verificação de tubulação de vapor: vazão mássica e volumétrica, escolha de diâmetro por velocidade recomendada (20–40 m/s saturado, 35–60 m/s superaquecido), número de Reynolds, fator de atrito por Swamee-Jain/Colebrook/Haaland, perda de carga distribuída de Darcy-Weisbach, perdas localizadas por coeficientes K (curvas, válvulas, filtros, separadores), queda de pressão total e critério de ΔP admissível, além das boas práticas construtivas (drenos de condensado, purgadores, separador de umidade, lira de dilatação, isolamento, tomada de ramal). Usar ao dimensionar ou revisar linha de vapor/condensado, escolher o diâmetro de uma linha de vapor, checar velocidade do vapor, calcular perda de carga com acessórios ou verificar se a pressão disponível chega ao processo."
---

# Dimensionamento de Tubulação de Vapor

**Idiomas:** [English](SKILL.md) · Português (BR) · [Español](SKILL.es.md)

**Fonte**: folha de cálculo "Tubulação de Vapor" fornecida pelo usuário — procedimento de 10 etapas (dados do sistema → propriedades do vapor → vazão volumétrica → diâmetro por velocidade → Reynolds → fator de atrito de Swamee-Jain → perda distribuída de Darcy-Weisbach → coeficientes K → perda total e ΔP → boas práticas), complementada com prática de projeto e verificações cruzadas de engenharia. **Gerado**: 2026-10-13.

**Ferramenta**: `tools/calc-steam.mjs` (Node, sem dependências) executa a cadeia inteira e mostra cada etapa.

## Como usar
- "Que diâmetro usar para essa vazão de vapor" → framework 1.
- "Qual a massa específica / a vazão volumétrica" → framework 2.
- "Qual o fator de atrito / a perda de carga" → frameworks 3 e 4.
- "A pressão chega no processo / a linha está bem dimensionada" → framework 5.
- "O que não pode faltar na linha" → framework 7.
- Erros que produzem resultado errado sem avisar → seção **Anti-padrões**.

## Frameworks centrais

1. **A linha de vapor se dimensiona pela velocidade e se VERIFICA pela perda de carga — as duas checagens são obrigatórias. Para no cálculo do diâmetro é o erro mais comum.**
   - `Qv = ṁ/ρ` (vazão volumétrica) → `D = √(4·Qv/(π·V))` com V arbitrado dentro da faixa recomendada.
   - O diâmetro calculado é **interno**. Nunca adotar pelo diâmetro nominal: DN80 (3") Schedule 40 tem ID = 77.9 mm, não 80 mm. A tabela de schedule é quem manda — usar `references/tables.pt-BR.md`.
   - Escolher o **menor DN cujo ID seja ≥ D calculado** (o ID imediatamente acima). Recalcular a velocidade real `V = Qv/A` com o ID adotado — ela **não** é igual à velocidade de projeto, e é ela que entra em todas as etapas seguintes.
   - Velocidades usuais (confirmar com a especificação do projeto — variam por cliente/norma):

     | Serviço | Faixa usual (m/s) |
     |---|---|
     | Vapor saturado — linha principal | 20 – 40 |
     | Vapor saturado — ramal / entrada de equipamento | 15 – 25 |
     | Vapor superaquecido — linha principal | 35 – 60 (até 75) |
     | Vapor de exaustão de turbina / baixa pressão | 40 – 75 |
     | Condensado (líquido) | 0.5 – 2 |
     | Água / outros líquidos | 1 – 3 |

   - Verificação de erosão (API RP 14E): `V_max = C/√ρ`, com C = 100 para serviço contínuo e 125 para intermitente. Para vapor a 9 bar abs (ρ ≈ 4.7 kg/m³) → V_max ≈ 46 m/s.
   - Verificação de compressibilidade: `Ma = V/a < 0.3` (a ≈ 480–520 m/s para vapor na faixa de 150–200 °C). Acima disso o escoamento é compressível e Darcy-Weisbach perde validade.
   - Critério de queda de pressão: `ΔP ≤ 10 %` da pressão **absoluta** de operação é o limite usual; na prática usa-se `ΔP ≤ 0.5 bar` para linha longa e `ΔP ≤ 0.1–0.2 bar` para linha curta de alimentação de equipamento. Vapor para turbina é muito mais restritivo — o limite vem do fabricante.

2. **A massa específica é a variável mais frágil do cálculo: vapor é compressível e ρ depende de P e T simultaneamente. Errar ρ erra o diâmetro na raiz e a perda de carga inteira.**
   - Tirar ρ de **tabela de vapor**, nunca de gás ideal (a 9 bar abs o gás ideal erra ~7 %; a pressões altas o erro explode). Tabela de vapor saturado em `references/tables.pt-BR.md`.
   - **Vapor saturado**: ρ é função só da pressão (a temperatura é a de saturação). **Vapor superaquecido**: ρ depende de P e T.
   - Consequência prática de confusão comum: a 8 bar(g) a temperatura de saturação é ≈ 175.5 °C. Se o dado de projeto diz "175 °C", o vapor é **saturado**, não superaquecido — chamar de superaquecido não muda o cálculo, mas muda a interpretação (não há grau de superaquecimento para trocar calor).
   - `bar(g)` é pressão **manométrica**. As tabelas e o critério de ΔP% usam pressão **absoluta**: `P_abs = P_man + 1.013` (ou +0.981 se a referência for 1 kgf/cm²).
   - Título/umidade: vapor com x < 1 carrega gotas — a massa específica efetiva sobe, a velocidade do líquido é muito menor e a erosão nos acessórios aumenta. Vapor de caldeira típico sai com 1–3 % de umidade.
   - Em linha longa ou de baixa pressão, a pressão cai ao longo do trecho e ρ cai junto. Para linha longa, dividir em trechos e **recalcular ρ** a cada trecho; usar ρ da pressão média é aceitável só como primeira estimativa.
   - A vazão mássica considerada deve incluir as **derivações de purga**, o aquecimento de traço de vapor e o consumo do equipamento — não só a vazão nominal do processo.

3. **Reynolds e fator de atrito são calculados com o diâmetro INTERNO real e com a rugosidade do material da tubulação — não com valores genéricos.**
   - `Re = ρ·V·D/μ = V·D/ν = 4·ṁ/(π·D·μ)`. A última forma é a mais útil: **independe da velocidade**, então serve para conferir Re direto das entradas e detectar erro de propagação.
   - Regime: laminar `Re < 2000`; transição `2000–4000`; turbulento `Re > 4000`. Linha de vapor está **sempre** em regime turbulento (Re ∼ 10⁵–10⁶) — se der laminar, o dado de entrada está errado.
   - Fator de atrito de Darcy `f` (o mesmo que multiplica `L/D`):
     - **Swamee-Jain** (explícita, a usada na folha de origem — válida para `5×10³ < Re < 10⁸` e `10⁻⁶ < ε/D < 10⁻²`): `f = 0.25 / [log₁₀(ε/(3.7·D) + 5.74/Re^0.9)]²`
     - **Colebrook-White** (implícita, é a referência; resolver por iteração): `1/√f = −2·log₁₀(ε/(3.7·D) + 2.51/(Re·√f))`
     - **Haaland** (explícita, ótima estimativa inicial): `1/√f = −1.8·log₁₀[(ε/(3.7·D))^1.11 + 6.9/Re]`
     - Swamee-Jain erra tipicamente < 1 % contra Colebrook na faixa de vapor — usar as três e comparar é uma conferência barata.
   - Rugosidade absoluta `ε` típica (usar a do material **na condição de operação**, não do tubo novo, quando a linha tem histórico de incrustação):

     | Material / condição | ε (mm) |
     |---|---|
     | Aço-carbono novo, sem costura (ASTM A106) | 0.045 |
     | Aço-carbono comercial | 0.046 |
     | Aço-carbono incrustado / com incrustação | 0.15 – 0.5 |
     | Aço galvanizado | 0.15 |
     | Ferro fundido | 0.26 |
     | Aço inoxidável | 0.015 |
     | Cobre / latão | 0.0015 |
     | PVC / plásticos | 0.0015 – 0.007 |
     | Concreto | 0.3 – 3 |

   - `ε/D` é adimensional e usa D na mesma unidade de ε. Unidade trocada aqui (mm com m) é erro de fator 1000 que passa despercebido.

4. **Perda de carga = distribuída (Darcy-Weisbach) + localizada (ΣK). Em vapor, as perdas localizadas costumam DOMINAR — a válvula de controle sozinha pode ser metade do total.**
   - Distribuída: `hf = f·(L/D)·(V²/2g)` em metros de coluna do fluido, ou direto em pressão: `ΔP_f = f·(L/D)·(ρ·V²/2)`.
   - Localizada: `h_loc = ΣK·(V²/2g)`; `ΔP_loc = ΣK·(ρ·V²/2)`.
   - `ρ·V²/2` é a pressão dinâmica — calcular uma vez e reutilizar nas duas parcelas.
   - Compressão para a forma de comprimento equivalente (ponte com a tabela de acessórios): `L_eq = K·D/f`.
   - Coeficientes K típicos (valores de projeto usuais; confirmar com Crane TP-410 ou a norma do projeto — K varia com o diâmetro e com Re):

     | Componente | K |
     |---|---|
     | Cotovelo 90° raio longo | 0.20 |
     | Cotovelo 45° | 0.20 |
     | Cotovelo 90° raio curto | 0.90 |
     | Tê — fluxo direto | 0.40 |
     | Tê — fluxo desviado | 1.00 |
     | Válvula gaveta aberta | 0.20 |
     | Válvula globo aberta | 10.0 |
     | Válvula de retenção (portinhola) | 2.0 – 2.5 |
     | Válvula de controle tipo globo | 10.0 (ou o Cv da válvula) |
     | Filtro Y limpo | 1.5 – 2.5 |
     | Separador de umidade | 1.0 – 2.0 |
     | Entrada de tubulação / saída | 0.5 / 1.0 |

   - **Exceção importante**: para válvula de controle, não usar K genérico — a perda depende da abertura e da vazão. Dimensionar com a equação da válvula (Cv) e a queda de pressão de projeto (skill `valvulas-controle-fisher`). Um K = 10 é só ordem de grandeza para pré-dimensionamento.
   - Total: `ΔP_total = ΔP_f + ΔP_loc`; comparar com o admissível do framework 1. Se reprovar: subir um DN e repetir a cadeia inteira (V, Re, f e K mudam todos).

5. **"mca" é metro de coluna d'ÁGUA — e o head calculado em coluna de VAPOR não é a mesma coisa. Somar ou comparar os dois é o erro de unidade que mais contamina cálculo de vapor.**
   - `h` (coluna do fluido) `= ΔP/(ρ_fluido·g)` — para vapor dá números grandes (centenas de metros) porque ρ é pequeno. Isso é head de vapor, não mca.
   - `mca = ΔP/(ρ_água·g) = ΔP/9810`. A conversão entre os dois é o fator `ρ_água/ρ_vapor ≈ 208` para vapor a 9 bar abs.
   - Para vapor, trabalhar **direto em pressão (Pa, bar, kgf/cm²)** e reservar "mca" para as linhas de líquido. Apresentar head de vapor só quando o requisito do projeto pedir explicitamente.
   - Conferência de consistência obrigatória: `ΔP = ρ·g·h` tem de fechar com o ρ usado. Se `ΔP` fecha com um ρ e o `h` foi calculado com outro, o resultado parece plausível e está errado.

6. **Conferência de ordem de grandeza antes de entregar o número.**
   - Para vapor saturado a 8–10 bar, linha de 3" com 2,500 kg/h: V ≈ 30 m/s e ΔP ≈ 0.5 bar em ~45 m com acessórios pesados. Resultados uma ordem de grandeza abaixo disso quase sempre vêm de erro aritmético, não de um projeto excepcionalmente bom.
   - Estimativa independente rápida de ΔP pela via do comprimento equivalente: `L_total = L_reto + Σ(K·D/f)` e depois `ΔP = f·(L_total/D)·(ρ·V²/2)`. Se as duas vias discordarem mais de ~10 %, há erro de aritmética.
   - Re calculado por `4·ṁ/(π·D·μ)` deve bater com `ρ·V·D/μ`. Divergência = inconsistência entre ρ, V e D.
   - Checagem de plausibilidade da queda de pressão: `ΔP/P_abs` em %.

7. **O que faz a linha de vapor funcionar na prática (não aparece no cálculo e é o que mais falha em campo).**
   - **Drenos de condensado** nos pontos baixos, no início e no fim da linha, antes de cada válvula de bloqueio e a cada 30–50 m de linha horizontal. Vapor sem dreno dá golpe de aríete na partida.
   - **Inclinação** de 1:100 a 1:250 no sentido do fluxo (ou contra, conforme o projeto), sempre para o ponto de dreno.
   - **Purgadores de vapor** nos drenos e nos pontos de retenção (skill `purgadores-vapor-isolamento-tracing-pintura-catodica`).
   - **Separador de umidade** a montante de turbina, medidor, válvula de controle e trocador — não é acessório opcional, é proteção.
   - **Filtro Y** a montante de válvula de controle e de medidor, com malha compatível.
   - **Tomada de ramal sempre por cima** da linha principal (nunca por baixo ou pelo lado), para não arrastar condensado para o ramal.
   - **Lira de dilatação / flexibilidade**: vapor é a linha mais quente da planta, a dilatação térmica define o traçado (skill `flexibilidade-viga-balanco-guiada`).
   - **Isolamento térmico** dimensionado por temperatura e por perda admissível (skill `aquecimento-isolamento-pintura-tubulacao`).
   - **Material**: ASTM A106 Gr. B é o padrão para vapor; verificar espessura pela fórmula ASME B31 (skill `asme-b31-3-codigo-normativo`).
   - **Purga e partida**: a vazão de aquecimento inicial pode ser várias vezes a nominal, com muito condensado — a linha precisa drenar isso sem golpe.

## Cheatsheet de decisão
| Situação | Ação |
|---|---|
| Linha de vapor nova, vazão conhecida | Arbitrar V na faixa do serviço → D por velocidade → DN por ID de Schedule 40 → recalcular V real |
| V = 30 m/s deu exatamente o ID de um DN | Adotar o DN acima; a velocidade real fica ligeiramente maior que o alvo |
| D calculado entre dois DN comerciais | Sempre o maior (ID ≥ D calculado); nunca arredondar para baixo |
| Precisa do ρ do vapor | Tabela de vapor. Se só tem P manométrica, somar 1.013 (ou 0.981) antes de entrar na tabela |
| T informada = T de saturação da P | Vapor saturado. Não tratar como superaquecido |
| Re deu < 4000 | Dado de entrada errado — conferir μ, ρ e D (vapor sempre é turbulento) |
| f entre Swamee-Jain e Colebrook difere > 2 % | Conferir ε/D e Re; fora da faixa de validade da correlação explícita |
| Perda localizada > perda distribuída | Normal em vapor, principalmente com válvula de controle ou globo na linha |
| Válvula de controle na linha | Não usar K genérico: dimensionar por Cv (skill `valvulas-controle-fisher`) |
| ΔP > 10 % da P_abs | Subir um DN e refazer a cadeia inteira |
| Resultado em "mca" para vapor | Suspeitar: head de vapor ≠ mca. Converter com ρ_água, ou trabalhar em bar |
| Resultado de ΔP muito abaixo do esperado | Conferir se as perdas localizadas entraram e se a pressão dinâmica usou o ρ correto |
| Linha longa (> 100 m) ou baixa pressão | Dividir em trechos e recalcular ρ com a pressão de cada trecho |
| V acima de 100/√ρ | Reprova por erosão — subir DN |
| Ma > 0.3 | Escoamento compressível — Darcy-Weisbach não se aplica direto |
| Linha com histórico de incrustação | Usar ε de 0.15–0.5 mm, não 0.045 mm |

## Anti-padrões
- **Parar no diâmetro.** Calcular D pela velocidade e entregar como resposta, sem verificar ΔP. A velocidade só garante que a linha não erode; não garante que a pressão chega.
- **Usar o diâmetro nominal como diâmetro interno.** 3" tem ID 77.9 mm. O erro de 3 % no D vira ~6 % na velocidade e ~13 % na perda de carga.
- **Trocar o DN e não recalcular V, Re e f.** Toda a cadeia é acoplada: mudar D muda V, Re, f e K ao mesmo tempo.
- **Usar ρ de gás ideal.** A 9 bar abs o erro é da ordem de 7 % e cresce com a pressão.
- **Esquecer as perdas localizadas**, ou considerá-las "pequenas" por analogia com linhas de líquido. Em vapor com válvula de controle, elas são a maior parcela.
- **Somar head de vapor com mca.** São fluidos de referência diferentes; o fator entre eles é ≈ 208.
- **Confundir bar(g) e bar(a).** A tabela de vapor e o critério de ΔP% usam pressão absoluta.
- **Adotar f = 0.02 fixo** para tudo. Serve como estimativa de ordem de grandeza; contra Colebrook chega a errar 10–15 %, e o erro se propaga para ΔP.
- **Somar Re e h com valores de D diferentes** (um com o nominal, outro com o interno) — é o erro de propagação mais difícil de enxergar, porque cada número isolado parece razoável.
- **Não checar erosão nem Mach.** Em linha de baixa pressão (ρ pequeno) a velocidade sobe rápido e ρ·V² é o que limita.
- **Ignorar o condensado.** Sem dreno, inclinação e purgador, a linha calculada corretamente falha na partida.

## Glossário
**ṁ** — vazão de massa (kg/h ou kg/s).
**Qv** — vazão volumétrica na condição de operação (m³/h ou m³/s); `Qv = ṁ/ρ`.
**ρ** — massa específica do vapor na condição de operação (kg/m³).
**D** — diâmetro **interno** da tubulação (m); em tabela normalmente em mm.
**ε** — rugosidade absoluta da parede (mm ou m).
**ε/D** — rugosidade relativa (adimensional).
**Re** — número de Reynolds.
**f** — fator de atrito de Darcy (adimensional); é o `f` de `f·L/D`, não o fator de Fanning.
**hf / ΔP_f** — perda de carga distribuída, em head ou em pressão.
**K** — coeficiente de perda localizada de um acessório (adimensional).
**L_eq** — comprimento equivalente de um acessório: `L_eq = K·D/f`.
**mca** — metro de coluna d'água: `ΔP/9810`.
**bar(g) / bar(a)** — pressão manométrica / absoluta.
**Ma** — número de Mach.
**Lira de dilatação** — trecho em U que absorve a dilatação térmica da linha.

## Âmbito e limites
Cobre o dimensionamento hidráulico de linha de vapor em regime permanente, escoamento adiabático e incompressível (Ma < 0.3), fluido newtoniano, seção circular constante — o procedimento de 10 etapas da folha de origem, com as verificações que ele não inclui.

Não cobre, e precisa de skill/software próprio: análise de flexibilidade e reações em bocais (`flexibilidade-viga-balanco-guiada`, CAESAR II); espessura de parede e classes de pressão (`asme-b31-3-codigo-normativo`, `materiais-tubulacao-refino-transporte-n76`); seleção e dimensionamento de purgadores (`purgadores-vapor-isolamento-tracing-pintura-catodica`); isolamento térmico e traçamento (`aquecimento-isolamento-pintura-tubulacao`); dimensionamento de válvula de controle por Cv (`valvulas-controle-fisher`); escoamento bifásico e flash de condensado; análise transiente e golpe de aríete.

As tabelas de vapor, rugosidades, K e velocidades aqui são valores usuais de projeto — **confirmar sempre contra a especificação do projeto e a norma aplicável** antes de emitir documento. Para verificação de um caso completo, ver `examples/steam-8bar-2500kgh.pt-BR.md`.
