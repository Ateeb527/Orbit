const router = require('express').Router();
const db = require('../db');
const { auth, role } = require('../middleware/auth');

// GET my goals (employee only)
router.get('/', auth, role('employee'), async (req, res) => {
  const { quarter } = req.query;
  try {
    let query = 'SELECT * FROM goals WHERE user_id = $1';
    const params = [req.user.id];
    if (quarter) { query += ' AND quarter = $2'; params.push(quarter); }
    query += ' ORDER BY created_at DESC';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET team goals (manager/admin)
router.get('/team', auth, role('manager', 'admin'), async (req, res) => {
  try {
    let query;
    let params;

    if (req.user.role === 'admin') {
      // Admin sees all goals from all employees
      query = `
        SELECT g.*, u.name as employee_name, u.email as employee_email
        FROM goals g
        JOIN users u ON g.user_id = u.id
        WHERE u.role = 'employee'
        ORDER BY g.created_at DESC
      `;
      params = [];
    } else {
      // Manager sees only their direct reports' goals
      query = `
        SELECT g.*, u.name as employee_name, u.email as employee_email
        FROM goals g
        JOIN users u ON g.user_id = u.id
        WHERE u.manager_id = $1 AND u.role = 'employee'
        ORDER BY g.created_at DESC
      `;
      params = [req.user.id];
    }

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create goal — employees only
router.post('/', auth, role('employee'), async (req, res) => {
  const { title, description, weightage, quarter } = req.body;
  try {
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (weightage < 10 || weightage > 100)
      return res.status(400).json({ error: 'Weightage must be between 10 and 100' });

    // Check total weightage for this quarter won't exceed 100
    const { rows: existing } = await db.query(
      "SELECT COALESCE(SUM(weightage),0) as total FROM goals WHERE user_id=$1 AND quarter=$2 AND status != 'rejected'",
      [req.user.id, quarter]
    );
    const currentTotal = parseInt(existing[0].total);
    if (currentTotal + weightage > 100)
      return res.status(400).json({
        error: `Total weightage would exceed 100% (current: ${currentTotal}%, adding: ${weightage}%)`
      });

    const { rows } = await db.query(
      'INSERT INTO goals (user_id, title, description, weightage, quarter) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [req.user.id, title, description, weightage, quarter]
    );

    await db.query(
      'INSERT INTO audit_logs (user_id, action, details) VALUES ($1,$2,$3)',
      [req.user.id, 'GOAL_CREATED', `Goal: ${title}`]
    );

    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update goal (employee only, draft/rejected only)
router.put('/:id', auth, role('employee'), async (req, res) => {
  const { title, description, weightage } = req.body;
  try {
    const { rows: goal } = await db.query(
      'SELECT * FROM goals WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    );
    if (!goal[0]) return res.status(404).json({ error: 'Goal not found' });
    if (!['draft', 'rejected'].includes(goal[0].status))
      return res.status(400).json({ error: 'Can only edit draft or rejected goals' });

    const { rows } = await db.query(
      'UPDATE goals SET title=$1, description=$2, weightage=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [
        title || goal[0].title,
        description !== undefined ? description : goal[0].description,
        weightage || goal[0].weightage,
        req.params.id
      ]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST submit for approval (employee only)
router.post('/:id/submit', auth, role('employee'), async (req, res) => {
  try {
    const { rows } = await db.query(
      "UPDATE goals SET status='pending', updated_at=NOW() WHERE id=$1 AND user_id=$2 AND status='draft' RETURNING *",
      [req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(400).json({ error: 'Goal not found or already submitted' });

    // Notify manager
    const { rows: user } = await db.query('SELECT manager_id FROM users WHERE id=$1', [req.user.id]);
    if (user[0]?.manager_id) {
      await db.query(
        'INSERT INTO notifications (user_id, message) VALUES ($1,$2)',
        [user[0].manager_id, `${req.user.name} submitted a goal for review: "${rows[0].title}"`]
      );
    }

    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST approve or reject (manager/admin only)
router.post('/:id/review', auth, role('manager'), async (req, res) => {
  const { action } = req.body;
  if (!['approve', 'reject'].includes(action))
    return res.status(400).json({ error: 'Action must be approve or reject' });

  try {
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const { rows } = await db.query(
      "UPDATE goals SET status=$1, updated_at=NOW() WHERE id=$2 AND status='pending' RETURNING *",
      [newStatus, req.params.id]
    );
    if (!rows[0]) return res.status(400).json({ error: 'Goal not found or not pending' });

    await db.query(
      'INSERT INTO audit_logs (user_id, action, details) VALUES ($1,$2,$3)',
      [req.user.id, `GOAL_${newStatus.toUpperCase()}`, `Goal ID: ${req.params.id} — "${rows[0].title}"`]
    );

    await db.query(
      'INSERT INTO notifications (user_id, message) VALUES ($1,$2)',
      [rows[0].user_id, `Your goal "${rows[0].title}" was ${newStatus} by ${req.user.name}`]
    );

    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE goal (employee only, draft only)
router.delete('/:id', auth, role('employee','manager','admin'), async (req, res) => {
  try {

    let query, params;

    if (req.user.role === 'employee') {
      query = `
        DELETE FROM goals
        WHERE id=$1 AND user_id=$2 AND status='draft'
        RETURNING id
      `;
      params = [req.params.id, req.user.id];
    } else {
      query = `
        DELETE FROM goals
        WHERE id=$1
        RETURNING id
      `;
      params = [req.params.id];
    }

    const { rows } = await db.query(query, params);

    if (!rows[0]) {
      return res.status(400).json({
        error: 'Cannot delete goal'
      });
    }

   await db.query(
  'INSERT INTO audit_logs (user_id, action, details) VALUES ($1,$2,$3)',
  [
    req.user.id,
    'GOAL_DELETED',
    `Deleted Goal ID ${req.params.id}`
  ]
);

res.json({
  message: 'Goal deleted'
});

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});
router.post('/assign', auth, role('manager'), async (req, res) => {
  const { user_id, title, description, weightage, quarter } = req.body;

  try {

    const { rows } = await db.query(
      `
      INSERT INTO goals
      (user_id, title, description, weightage, quarter, status)
      VALUES ($1,$2,$3,$4,$5,'approved')
      RETURNING *
      `,
      [user_id, title, description, weightage, quarter]
    );

    await db.query(
      `
      INSERT INTO notifications (user_id, message)
      VALUES ($1,$2)
      `,
      [
        user_id,
        `Manager assigned you a goal: "${title}"`
      ]
    );

    await db.query(
      `
      INSERT INTO audit_logs (user_id, action, details)
      VALUES ($1,$2,$3)
      `,
      [
        req.user.id,
        'GOAL_ASSIGNED',
        `Assigned "${title}" to employee ${user_id}`
      ]
    );

    res.status(201).json(rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Failed to assign goal'
    });
  }
});
module.exports = router;