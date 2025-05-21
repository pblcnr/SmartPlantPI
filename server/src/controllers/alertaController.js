import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function configurarAlerta(req, res) {
    const { plantaId } = req.params;
    const { minUmidade } = req.body;

    if (typeof minUmidade !== "number") {
        return res.status(400).json({ error: "Umidade miníma deve ser um número. "});
    }

    try {
        // Upsert: cria se não existir, atualiza se já existir
        const limite = await prisma.alerta.upsert({
            where: { plantaId: Number(plantaId) },
            update: { minUmidade },
            create: { plantaId: Number(plantaId), minUmidade}
        });
        res.status(200).json(limite);
    } catch (error) {
        res.status(500).json({ error: "Erro ao configurar alerta." });
    }
}

export async function consultarAlerta(req, res) {
    const { plantaId } = req.params;

    try {

        const limite = await prisma.alerta.findUnique({
            where: { plantaId: Number(plantaId) }
        });

        if (!limite) {
            return res.status(404).json({ error: "Limite não configurado. "})
        }
        res.json(limite);
    } catch (error) {
        res.status(500).json({ error: "Erro ao consultar limite de alerta." });
    }
}