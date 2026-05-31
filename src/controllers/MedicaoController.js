const MedicaoModel = require('../models/MedicaoModel');

function formatDateTimeLocal(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateBR(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

class MedicaoController {
  // ---- HISTÓRICO ----
  historico(req, res) {
    const medicoes = MedicaoModel.findByUserLast30Days(req.session.userId).map(m => ({
      ...m,
      dataFormatada: formatDateBR(m.dataHora),
      classificacao: m.tipo === 'pressao'
        ? MedicaoModel.getClassificacaoPressao(m.sistolico, m.diastolico)
        : MedicaoModel.getClassificacaoGlicemia(m.valor)
    }));

    res.render('medicoes/historico', {
      title: 'Histórico de Medições',
      userName: req.session.userName,
      medicoes,
      totalMedicoes: medicoes.length,
      errors: req.flash('error'),
      success: req.flash('success')
    });
  }

  // ---- PRESSÃO ARTERIAL ----
  showFormPressao(req, res) {
    const editando = req.params.id ? MedicaoModel.findById(req.params.id) : null;
    res.render('medicoes/pressao', {
      title: editando ? 'Editar Pressão Arterial' : 'Registrar Pressão Arterial',
      userName: req.session.userName,
      editando,
      dataHoraAtual: formatDateTimeLocal(new Date().toISOString()),
      dataHoraEdit: editando ? formatDateTimeLocal(editando.dataHora) : null,
      errors: req.flash('error'),
      success: req.flash('success')
    });
  }

  createPressao(req, res) {
    const { sistolico, diastolico, dataHora, observacao } = req.body;
    const errors = [];

    if (!sistolico) errors.push('Valor sistólico é obrigatório.');
    else if (parseInt(sistolico) < 60 || parseInt(sistolico) > 300) errors.push('Valor sistólico deve estar entre 60 e 300 mmHg.');

    if (!diastolico) errors.push('Valor diastólico é obrigatório.');
    else if (parseInt(diastolico) < 40 || parseInt(diastolico) > 200) errors.push('Valor diastólico deve estar entre 40 e 200 mmHg.');

    if (!dataHora) errors.push('Data e horário são obrigatórios.');

    if (errors.length > 0) {
      errors.forEach(e => req.flash('error', e));
      return res.redirect('/medicoes/pressao/nova');
    }

    MedicaoModel.createPressao({ userId: req.session.userId, sistolico, diastolico, dataHora, observacao });
    req.flash('success', 'Medição de pressão arterial registrada com sucesso!');
    res.redirect('/dashboard');
  }

  updatePressao(req, res) {
    const { sistolico, diastolico, dataHora, observacao } = req.body;
    const medicao = MedicaoModel.findById(req.params.id);

    if (!medicao || medicao.userId !== req.session.userId) {
      req.flash('error', 'Medição não encontrada.');
      return res.redirect('/historico');
    }

    const errors = [];
    if (!sistolico || parseInt(sistolico) < 60 || parseInt(sistolico) > 300)
      errors.push('Valor sistólico deve estar entre 60 e 300 mmHg.');
    if (!diastolico || parseInt(diastolico) < 40 || parseInt(diastolico) > 200)
      errors.push('Valor diastólico deve estar entre 40 e 200 mmHg.');
    if (!dataHora) errors.push('Data e horário são obrigatórios.');

    if (errors.length > 0) {
      errors.forEach(e => req.flash('error', e));
      return res.redirect(`/medicoes/pressao/${req.params.id}/editar`);
    }

    MedicaoModel.update(req.params.id, { sistolico: parseInt(sistolico), diastolico: parseInt(diastolico), dataHora, observacao });
    req.flash('success', 'Medição atualizada com sucesso!');
    res.redirect('/historico');
  }

  // ---- GLICEMIA ----
  showFormGlicemia(req, res) {
    const editando = req.params.id ? MedicaoModel.findById(req.params.id) : null;
    res.render('medicoes/glicemia', {
      title: editando ? 'Editar Glicemia' : 'Registrar Glicemia',
      userName: req.session.userName,
      editando,
      dataHoraAtual: formatDateTimeLocal(new Date().toISOString()),
      dataHoraEdit: editando ? formatDateTimeLocal(editando.dataHora) : null,
      errors: req.flash('error'),
      success: req.flash('success')
    });
  }

  createGlicemia(req, res) {
    const { valor, dataHora, observacao } = req.body;
    const errors = [];

    if (!valor) errors.push('Valor da glicemia é obrigatório.');
    else if (parseFloat(valor) < 20 || parseFloat(valor) > 600) errors.push('Valor da glicemia deve estar entre 20 e 600 mg/dL.');
    if (!dataHora) errors.push('Data e horário são obrigatórios.');

    if (errors.length > 0) {
      errors.forEach(e => req.flash('error', e));
      return res.redirect('/medicoes/glicemia/nova');
    }

    MedicaoModel.createGlicemia({ userId: req.session.userId, valor, dataHora, observacao });
    req.flash('success', 'Medição de glicemia registrada com sucesso!');
    res.redirect('/dashboard');
  }

  updateGlicemia(req, res) {
    const { valor, dataHora, observacao } = req.body;
    const medicao = MedicaoModel.findById(req.params.id);

    if (!medicao || medicao.userId !== req.session.userId) {
      req.flash('error', 'Medição não encontrada.');
      return res.redirect('/historico');
    }

    const errors = [];
    if (!valor || parseFloat(valor) < 20 || parseFloat(valor) > 600)
      errors.push('Valor da glicemia deve estar entre 20 e 600 mg/dL.');
    if (!dataHora) errors.push('Data e horário são obrigatórios.');

    if (errors.length > 0) {
      errors.forEach(e => req.flash('error', e));
      return res.redirect(`/medicoes/glicemia/${req.params.id}/editar`);
    }

    MedicaoModel.update(req.params.id, { valor: parseFloat(valor), dataHora, observacao });
    req.flash('success', 'Medição atualizada com sucesso!');
    res.redirect('/historico');
  }

  // ---- EXCLUSÃO ----
  delete(req, res) {
    const medicao = MedicaoModel.findById(req.params.id);
    if (!medicao || medicao.userId !== req.session.userId) {
      req.flash('error', 'Medição não encontrada.');
      return res.redirect('/historico');
    }
    MedicaoModel.delete(req.params.id);
    req.flash('success', 'Medição excluída com sucesso!');
    res.redirect('/historico');
  }
}

module.exports = new MedicaoController();
