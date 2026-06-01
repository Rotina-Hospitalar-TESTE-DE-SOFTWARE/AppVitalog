*** Settings ***
Library           SeleniumLibrary

# O Setup agora prepara todo o ambiente antes de começar o teste
Test Setup       Dado que o usuário loga e acessa a tela de glicemia
Test Teardown     Fechar Navegador

*** Variables ***
${URL_LOGIN}              http://localhost:3000/login
${URL_REGISTRO}           http://localhost:3000/registrar
${BROWSER}                Chrome

${INPUT_EMAIL}            id=email
${INPUT_SENHA}            id=senha
${BOTAO_LOGIN}            css=.btn-auth
${BOTAO_GLICEMIA}         id=btnGlicemia

${INPUT_VALOR}            id=valor
${INPUT_DATA_HORA}        id=dataHoraGlicemia
${BOTAO_REGISTRAR}        css=#formGlicemiaWrap .btn-registrar

*** Test Cases ***
CT01 - Registrar Glicemia Com Sucesso
    Preencher Formulario De Glicemia    90    2026-06-01T10:00
    Submeter Formulario De Glicemia
    Wait Until Element Is Visible       css=.alerta-sucesso    timeout=5s

CT02 - Glicemia Invalida (Valor Negativo)
    Preencher Formulario De Glicemia    -60    2026-06-01T10:00
    Submeter Formulario De Glicemia
    Então o navegador deve bloquear o campo alertando    valor    O valor deve ser maior ou igual a 20.

*** Keywords ***
Dado que o usuário loga e acessa a tela de glicemia
    Open Browser    ${URL_LOGIN}    ${BROWSER}
    Maximize Browser Window
    
    # Login
    Input Text      ${INPUT_EMAIL}    rhuan@gmail.com
    Input Password  ${INPUT_SENHA}    123456
    Click Element   ${BOTAO_LOGIN}
    
    # Navegação
    Wait Until Location Does Not Contain    /login    timeout=10s
    Go To           ${URL_REGISTRO}
    
    # Seleção da aba de glicemia
    Wait Until Element Is Visible    ${BOTAO_GLICEMIA}    timeout=10s
    Click Element                    ${BOTAO_GLICEMIA}

Preencher Formulario De Glicemia
    [Arguments]    ${valor}    ${dataHora}
    Wait Until Element Is Visible    ${INPUT_VALOR}    timeout=5s
    Input Text    ${INPUT_VALOR}                ${valor}
    Input Text    ${INPUT_DATA_HORA}            ${dataHora}

Submeter Formulario De Glicemia
    Click Button    ${BOTAO_REGISTRAR}

Então o navegador deve bloquear o campo alertando
    [Arguments]    ${id_campo}    ${mensagem_esperada}
    Wait Until Element Is Visible    css=#${id_campo}:invalid    timeout=5s
    ${mensagem_nativa}=    Execute Javascript    return document.getElementById('${id_campo}').validationMessage;
    Should Be Equal As Strings    ${mensagem_nativa}    ${mensagem_esperada}

Fechar Navegador
    Close Browser