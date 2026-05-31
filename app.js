const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const { engine } = require('express-handlebars');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const medicaoRoutes = require('./src/routes/medicoes');

const app = express();
const PORT = process.env.PORT || 3000;

// Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'src/views/layouts'),
  partialsDir: path.join(__dirname, 'src/views/partials'),
  helpers: {
    eq: (a, b) => a === b,
    ne: (a, b) => a !== b,
    formatDate: (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      const p = n => String(n).padStart(2, '0');
      return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/public')));

app.use(session({
  secret: 'saude-monitor-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24h
}));

app.use(flash());

// Rota raiz
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

// Routes com layout correto
app.use((req, res, next) => {
  const authPaths = ['/login', '/cadastro'];
  if (authPaths.includes(req.path)) {
    res.locals.layout = 'auth';
  }
  next();
});

app.use('/', authRoutes);
app.use('/', medicaoRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Página não encontrada',
    message: 'A página que você procura não existe.'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Monitor de Saúde rodando em http://localhost:${PORT}`);
});

module.exports = app;
