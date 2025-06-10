import express from "express";
import autenticarToken from "../middlewares/authMiddleware.js";
import { estatisticasSensor } from "../controllers/estatisticasController.js";

const router = express.Router();

router.get("/estatisticas", autenticarToken, estatisticasSensor);

export default router;