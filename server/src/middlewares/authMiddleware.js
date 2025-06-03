import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const chaveSecreta = process.env.JWT_SECRET;

export default function autenticarToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido." });
    }

    jwt.verify(token, chaveSecreta, (error, usuario) => {
        if (error) {
            return res.status(403).json({ error: "Token inválido." });
        }
        req.usuario = usuario;
        next();
    });
}