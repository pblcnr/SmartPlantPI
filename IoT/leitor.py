import adafruit_dht
import board
import time
import mysql.connector
from datetime import datetime

sensor = adafruit_dht.DHT22(board.D4)
time.sleep(2)

conn = mysql.connector.connect(
    host="192.168.100.190",
    port=3306,
    user="smartplant",
    password="smartplant",
    database="smartplant"
)

cursor = conn.cursor()

while True:
    try:
        temp = sensor.temperature
        umid = sensor.humidity
        now = datetime.now()

        if temp is not None and umid is not None:
            query = "INSERT INTO SensorData (temperatura, umidade, timestamp, plantaId) VALUES (%s, %s, %s, %s)"
            values = (temp, umid, now, 1)
            cursor.execute(query, values)
            conn.commit()

            print(f"Temperatura: {temp:.1f}ºC  | Umidade: {umid:.1f}%  |  {now}")
        else:
            print("Falha na leitura do sensor. Valores None.")

    except Exception as e:
        print("Erro:", e)

    time.sleep(900)