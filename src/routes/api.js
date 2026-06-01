const express = require("express");
const router = express.Router();

const auth = require("../controllers/api/AuthApiController");
const user = require("../controllers/api/UserApiController");
const medicao = require("../controllers/api/MedicaoApiController");

const apiAuth = require("../middlewares/apiAuth");

router.post("/auth/register", auth.register);
router.post("/auth/login", auth.login);
router.post("/auth/logout", auth.logout);

router.get("/users/me", apiAuth, user.me);

router.get("/historico", apiAuth, medicao.listarHistorico);

router.get("/medicoes/pressao", apiAuth, medicao.listarPressao);
router.get("/medicoes/pressao/:id", apiAuth, medicao.buscarPressao);
router.post("/medicoes/pressao", apiAuth, medicao.criarPressao);
router.put("/medicoes/pressao/:id", apiAuth, medicao.atualizarPressao);
router.delete("/medicoes/pressao/:id", apiAuth, medicao.excluir);

router.get("/medicoes/glicemia", apiAuth, medicao.listarGlicemia);
router.get("/medicoes/glicemia/:id", apiAuth, medicao.buscarGlicemia);
router.post("/medicoes/glicemia", apiAuth, medicao.criarGlicemia);
router.put("/medicoes/glicemia/:id", apiAuth, medicao.atualizarGlicemia);
router.delete("/medicoes/glicemia/:id", apiAuth, medicao.excluir);

module.exports = router;
