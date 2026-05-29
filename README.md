# 🩺 Vitalog - Sistema de Monitoramento Pessoal de Saúde

O **Vitalog** é uma aplicação web moderna, responsiva e com design premium voltada para o monitoramento e registro pessoal de índices de **Pressão Arterial** e **Glicemia**. O projeto foi concebido sob rigorosas diretrizes de **acessibilidade para idosos (RN07)**, contando com alto contraste visual, tipografia ampliada e alvos de clique WCAG (mínimo de 48px de altura).

---

## ✨ Funcionalidades Principais

1. **Cadastro e Login Dinâmicos (HU01, HU02 e HU07)**:
   - Interface simples de cadastro (Nome, E-mail e Senha) com persistência local no `localStorage` sob a chave `vitalog_users`.
   - Sistema de Login seguro validando as credenciais no banco local.
   - Credencial administrativa padrão pré-configurada para testes rápidos se o banco estiver vazio: `admin@vitalog.com` / `vitalog123`.
   - Encerramento de sessão (Logout) seguro, limpando os dados ativos do navegador.

2. **Registro de Pressão Arterial (RF08)**:
   - Formulário validado com campos de Pressão Sistólica (60 a 300 mmHg), Diastólica (40 a 200 mmHg) e Frequência Cardíaca (30 a 200 BPM).
   - Validações em tempo real via `react-hook-form` com avisos claros.

3. **Registro de Glicemia (RF09)**:
   - Campo para nível de glicose (20 a 600 mg/dL) com dropdown de classificação de momento (Jejum, Pré-prandial, Pós-prandial, Ao deitar e Outros).

4. **Painel Geral (Dashboard)**:
   - Médias gerais das medições cadastradas.
   - Lista das últimas 3 atividades recentes.
   - Alertas dinâmicos inteligentes baseados nos dados coletados (Avisos de Hipotensão, Hipertensão, Hipoglicemia e Hiperglicemia).

5. **Histórico Interativo com Filtros e Edição/Exclusão (HU05 e HU06)**:
   - Tabela organizada das medições ordenadas por data/hora.
   - Badges coloridos que categorizam a leitura (Verde: Normal, Amarelo: Elevado, Vermelho: Alto, Azul: Baixo) baseadas em diretrizes médicas padrão.
   - **Edição (HU05)**: Permite clicar no ícone de lápis para abrir o formulário correspondente pré-preenchido e atualizar os dados.
   - **Exclusão Segura (HU06)**: Botão de exclusão (lixeira) com área de clique confortável que abre um modal customizado de confirmação: *"Tem certeza que deseja apagar este registro?"*.

6. **Exportação de Dados**:
   - **PDF**: Relatório clínico profissional contendo cabeçalho estruturado, médias do paciente e tabela de histórico no lado do cliente via `jsPDF`.
   - **Planilha (CSV)**: Exportação com encoding UTF-8 BOM e separador `;`, garantindo compatibilidade direta e sem erros de acentuação no Microsoft Excel em português.

7. **Aviso Clínico de Apoio (Disclaimer)**:
   - Rodapé persistente em todas as páginas do sistema: *"O sistema é um registro de apoio e não substitui a avaliação clínica profissional de um médico."* (Conforme requisitos RNF11/RNF12).

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
   git clone <link-do-seu-repositorio>
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

4. **Gerar build de produção**:
   ```bash
   npm run build
   ```
   Os arquivos compilados e minificados prontos para deploy estarão na pasta `dist/`.

---

## ♿ Acessibilidade e Design para Idosos (RN07)

* **Legibilidade**: Fonte base ampliada para `18px`. Cores secundárias clareadas de forma a atingir a classificação WCAG AAA de contraste sobre o fundo escuro profundo.
* **Target Size**: Todos os botões, links de navegação e inputs possuem altura mínima de **48px** e espaçamentos confortáveis, atendendo à facilidade física de toque e clique de usuários da melhor idade.
