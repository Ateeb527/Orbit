
const router = require('express').Router();
const db = require('../db');
const { auth, role } = require('../middleware/auth');

// GET checkins for a specific goal
router.get('/goal/:goalId', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT c.*, u.name as user_name
       FROM checkins c
       JOIN users u ON c.user_id = u.id
       WHERE c.goal_id = $1
       ORDER BY c.created_at DESC`,
      [req.params.goalId]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET team check-ins for manager/admin
// Returns all approved goals with their latest check-in
router.get('/team', auth, role('manager', 'admin'), async (req, res) => {
  try {
    let query, params;

    if (req.user.role === 'admin') {
      query = `
        SELECT
          g.id        AS goal_id,
          g.title,
          g.weightage,
          g.quarter,
          g.status    AS goal_status,
          u.name      AS employee_name,
          u.email     AS employee_email,
          c.id        AS checkin_id,
          c.achievement_percent,
          c.notes,
          c.manager_comment,
          c.created_at AS checkin_date
        FROM goals g
        JOIN users u ON g.user_id = u.id
        LEFT JOIN LATERAL (
          SELECT * FROM checkins WHERE goal_id = g.id ORDER BY created_at DESC LIMIT 1
        ) c ON true
        WHERE u.role = 'employee' AND g.status = 'approved'
        ORDER BY u.name, g.title
      `;
      params = [];
    } else {
      query = `
        SELECT
          g.id        AS goal_id,
          g.title,
          g.weightage,
          g.quarter,
          g.status    AS goal_status,
          u.name      AS employee_name,
          u.email     AS employee_email,
          c.id        AS checkin_id,
          c.achievement_percent,
          c.notes,
          c.manager_comment,
          c.created_at AS checkin_date
        FROM goals g
        JOIN users u ON g.user_id = u.id
        LEFT JOIN LATERAL (
          SELECT * FROM checkins WHERE goal_id = g.id ORDER BY created_at DESC LIMIT 1
        ) c ON true
        WHERE u.manager_id = $1 AND u.role = 'employee' AND g.status = 'approved'
        ORDER BY u.name, g.title
      `;
      params = [req.user.id];
    }

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST new check-in (employee only)
router.post('/', auth, role('employee'), async (req, res) => {
  const { goal_id, achievement_percent, notes } = req.body;
  try {
    const { rows: goal } = await db.query(
      'SELECT * FROM goals WHERE id=$1 AND user_id=$2',
      [goal_id, req.user.id]
    );
    if (!goal[0]) return res.status(404).json({ error: 'Goal not found' });
    if (goal[0].status !== 'approved')
      return res.status(400).json({ error: 'Goal must be approved before check-in' });

    const { rows } = await db.query(
      'INSERT INTO checkins (goal_id, user_id, achievement_percent, notes) VALUES ($1,$2,$3,$4) RETURNING *',
      [goal_id, req.user.id, achievement_percent, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT manager adds/edits comment on a check-in
router.put('/:id/comment', auth, role('manager', 'admin'), async (req, res) => {
  const { manager_comment } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE checkins SET manager_comment=$1 WHERE id=$2 RETURNING *',
      [manager_comment, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Check-in not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/review', async (req, res) => {
  try {
    const { goal_id, manager_comment } = req.body;

    await db.query(
      `
      UPDATE checkins
      SET manager_comment = $1
      WHERE id = (
        SELECT id FROM checkins
        WHERE goal_id = $2
        ORDER BY created_at DESC
        LIMIT 1
      )
      `,
      [manager_comment, goal_id]
    );

    res.json({
      success: true,
      message: 'Review saved'
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Failed to save review'
    });
  }
});

module.exports = router;