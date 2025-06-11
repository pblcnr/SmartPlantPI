import { PrismaClient } from "@prisma/client";
import * as ss from "simple-statistics";
const prisma = new PrismaClient();

export async function estatisticasSensor(req, res) {
    try {
        const usuarioId = req.usuario.id;

        const plantas = await prisma.planta.findMany({
            where: { usuarioId },
            select: { id: true }
        });
        const plantasIds = plantas.map(p => typeof p.id === "bigint" ? Number(p.id) : p.id);

        // Busca dados do sensor
        const dados = await prisma.sensordata.findMany({
            where: { plantaId: { in: plantasIds } },
            select: { umidade: true, temperatura: true }
        });

        const umidades = dados.map(d => d.umidade).filter(Number.isFinite);
        const temperaturas = dados.map(d => d.temperatura).filter(Number.isFinite);

        // Estatísticas umidade
        const mediaUmidade = ss.mean(umidades);
        const modaUmidade = ss.mode(umidades);
        const medianaUmidade = ss.median(umidades);
        const desvioPadraoUmidade = ss.standardDeviation(umidades);
        const assimetriaUmidade = ss.sampleSkewness(umidades);

        // Estatísticas temperatura
        const mediaTemperatura = ss.mean(temperaturas);
        const modaTemperatura = ss.mode(temperaturas);
        const medianaTemperatura = ss.median(temperaturas);
        const desvioPadraoTemperatura = ss.standardDeviation(temperaturas);
        const assimetriaTemperatura = ss.sampleSkewness(temperaturas);

        // Registros de umidade acima de 50%
        const acima50 = umidades.filter(u => u > 50).length;
        const porcentagemAcima50 = umidades.length ? (acima50 / umidades.length) * 100 : 0;

        res.json({
            totalRegistros: umidades.length,
            mediaUmidade,
            modaUmidade,
            medianaUmidade,
            desvioPadraoUmidade,
            assimetriaUmidade,
            porcentagemAcima50,
            mediaTemperatura,
            modaTemperatura,
            medianaTemperatura,
            desvioPadraoTemperatura,
            assimetriaTemperatura,
            umidades,
            temperaturas
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar estatísticas." });
    }
}