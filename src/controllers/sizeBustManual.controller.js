const pool = require("../db");

// POST /api/sizeBust/manual
// body: { value: 101 }
exports.setManualSizeBust = async (req, res) => {
  const client = await pool.connect();
  try {
    const { value } = req.body;

    if (value === undefined || value === null || Number.isNaN(Number(value))) {
      return res.status(400).json({ error: "value doit être un nombre" });
    }

    const numericValue = Number(value);

    // Transaction: supprimer l'ancienne puis insérer la nouvelle
    await client.query("BEGIN");

    await client.query(`DELETE FROM measurements WHERE type = 'sizeBustManual'`);

    const { rows } = await client.query(
      `INSERT INTO measurements(type, value)
       VALUES ('sizeBustManual', $1)
       RETURNING id, type, value, created_at`,
      [numericValue]
    );

    await client.query("COMMIT");
    return res.status(201).json(rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
};

// GET /api/sizeBust/manual
exports.getManualSizeBust = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, type, value, created_at
       FROM measurements
       WHERE type = 'sizeBustManual'
       ORDER BY created_at DESC
       LIMIT 1`
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Aucune valeur manuelle trouvée" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};