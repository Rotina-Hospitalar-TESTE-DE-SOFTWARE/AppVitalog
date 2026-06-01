*** Settings ***
Library           SeleniumLibrary

# Mudamos para Test Setup para garantir que cada teste comece na tela correta e limpa
Test Setup       Dado que o usuário acessa a tela de cadastro
Test Teardown     E fecha o navegador

*** Variables ***
${URL}                     http://localhost:3000/cadastro
${BROWSER}                 chrome

${INPUT_NOME}              id=nome
${INPUT_DATA_NASCIMENTO}   id=dataNascimento
${INPUT_EMAIL}             id=email
${INPUT_TELEFONE}          id=telefone
${INPUT_SENHA}             id=senha
${INPUT_CONFIRMAR}         id=confirmarSenha

${BOTAO_CADASTRAR}         css=.btn-auth
${MENSAGEM_ERRO}           css=.alerta-erro

*** Test Cases ***
CT01 - Deve cadastrar usuário com data de nascimento válida
    Dado que o usuário informa o nome    Teste Usuario
    E informa a data de nascimento    2000-01-01
    E informa o email    teste@email.com
    E informa o telefone    62999999999
    E informa a senha    12345678
    E confirma a senha    12345678
    Quando solicitar o cadastro
    Então o sistema não deve apresentar mensagem de erro

CT02 - Deve rejeitar data de nascimento futura
    Dado que o usuário informa o nome    Teste Usuario
    E informa a data de nascimento    2050-01-01
    E informa o email    teste2@email.com
    E informa o telefone    62999999999
    E informa a senha    12345678
    E confirma a senha    12345678
    Quando solicitar o cadastro
    Então o sistema deve apresentar a mensagem de erro    Data de nascimento não pode ser futura

*** Keywords ***
Dado que o usuário acessa a tela de cadastro
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_NOME}    timeout=5s

Dado que o usuário informa o nome
    [Arguments]    ${nome}
    Input Text    ${INPUT_NOME}    ${nome}

E informa a data de nascimento
    [Arguments]    ${data}
    Input Text    ${INPUT_DATA_NASCIMENTO}    ${data}

E informa o email
    [Arguments]    ${email}
    Input Text    ${INPUT_EMAIL}    ${email}

E informa o telefone
    [Arguments]    ${telefone}
    Input Text    ${INPUT_TELEFONE}    ${telefone}

E informa a senha
    [Arguments]    ${senha}
    Input Password    ${INPUT_SENHA}    ${senha}

E confirma a senha
    [Arguments]    ${senha_confirmacao}
    Input Password    ${INPUT_CONFIRMAR}    ${senha_confirmacao}

Quando solicitar o cadastro
    Click Element    ${BOTAO_CADASTRAR}

Então o sistema não deve apresentar mensagem de erro
    # Aguarda um pequeno momento para garantir que nenhuma mensagem de erro brotou na tela
    Sleep    1s
    Page Should Not Contain Element    ${MENSAGEM_ERRO}

Então o sistema deve apresentar a mensagem de erro
    [Arguments]    ${mensagem}
    # Espera o componente de erro do React ficar visível na tela
    Wait Until Element Is Visible    ${MENSAGEM_ERRO}    timeout=5s
    Element Should Contain    ${MENSAGEM_ERRO}    ${mensagem}

E fecha o navegador
    Close Browser