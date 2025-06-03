import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export async function registro(req, res) {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
    }

    try {
        const existingUser = await prisma.usuario.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ error: "Email já cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.create({
            data: { nome, email, senha: hashedPassword },
        });

        res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao cadastrar usuário." });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ error: "Usuário ou senha inválidos." });
        }

        const senhaCorreta = await bcrypt.compare(password, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: "Usuário ou senha inválidos" });
        }

        // Gera token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao fazer login." });
    }
}