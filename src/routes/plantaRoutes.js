const express = require("express");
const autenticarToken = require("../middlewares/authMiddleware");
const {
    criarPlanta,
    listarPlantas,
    detalharPlanta,
    atualizarPlanta,
    removerPlanta
} = require("../controllers/plantaController");

const router = express.Router();

router.post("/", autenticarToken, criarPlanta);
router.get("/", autenticarToken, listarPlantas);
router.get("/:id", autenticarToken, detalharPlanta);
router.put("/:id", autenticarToken, atualizarPlanta);
router.delete("/:id", autenticarToken, removerPlanta);

module.exports = router;