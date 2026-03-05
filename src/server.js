const express = require("express");
require("dotenv").config();

// IMPORT du contrôleur pour pouvoir utiliser ctrl.createBatch plus bas
const ctrl = require("./controllers/measurements.controller"); 

const measurementsRoutes = require("./routes/measurements.routes");
const sizeBustRoutes = require("./routes/sizeBustManual.routes");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

// Ta route batch personnalisée
app.post("/batch", ctrl.createBatch);

app.use("/api/measurements", measurementsRoutes);
app.use("/api/sizeBust", sizeBustRoutes);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));