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