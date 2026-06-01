*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}        http://localhost:3000/cadastro
${BROWSER}    Chrome

*** Test Cases ***

CT01 - Cadastro Valido
    Abrir Tela De Cadastro
    Preencher Formulario
    ...    Maria Silva
    ...    maria.silva@email.com
    ...    11999999999
    ...    2000-08-15
    ...    Senha123
    ...    Senha123

    Submeter Formulario

    Page Should Not Contain Element    css=.alerta-erro
    Fechar Navegador


CT02 - Nome Invalido
    Abrir Tela De Cadastro
    Preencher Formulario
    ...    111
    ...    maria.silva2@email.com
    ...    11999999999
    ...    2000-08-15
    ...    Senha123
    ...    Senha123

    Submeter Formulario

    Wait Until Page Contains    Nome inválido    timeout=5s
    Fechar Navegador


CT03 - Email Invalido
    Abrir Tela De Cadastro
    Preencher Formulario
    ...    Maria Silva
    ...    maria.silvaemail.com
    ...    11999999999
    ...    2000-08-15
    ...    Senha123
    ...    Senha123

    Submeter Formulario

    Fechar Navegador


CT04 - Senha Invalida
    Abrir Tela De Cadastro
    Preencher Formulario
    ...    Maria Silva
    ...    maria.silva3@email.com
    ...    11999999999
    ...    2000-08-15
    ...    Se
    ...    Se

    Submeter Formulario

    Page Should Contain    Senha deve ter pelo menos 6 caracteres
    Fechar Navegador


CT05 - Telefone Invalido
    Abrir Tela De Cadastro
    Preencher Formulario
    ...    Maria Silva
    ...    maria.silv4@email.com
    ...    119999
    ...    2000-08-15
    ...    Senha123
    ...    Senha123

    Submeter Formulario

    Page Should Contain    Telefone inválido
    Fechar Navegador


CT06 - Senhas Diferentes
    Abrir Tela De Cadastro
    Preencher Formulario
    ...    Maria Silva
    ...    maria.silva5@email.com
    ...    11999999999
    ...    2000-08-15
    ...    Senha123
    ...    Senha456

    Submeter Formulario

    Page Should Contain    As senhas não coincidem
    Fechar Navegador


*** Keywords ***

Abrir Tela De Cadastro
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    id=nome

Preencher Formulario
    [Arguments]
    ...    ${nome}
    ...    ${email}
    ...    ${telefone}
    ...    ${dataNascimento}
    ...    ${senha}
    ...    ${confirmarSenha}

    Input Text        id=nome               ${nome}
    Input Text        id=email              ${email}
    Input Text        id=telefone           ${telefone}
    Input Text        id=dataNascimento     ${dataNascimento}
    Input Password    id=senha              ${senha}
    Input Password    id=confirmarSenha     ${confirmarSenha}

Submeter Formulario
    Click Button    css=button[type="submit"]

Fechar Navegador
    Close Browser