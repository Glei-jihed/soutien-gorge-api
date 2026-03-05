const router = require("express").Router();
const ctrl = require("../controllers/measurements.controller");

router.post("/", ctrl.createMeasurement);

router.get("/", ctrl.listMeasurements);

router.get("/latest/:type", ctrl.getLatestByType);

module.exports = router;