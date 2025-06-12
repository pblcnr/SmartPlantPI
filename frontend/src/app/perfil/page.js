"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Perfil() {
  const [usuario, setUsuario] = useState({ nome: "", email: "" });
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "" });
  const [mensagem, setMensagem] = useState("");
  const API_URL = "https://smartplant-backend-ct0o.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    // Buscar dados do usuário
    fetch(`${API_URL}/api/auth/usuario`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUsuario(data);
        setForm({ nome: data.nome, email: data.email });
      });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setMensagem("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/auth/usuario`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setUsuario(form);
        setEditando(false);
        setMensagem("Perfil atualizado com sucesso!");
        localStorage.setItem("usuarioNome", form.nome);
      } else {
        setMensagem("Erro ao atualizar perfil.");
      }
    } catch {
      setMensagem("Erro de conexão.");
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar onLogout={() => {
        localStorage.removeItem("token");
        window.location.href = "/auth";
      }} />
      <main className="flex-1 bg-gray-100 p-8 text-gray-900 flex flex-col items-center">
        <header className="mb-8 w-full">
          <div className="rounded-xl bg-gradient-to-r from-green-600 to-green-400 p-6 shadow-md flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white drop-shadow">Perfil</h2>
          </div>
        </header>
        <section className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow p-8">
            <h3 className="text-xl font-bold text-green-700 mb-4">Dados do Usuário</h3>
            {!editando ? (
              <>
                <div className="mb-2">
                  <span className="font-semibold">Nome:</span> {usuario.nome}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">E-mail:</span> {usuario.email}
                </div>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold cursor-pointer"
                  onClick={() => setEditando(true)}
                >
                  Editar Perfil
                </button>
              </>
            ) : (
              <form onSubmit={handleSalvar} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="nome"
                  className="p-3 border border-green-300 rounded text-gray-900"
                  placeholder="Nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  className="p-3 border border-green-300 rounded text-gray-900"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={() => {
                      setEditando(false);
                      setForm({ nome: usuario.nome, email: usuario.email });
                      setMensagem("");
                    }}
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
            )}
            {mensagem && (
              <div className="mt-4 text-center text-green-700 font-semibold">{mensagem}</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}