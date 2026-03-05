const pool = require("../db");

// POST /api/measurements
exports.createMeasurement = async (req, res) => {

  try {

    const { type, value } = req.body;

    const result = await pool.query(
      "INSERT INTO measurements(type,value) VALUES($1,$2) RETURNING *",
      [type, value]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "server error" });

  }
};

// GET latest measurement
exports.getLatestByType = async (req, res) => {

  const { type } = req.params;

  const result = await pool.query(
    "SELECT * FROM measurements WHERE type=$1 ORDER BY created_at DESC LIMIT 1",
    [type]
  );

  res.json(result.rows[0]);
};

// GET all
exports.listMeasurements = async (req, res) => {

  const result = await pool.query(
    "SELECT * FROM measurements ORDER BY created_at DESC"
  );

  res.json(result.rows);
};

// GET /api/measurements/type/:type
exports.listByType = async (req, res) => {
  try {
    const { type } = req.params;
    const result = await pool.query(
      "SELECT * FROM measurements WHERE type = $1 ORDER BY created_at DESC",
      [type]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
};

// POST /api/measurements/batch
exports.createBatch = async (req, res) => {
  try {
    const { measurements } = req.body; // Doit être un tableau [{type, value}, ...]

    if (!Array.isArray(measurements) || measurements.length === 0) {
      return res.status(400).json({ error: "Tableau de mesures requis" });
    }

    // Construction d'une requête d'insertion multiple dynamique
    const values = [];
    const placeholders = measurements.map((m, i) => {
      values.push(m.type, m.value);
      return `($${i * 2 + 1}, $${i * 2 + 2})`;
    }).join(",");

    const query = `INSERT INTO measurements(type, value) VALUES ${placeholders} RETURNING *`;
    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors du batch insert" });
  }
};