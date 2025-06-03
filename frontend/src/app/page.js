"use client";
import { useEffect, useState } from "react";
import Sidebar from "../app/components/Sidebar";
import PlantCard from "../app/components/PlantCard";
import AlertPanel from "../app/components/AlertPanel";

export default function Dashboard() {
  const [usuario, setUsuario] = useState({ nome: "" });
  const [plantas, setPlantas] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nome = localStorage.getItem("usuarioNome") || "Usuário";
    setUsuario({ nome });
    console.log("Era pra tá aqui", usuario);
    console.log("Nome:", nome)
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    // Buscar plantas
    fetch("http://localhost:3001/api/plantas", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          // Token inválido ou expirado
          localStorage.removeItem("token");
          window.location.href = "/auth";
          return null;
        }
        return res.json();
      })
      .then(async plantas => {
        if (!plantas) return;
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
        setCarregando(false);
      });

    // Buscar alertas recentes (exemplo: pega alertas da primeira planta, adapte conforme sua lógica)
    fetch("http://localhost:3001/api/plantas/1/alertas", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          window.location.href = "/auth";
          return null;
        }
        return res.json();
      })
      .then(data => setAlertas(data));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  }

  if (carregando) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
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