const pool = require("../db");

const ALLOWED_TYPES = new Set(["temperature", "sizeBust", "cardiac", "getSizeBust"]);

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

exports.createMeasurement = async (req, res) => {
  try {
    const { type, value } = req.body;

    if (!type || !ALLOWED_TYPES.has(type)) {
      return badRequest(res, `type invalide. Autorisés: ${Array.from(ALLOWED_TYPES).join(", ")}`);
    }

    if (value === undefined || value === null || Number.isNaN(Number(value))) {
      return badRequest(res, "value doit être un nombre");
    }

    const numericValue = Number(value);

    const { rows } = await pool.query(
      `INSERT INTO measurements(type, value)
       VALUES ($1, $2)
       RETURNING id, type, value, created_at`,
      [type, numericValue]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getLatestByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!type || !ALLOWED_TYPES.has(type)) {
      return badRequest(res, `type invalide. Autorisés: ${Array.from(ALLOWED_TYPES).join(", ")}`);
    }

    const { rows } = await pool.query(
      `SELECT id, type, value, created_at
       FROM measurements
       WHERE type = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [type]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Aucune donnée trouvée" });

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.listMeasurements = async (req, res) => {
  try {
    const { type, limit = 50 } = req.query;
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 500);

    let sql = `SELECT id, type, value, created_at FROM measurements`;
    const params = [];

    if (type) {
      if (!ALLOWED_TYPES.has(type)) {
        return badRequest(res, `type invalide. Autorisés: ${Array.from(ALLOWED_TYPES).join(", ")}`);
      }
      params.push(type);
      sql += ` WHERE type = $${params.length}`;
    }

    params.push(safeLimit);
    sql += ` ORDER BY created_at DESC LIMIT $${params.length}`;

    const { rows } = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};