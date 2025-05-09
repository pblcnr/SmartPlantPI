const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Criar planta
async function criarPlanta(req, res) {
    const { nome } = req.body;
    const usuarioId = req.usuario.id;

    if (!nome) {
        return res.status(400).json({ error: "Nome da planta é obrigatório." });
    }

    try {
        const planta = await prisma.planta.create({
            data: {
                nome: nome,
                usuarioId: usuarioId
            }
        });
        res.status(201).json(planta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar planta." });
    }
}

// Listar plantas do usuário
async function listarPlantas(req, res) {
    const usuarioId = req.usuario.id;

    try {
        const plantas = await prisma.planta.findMany({
            where: { usuarioId }
        });
        res.json(plantas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar plantas." });
    }
}

// Detalhar plantas por ID
async function detalharPlanta(req, res) {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    try {
        const planta = await prisma.planta.findFirst({
            where: { id: Number(id), usuarioId }
        });

        if (!planta) {
            return res.status(404).json({ error: "Planta não encontrada." });
        }
        res.json(planta);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar planta." });
    }
}

// Atualizar planta
async function atualizarPlanta(req, res) {
    const usuarioId = req.usuario.id;
    const { id } = req.params;
    const { nome } = req.body;

    try {
        const planta = await prisma.planta.updateMany({
            where: { id: Number(id), usuarioId },
            data: { nome: nome }
        });

        if (planta.count === 0) {
            return res.status(404).json({ error: "Planta não encontrada." });
        }

        res.json({ message: "Planta atualizada com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar planta." });
    }
}

// Remover planta
async function removerPlanta(req, res) {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    try {
        const planta = await prisma.planta.deleteMany({
            where: { id: Number(id), usuarioId }
        });

        if (planta.count === 0) {
            return res.status(404).json({ error: "Planta não encontrada." });
        }

        res.json({ message: "Planta removida com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover planta." });
    }
}

module.exports = {
    criarPlanta,
    listarPlantas,
    detalharPlanta,
    atualizarPlanta,
    removerPlanta
};