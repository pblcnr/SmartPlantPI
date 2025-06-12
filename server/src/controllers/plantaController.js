import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criar planta
export async function criarPlanta(req, res) {
    const { nome } = req.body;
    const usuarioId = req.usuario.id;

    if (!nome) {
        return res.status(400).json({ error: "Nome da planta é obrigatório." });
    }

    try {
        const planta = await prisma.planta.create({
            data: {
                nome: nome,
                usuarioId: typeof usuarioId === "bigint" ? usuarioId : BigInt(usuarioId)
            }
        });
        // Converte BigInt para string antes de retornar
        res.status(201).json({
            ...planta,
            id: planta.id.toString(),
            usuarioId: planta.usuarioId.toString()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar planta." });
    }
}

// Listar plantas do usuário
export async function listarPlantas(req, res) {
    const usuarioId = req.usuario.id;

    try {
        const plantas = await prisma.planta.findMany({
            where: { usuarioId: typeof usuarioId === "bigint" ? usuarioId : BigInt(usuarioId) }
        });
        // Converte BigInt para string antes de retornar
        const plantasConvertidas = plantas.map(planta => ({
            ...planta,
            id: planta.id.toString(),
            usuarioId: planta.usuarioId.toString()
        }));
        res.json(plantasConvertidas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar plantas." });
    }
}

// Detalhar plantas por ID
export async function detalharPlanta(req, res) {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    try {
        const planta = await prisma.planta.findFirst({
            where: { id: BigInt(id), usuarioId: typeof usuarioId === "bigint" ? usuarioId : BigInt(usuarioId) }
        });

        if (!planta) {
            return res.status(404).json({ error: "Planta não encontrada." });
        }
        // Converte BigInt para string antes de retornar
        res.json({
            ...planta,
            id: planta.id.toString(),
            usuarioId: planta.usuarioId.toString()
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar planta." });
    }
}

// Atualizar planta
export async function atualizarPlanta(req, res) {
    const usuarioId = req.usuario.id;
    const { id } = req.params;
    const { nome } = req.body;

    try {
        const planta = await prisma.planta.updateMany({
            where: { id: BigInt(id), usuarioId: typeof usuarioId === "bigint" ? usuarioId : BigInt(usuarioId) },
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
export async function removerPlanta(req, res) {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    if (id === "1" || id === 1) {
        return res.status(403).json({ error: "Não é permitido remover a planta principal." });
    }

    try {
        const planta = await prisma.planta.deleteMany({
            where: { id: BigInt(id), usuarioId: typeof usuarioId === "bigint" ? usuarioId : BigInt(usuarioId) }
        });

        if (planta.count === 0) {
            return res.status(404).json({ error: "Planta não encontrada." });
        }

        res.json({ message: "Planta removida com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover planta." });
    }
}