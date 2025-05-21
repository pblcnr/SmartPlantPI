import express from "express";
import autenticarToken from "../middlewares/authMiddleware";
import {
    criarPlanta,
    listarPlantas,
    detalharPlanta,
    atualizarPlanta,
    removerPlanta
} from "../controllers/plantaController";

const router = express.Router();

router.post("/", autenticarToken, criarPlanta);
router.get("/", autenticarToken, listarPlantas);
router.get("/:id", autenticarToken, detalharPlanta);
router.put("/:id", autenticarToken, atualizarPlanta);
router.delete("/:id", autenticarToken, removerPlanta);

export default router;