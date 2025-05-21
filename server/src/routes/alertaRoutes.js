import express from "express";
import autenticarToken from "../middlewares/authMiddleware.js";
import { configurarLimiteAlerta, consultarLimiteAlerta } from "../controllers/alertLimitController.js";

const router = express.Router();

router.post("/:plantId/alerta", autenticarToken, configurarLimiteAlerta);
router.get("/:plantId/alerta", autenticarToken, consultarLimiteAlerta);

export default router;