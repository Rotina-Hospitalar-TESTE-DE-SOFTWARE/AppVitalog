# Resultado da Execução - TW9 / CT35

## Ambiente de testes

| Item | Valor |
|---|---|
| Ferramenta | Robot Framework |
| Biblioteca | SeleniumLibrary |
| Navegador | Google Chrome |
| URL | `http://localhost:3000/registrar` |
| Data | 02/06/2026 |

## Casos de teste

| Caso | Resultado esperado | Status previsto |
|---|---|---|
| CT01 - Sem sistólico | Navegador bloqueia o envio e exige preenchimento | Aprovado |
| CT02 - Sem diastólico | Navegador bloqueia o envio e exige preenchimento | Aprovado |
| CT03 - Sem data/hora | Navegador bloqueia o envio e exige preenchimento | Aprovado |

## Arquivos de evidência esperados

Após executar a suíte, publicar os arquivos gerados:

| Arquivo | Caminho |
|---|---|
| report.html | `robot/TW9/report.html` |
| log.html | `robot/TW9/log.html` |
| output.xml | `robot/TW9/output.xml` |

## Comando

```bash
robot -d robot/TW9 robot/TW9/pressao_campos_obrigatorios.robot
```

## Observação

O ambiente local usado para preparar esta documentação não possui o comando `robot` instalado, então os arquivos `report.html`, `log.html` e `output.xml` ainda precisam ser gerados em uma máquina com Robot Framework e SeleniumLibrary.
