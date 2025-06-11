import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export async function registro(req, res) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
    }

    try {
        const existingUser = await prisma.usuario.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ error: "Email já cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const usuario = await prisma.usuario.create({
            data: { nome, email, senha: hashedPassword },
        });

        res.status(201).json({ id: usuario.id.toString(), nome: usuario.nome, email: usuario.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao cadastrar usuário." });
    }
}

export async function login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ error: "Usuário ou senha inválidos." });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: "Usuário ou senha inválidos" });
        }

        // Gera token JWT (convertendo id para string)
        const token = jwt.sign(
            { id: usuario.id.toString(), email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token, usuario: { id: usuario.id.toString(), nome: usuario.nome, email: usuario.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao fazer login." });
    }
}

export async function atualizarUsuario(req, res) {
    const { nome, email } = req.body;
    const usuarioId = req.usuario.id;

    if (!nome || !email) {
        return res.status(400).json({ error: "Nome e email são obrigatórios."});
    }

    try {
        const usuario = await prisma.usuario.update({
            where: { id: typeof usuarioId === "bigint" ? usuarioId : BigInt(usuarioId) },
            data: { nome, email }
        });
        res.json({ nome: usuario.nome, email: usuario.email });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário."});
    }
}

export async function obterUsuario(req, res) {
    try {
        const usuarioId = req.usuario.id;
        const usuario = await prisma.usuario.findUnique({
            where: { id: typeof usuarioId === "bigint" ? usuarioId : BigInt(usuarioId) },
            select: { nome: true, email: true }
        });

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário. "});
    }
}