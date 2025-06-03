import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Receber dados do sensor
export async function registrarSensorData(req, res) {
    const { plantaId } = req.params;
    const { temperatura, umidade } = req.body;

    if (typeof temperatura !== "number" || typeof umidade !== "number") {
        return res.status(400).json({ error: "Temperatura e umidade devem ser números." });
    }

    try {
        const sensorData = await prisma.sensorData.create({
            data: {
                temperatura,
                umidade,
                plantaId: Number(plantaId)
            }
        });
        res.status(201).json(sensorData);
    } catch (error) {
        res.status(500).json({ error: "Erro ao registrar dados do sensor." });
    }
}

// Listar histórico de dados do sensor
export async function listarSensorData(req, res) {
    const { plantaId } = req.params;

    try {
        const historico = await prisma.sensorData.findMany({
            where: { plantaId: Number(plantaId) },
            orderBy: { timestamp: "desc" }
        });
        res.json(historico);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar histórico do sensor." });
    }
}