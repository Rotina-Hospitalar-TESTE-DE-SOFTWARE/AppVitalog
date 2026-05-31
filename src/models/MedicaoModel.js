const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class MedicaoModel {
  static findByUser(userId) {
    db.read();
    return db.data.medicoes
      .filter(m => m.userId === userId)
      .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
  }

  static findById(id) {
    db.read();
    return db.data.medicoes.find(m => m.id === id) || null;
  }

  static findByUserAndPeriod(userId, dias) {
    db.read();
    const limite = new Date();
    if (dias === 365) {
      limite.setFullYear(limite.getFullYear() - 1);
    } else {
      limite.setDate(limite.getDate() - dias);
    }
    return db.data.medicoes
      .filter(m => m.userId === userId && new Date(m.dataHora) >= limite)
      .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
  }

  static findByUserLast30Days(userId) {
    return this.findByUserAndPeriod(userId, 30);
  }

  static createPressao({ userId, sistolico, diastolico, dataHora, observacao }) {
    db.read();
    const medicao = {
      id: uuidv4(),
      userId,
      tipo: 'pressao',
      sistolico: parseInt(sistolico),
      diastolico: parseInt(diastolico),
      unidade: 'mmHg',
      dataHora,
      observacao: observacao || '',
      criadoEm: new Date().toISOString()
    };
    db.data.medicoes.push(medicao);
    db.write();
    return medicao;
  }

  static createGlicemia({ userId, valor, dataHora, observacao }) {
    db.read();
    const medicao = {
      id: uuidv4(),
      userId,
      tipo: 'glicemia',
      valor: parseFloat(valor),
      unidade: 'mg/dL',
      dataHora,
      observacao: observacao || '',
      criadoEm: new Date().toISOString()
    };
    db.data.medicoes.push(medicao);
    db.write();
    return medicao;
  }

  static update(id, data) {
    db.read();
    const idx = db.data.medicoes.findIndex(m => m.id === id);
    if (idx === -1) return null;
    db.data.medicoes[idx] = { ...db.data.medicoes[idx], ...data, atualizadoEm: new Date().toISOString() };
    db.write();
    return db.data.medicoes[idx];
  }

  static delete(id) {
    db.read();
    const idx = db.data.medicoes.findIndex(m => m.id === id);
    if (idx === -1) return false;
    db.data.medicoes.splice(idx, 1);
    db.write();
    return true;
  }

  static getClassificacaoPressao(sistolico, diastolico) {
    if (sistolico < 120 && diastolico < 80) return { label: 'Normal', cls: 'normal' };
    if (sistolico < 130 && diastolico < 80) return { label: 'Elevada', cls: 'elevada' };
    if (sistolico < 140 || diastolico < 90) return { label: 'Hipertensão Estágio 1', cls: 'hiper1' };
    if (sistolico < 180 || diastolico < 120) return { label: 'Hipertensão Estágio 2', cls: 'hiper2' };
    return { label: 'Crise Hipertensiva', cls: 'crise' };
  }

  static getClassificacaoGlicemia(valor) {
    if (valor < 70) return { label: 'Hipoglicemia', cls: 'hipo' };
    if (valor <= 99) return { label: 'Normal', cls: 'normal' };
    if (valor <= 125) return { label: 'Pré-diabetes', cls: 'pre' };
    return { label: 'Diabetes', cls: 'diabetes' };
  }
}

module.exports = MedicaoModel;
