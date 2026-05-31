const MedicaoModel = require('../models/MedicaoModel');

class DashboardController {
  index(req, res) {
    const medicoes = MedicaoModel.findByUserLast30Days(req.session.userId);
    const pressoes = medicoes.filter(m => m.tipo === 'pressao');
    const glicemias = medicoes.filter(m => m.tipo === 'glicemia');

    const ultimaPressao = pressoes[0] || null;
    const ultimaGlicemia = glicemias[0] || null;

    const classificacaoPressao = ultimaPressao
      ? MedicaoModel.getClassificacaoPressao(ultimaPressao.sistolico, ultimaPressao.diastolico)
      : null;
    const classificacaoGlicemia = ultimaGlicemia
      ? MedicaoModel.getClassificacaoGlicemia(ultimaGlicemia.valor)
      : null;

    // Dados para gráfico (últimas 10 medições de cada tipo)
    const dadosPressao = pressoes.slice(0, 10).reverse().map(m => ({
      data: formatDate(m.dataHora),
      sistolico: m.sistolico,
      diastolico: m.diastolico
    }));

    const dadosGlicemia = glicemias.slice(0, 10).reverse().map(m => ({
      data: formatDate(m.dataHora),
      valor: m.valor
    }));

    res.render('dashboard/index', {
      title: 'Painel Principal',
      userName: req.session.userName,
      totalMedicoes: medicoes.length,
      totalPressoes: pressoes.length,
      totalGlicemias: glicemias.length,
      ultimaPressao,
      ultimaGlicemia,
      classificacaoPressao,
      classificacaoGlicemia,
      dadosPressaoJSON: JSON.stringify(dadosPressao),
      dadosGlicemiaJSON: JSON.stringify(dadosGlicemia),
      errors: req.flash('error'),
      success: req.flash('success')
    });
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
}

module.exports = new DashboardController();
