const router = require('express').Router();
const db = require('../db');
const { auth, role } = require('../middleware/auth');


// GET all users (admin/manager)
router.get('/', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT id, name, email, role, manager_id, created_at FROM users WHERE role = 'employee' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT mark notification read
router.put('/notifications/:id/read', auth, async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET is_read=true WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Marked read' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET audit logs (admin only)
router.get('/audit', auth, role('admin'), async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT a.*, u.name, u.email
       FROM audit_logs a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC
       LIMIT 100`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // For employees: their own goal counts
    // For managers/admins: show 0 personal goals (they don't have goals)
    let myGoals = [];
    if (userRole === 'employee') {
      const result = await db.query(
        "SELECT status, COUNT(*) as count FROM goals WHERE user_id=$1 GROUP BY status",
        [userId]
      );
      myGoals = result.rows;
    }

    // Team stats for manager/admin
    let teamStats = [];
    if (userRole === 'manager') {
      const result = await db.query(
        `SELECT u.name,
          COUNT(g.id) as total_goals,
          COUNT(CASE WHEN g.status='approved' THEN 1 END) as approved_goals,
          COUNT(CASE WHEN g.status='pending' THEN 1 END) as pending_goals
         FROM users u
         LEFT JOIN goals g ON g.user_id = u.id
         WHERE u.manager_id = $1 AND u.role = 'employee'
         GROUP BY u.id, u.name`,
        [userId]
      );
      teamStats = result.rows;
    } else if (userRole === 'admin') {
      const result = await db.query(
        `SELECT u.name,
          COUNT(g.id) as total_goals,
          COUNT(CASE WHEN g.status='approved' THEN 1 END) as approved_goals,
          COUNT(CASE WHEN g.status='pending' THEN 1 END) as pending_goals
         FROM users u
         LEFT JOIN goals g ON g.user_id = u.id
         WHERE u.role = 'employee'
         GROUP BY u.id, u.name`
      );
      teamStats = result.rows;
    }

    res.json({ myGoals, teamStats });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.get('/admin-stats', auth, async (req, res) => {
  try {

    const totalUsers = await db.query(`
      SELECT COUNT(*) AS count
      FROM users
    `);

    const totalGoals = await db.query(`
      SELECT COUNT(*) AS count
      FROM goals
    `);

    const approvedGoals = await db.query(`
      SELECT COUNT(*) AS count
      FROM goals
      WHERE status = 'approved'
    `);

    const pendingGoals = await db.query(`
      SELECT COUNT(*) AS count
      FROM goals
      WHERE status = 'pending'
    `);

    const totalCheckins = await db.query(`
      SELECT COUNT(*) AS count
      FROM checkins
    `);

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalGoals: parseInt(totalGoals.rows[0].count),
      approvedGoals: parseInt(approvedGoals.rows[0].count),
      pendingGoals: parseInt(pendingGoals.rows[0].count),
      totalCheckins: parseInt(totalCheckins.rows[0].count),
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Server error',
    });
  }
});

module.exports = router;