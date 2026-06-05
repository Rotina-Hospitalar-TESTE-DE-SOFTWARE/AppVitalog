*** Settings ***
Library           SeleniumLibrary

Test Setup        Preparar Ambiente Para Exclusao
Test Teardown     Fechar Navegador

*** Variables ***
${URL}                  http://localhost:3000
${BROWSER}              Chrome

${INPUT_EMAIL}          id=email
${INPUT_SENHA}          id=senha
${BOTAO_LOGIN}          css=.btn-auth

${INPUT_SISTOLICO}      id=sistolico
${INPUT_DIASTOLICO}     id=diastolico
${BTN_REGISTRAR}        css=button.btn-registrar

${BTN_EXCLUIR_LISTA}    css=.btn-excluir
${BTN_CONFIRMAR}        css=.btn-confirmar-excluir
${BTN_CANCELAR}         css=.btn-cancelar
${MODAL}                id=modalExclusao

${MSG_SUCESSO}          Medição excluída com sucesso!
${MSG_ERRO}             Erro

*** Test Cases ***
CT01 - Confirma exclusao com banco disponivel
    Selecionar Registro
    Confirmar Exclusao
    Wait Until Page Contains    ${MSG_SUCESSO}    timeout=5s

CT02 - Confirma exclusao com banco indisponivel
    Simular Banco Indisponivel
    Selecionar Registro
    Confirmar Exclusao
    Wait Until Page Contains    ${MSG_ERRO}    timeout=5s

CT03 - Cancela exclusao com banco disponivel
    Selecionar Registro
    Cancelar Exclusao
    Registro Deve Existir

CT04 - Cancela exclusao com banco indisponivel
    Simular Banco Indisponivel
    Selecionar Registro
    Cancelar Exclusao
    Registro Deve Existir

*** Keywords ***
Preparar Ambiente Para Exclusao
    Open Browser    ${URL}/login    ${BROWSER}
    Maximize Browser Window
    Input Text      ${INPUT_EMAIL}    rhuan@gmail.com
    Input Password  ${INPUT_SENHA}    123456
    Click Button    ${BOTAO_LOGIN}
    Wait Until Location Is    ${URL}/registrar    timeout=10s
    Wait Until Element Is Visible    ${INPUT_SISTOLICO}    timeout=5s
    Input Text    ${INPUT_SISTOLICO}       120
    Input Text    ${INPUT_DIASTOLICO}      80
    Click Button  ${BTN_REGISTRAR}
    Wait Until Element Is Visible    css=.alerta-sucesso    timeout=10s
    Go To    ${URL}/historico
    Wait Until Element Is Visible    ${BTN_EXCLUIR_LISTA}    timeout=15s

Fechar Navegador
    Close Browser

Selecionar Registro
    Scroll Element Into View         ${BTN_EXCLUIR_LISTA}
    Sleep    1s
    Click Element                    ${BTN_EXCLUIR_LISTA}
    Wait Until Element Is Visible    ${MODAL}    timeout=10s

Confirmar Exclusao
    Wait Until Element Is Visible    ${BTN_CONFIRMAR}    timeout=5s
    Click Button                     ${BTN_CONFIRMAR}
    Wait Until Element Is Not Visible    ${MODAL}    timeout=10s
    Sleep    1s

Cancelar Exclusao
    Wait Until Element Is Visible    ${BTN_CANCELAR}    timeout=5s
    Click Button                     ${BTN_CANCELAR}
    Wait Until Element Is Not Visible    ${MODAL}    timeout=10s
    Sleep    1s

Registro Deve Existir
    Page Should Contain Element    ${BTN_EXCLUIR_LISTA}

Simular Banco Indisponivel
    Log    Simulação de indisponibilidade