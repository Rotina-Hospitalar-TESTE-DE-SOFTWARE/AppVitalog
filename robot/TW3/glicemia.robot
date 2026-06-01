*** Settings ***
Library           SeleniumLibrary

Test Setup    Dado que o usuário acessa o sistema e realiza login
Test Teardown     E fecha o navegador

*** Variables ***
${URL_LOGIN}              http://localhost:3000/login
${URL_REGISTRO}           http://localhost:3000/registrar
${BROWSER}                chrome

${INPUT_EMAIL}            id=email
${INPUT_SENHA}            id=senha
${BOTAO_LOGIN}            css=.btn-auth

# Elementos do Registro
${BOTAO_TIPO_GLICEMIA}    id=btnGlicemia
${INPUT_VALOR}            id=valor
${INPUT_DATA_HORA}        id=dataHoraGlicemia
${BOTAO_REGISTRAR}        css=#formGlicemiaWrap .btn-registrar

${MENSAGEM_SUCESSO}       css=.alerta-sucesso
${MENSAGEM_ERRO}          css=.alerta-erro

*** Test Cases ***
CT01 - Deve registrar glicemia com valor válido
    Dado que o usuário seleciona o tipo glicemia
    E informa o valor da glicemia    95
    E informa a data e hora    2026-06-01T10:00
    Quando solicitar o registro da glicemia
    Então o sistema deve apresentar a mensagem de sucesso    Glicemia registrada com sucesso

CT02 - Deve validar glicemia inferior ao limite mínimo
    Dado que o usuário seleciona o tipo glicemia
    E informa o valor da glicemia    10
    E informa a data e hora    2026-06-01T10:00
    Quando solicitar o registro da glicemia
    Então o navegador deve bloquear o campo alertando    O valor deve ser maior ou igual a 20.

CT03 - Deve validar glicemia superior ao limite máximo
    Dado que o usuário seleciona o tipo glicemia
    E informa o valor da glicemia    700
    E informa a data e hora    2026-06-01T10:00
    Quando solicitar o registro da glicemia
    Então o navegador deve bloquear o campo alertando    O valor deve ser menor ou igual a 600.

*** Keywords ***
Dado que o usuário acessa o sistema e realiza login
    Open Browser    ${URL_LOGIN}    ${BROWSER}
    Maximize Browser Window
    
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=10s
    Input Text    ${INPUT_EMAIL}    rhuan@gmail.com
    Input Password    ${INPUT_SENHA}    123456
    Click Element    ${BOTAO_LOGIN}
    
    Wait Until Location Does Not Contain    /auth/login    timeout=10s
    
    Go To    ${URL_REGISTRO}

Dado que o usuário seleciona o tipo glicemia
    Wait Until Element Is Visible    ${BOTAO_TIPO_GLICEMIA}    timeout=10s
    Click Element    ${BOTAO_TIPO_GLICEMIA}

E informa o valor da glicemia
    [Arguments]    ${valor}
    Wait Until Element Is Visible    ${INPUT_VALOR}    timeout=10s
    Input Text    ${INPUT_VALOR}    ${valor}

E informa a data e hora
    [Arguments]    ${dataHora}
    Input Text    ${INPUT_DATA_HORA}    ${dataHora}

Quando solicitar o registro da glicemia
    Click Element    ${BOTAO_REGISTRAR}

Então o sistema deve apresentar a mensagem de sucesso
    [Arguments]    ${texto_esperado}
    Wait Until Element Is Visible    ${MENSAGEM_SUCESSO}    timeout=10s
    Element Should Contain    ${MENSAGEM_SUCESSO}    ${texto_esperado}

Então o sistema deve apresentar a mensagem de erro
    [Arguments]    ${texto_esperado}
    Wait Until Element Is Visible    ${MENSAGEM_ERRO}    timeout=10s
    Element Should Contain    ${MENSAGEM_ERRO}    ${texto_esperado}

Então o navegador deve bloquear o campo alertando
    [Arguments]    ${mensagem_esperada}
    Wait Until Element Is Visible    css=#valor:invalid    timeout=5s
    
    ${mensagem_nativa}=    Execute Javascript    return document.getElementById('valor').validationMessage;
    
        Should Be Equal As Strings    ${mensagem_nativa}    ${mensagem_esperada}

E fecha o navegador
    Close Browser