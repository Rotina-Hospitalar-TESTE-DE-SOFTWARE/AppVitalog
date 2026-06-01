const MedicaoModel = require('../models/MedicaoModel');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const PERIODOS = { '7': 7, '15': 15, '30': 30, '365': 365 };

function formatDateBR(iso) {
  const d = new Date(iso);
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function getLabelPeriodo(dias) {
  if (dias === 7) return 'Últimos 7 dias';
  if (dias === 15) return 'Últimos 15 dias';
  if (dias === 30) return 'Últimos 30 dias';
  return 'Últimos 12 meses';
}

class ExportController {
  showExport(req, res) {
    res.render('exportar/index', {
      title: 'Exportar Histórico',
      userName: req.session.userName,
      activeExportar: true,
      errors: req.flash('error'),
      success: req.flash('success')
    });
  }

  async exportPDF(req, res) {
    const dias = PERIODOS[req.body.periodo] || 30;
    const medicoes = MedicaoModel.findByUserAndPeriod(req.session.userId, dias);

    if (medicoes.length === 0) {
      req.flash('error', 'Nenhuma medição encontrada para o período selecionado.');
      return res.redirect('/exportar');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=historico-medicoes-${Date.now()}.pdf`);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#1a3c5e').text('Monitor de Saúde', { align: 'center' });
    doc.fontSize(14).font('Helvetica').fillColor('#444').text('Histórico de Medições', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor('#666').text(`Período: ${getLabelPeriodo(dias)}`, { align: 'center' });
    doc.text(`Gerado em: ${formatDateBR(new Date().toISOString())}`, { align: 'center' });
    doc.text(`Usuário: ${req.session.userName}`, { align: 'center' });
    doc.moveDown();

    // Aviso
    doc.fontSize(9).fillColor('#c0392b')
      .text('⚠ AVISO: Este documento tem caráter de apoio ao acompanhamento de saúde. Não constitui diagnóstico médico nem substitui avaliação clínica profissional.', {
        align: 'center', lineGap: 2
      });
    doc.moveDown();

    // Separador
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#1a3c5e').stroke();
    doc.moveDown(0.5);

    // Tabela - cabeçalho
    const col = { tipo: 50, data: 160, valores: 310, classif: 420 };
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a3c5e');
    doc.text('Tipo', col.tipo, doc.y, { width: 100 });
    doc.text('Data/Hora', col.data, doc.y - 12, { width: 140 });
    doc.text('Valores', col.valores, doc.y - 12, { width: 100 });
    doc.text('Classificação', col.classif, doc.y - 12, { width: 120 });
    doc.moveDown(0.3);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#ccc').stroke();
    doc.moveDown(0.3);

    medicoes.forEach((m, i) => {
      if (doc.y > 720) { doc.addPage(); doc.moveDown(); }

      const bg = i % 2 === 0 ? '#f7f9fc' : '#ffffff';
      const yPos = doc.y;
      doc.rect(50, yPos - 2, 495, 18).fillColor(bg).fill();

      const tipo = m.tipo === 'pressao' ? 'Pressão Arterial' : 'Glicemia';
      const valores = m.tipo === 'pressao'
        ? `${m.sistolico}/${m.diastolico} mmHg`
        : `${m.valor} mg/dL`;
      const classif = m.tipo === 'pressao'
        ? MedicaoModel.getClassificacaoPressao(m.sistolico, m.diastolico).label
        : MedicaoModel.getClassificacaoGlicemia(m.valor).label;

      doc.fontSize(9).font('Helvetica').fillColor('#333');
      doc.text(tipo, col.tipo, yPos, { width: 100 });
      doc.text(formatDateBR(m.dataHora), col.data, yPos, { width: 140 });
      doc.text(valores, col.valores, yPos, { width: 100 });
      doc.text(classif, col.classif, yPos, { width: 120 });
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#1a3c5e').stroke();
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor('#666').text(`Total de registros: ${medicoes.length}`, { align: 'right' });

    doc.end();
  }

  async exportExcel(req, res) {
    const dias = PERIODOS[req.body.periodo] || 30;
    const medicoes = MedicaoModel.findByUserAndPeriod(req.session.userId, dias);

    if (medicoes.length === 0) {
      req.flash('error', 'Nenhuma medição encontrada para o período selecionado.');
      return res.redirect('/exportar');
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Monitor de Saúde';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Medições', {
      pageSetup: { paperSize: 9, orientation: 'landscape' }
    });

    // Título
    sheet.mergeCells('A1:G1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'Monitor de Saúde — Histórico de Medições';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FF1a3c5e' } };
    titleCell.alignment = { horizontal: 'center' };

    sheet.mergeCells('A2:G2');
    const subCell = sheet.getCell('A2');
    subCell.value = `Período: ${getLabelPeriodo(dias)} | Gerado em: ${formatDateBR(new Date().toISOString())} | Usuário: ${req.session.userName}`;
    subCell.font = { size: 10, color: { argb: 'FF666666' } };
    subCell.alignment = { horizontal: 'center' };

    sheet.addRow([]);

    // Cabeçalhos
    const headerRow = sheet.addRow(['Tipo', 'Data/Hora', 'Sistólico (mmHg)', 'Diastólico (mmHg)', 'Glicemia (mg/dL)', 'Classificação', 'Observação']);
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1a3c5e' } };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' }, bottom: { style: 'thin' },
        left: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    // Dados
    medicoes.forEach((m, i) => {
      const classif = m.tipo === 'pressao'
        ? MedicaoModel.getClassificacaoPressao(m.sistolico, m.diastolico).label
        : MedicaoModel.getClassificacaoGlicemia(m.valor).label;

      const row = sheet.addRow([
        m.tipo === 'pressao' ? 'Pressão Arterial' : 'Glicemia',
        formatDateBR(m.dataHora),
        m.tipo === 'pressao' ? m.sistolico : '—',
        m.tipo === 'pressao' ? m.diastolico : '—',
        m.tipo === 'glicemia' ? m.valor : '—',
        classif,
        m.observacao || ''
      ]);

      const bgColor = i % 2 === 0 ? 'FFF7F9FC' : 'FFFFFFFF';
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    // Aviso
    sheet.addRow([]);
    const aviso = sheet.addRow(['⚠ Este documento tem caráter de apoio ao acompanhamento de saúde. Não constitui diagnóstico médico.']);
    sheet.mergeCells(`A${aviso.number}:G${aviso.number}`);
    aviso.getCell('A').font = { color: { argb: 'FFc0392b' }, italic: true, size: 9 };

    // Larguras
    sheet.columns = [
      { width: 18 }, { width: 20 }, { width: 18 }, { width: 18 },
      { width: 18 }, { width: 22 }, { width: 30 }
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=historico-medicoes-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  }
}

module.exports = new ExportController();
