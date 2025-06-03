"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PlantCard from "../components/PlantCard";
import AlertPanel from "../components/AlertPanel";

export default function Dashboard() {
  const [usuario, setUsuario] = useState({ nome: "Usuário" });
  const [plantas, setPlantas] = useState([]);
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    // Buscar plantas
    fetch("http://localhost:3001/api/plantas", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(async plantas => {
        // Para cada planta, buscar a última leitura
        const plantasComLeitura = await Promise.all(
          plantas.map(async (planta) => {
            const res = await fetch(`http://localhost:3001/api/plantas/${planta.id}/sensordata`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const historico = await res.json();
            const ultima = historico[0];
            return {
              ...planta,
              status: ultima && ultima.umidade > 40 ? "OK" : "Alerta", // Exemplo de status
              ultimaLeitura: ultima
                ? `Temp: ${ultima.temperatura}°C, Umidade: ${ultima.umidade}% em ${new Date(ultima.timestamp).toLocaleString()}`
                : "Sem dados",
            };
          })
        );
        setPlantas(plantasComLeitura);
      });

    // Buscar alertas recentes (exemplo: pega alertas da primeira planta, adapte conforme sua lógica)
    fetch("http://localhost:3001/api/plantas/1/alertas", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAlertas(data));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 bg-amber-100 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold">Bem-vindo, {usuario.nome}!</h2>
        </header>
        <section className="mb-8">
          <button className="mb-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">
            + Adicionar nova planta
          </button>
          <div>
            {plantas.map(planta => (
              <PlantCard key={planta.id} planta={planta} />
            ))}
          </div>
        </section>
        <section>
          <AlertPanel alertas={alertas} />
        </section>
      </main>
    </div>
  );
}