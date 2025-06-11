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
        const sensorData = await prisma.sensordata.create({
            data: {
                temperatura,
                umidade,
                plantaId: Number(plantaId)
            }
        });
        // Converte BigInt para string antes de retornar
        res.status(201).json({
            ...sensorData,
            id: sensorData.id.toString(),
            plantaId: sensorData.plantaId.toString()
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao registrar dados do sensor." });
    }
}

// Listar histórico de dados do sensor
export async function listarSensorData(req, res) {
    const { plantaId } = req.params;

    try {
        const historico = await prisma.sensordata.findMany({
            where: { plantaId: Number(plantaId) },
            orderBy: { timestamp: "desc" }
        });
        // Converte BigInt para string antes de retornar
        const historicoConvertido = historico.map(item => ({
            ...item,
            id: item.id.toString(),
            plantaId: item.plantaId.toString()
        }));
        res.json(historicoConvertido);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar histórico do sensor." });
    }
}