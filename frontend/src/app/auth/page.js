"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [mensagem, setMensagem] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");
    const url = isLogin ? "/api/auth/login" : "/api/auth/registro";
    try {
      const API_URL = "https://smartplant-backend-ct0o.onrender.com";
      const res = await fetch(`${API_URL}${url}`, {
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
    <div className="min-h-screen flex bg-gray-100">
      {/* Coluna Esquerda */}
      <div className="w-1/2 bg-gradient-to-b from-green-700 to-green-500 flex flex-col justify-center items-center text-white">
        <Image src="/img/logo.png" alt="Logo" className="w-90 mb-10 drop-shadow-lg rounded-full" width={200} height={200} />
        <h1 className="text-4xl font-extrabold mb-2 drop-shadow-lg">SmartPlant</h1>
        <p className="text-xl font-semibold drop-shadow-lg">Sua planta conectada.</p>
      </div>
      {/* Coluna Direita */}
      <div className="w-1/2 flex flex-col justify-center items-center">
        <div className="w-full max-w-md p-10 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-green-700 text-center drop-shadow">{
            isLogin ? "Login" : "Cadastro"
          }</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                className="w-full mb-4 p-3 border border-green-300 rounded text-gray-900 text-lg"
                value={form.nome}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              className="w-full mb-4 p-3 border border-green-300 rounded text-gray-900 text-lg"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              className="w-full mb-6 p-3 border border-green-300 rounded text-gray-900 text-lg"
              value={form.senha}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded font-bold text-lg hover:bg-green-800 transition-colors shadow"
            >
              {isLogin ? "Entrar" : "Cadastrar"}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-700 text-base">
            {isLogin ? (
              <>
                Não tem conta?{" "}
                <button
                  className="text-green-700 font-bold underline cursor-pointer"
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
                  className="text-green-700 font-bold underline cursor-pointer"
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
            <div className="mt-4 text-center text-red-600 font-semibold">{mensagem}</div>
          )}
        </div>
      </div>
    </div>
  );
}