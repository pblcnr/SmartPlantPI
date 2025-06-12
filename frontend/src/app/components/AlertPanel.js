export default function AlertPanel({ alertas }) {
  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h3 className="text-lg font-bold text-red-600 mb-2">Alertas Recentes</h3>
      {alertas.length === 0 ? (
        <p className="text-gray-500">Nenhum alerta recente.</p>
      ) : (
        <ul>
          {alertas.map((alerta, idx) => (
            <li key={idx} className="mb-1">
              <span className="font-semibold">{alerta.plantaNome || alerta.planta?.nome || "Planta"}:</span>{" "}
              {alerta.tipo === "umidade"
                ? `Umidade baixa (${alerta.valorAtual ?? "-"}% < ${alerta.limite ?? "-"})`
                : alerta.mensagem || "Alerta: Umidade abaixo de 50%"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}