const express = require('express');
const router = express.Router();
const MedicaoController = require('../controllers/MedicaoController');
const ExportController = require('../controllers/ExportController');
const RegistrarController = require('../controllers/RegistrarController');
const { auth } = require('../middlewares/auth');

// Tela principal = registrar
router.get('/dashboard', auth, (req, res) => res.redirect('/registrar'));
router.get('/registrar', auth, RegistrarController.index);

// Histórico
router.get('/historico', auth, MedicaoController.historico);

// Pressão
router.post('/medicoes/pressao', auth, MedicaoController.createPressao);
router.get('/medicoes/pressao/:id/editar', auth, MedicaoController.showFormPressao);
router.post('/medicoes/pressao/:id', auth, MedicaoController.updatePressao);

// Glicemia
router.post('/medicoes/glicemia', auth, MedicaoController.createGlicemia);
router.get('/medicoes/glicemia/:id/editar', auth, MedicaoController.showFormGlicemia);
router.post('/medicoes/glicemia/:id', auth, MedicaoController.updateGlicemia);

// Exclusão
router.post('/medicoes/:id/excluir', auth, MedicaoController.delete);

// Exportar
router.get('/exportar', auth, ExportController.showExport);
router.post('/exportar/pdf', auth, ExportController.exportPDF);
router.post('/exportar/excel', auth, ExportController.exportExcel);

module.exports = router;
