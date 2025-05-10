require("dotenv").config();
const jwt = require("jsonwebtoken");

const chaveSecreta = process.env.JWT_SECRET;

function autenticarToken(req, res, next) {
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

module.exports = autenticarToken;