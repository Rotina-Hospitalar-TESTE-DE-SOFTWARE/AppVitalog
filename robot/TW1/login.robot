*** Settings ***
Library           SeleniumLibrary
Test Setup        Dado que o usuário acessa a tela de login
Test Teardown     E fecha o navegador

*** Variables ***
${URL}            http://localhost:3000/login
${BROWSER}        chrome

${INPUT_EMAIL}    id=email
${INPUT_SENHA}    id=senha
${BOTAO_LOGIN}    css=.btn-auth
${MENSAGEM}       css=.alerta

*** Test Cases ***
CT01 - Deve realizar login com dados válidos
    Dado que o usuário informa o email    joaoPedro@email.com
    E informa a senha    senha3654
    Quando solicitar o login
    Então o usuário deve ser logado com sucesso

CT02 - Deve validar email inválido
    Dado que o usuário informa o email    emailinvalido@email.com
    E informa a senha    senha3654
    Quando solicitar o login
    Então o sistema deve apresentar a mensagem    Credenciais inválidas

CT03 - Deve validar senha inválida
    Dado que o usuário informa o email    joaoPedro@email.com
    E informa a senha    aaa
    Quando solicitar o login
    Então o sistema deve apresentar a mensagem    Credenciais inválidas

CT04 - Deve validar email e senha inválidos
    Dado que o usuário informa o email    emailinvalido@email.com
    E informa a senha    aaa
    Quando solicitar o login
    Então o sistema deve apresentar a mensagem    Credenciais inválidas

*** Keywords ***
Dado que o usuário acessa a tela de login
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

Dado que o usuário informa o email
    [Arguments]    ${email}=${EMPTY}
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=10s
    Input Text    ${INPUT_EMAIL}    ${email}

E informa a senha
    [Arguments]    ${senha}=${EMPTY}
    Input Password    ${INPUT_SENHA}    ${senha}

Quando solicitar o login
    Click Button    ${BOTAO_LOGIN}

Então o sistema deve apresentar a mensagem
    [Arguments]    ${texto_esperado}
    Wait Until Element Is Visible    ${MENSAGEM}    timeout=10s
    Element Should Contain    ${MENSAGEM}    ${texto_esperado}

Então o usuário deve ser logado com sucesso
    Wait Until Location Contains    /registrar    timeout=10s

E fecha o navegador
    Close Browser