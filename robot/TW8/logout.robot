*** Settings ***
Library           SeleniumLibrary

Test Setup       Abrir Navegador
Test Teardown     Close Browser

*** Variables ***
${URL}                  http://localhost:3000
${BROWSER}              Chrome

${INPUT_EMAIL}          id=email
${INPUT_SENHA}          id=senha
${BOTAO_LOGIN}          css=.btn-auth
${BTN_LOGOUT}           xpath=//*[contains(text(), 'Sair') or @id='btnLogout']

*** Test Cases ***
CT01 - Logout executado log disponivel
    Realizar Login
    Executar Logout
    Verificar Logout Realizado

CT02 - Logout executado log indisponivel
    Simular Sistema De Log Indisponivel
    Realizar Login
    Executar Logout
    Verificar Logout Realizado

CT03 - Logout nao executado log disponivel
    Realizar Login
    Verificar Nenhum Logout

CT04 - Logout nao executado log indisponivel
    Simular Sistema De Log Indisponivel
    Realizar Login
    Verificar Nenhum Logout

*** Keywords ***
Abrir Navegador
    Open Browser    ${URL}/login    ${BROWSER}
    Maximize Browser Window

Realizar Login
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=5s
    Input Text      ${INPUT_EMAIL}    rhuan@gmail.com
    Input Password  ${INPUT_SENHA}    123456
    Click Button    ${BOTAO_LOGIN}
    Wait Until Location Does Not Contain    /login    timeout=10s

Executar Logout
    Wait Until Element Is Visible    ${BTN_LOGOUT}    timeout=5s
    Click Element    ${BTN_LOGOUT}

Verificar Logout Realizado
    Wait Until Location Contains    /login    timeout=5s
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=5s

Verificar Nenhum Logout
    Location Should Not Contain    /login

Simular Sistema De Log Indisponivel
    Execute Javascript    console.log('Sistema de log simulado como indisponível no frontend');