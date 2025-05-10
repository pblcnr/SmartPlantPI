const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const plantaRoutes = require("./routes/plantaRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/plantas", plantaRoutes);

app.use("/api-smartplant", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.json({ message: "API SmartPlant funcionando!"});
})

module.exports = app;