const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const { engine } = require("express-handlebars");
const path = require("path");

const authRoutes = require("./src/routes/auth");
const medicaoRoutes = require("./src/routes/medicoes");
const apiRoutes = require("./src/routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   HANDLEBARS
========================= */

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "src/views/layouts"),
    partialsDir: path.join(__dirname, "src/views/partials"),
    helpers: {
      eq: (a, b) => a === b,
      ne: (a, b) => a !== b,

      formatDate: (iso) => {
        if (!iso) return "";

        const d = new Date(iso);
        const pad = (n) => String(n).padStart(2, "0");

        return `${pad(d.getDate())}/${pad(
          d.getMonth() + 1,
        )}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      },
    },
  }),
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src/views"));

/* =========================
   MIDDLEWARES
========================= */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "src/public")));

app.use(
  session({
    secret: "saude-monitor-secret-2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24h
    },
  }),
);

app.use(flash());

/* =========================
   LAYOUT AUTH
========================= */

app.use((req, res, next) => {
  const authPaths = ["/login", "/cadastro"];

  if (authPaths.includes(req.path)) {
    res.locals.layout = "auth";
  }

  next();
});

/* =========================
   ROTA RAIZ
========================= */

app.get("/", (req, res) => {
  if (req.session?.userId) {
    return res.redirect("/dashboard");
  }

  return res.redirect("/login");
});

/* =========================
   ROTAS WEB
========================= */

app.use("/", authRoutes);
app.use("/", medicaoRoutes);

/* =========================
   API REST
========================= */

app.use("/api/v1", apiRoutes);

/* =========================
   TESTE DA API
========================= */

app.get("/api-health", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando",
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   404
========================= */

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Página não encontrada",
    message: "A página que você procura não existe.",
  });
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log("");
  console.log("=====================================");
  console.log("🚀 Monitor de Saúde iniciado");
  console.log(`🌐 Web: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api/v1`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/api-health`);
  console.log("=====================================");
  console.log("");
});

module.exports = app;
