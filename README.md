# 🩺 Vitalog - Sistema de Monitoramento Pessoal de Saúde

O **Vitalog** é uma aplicação web moderna, responsiva e com design premium voltada para o monitoramento e registro pessoal de índices de **Pressão Arterial** e **Glicemia**.

---

## ✨ Funcionalidades Principais

1. **Cadastro e Login Dinâmicos**:
   - Interface simples de cadastro (Nome, E-mail e Senha) com persistência local no `localStorage` sob a chave `vitalog_users`.
   - Sistema de Login seguro validando as credenciais no banco local.
   - Credencial administrativa padrão pré-configurada para testes rápidos se o banco estiver vazio: `admin@vitalog.com` / `vitalog123`.
   - Encerramento de sessão (Logout) seguro, limpando os dados ativos do navegador.

2. **Registro de Pressão Arterial**:
   - Formulário validado com campos de Pressão Sistólica, Diastólica e Frequência Cardíaca.
   - Validações em tempo real via `react-hook-form` com avisos claros.

3. **Registro de Glicemia**:
   - Campo para nível de glicose com dropdown de classificação de momento (Jejum, Pré-prandial, Pós-prandial, Ao deitar e Outros).

4. **Painel Geral (Dashboard)**:
   - Médias gerais das medições cadastradas.
   - Lista das últimas 3 atividades recentes.
   - Alertas dinâmicos inteligentes baseados nos dados coletados (Avisos de Hipotensão, Hipertensão, Hipoglicemia e Hiperglicemia).

5. **Histórico Interativo com Filtros e Edição/Exclusão**:
   - Tabela organizada das medições ordenadas por data/hora.
   - Badges coloridos que categorizam a leitura (Verde: Normal, Amarelo: Elevado, Vermelho: Alto, Azul: Baixo) baseadas em diretrizes médicas padrão.
   - **Edição**: Permite clicar no ícone de lápis para abrir o formulário correspondente pré-preenchido e atualizar os dados.
   - **Exclusão Segura**: Botão de exclusão (lixeira) com área de clique confortável que abre um modal customizado de confirmação: *"Tem certeza que deseja apagar este registro?"*.

6. **Exportação de Dados**:
   - **PDF**: Relatório clínico profissional contendo cabeçalho estruturado, médias do paciente e tabela de histórico no lado do cliente via `jsPDF`.
   - **Planilha (CSV)**: Exportação com encoding UTF-8 BOM e separador `;`, garantindo compatibilidade direta e sem erros de acentuação no Microsoft Excel em português.

7. **Aviso Clínico de Apoio (Disclaimer)**:
   - Rodapé persistente em todas as páginas do sistema: *"O sistema é um registro de apoio e não substitui a avaliação clínica profissional de um médico."*.

---

## 🛠️ Tecnologias e Bibliotecas

* **React 18** (JavaScript)
* **Vite** (Build Tool veloz)
* **Vanilla CSS** (Design System proprietário com HSL e Glassmorphism)
* **react-router-dom (v7)** (Roteamento SPA e proteção de rotas privadas)
* **react-hook-form** (Gerenciamento leve de formulários e validações)
* **lucide-react** (Ícones modernos)
* **jsPDF** (Gerador de relatórios PDF)
* **html2canvas** (Utilitário de imagem para PDF)

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
Você precisará ter o **Node.js** instalado na sua máquina (versão 18 ou superior recomendada).

### Passo a Passo

1. **Baixe ou clone o repositório**:
   ```bash
   git clone <https://github.com/Rotina-Hospitalar-TESTE-DE-SOFTWARE/AppVitalog.git>
   cd Vitalog
   ```

2. **Instale as dependências do projeto**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a URL gerada no terminal (geralmente `http://localhost:5173`).

---
