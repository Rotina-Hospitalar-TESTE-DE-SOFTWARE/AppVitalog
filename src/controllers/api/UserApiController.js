const UserModel = require("../../models/UserModel");

class UserApiController {
  me(req, res) {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
      });
    }

    const user = UserModel.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado.",
      });
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        dataNascimento: user.dataNascimento,
      },
    });
  }
}

module.exports = new UserApiController();
