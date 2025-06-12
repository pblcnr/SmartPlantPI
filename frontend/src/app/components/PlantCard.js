export default function PlantCard({ planta, onDelete }) {
  const leitura = planta.ultimaLeitura;

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h3 className="text-xl font-bold text-green-700">{planta.nome}</h3>
      <p>Status: <span className={planta.status === "OK" ? "text-green-700" : "text-red-600"}>{planta.status}</span></p>
      {leitura && typeof leitura === "object" ? (
        <div className="text-sm mt-2">
          <p>Temperatura: <span className="font-semibold">{leitura.temperatura}°C</span></p>
          <p>Umidade: <span className="font-semibold">{leitura.umidade}%</span></p>
          <p className="text-gray-500">Data: {new Date(leitura.timestamp).toLocaleString()}</p>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">Sem leituras recentes.</p>
      )}
      <div className="flex gap-2 mt-4">
        {/* Só mostra o botão Deletar se o id for diferente de 1 */}
        {String(planta.id) !== "1" && (
          <button
            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-800 cursor-pointer"
            onClick={() => onDelete(planta.id)}
          >
            Deletar
          </button>
        )}
      </div>
    </div>
  );
}