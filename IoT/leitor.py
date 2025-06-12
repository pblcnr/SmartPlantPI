import adafruit_dht
import board
import time
import psycopg2
from datetime import datetime

# Função para conectar ao banco
def conectar():
    return psycopg2.connect(
        host="ep-snowy-pine-a8gtzcoz-pooler.eastus2.azure.neon.tech",
        port=5432,
        user="neondb_owner",
        password="npg_OnyRDUf4gQ2A",
        dbname="neondb",
        sslmode="require"
    )

sensor = adafruit_dht.DHT22(board.D4)
time.sleep(2)

conn = None
cursor = None

while True:
    try:
        # Reconecta se necessário
        if conn is None or conn.closed != 0:
            conn = conectar()
            cursor = conn.cursor()
            print("Conectado ao banco de dados.")

        temp = sensor.temperature
        umid = sensor.humidity
        now = datetime.now()

        if temp is not None and umid is not None:
            query = "INSERT INTO sensordata (temperatura, umidade, timestamp, plantaid) VALUES (%s, %s, %s, %s)"
            values = (temp, umid, now, 1)
            cursor.execute(query, values)
            conn.commit()
            print(f"Temperatura: {temp:.1f}ºC  | Umidade: {umid:.1f}%  |  {now}")
        else:
            print("Falha na leitura do sensor. Valores None.")

    except Exception as e:
        print("Erro:", e)
        # Fecha conexão/cursor se houver erro
        if cursor:
            try:
                cursor.close()
            except:
                pass
        if conn:
            try:
                conn.close()
            except:
                pass
        conn = None
        cursor = None
        print("Tentando reconectar em 30 segundos...")
        time.sleep(30)
        continue

    # Aguarda 15 minutos para próxima leitura
    time.sleep(900)