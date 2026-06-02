# Implementação no Postman - TA10 / CT32

## Situação da API

Não existe endpoint REST para exportação de planilha no projeto atual. Portanto, este caso não pode ser executado como teste de API REST sem alteração de rota.

## Alternativa executável via Postman

É possível chamar a rota web autenticada:

POST `http://localhost:3000/exportar/excel`

Essa rota usa sessão web e `Content-Type: application/x-www-form-urlencoded`.

## Login web prévio

POST `http://localhost:3000/login`

Body form-data ou x-www-form-urlencoded:

```text
email=rhuan@gmail.com
senha=123456
```

## CT01 - Período sem medições

POST `http://localhost:3000/exportar/excel`

Body x-www-form-urlencoded:

```text
periodo=7
```

Comportamento esperado:

```text
302 Found
Location: /exportar
```

Após o redirecionamento, a tela deve exibir:

```text
Nenhuma medição encontrada para o período selecionado.
```

## Tests sugeridos

```javascript
pm.test("Não deve retornar arquivo XLSX quando não há medições", function () {
  pm.expect(pm.response.code).to.be.oneOf([302, 200]);
  pm.expect(pm.response.headers.get("Content-Type") || "")
    .to.not.include("spreadsheetml.sheet");
});
```

## Recomendação

Para transformar este caso em teste de API puro, criar uma rota autenticada como:

GET `/api/v1/exportar/excel?periodo=7`

Essa rota deve retornar `404` ou `400` com JSON quando não houver dados, em vez de redirecionar para uma tela web.
