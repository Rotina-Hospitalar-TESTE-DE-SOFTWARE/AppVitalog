# Relatório de Execução de Testes - TA10 / CT32

## Caso de teste

CT32 - Impedir a geração da planilha quando não existem medições no período.

## Resultado da análise

O caso não possui endpoint REST no projeto atual. A exportação de Excel está disponível apenas na rota web `POST /exportar/excel`.

## Ambiente

| Item | Valor |
|---|---|
| Ferramenta | Análise de rotas / Postman web |
| Ambiente | Localhost |
| Data de análise | 02/06/2026 |

## Evidência técnica

Rotas REST existentes:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/users/me
GET  /api/v1/historico
GET  /api/v1/medicoes/pressao
POST /api/v1/medicoes/pressao
GET  /api/v1/medicoes/glicemia
POST /api/v1/medicoes/glicemia
```

Rota web existente:

```text
POST /exportar/excel
```

## Resultado

| Caso | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|
| CT32 | API impede geração sem dados | Não há endpoint REST para executar o teste | Bloqueado |

## Observação

O comportamento esperado existe no controller web: quando não há medições no período, o sistema redireciona para `/exportar` com a mensagem `Nenhuma medição encontrada para o período selecionado.`
