export default function PlantCard({ planta }) {
    return (
        <div className="bg-white rounded shadow p-4 mb-4">
            <h3 className="text-xl font-bold text-green-700">{planta.nome}</h3>
            <p>Status: <span className={planta.status === "OK" ? "text-green-700" : "text-red-600"}>{planta.status}</span></p>
            <p>Última leitura: {planta.ultimaLeitura}</p>
            <button className="mt-2 px-4 py-1 bg-green-700 text-white rounded hover:bg-green-800">Detalhes</button>
        </div>
    );
}