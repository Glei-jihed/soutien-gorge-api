const router = require("express").Router();
const ctrl = require("../controllers/measurements.controller");

// Create one measurement
router.post("/", ctrl.createMeasurement);

// Get latest measurement for a type (ex: temperature)
router.get("/latest/:type", ctrl.getLatestByType);

// List measurements (optional filters)
router.get("/", ctrl.listMeasurements);

module.exports = router;