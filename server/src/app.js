import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import plantaRoutes from "./routes/plantaRoutes.js";
import sensorDataRoutes from "./routes/sensorDataRoutes.js";
import alertaRoutes from "./routes/alertaRoutes.js";
import estatisticasRoutes from "./routes/estatisticasRoutes.js";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerDocument = require("../swagger.json");

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "https://smart-plant-pi.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/plantas", plantaRoutes);
app.use("/api/plantas", sensorDataRoutes);
app.use("/api/plantas", alertaRoutes);
app.use("/api/alertas", alertaRoutes);
app.use("/api", estatisticasRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.json({ message: "API SmartPlant funcionando!"});
});

export default app;