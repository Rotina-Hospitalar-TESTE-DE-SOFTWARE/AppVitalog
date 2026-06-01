const UserModel = require("../../models/UserModel");

class AuthApiController {
  register(req, res) {
    const { nome, email, senha, telefone, dataNascimento } = req.body;

    const errors = [];

    if (!nome || nome.trim().length < 2)
      errors.push("Nome deve ter pelo menos 2 caracteres.");

    if (!email || !email.includes("@")) errors.push("E-mail inválido.");

    if (!senha || senha.length < 6)
      errors.push("Senha deve ter pelo menos 6 caracteres.");

    if (!telefone) errors.push("Telefone é obrigatório.");

    if (!dataNascimento) errors.push("Data de nascimento é obrigatória.");

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    if (UserModel.findByEmail(email)) {
      return res.status(409).json({
        success: false,
        message: "E-mail já cadastrado.",
      });
    }

    const user = UserModel.create({
      nome,
      email,
      senha,
      telefone,
      dataNascimento,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    });
  }

  login(req, res) {
    const { email, senha } = req.body;

    const user = UserModel.findByEmail(email);

    if (!user || !UserModel.verifyPassword(senha, user.senha)) {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas.",
      });
    }

    req.session.userId = user.id;
    req.session.userName = user.nome;

    return res.json({
      success: true,
      message: "Login realizado com sucesso.",
      data: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    });
  }

  logout(req, res) {
    req.session.destroy(() => {
      return res.json({
        success: true,
        message: "Logout realizado com sucesso.",
      });
    });
  }
}

module.exports = new AuthApiController();
