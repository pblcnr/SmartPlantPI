import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import plantaRoutes from "./routes/plantRoutes.js";
import sensorDataRoutes from "./routes/sensorDataRoutes.js";
import alertaRoutes from "./routes/alertaRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" assert { type: "json" };

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/plantas", plantaRoutes);
app.use("/api/plantas", sensorDataRoutes);
app.use("/api/plantas", alertaRoutes);

app.use("/api-smartplant", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.json({ message: "API SmartPlant funcionando!"});
})

module.exports = app;