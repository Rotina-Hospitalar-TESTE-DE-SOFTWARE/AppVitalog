# Relatório de Execução de Testes - TA9 / CT31

## Endpoint testado

POST `http://localhost:3000/api/v1/medicoes/glicemia`

## Ambiente

| Item | Valor |
|---|---|
| Ferramenta | Postman / curl |
| Ambiente | Localhost |
| Base URL | `http://localhost:3000/api/v1` |
| Data de execução | 02/06/2026 |

## Casos executados

| Caso | Entrada | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|
| CT01 | Valor 90 e data/hora preenchida | `201 Created` | `201 Created` | Aprovado |
| CT02 | Valor vazio e data/hora preenchida | `400 Bad Request` | `400 Bad Request` | Aprovado |
| CT03 | Valor preenchido e data/hora vazia | `400 Bad Request` | `400 Bad Request` | Aprovado |

## Evidência - valor obrigatório vazio

```json
{
  "success": false,
  "errors": [
    "Valor da glicemia é obrigatório."
  ]
}
```

## Evidência - data/hora obrigatória vazia

```json
{
  "success": false,
  "errors": [
    "Data e horário são obrigatórios."
  ]
}
```

## Resumo

| Total de testes | Aprovados | Reprovados |
|---|---|---|
| 3 | 3 | 0 |
