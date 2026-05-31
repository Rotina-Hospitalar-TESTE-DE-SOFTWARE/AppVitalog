const UserModel = require('../models/UserModel');

class AuthController {
  showRegister(req, res) {
    res.render('auth/register', {
      title: 'Cadastro',
      errors: req.flash('error'),
      success: req.flash('success'),
      formData: req.flash('formData')[0] || {}
    });
  }

  register(req, res) {
    const { nome, email, senha, confirmarSenha, telefone, dataNascimento } = req.body;

    // Validações
    const errors = [];
    if (!nome || nome.trim().length < 2) errors.push('Nome deve ter pelo menos 2 caracteres.');
    if (!email || !email.includes('@')) errors.push('E-mail inválido.');
    if (!senha || senha.length < 6) errors.push('Senha deve ter pelo menos 6 caracteres.');
    if (senha !== confirmarSenha) errors.push('As senhas não coincidem.');
    if (!telefone || telefone.trim().length < 8) errors.push('Telefone inválido.');
    if (!dataNascimento) errors.push('Data de nascimento é obrigatória.');

    if (errors.length > 0) {
      errors.forEach(e => req.flash('error', e));
      req.flash('formData', { nome, email, telefone, dataNascimento });
      return res.redirect('/cadastro');
    }

    if (UserModel.findByEmail(email)) {
      req.flash('error', 'Este e-mail já está cadastrado.');
      req.flash('formData', { nome, email, telefone, dataNascimento });
      return res.redirect('/cadastro');
    }

    UserModel.create({ nome, email, senha, telefone, dataNascimento });
    req.flash('success', 'Conta criada com sucesso! Faça login para continuar.');
    res.redirect('/login');
  }

  showLogin(req, res) {
    res.render('auth/login', {
      title: 'Login',
      errors: req.flash('error'),
      success: req.flash('success')
    });
  }

  login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      req.flash('error', 'Preencha todos os campos.');
      return res.redirect('/login');
    }

    const user = UserModel.findByEmail(email);
    if (!user || !UserModel.verifyPassword(senha, user.senha)) {
      req.flash('error', 'Credenciais inválidas. Verifique seu e-mail e senha.');
      return res.redirect('/login');
    }

    req.session.userId = user.id;
    req.session.userName = user.nome;
    res.redirect('/dashboard');
  }

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
}

module.exports = new AuthController();
