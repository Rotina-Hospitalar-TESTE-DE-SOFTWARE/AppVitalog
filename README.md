# 🩺 Monitor de Saúde

Sistema web para registro e acompanhamento de medições de **pressão arterial** e **glicemia**, com histórico, gráficos e exportação para PDF e planilha.

---

## 🚀 Como executar

### Pré-requisitos
- Node.js 16+
- npm

### Instalação
```bash
# Instalar dependências
npm install

# Iniciar o servidor
npm start
```

Acesse: **http://localhost:3000**

---

## 📁 Estrutura MVC

```
saude-monitor/
├── app.js                          # Ponto de entrada
├── data/
│   └── db.json                     # Banco de dados (JSON)
└── src/
    ├── config/
    │   └── database.js             # Configuração do banco
    ├── controllers/
    │   ├── AuthController.js       # Login, cadastro, logout
    │   ├── DashboardController.js  # Painel principal
    │   ├── MedicaoController.js    # CRUD de medições
    │   └── ExportController.js     # Exportação PDF/Excel
    ├── middlewares/
    │   └── auth.js                 # Autenticação de sessão
    ├── models/
    │   ├── UserModel.js            # Modelo de usuário
    │   └── MedicaoModel.js         # Modelo de medições
    ├── routes/
    │   ├── auth.js                 # Rotas de autenticação
    │   └── medicoes.js             # Rotas de medições
    ├── views/
    │   ├── layouts/                # Layouts Handlebars
    │   ├── auth/                   # Telas de login/cadastro
    │   ├── dashboard/              # Painel principal
    │   ├── medicoes/               # Formulários e histórico
    │   └── exportar/               # Tela de exportação
    └── public/
        ├── css/app.css
        └── js/app.js
```

---

## ✅ Funcionalidades

| RF  | Descrição                              | Status |
|-----|----------------------------------------|--------|
| RF01| Cadastro de usuário                    | ✅     |
| RF02| Autenticação (login/logout)            | ✅     |
| RF03| Registro de pressão arterial           | ✅     |
| RF04| Registro de glicemia                   | ✅     |
| RF05| Validação de pressão (60-300/40-200)   | ✅     |
| RF06| Validação de glicemia (20-600)         | ✅     |
| RF07| Edição de medições                     | ✅     |
| RF08| Exclusão de medições                   | ✅     |
| RF09| Histórico (últimos 30 dias)            | ✅     |
| RF10| Exportação para PDF                    | ✅     |
| RF11| Exportação para planilha (.xlsx)       | ✅     |

---

## 🛠 Tecnologias

- **Node.js + Express** — servidor web
- **Express-Handlebars** — templates
- **LowDB** — banco de dados JSON
- **bcryptjs** — hash de senhas
- **express-session + connect-flash** — sessões e mensagens
- **PDFKit** — geração de PDF
- **ExcelJS** — geração de planilhas .xlsx
- **Chart.js** (CDN) — gráficos de evolução

---

> ⚠️ Este sistema tem caráter de apoio ao acompanhamento de saúde. Não constitui diagnóstico médico nem substitui avaliação clínica profissional.
