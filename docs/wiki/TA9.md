# Documentação da API - TA9 / CT31

## Caso de teste

CT31 - Impedir registro de glicemia quando um campo obrigatório não é preenchido.

## Endpoint

POST `http://localhost:3000/api/v1/medicoes/glicemia`

## Descrição

Valida se a API impede o registro de glicemia quando o valor da glicemia ou a data/hora não são informados.

## Autenticação

Necessária. O usuário deve estar autenticado antes de chamar o endpoint.

Endpoint de login:

POST `http://localhost:3000/api/v1/auth/login`

Body:

```json
{
  "email": "rhuan@gmail.com",
  "senha": "123456"
}
```

## Requisição válida

Headers:

| Key | Value |
|---|---|
| Content-Type | application/json |

Body:

```json
{
  "valor": 90,
  "dataHora": "2026-06-01T10:00"
}
```

Resposta esperada:

Status `201 Created`

```json
{
  "success": true,
  "data": {
    "tipo": "glicemia",
    "valor": 90,
    "unidade": "mg/dL",
    "dataHora": "2026-06-01T10:00"
  }
}
```

## Requisição inválida - valor obrigatório vazio

Body:

```json
{
  "valor": "",
  "dataHora": "2026-06-01T10:00"
}
```

Resposta esperada:

Status `400 Bad Request`

```json
{
  "success": false,
  "errors": [
    "Valor da glicemia é obrigatório."
  ]
}
```

## Requisição inválida - data/hora obrigatória vazia

Body:

```json
{
  "valor": 90,
  "dataHora": ""
}
```

Resposta esperada:

Status `400 Bad Request`

```json
{
  "success": false,
  "errors": [
    "Data e horário são obrigatórios."
  ]
}
```
