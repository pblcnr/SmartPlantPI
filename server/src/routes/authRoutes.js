import express from "express";
import { registro, login, atualizarUsuario, obterUsuario } from "../controllers/authController.js";
import autenticarToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/registro", registro);
router.post("/login", login);
router.get("/usuario", autenticarToken, obterUsuario)
router.put("/usuario", autenticarToken, atualizarUsuario);

export default router;