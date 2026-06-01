*** Settings ***
Library           SeleniumLibrary

Test Setup    Dado que o usuário acessa a tela de login
Test Teardown     E fecha o navegador

*** Variables ***
${URL}                http://localhost:3000/login
${BROWSER}            chrome

${INPUT_EMAIL}        id=email
${INPUT_SENHA}        id=senha
${BOTAO_LOGIN}        css=.btn-auth
${MENSAGEM_ALERTA}    css=.alerta

*** Test Cases ***
CT01 - Deve realizar login com campos válidos
    Dado que o usuário informa o email    joaoPedro@email.com
    E informa a senha    senha3654
    Quando solicitar o login
    Então o usuário deve ser logado com sucesso

CT02 - Deve validar email nulo
    Dado que o usuário informa o email
    E informa a senha    senha3654
    Quando solicitar o login
    Então o navegador deve bloquear o campo alertando    email    Preencha este campo.

CT03 - Deve validar senha nula
    Dado que o usuário informa o email    joaoPedro@email.com
    E informa a senha
    Quando solicitar o login
    Então o navegador deve bloquear o campo alertando    senha    Preencha este campo.

CT04 - Deve validar email e senha nulos
    Dado que o usuário informa o email
    E informa a senha
    Quando solicitar o login
    Então o navegador deve bloquear o campo alertando    email    Preencha este campo.


*** Keywords ***
Dado que o usuário acessa a tela de login
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

Dado que o usuário informa o email
    [Arguments]    ${email}=${EMPTY}
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=5s
    Input Text    ${INPUT_EMAIL}    ${email}

E informa a senha
    [Arguments]    ${senha}=${EMPTY}
    Input Password    ${INPUT_SENHA}    ${senha}

Quando solicitar o login
    Click Element    ${BOTAO_LOGIN}

E fecha o navegador
    Close Browser

Então o sistema deve apresentar a mensagem
    [Arguments]    ${texto_esperado}
    Wait Until Element Is Visible    ${MENSAGEM_ALERTA}    timeout=5s
    Element Should Contain    ${MENSAGEM_ALERTA}    ${texto_esperado}

Então o navegador deve bloquear o campo alertando
    [Arguments]    ${id_do_campo}    ${mensagem_esperada}
    Wait Until Element Is Visible    css=#${id_do_campo}:invalid    timeout=5s
    ${mensagem_nativa}=    Execute Javascript    return document.getElementById('${id_do_campo}').validationMessage;
    Should Be Equal As Strings    ${mensagem_nativa}    ${mensagem_esperada}

Então o usuário deve ser logado com sucesso
    Wait Until Location Contains    /registrar    timeout=10s