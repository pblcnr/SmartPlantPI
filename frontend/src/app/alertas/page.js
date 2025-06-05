"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AlertPanel from "../components/AlertPanel";

export default function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    fetch("http://localhost:3001/api/alertas", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setAlertas(Array.isArray(data) ? data : []);
        setCarregando(false);
      })
      .catch(() => {
        setCarregando(false);
        setAlertas([]);
      });
  }, []);

  if (carregando) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
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
            <h2 className="text-3xl font-bold text-white drop-shadow">Alertas</h2>
          </div>
        </header>
        <section>
          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-md">
              <AlertPanel alertas={alertas} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}