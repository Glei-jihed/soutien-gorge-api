const router = require("express").Router();
const ctrl = require("../controllers/sizeBustManual.controller");

// POST: remplace l'ancienne valeur par la nouvelle
router.post("/manual", ctrl.setManualSizeBust);

// GET: récupère la valeur manuelle actuelle
router.get("/manual", ctrl.getManualSizeBust);

module.exports = router;