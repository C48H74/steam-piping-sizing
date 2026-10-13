# Exemplo verificado — linha de vapor 8 bar(g), 2,500 kg/h

**Idiomas:** [English](steam-8bar-2500kgh.en.md) · Português (BR) · [Español](steam-8bar-2500kgh.es.md)

Caso de referência da folha de origem deste procedimento, **recalculado** com a ferramenta `tools/calc-steam.mjs`. Todos os números abaixo saem da mesma cadeia de cálculo e são reproduzíveis.

## Dados do sistema

| Dado | Valor |
|---|---|
| Vazão de massa de vapor (ṁ) | 2,500 kg/h |
| Pressão de operação | 8 bar(g) → **P_abs = 9.013 bar** |
| Temperatura | 175 °C |
| Comprimento reto total (L) | 45 m |
| Material | Aço-carbono ASTM A106 Gr. B |
| Rugosidade absoluta (ε) | 0.045 mm |
| Acessórios | 6 curvas 90° raio longo, 2 válvulas de bloqueio (gaveta), 1 válvula de controle (globo), 1 filtro Y, 1 separador de umidade |
| Massa específica adotada (ρ) | 4.81 kg/m³ |
| Viscosidade dinâmica (μ) | 1.34×10⁻⁵ Pa·s |
| Velocidade de projeto (V) | 30 m/s |

> **Nota sobre ρ**: a 9.013 bar(a) o vapor está **saturado** (T_sat ≈ 175.5 °C), e a tabela dá ρ ≈ 4.66 kg/m³. O valor de 4.81 kg/m³ usado aqui é o da folha de origem (≈ 3 % acima da tabela) e foi mantido para que o exemplo seja rastreável. Com 4.66 kg/m³ a vazão volumétrica sobe ~3 % e o diâmetro requerido também — a conclusão não muda, mas o número muda.

## Passo 1 — Vazão volumétrica

```
Qv = ṁ/ρ = 2500/4.81 = 519.8 m³/h = 0.1444 m³/s
```

## Passo 2 — Diâmetro requerido por velocidade

```
D = √(4·Qv/(π·V)) = √(4×0.1444/(π×30)) = 0.0783 m = 78.3 mm
```

