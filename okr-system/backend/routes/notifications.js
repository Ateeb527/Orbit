const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {

    const result = await db.query(`
      SELECT *
      FROM notifications
      ORDER BY created_at DESC
      LIMIT 20
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Failed to load notifications'
    });
  }
});

module.exports = router;