import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

export default function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [mensagem, setMensagem] = useState('');

  const API_URL = "https://smartplant-backend-ct0o.onrender.com";

  function handleChange(name, value) {
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit() {
    setMensagem('');
    const url = isLogin ? '/api/auth/login' : '/api/auth/registro';
    try {
      const res = await fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setMensagem(isLogin ? 'Login realizado!' : 'Cadastro realizado!');
        onLogin(data.token);
      } else {
        setMensagem(data.error || 'Erro ao enviar formulário.');
      }
    } catch (err) {
      setMensagem('Erro de conexão com o servidor.');
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Cadastro'}</Text>
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={form.nome}
            onChangeText={text => handleChange('nome', text)}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={form.email}
          onChangeText={text => handleChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={form.senha}
          onChangeText={text => handleChange('senha', text)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isLogin ? 'Entrar' : 'Cadastrar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setMensagem(''); }}>
          <Text style={styles.switchText}>
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </Text>
        </TouchableOpacity>
        {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F3F4F6' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#166534', marginBottom: 32 },
  input: { width: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#A7F3D0' },
  button: { width: '100%', backgroundColor: '#166534', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  switchText: { color: '#166534', fontWeight: 'bold', textDecorationLine: 'underline', marginBottom: 16 },
  mensagem: { color: '#dc2626', marginTop: 8, textAlign: 'center' }
});