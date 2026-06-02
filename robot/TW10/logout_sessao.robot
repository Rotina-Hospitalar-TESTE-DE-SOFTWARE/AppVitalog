*** Settings ***
Library           SeleniumLibrary

Test Setup        Dado que o usuário está autenticado
Test Teardown     Fechar Navegador

*** Variables ***
${URL_LOGIN}              http://localhost:3000/login
${URL_HISTORICO}          http://localhost:3000/historico
${URL_REGISTRO}           http://localhost:3000/registrar
${BROWSER}                chrome

${INPUT_EMAIL}            id=email
${INPUT_SENHA}            id=senha
${BOTAO_LOGIN}            css=.btn-auth
${BOTAO_SAIR}             css=.btn-sair

*** Test Cases ***
CT01 - Deve exigir novo login após logout ao acessar tela protegida
    Quando o usuário encerra a sessão
    E tenta acessar diretamente uma tela protegida
    Então o sistema deve redirecionar para login

*** Keywords ***
Dado que o usuário está autenticado
    Open Browser    ${URL_LOGIN}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=10s
    Input Text    ${INPUT_EMAIL}    rhuan@gmail.com
    Input Password    ${INPUT_SENHA}    123456
    Click Element    ${BOTAO_LOGIN}
    Wait Until Location Does Not Contain    /login    timeout=10s
    Go To    ${URL_REGISTRO}
    Wait Until Element Is Visible    ${BOTAO_SAIR}    timeout=10s

Quando o usuário encerra a sessão
    Click Element    ${BOTAO_SAIR}
    Wait Until Location Contains    /login    timeout=10s

E tenta acessar diretamente uma tela protegida
    Go To    ${URL_HISTORICO}

Então o sistema deve redirecionar para login
    Wait Until Location Contains    /login    timeout=10s

Fechar Navegador
    Close Browser
