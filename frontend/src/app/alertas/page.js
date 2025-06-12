"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AlertPanel from "../components/AlertPanel";

export default function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const API_URL = "https://smartplant-backend-ct0o.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    async function fetchAlertas() {
      try {
        const res = await fetch(`${API_URL}/api/alertas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAlertas(Array.isArray(data) ? data : []);
      } catch {
        setAlertas([]);
      } finally {
        setCarregando(false);
      }
    }
    fetchAlertas();
    const interval = setInterval(fetchAlertas, 900000);
    return () => clearInterval(interval);
  }, []);

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