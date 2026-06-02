# Resultado da Execução - TW10 / CT36

## Ambiente de testes

| Item | Valor |
|---|---|
| Ferramenta | Robot Framework |
| Biblioteca | SeleniumLibrary |
| Navegador | Google Chrome |
| URL | `http://localhost:3000/login` |
| Data | 02/06/2026 |

## Caso de teste

| Caso | Resultado esperado | Status previsto |
|---|---|---|
| CT01 - Acessar tela protegida após logout | Sistema redireciona para `/login` | Aprovado |

## Arquivos de evidência esperados

Após executar a suíte, publicar os arquivos gerados:

| Arquivo | Caminho |
|---|---|
| report.html | `robot/TW10/report.html` |
| log.html | `robot/TW10/log.html` |
| output.xml | `robot/TW10/output.xml` |

## Comando

```bash
robot -d robot/TW10 robot/TW10/logout_sessao.robot
```

## Observação

O ambiente local usado para preparar esta documentação não possui o comando `robot` instalado, então os arquivos `report.html`, `log.html` e `output.xml` ainda precisam ser gerados em uma máquina com Robot Framework e SeleniumLibrary.
