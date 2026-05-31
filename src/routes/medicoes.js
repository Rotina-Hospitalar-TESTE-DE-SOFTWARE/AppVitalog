const express = require('express');
const router = express.Router();
const MedicaoController = require('../controllers/MedicaoController');
const ExportController = require('../controllers/ExportController');
const DashboardController = require('../controllers/DashboardController');
const { auth } = require('../middlewares/auth');

router.get('/dashboard', auth, DashboardController.index);
router.get('/historico', auth, MedicaoController.historico);

// Pressão
router.get('/medicoes/pressao/nova', auth, MedicaoController.showFormPressao);
router.post('/medicoes/pressao', auth, MedicaoController.createPressao);
router.get('/medicoes/pressao/:id/editar', auth, MedicaoController.showFormPressao);
router.post('/medicoes/pressao/:id', auth, MedicaoController.updatePressao);

// Glicemia
router.get('/medicoes/glicemia/nova', auth, MedicaoController.showFormGlicemia);
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
