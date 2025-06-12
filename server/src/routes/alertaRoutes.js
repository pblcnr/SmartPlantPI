import express from "express";
import autenticarToken from "../middlewares/authMiddleware.js";
import { configurarAlerta, consultarAlerta, listarAlertasUsuario } from "../controllers/alertaController.js";

const router = express.Router();

router.get("/", autenticarToken, listarAlertasUsuario);
router.post("/:plantaId/alerta", autenticarToken, configurarAlerta);
router.get("/:plantaId/alerta", autenticarToken, consultarAlerta);

export default router;