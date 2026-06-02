# Implementação - TW9 / CT35

## Caso de teste

CT35 - Impedir o registro de pressão arterial quando um campo obrigatório não é preenchido.

## Suite Robot

Arquivo no repositório:

`robot/TW9/pressao_campos_obrigatorios.robot`

```robot
*** Settings ***
Library           SeleniumLibrary

Test Setup        Dado que o usuário loga e acessa a tela de registro
Test Teardown     Fechar Navegador

*** Variables ***
${URL_LOGIN}              http://localhost:3000/login
${URL_REGISTRO}           http://localhost:3000/registrar
${BROWSER}                chrome

${INPUT_EMAIL}            id=email
${INPUT_SENHA}            id=senha
${BOTAO_LOGIN}            css=.btn-auth

${INPUT_SISTOLICO}        id=sistolico
${INPUT_DIASTOLICO}       id=diastolico
${INPUT_DATA_HORA}        id=dataHoraPressao
${BOTAO_REGISTRAR}        css=#formPressaoWrap .btn-registrar

*** Test Cases ***
CT01 - Deve bloquear pressão sem valor sistólico
    Preencher Formulario De Pressao    ${EMPTY}    80    2026-06-01T10:00
    Submeter Formulario De Pressao
    Então o navegador deve bloquear o campo alertando    sistolico    Preencha este campo.

CT02 - Deve bloquear pressão sem valor diastólico
    Preencher Formulario De Pressao    120    ${EMPTY}    2026-06-01T10:00
    Submeter Formulario De Pressao
    Então o navegador deve bloquear o campo alertando    diastolico    Preencha este campo.

CT03 - Deve bloquear pressão sem data e horário
    Preencher Formulario De Pressao    120    80    ${EMPTY}
    Submeter Formulario De Pressao
    Então o navegador deve bloquear o campo alertando    dataHoraPressao    Preencha este campo.
```

## Comando de execução

```bash
robot robot/TW9/pressao_campos_obrigatorios.robot
```
