"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PlantCard from "../components/PlantCard";

export default function MinhasPlantas() {
  const [plantas, setPlantas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [novaPlanta, setNovaPlanta] = useState({ nome: "" });
  const API_URL = "https://smartplant-backend-ct0o.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    fetch(`${API_URL}/api/plantas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(async plantas => {
        if (!Array.isArray(plantas)) {
          setPlantas([]);
          setCarregando(false);
          return;
        }
        // Para cada planta, buscar a última leitura
        const plantasComLeitura = await Promise.all(
          plantas.map(async (planta) => {
            const res = await fetch(`${API_URL}/api/plantas/${planta.id}/sensordata`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const historico = await res.json();
            const ultima = historico[0];
            return {
              ...planta,
              status: ultima && ultima.umidade > 40 ? "OK" : "Alerta",
              ultimaLeitura: ultima || null,
            };
          })
        );
        setPlantas(plantasComLeitura);
        setCarregando(false);
      });
  }, []);

  // Função para deletar planta
  async function handleDeletePlanta(plantaId) {
    const token = localStorage.getItem("token");
    if (!window.confirm("Tem certeza que deseja remover esta planta?")) return;
    try {
      const res = await fetch(`${API_URL}/api/plantas/${plantaId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPlantas(plantas => plantas.filter(p => p.id !== plantaId));
      } else {
        alert("Erro ao remover planta.");
      }
    } catch {
      alert("Erro de conexão ao remover planta.");
    }
  }

  // Função para adicionar planta
  async function handleAddPlanta(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/plantas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novaPlanta),
      });
      const data = await res.json();
      if (res.ok) {
        setPlantas(plantas => [...plantas, { ...data, status: "OK", ultimaLeitura: null }]);
        setShowForm(false);
        setNovaPlanta({ nome: "" });
      } else {
        alert(data.error || "Erro ao adicionar planta.");
      }
    } catch {
      alert("Erro de conexão ao adicionar planta.");
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar onLogout={() => {
        localStorage.removeItem("token");
        window.location.href = "/auth";
      }} />
      <main className="flex-1 bg-gray-100 p-8 text-gray-900">
        <header className="mb-8">
          <div className="rounded-xl bg-gradient-to-r from-green-600 to-green-400 p-6 shadow-md flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white drop-shadow">Minhas Plantas</h2>
          </div>
        </header>
        <section className="mb-8">
          <button
            className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
            onClick={() => setShowForm(true)}
          >
            + Adicionar nova planta
          </button>
          {showForm && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h3 className="text-2xl font-bold mb-4 text-green-700">Adicionar nova planta</h3>
                <form onSubmit={handleAddPlanta} className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Nome da planta"
                    className="p-3 border border-green-300 rounded text-gray-900"
                    value={novaPlanta.nome}
                    onChange={e => setNovaPlanta({ nome: e.target.value })}
                    required
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center gap-6">
            {plantas.map(planta => (
              <div className="w-full max-w-md" key={planta.id}>
                <PlantCard planta={planta} onDelete={handleDeletePlanta} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}