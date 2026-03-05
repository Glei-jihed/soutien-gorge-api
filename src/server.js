const express = require("express");
require("dotenv").config();

const measurementsRoutes = require("./routes/measurements.routes");
const sizeBustRoutes = require("./routes/sizeBustManual.routes");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/measurements", measurementsRoutes);
app.use("/api/sizeBust", sizeBustRoutes);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));