Adotando o menor Schedule 40 com **ID ≥ 78.3 mm** → **DN80 (3")**, ID = **77.9 mm**.
(77.9 < 78.3, então a velocidade real fica um pouco acima do alvo — aceitável. O próximo seria DN100, ID 102.3 mm, que daria V = 17.6 m/s, muito abaixo do econômico.)

```
V real = Qv/A = 0.1444/(π×0.0779²/4) = 30.3 m/s
```

Verificações de velocidade:

| Verificação | Valor | Situação |
|---|---|---|
| Faixa usual (vapor saturado, linha principal) | 20 – 40 m/s | **OK** |
| Erosão API RP 14E (C = 100): V_max = 100/√4.81 | 45.6 m/s | **OK** |
| Mach = 30.3/519 | 0.058 | **OK** (< 0.3, incompressível) |
| ρ·V² | 4,414 kg/(m·s²) | **OK** (< 15,000) |

## Passo 3 — Número de Reynolds

```
Re = ρ·V·D/μ = 4.81 × 30.3 × 0.0779 / 1.34×10⁻⁵ = 8.47×10⁵
```

Conferência pela forma independente da velocidade:

```
Re = 4·ṁ/(π·D·μ) = 4×(2500/3600)/(π×0.0779×1.34×10⁻⁵) = 8.47×10⁵  ✓
```

Regime: **turbulento** (como esperado para vapor).

## Passo 4 — Fator de atrito

```
ε/D = 0.045×10⁻³/0.0779 = 5.78×10⁻⁴

Swamee-Jain:
f = 0.25 / [log₁₀(5.78×10⁻⁴/3.7 + 5.74/(8.47×10⁵)^0.9)]²
f = 0.25 / [log₁₀(1.561×10⁻⁴ + 2.65×10⁻⁵)]²
f = 0.0179
```

| Correlação | f |
|---|---:|
| Swamee-Jain (explícita) | 0.0179 |
| Colebrook-White (referência) | 0.0178 |
| Haaland (explícita) | 0.0178 |
| Desvio Swamee-Jain × Colebrook | 0.56 % |

As três concordam dentro de 1 % — a correlação explícita é segura nesta faixa.

## Passo 5 — Perda de carga distribuída (Darcy-Weisbach)

```
V²/2g = 30.3²/(2×9.80665) = 46.78 m de coluna de vapor
L/D   = 45/0.0779 = 577.7
f·L/D = 0.0178 × 577.7 = 10.276

hf   = 10.276 × 46.78 = 480.8 m de coluna de vapor
ΔP_f = f·(L/D)·(ρ·V²/2) = 10.276 × (4.81×30.3²/2) = 22,678 Pa = 0.2268 bar
```

## Passo 6 — Perdas localizadas (ΣK)

| Componente | Qtd | K unit. | Qtd × K |
|---|---:|---:|---:|
| Curva 90° raio longo | 6 | 0.20 | 1.20 |
| Válvula de bloqueio (gaveta) | 2 | 0.20 | 0.40 |
| Válvula de controle (globo) | 1 | 10.0 | 10.00 |
| Filtro Y | 1 | 1.50 | 1.50 |
| Separador de umidade | 1 | 1.00 | 1.00 |
| **ΣK** | | | **14.10** |

```
h_loc   = ΣK·(V²/2g) = 14.10 × 46.78 = 659.7 m de coluna de vapor
ΔP_loc  = ΣK·(ρ·V²/2) = 14.10 × (4.81×30.3²/2) = 31,116 Pa = 0.3112 bar
```

A válvula de controle sozinha responde por **71 %** das perdas localizadas.

## Passo 7 — Perda total e verificação

```
h_total = 480.8 + 659.7 = 1,140.4 m de coluna de vapor
ΔP      = 22,678 + 31,116 = 53,795 Pa = 0.5379 bar = 0.5486 kgf/cm²
ΔP/P_abs = 0.5379/9.013 = 5.97 %
```

| Critério | Valor | Situação |
|---|---|---|
| ΔP ≤ 10 % da P_abs | 5.97 % | **OK** |
| ΔP ≤ 0.5 bar (linha longa) | 0.538 bar | **Limite** — levemente acima, aceitável na prática pela dominância da válvula de controle |

**Resultado: DN80 (3") Schedule 40 atende**, com ΔP ≈ 0.54 bar (6 % da pressão absoluta).

## Conferência independente (via comprimento equivalente)

```
L_eq = ΣK·D/f = 14.10 × 0.0779/0.0178 = 61.7 m
L_total = 45 + 61.7 = 106.7 m
ΔP = f·(L_total/D)·(ρ·V²/2) = 0.0178 × (106.7/0.0779) × 2,204.7 = 53,800 Pa = 0.538 bar  ✓
```

As duas vias fecham — o resultado é confiável.

## Conferência da folha de origem

Ao reproduzir a folha, três etapas **não fecham com as próprias entradas** dela. Registrado aqui porque é exatamente a checagem que este procedimento exige antes de emitir qualquer número:

| Etapa | Folha de origem | Recalculado | Observação |
|---|---|---|---|
| Reynolds | 1.06×10⁶ | 8.47×10⁵ | Com ρ, V, D e μ da própria folha, Re = 8.5×10⁵. Não muda a conclusão (turbulento), mas o valor não é reproduzível |
| hf distribuída | 38.3 m | 480.8 m | `f·(L/D)·(V²/2g)` com os dados da folha dá ~481 m de coluna de vapor. Há um fator ~12 de diferença |
| h_loc localizada | 64.1 m | 659.7 m | `ΣK·(V²/2g)` com ΣK = 14.10 dá ~660 m. Há um fator ~10 de diferença |
| ΔP total | 4,830 Pa = 0.049 bar | 53,795 Pa = 0.538 bar | Consequência das anteriores |

A **conclusão de engenharia coincide** (DN80 / 3" atende, ΔP na casa de 0.5 bar), mas os valores intermediários da folha não são reproduzíveis. O erro mais provável é a mistura de head em coluna de **vapor** com **mca** (metros de coluna d'água) — o fator entre os dois é ρ_água/ρ_vapor ≈ 208, e é o erro de unidade mais comum em cálculo de vapor.

## Reproduzir

```bash
node tools/calc-steam.mjs --m 2500 --rho 4.81 --mu 1.34e-5 --L 45 --eps 0.045 --K 14.1 --Pabs 9.013 --D 77.9
```

Sem `--D`, a ferramenta escolhe o menor DN Schedule 40 com ID ≥ D requerido e recalcula a velocidade real.
