const router = require("express").Router();
const ctrl = require("../controllers/measurements.controller");

router.post("/", ctrl.createMeasurement);

router.get("/", ctrl.listMeasurements);

router.get("/latest/:type", ctrl.getLatestByType);

// Nouvelle route pour récupérer toutes les données d'un type spécifique (ex: temperature)
router.get("/type/:type", ctrl.listByType);

module.exports = router;