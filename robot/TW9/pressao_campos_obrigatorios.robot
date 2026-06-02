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

*** Keywords ***
Dado que o usuário loga e acessa a tela de registro
    Open Browser    ${URL_LOGIN}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=10s
    Input Text    ${INPUT_EMAIL}    rhuan@gmail.com
    Input Password    ${INPUT_SENHA}    123456
    Click Element    ${BOTAO_LOGIN}
    Wait Until Location Does Not Contain    /login    timeout=10s
    Go To    ${URL_REGISTRO}
    Wait Until Element Is Visible    ${INPUT_SISTOLICO}    timeout=10s

Preencher Formulario De Pressao
    [Arguments]    ${sistolico}    ${diastolico}    ${dataHora}
    Preencher Campo Se Informado    ${INPUT_SISTOLICO}    ${sistolico}
    Preencher Campo Se Informado    ${INPUT_DIASTOLICO}    ${diastolico}
    Definir Data Hora Pressao    ${dataHora}

Preencher Campo Se Informado
    [Arguments]    ${locator}    ${valor}
    Clear Element Text    ${locator}
    Run Keyword If    '${valor}' != ''    Input Text    ${locator}    ${valor}

Definir Data Hora Pressao
    [Arguments]    ${dataHora}
    Execute Javascript    document.getElementById('dataHoraPressao').value = '${dataHora}';

Submeter Formulario De Pressao
    Click Element    ${BOTAO_REGISTRAR}

Então o navegador deve bloquear o campo alertando
    [Arguments]    ${id_campo}    ${mensagem_esperada}
    Wait Until Element Is Visible    css=#${id_campo}:invalid    timeout=5s
    ${mensagem_nativa}=    Execute Javascript    return document.getElementById('${id_campo}').validationMessage;
    Should Be Equal As Strings    ${mensagem_nativa}    ${mensagem_esperada}

Fechar Navegador
    Close Browser
