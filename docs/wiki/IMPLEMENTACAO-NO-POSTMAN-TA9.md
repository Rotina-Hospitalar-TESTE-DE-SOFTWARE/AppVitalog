# Implementação no Postman - TA9 / CT31

## Configuração padrão

Base URL: `http://localhost:3000/api/v1`

## Login

POST `{{baseUrl}}/auth/login`

Body:

```json
{
  "email": "rhuan@gmail.com",
  "senha": "123456"
}
```

Tests:

```javascript
pm.test("Status code deve ser 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Login deve retornar success true", function () {
  const response = pm.response.json();
  pm.expect(response.success).to.eql(true);
});
```

## CT01 - Registro válido

POST `{{baseUrl}}/medicoes/glicemia`

Body:

```json
{
  "valor": 90,
  "dataHora": "2026-06-01T10:00"
}
```

Tests:

```javascript
pm.test("Status code deve ser 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Campo success deve ser true", function () {
  const response = pm.response.json();
  pm.expect(response.success).to.eql(true);
});

pm.test("Glicemia registrada corretamente", function () {
  const response = pm.response.json();
  pm.expect(response.data.tipo).to.eql("glicemia");
  pm.expect(response.data.valor).to.eql(90);
  pm.expect(response.data.unidade).to.eql("mg/dL");
  pm.expect(response.data.dataHora).to.eql("2026-06-01T10:00");
});
```

## CT02 - Valor obrigatório vazio

POST `{{baseUrl}}/medicoes/glicemia`

Body:

```json
{
  "valor": "",
  "dataHora": "2026-06-01T10:00"
}
```

Tests:

```javascript
pm.test("Status code deve ser 400", function () {
  pm.response.to.have.status(400);
});

pm.test("Campo success deve ser false", function () {
  const response = pm.response.json();
  pm.expect(response.success).to.eql(false);
});

pm.test("Retorna mensagem de valor obrigatório", function () {
  const response = pm.response.json();
  pm.expect(response.errors).to.include("Valor da glicemia é obrigatório.");
});
```

## CT03 - Data e horário obrigatórios vazios

POST `{{baseUrl}}/medicoes/glicemia`

Body:

```json
{
  "valor": 90,
  "dataHora": ""
}
```

Tests:

```javascript
pm.test("Status code deve ser 400", function () {
  pm.response.to.have.status(400);
});

pm.test("Retorna mensagem de data e horário obrigatórios", function () {
  const response = pm.response.json();
  pm.expect(response.errors).to.include("Data e horário são obrigatórios.");
});
```
