const express = require("express");
require("dotenv").config();

const measurementsRoutes = require("./routes/measurements.routes");

const app = express();

app.use(express.json());

app.use("/api/measurements", measurementsRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});