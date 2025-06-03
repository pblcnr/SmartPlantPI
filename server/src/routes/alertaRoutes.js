import express from "express";
import autenticarToken from "../middlewares/authMiddleware.js";
import { configurarAlerta, consultarAlerta } from "../controllers/alertaController.js";

const router = express.Router();

router.post("/:plantId/alerta", autenticarToken, configurarAlerta);
router.get("/:plantId/alerta", autenticarToken, consultarAlerta);

export default router;