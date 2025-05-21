import express from "express";
import autenticarToken from "../middlewares/authMiddleware.js";
import { registrarSensorData, listarSensorData } from "../controllers/sensorDataController.js";

const router = express.Router();

router.post("/:plantaId/sensordata", autenticarToken, registrarSensorData);
router.get("/:plantaId/sensordata", autenticarToken, listarSensorData);

export default router;