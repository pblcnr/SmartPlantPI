import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal, SafeAreaView, ScrollView as RNScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const estatisticas = [
  { key: 'todas', label: 'Todas', tipo: 'all' },
  { key: 'umidade', label: 'Umidade', tipo: 'line', cor: '#22c55e' },
  { key: 'temperatura', label: 'Temperatura', tipo: 'bar', cor: '#facc15' },
];

export default function DashboardScreen({ token, setToken, navigation }) {
  const [stats, setStats] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [estatisticaSelecionada, setEstatisticaSelecionada] = useState('umidade');

  const API_URL = "https://smartplant-backend-ct0o.onrender.com";

  useEffect(() => {
    let interval;
    async function fetchStats() {
      try {
        const res = await fetch(`${API_URL}/api/estatisticas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch {
        setStats(null);
      }
    }
    fetchStats();
    interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Função para sair
  async function handleLogout() {
    await AsyncStorage.removeItem("token");
    setToken(null);
  }

  if (!stats) return <Text style={{ textAlign: 'center', marginTop: 40 }}>Carregando estatísticas...</Text>;

  // Flags para seleção
  const isUmidade = estatisticaSelecionada === 'umidade';
  const isTemperatura = estatisticaSelecionada === 'temperatura';
  const isTodas = estatisticaSelecionada === 'todas';

  // Dados para gráficos (tratando valores inválidos)
  const dadosUmidade = Array.isArray(stats.umidades)
    ? stats.umidades.slice(-15).map(x => Number.isFinite(x) ? x : 0)
    : [];
  const dadosTemperatura = Array.isArray(stats.temperaturas)
    ? stats.temperaturas.slice(-15).map(x => Number.isFinite(x) ? x : 0)
    : [];
  const dadosUmidadeChart = dadosUmidade.length ? dadosUmidade : [0];
  const dadosTemperaturaChart = dadosTemperatura.length ? dadosTemperatura : [0];
  const labelsUmidade = dadosUmidadeChart.map((_, i) => `${i + 1}`);
  const labelsTemperatura = dadosTemperaturaChart.map((_, i) => `${i + 1}`);

  // Dados dinâmicos para seleção única
  const dados = isUmidade ? dadosUmidadeChart : dadosTemperaturaChart;
  const labels = isUmidade ? labelsUmidade : labelsTemperatura;
  const media = isUmidade ? stats.mediaUmidade : stats.mediaTemperatura;
  const mediana = isUmidade ? stats.medianaUmidade : stats.medianaTemperatura;
  const desvio = isUmidade ? stats.desvioPadraoUmidade : stats.desvioPadraoTemperatura;
  const assimetria = isUmidade ? stats.assimetriaUmidade : stats.assimetriaTemperatura;
  const moda = isUmidade ? stats.modaUmidade : stats.modaTemperatura;
  const chartConfig = isUmidade ? chartConfigUmidade : chartConfigTemperatura;
  const unidade = isUmidade ? '%' : '°C';
  const titulo = isTodas ? 'Todas as Estatísticas' : isUmidade ? 'Umidade' : 'Temperatura';

  // Largura dinâmica para scroll dos gráficos
  const chartWidthUmidade = Math.max(Dimensions.get("window").width - 32, labelsUmidade.length * 40);
  const chartWidthTemperatura = Math.max(Dimensions.get("window").width - 32, labelsTemperatura.length * 40);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <View style={{ flex: 1 }}>
        {/* Botão para abrir sidebar */}
        <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={32} color="#166534" />
        </TouchableOpacity>

        {/* Sidebar */}
        <Modal visible={sidebarVisible} animationType="slide" transparent>
          <TouchableOpacity style={styles.overlay} onPress={() => setSidebarVisible(false)} />
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Estatísticas</Text>
            {estatisticas.map(e => (
              <TouchableOpacity
                key={e.key}
                style={[
                  styles.sidebarItem,
                  estatisticaSelecionada === e.key && styles.sidebarItemSelected
                ]}
                onPress={() => {
                  setEstatisticaSelecionada(e.key);
                  setSidebarVisible(false);
                }}
              >
                <Text style={[
                  styles.sidebarItemText,
                  estatisticaSelecionada === e.key && styles.sidebarItemTextSelected
                ]}>
                  {e.label}
                </Text>
              </TouchableOpacity>
            ))}
            {/* Botão de sair */}
            <TouchableOpacity
              style={[styles.sidebarItem, { backgroundColor: "#fee2e2", marginTop: 32 }]}
              onPress={handleLogout}
            >
              <Text style={[styles.sidebarItemText, { color: "#dc2626", fontWeight: "bold" }]}>
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <ScrollView style={styles.container}>
          <Text style={styles.title}>Dashboard Estatístico</Text>
          <Text style={styles.subtitle}>{titulo}</Text>

          {(isTodas || isUmidade) && (
            <>
              <View style={styles.cardRow}>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Média Umidade</Text>
                  <Text style={styles.cardValue}>{stats.mediaUmidade?.toFixed(1) ?? '-'}</Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Mediana</Text>
                  <Text style={styles.cardValue}>{stats.medianaUmidade ?? '-'}</Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Desvio Padrão</Text>
                  <Text style={styles.cardValue}>{stats.desvioPadraoUmidade?.toFixed(2) ?? '-'}</Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Assimetria</Text>
                  <Text style={styles.cardValue}>{stats.assimetriaUmidade?.toFixed(2) ?? '-'}</Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Moda</Text>
                  <Text style={styles.cardValue}>
                    {Array.isArray(stats.modaUmidade)
                      ? stats.modaUmidade.join(', ')
                      : stats.modaUmidade ?? '-'}
                  </Text>
                </View>
              </View>
              <Text style={styles.subtitle}>Gráfico de Umidade</Text>
              <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{
                    labels: labelsUmidade,
                    datasets: [{ data: dadosUmidadeChart }]
                  }}
                  width={chartWidthUmidade}
                  height={220}
                  yAxisSuffix="%"
                  chartConfig={chartConfigUmidade}
                  bezier
                  style={styles.chart}
                />
              </RNScrollView>
              <View 
                style={[styles.percentContainer, 
                isTodas && { marginBottom: 32 }]
                }
              >
                <Text style={styles.percentLabel}>Umidade acima de 50%:</Text>
                <View style={styles.percentBarBg}>
                  <View style={[styles.percentBar, { width: `${stats.porcentagemAcima50 ?? 0}%` }]} />
                </View>
                <Text style={styles.percentValue}>{stats.porcentagemAcima50?.toFixed(1) ?? '0.0'}%</Text>
              </View>
            </>
          )}

          {(isTodas || isTemperatura) && (
            <>
              <View style={styles.cardRow}>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Média Temp.</Text>
                  <Text style={styles.cardValue}>{stats.mediaTemperatura?.toFixed(1) ?? '-'}</Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Mediana</Text>
                  <Text style={styles.cardValue}>{stats.medianaTemperatura ?? '-'}</Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Desvio Padrão</Text>
                  <Text style={styles.cardValue}>{stats.desvioPadraoTemperatura?.toFixed(2) ?? '-'}</Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Assimetria</Text>
                  <Text style={styles.cardValue}>{stats.assimetriaTemperatura?.toFixed(2) ?? '-'}</Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Moda</Text>
                  <Text style={styles.cardValue}>
                    {Array.isArray(stats.modaTemperatura)
                      ? stats.modaTemperatura.join(', ')
                      : stats.modaTemperatura ?? '-'}
                  </Text>
                </View>
              </View>
              <Text style={styles.subtitle}>Gráfico de Temperatura</Text>
              <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={{
                    labels: labelsTemperatura,
                    datasets: [{ data: dadosTemperaturaChart }]
                  }}
                  width={chartWidthTemperatura}
                  height={220}
                  yAxisSuffix="°C"
                  chartConfig={chartConfigTemperatura}
                  style={styles.chart}
                />
              </RNScrollView>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const chartConfigUmidade = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#bbf7d0",
  backgroundGradientTo: "#22c55e",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(22, 101, 52, ${opacity})`,
};

const chartConfigTemperatura = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fef9c3",
  backgroundGradientTo: "#facc15",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(202, 138, 4, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(113, 63, 18, ${opacity})`,
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F3F4F6' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#166534', marginBottom: 16, textAlign: 'center' },
  subtitle: { fontSize: 20, fontWeight: 'bold', color: '#166534', marginTop: 24, marginBottom: 8, textAlign: 'center' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  card: { flex: 1, backgroundColor: '#fff', marginHorizontal: 4, borderRadius: 12, padding: 16, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 },
  cardLabel: { fontSize: 14, color: '#166534', marginBottom: 4 },
  cardValue: { fontSize: 20, fontWeight: 'bold', color: '#166534' },
  chart: { marginVertical: 8, borderRadius: 16 },
  percentContainer: { marginTop: 24, alignItems: 'center' },
  percentLabel: { fontSize: 16, color: '#166534', marginBottom: 8 },
  percentBarBg: { width: '80%', height: 16, backgroundColor: '#d1fae5', borderRadius: 8, overflow: 'hidden', marginBottom: 4 },
  percentBar: { height: 16, backgroundColor: '#22c55e' },
  percentValue: { fontSize: 16, color: '#166534', fontWeight: 'bold' },
  menuButton: { position: 'absolute', top: 40, left: 16, zIndex: 10, backgroundColor: '#fff', borderRadius: 24, padding: 4, elevation: 3 },
  sidebar: { position: 'absolute', top: 0, left: 0, width: 220, height: '100%', backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 16, elevation: 8, zIndex: 20 },
  sidebarTitle: { fontSize: 20, fontWeight: 'bold', color: '#166534', marginBottom: 24 },
  sidebarItem: { paddingVertical: 14, paddingHorizontal: 8, borderRadius: 8, marginBottom: 8 },
  sidebarItemSelected: { backgroundColor: '#bbf7d0' },
  sidebarItemText: { fontSize: 16, color: '#166534' },
  sidebarItemTextSelected: { fontWeight: 'bold', color: '#166534' },
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', opacity: 0.2, zIndex: 15 }
});