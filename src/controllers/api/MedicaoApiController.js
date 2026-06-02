const MedicaoModel = require("../../models/MedicaoModel");

class MedicaoApiController {
  listarHistorico(req, res) {
    const medicoes = MedicaoModel.findByUser(req.session.userId);

    return res.json({
      success: true,
      total: medicoes.length,
      data: medicoes,
    });
  }

  listarPressao(req, res) {
    const medicoes = MedicaoModel.findByUser(req.session.userId).filter(
      (m) => m.tipo === "pressao",
    );

    return res.json({
      success: true,
      total: medicoes.length,
      data: medicoes,
    });
  }

  buscarPressao(req, res) {
    const medicao = MedicaoModel.findById(req.params.id);

    if (!medicao || medicao.tipo !== "pressao") {
      return res.status(404).json({
        success: false,
        message: "Medição não encontrada.",
      });
    }

    return res.json({
      success: true,
      data: medicao,
    });
  }

  criarPressao(req, res) {
    const { sistolico, diastolico, dataHora } = req.body;

    const medicao = MedicaoModel.createPressao({
      userId: req.session.userId,
      sistolico,
      diastolico,
      dataHora,
      observacao: "",
    });

    return res.status(201).json({
      success: true,
      data: medicao,
    });
  }

  atualizarPressao(req, res) {
    const medicao = MedicaoModel.update(req.params.id, req.body);

    if (!medicao) {
      return res.status(404).json({
        success: false,
        message: "Medição não encontrada.",
      });
    }

    return res.json({
      success: true,
      data: medicao,
    });
  }

  listarGlicemia(req, res) {
    const medicoes = MedicaoModel.findByUser(req.session.userId).filter(
      (m) => m.tipo === "glicemia",
    );

    return res.json({
      success: true,
      total: medicoes.length,
      data: medicoes,
    });
  }

  buscarGlicemia(req, res) {
    const medicao = MedicaoModel.findById(req.params.id);

    if (!medicao || medicao.tipo !== "glicemia") {
      return res.status(404).json({
        success: false,
        message: "Medição não encontrada.",
      });
    }

    return res.json({
      success: true,
      data: medicao,
    });
  }

  criarGlicemia(req, res) {
    const { valor, dataHora } = req.body;
    const errors = [];
    const valorNumerico = parseFloat(valor);

    if (valor === undefined || valor === null || valor === "") {
      errors.push("Valor da glicemia é obrigatório.");
    } else if (Number.isNaN(valorNumerico) || valorNumerico < 20 || valorNumerico > 600) {
      errors.push("Valor da glicemia deve estar entre 20 e 600 mg/dL.");
    }

    if (!dataHora) {
      errors.push("Data e horário são obrigatórios.");
    }

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const medicao = MedicaoModel.createGlicemia({
      userId: req.session.userId,
      valor: valorNumerico,
      dataHora,
      observacao: "",
    });

    return res.status(201).json({
      success: true,
      data: medicao,
    });
  }

  atualizarGlicemia(req, res) {
    const medicao = MedicaoModel.update(req.params.id, req.body);

    if (!medicao) {
      return res.status(404).json({
        success: false,
        message: "Medição não encontrada.",
      });
    }

    return res.json({
      success: true,
      data: medicao,
    });
  }

  excluir(req, res) {
    const deleted = MedicaoModel.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Medição não encontrada.",
      });
    }

    return res.json({
      success: true,
      message: "Medição removida com sucesso.",
    });
  }
}

module.exports = new MedicaoApiController();
