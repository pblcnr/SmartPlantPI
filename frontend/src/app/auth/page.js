"use client";
import { useState } from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ nome: "", email: "", password: "" });
  const [mensagem, setMensagem] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");
    const url = isLogin ? "/api/auth/login" : "/api/auth/registro";
    try {
      const res = await fetch(`http://localhost:3001${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMensagem(isLogin ? "Login realizado!" : "Cadastro realizado!");
        if (isLogin && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("usuarioNome", data.usuario.nome);
          window.location.href = "/";
        }
      } else {
        setMensagem(data.error || "Erro ao enviar formulário.");
      }
    } catch (err) {
      setMensagem("Erro de conexão com o servidor.");
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Coluna Esquerda */}
      <div className="w-1/2 bg-green-700 flex flex-col justify-center items-center text-white">
        <img src="/logo.png" alt="Logo" className="w-32 mb-4" />
        <h1 className="text-4xl font-bold">SmartPlant</h1>
        <p className="text-2x font-bold">Monitoramento inteligente de plantas</p>
      </div>
      {/* Coluna Direita */}
      <div className="w-1/2 flex flex-col bg-amber-100 justify-center items-center">
        <div className="w-full max-w-md p-8 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold mb-6">
            {isLogin ? "Login" : "Cadastro"}
          </h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                className="w-full mb-4 p-2 border rounded"
                value={form.nome}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              className="w-full mb-4 p-2 border rounded"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              className="w-full mb-6 p-2 border rounded"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
            >
              {isLogin ? "Entrar" : "Cadastrar"}
            </button>
          </form>
          <p className="mt-4 text-center">
            {isLogin ? (
              <>
                Não tem conta?{" "}
                <button
                  className="text-green-700 font-semibold cursor-pointer"
                  onClick={() => {
                    setIsLogin(false);
                    setMensagem("");
                  }}
                >
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <button
                  className="text-green-700 font-semibold cursor-pointer"
                  onClick={() => {
                    setIsLogin(true);
                    setMensagem("");
                  }}
                >
                  Faça login
                </button>
              </>
            )}
          </p>
          {mensagem && (
            <div className="mt-4 text-center text-red-600">{mensagem}</div>
          )}
        </div>
      </div>
    </div>
  );
}