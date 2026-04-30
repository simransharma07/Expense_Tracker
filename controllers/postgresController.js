const pool = require('../config/postgres');

exports.getExpenseLogs = async (req, res) => {
  try {
    const { limit = 10, userId } = req.query;

    let query = 'SELECT * FROM expense_logs';
    const values = [];

    if (userId) {
      query += ' WHERE user_id = $1';
      values.push(userId);
    }

    query += ' ORDER BY logged_at DESC LIMIT $' + (values.length + 1);
    values.push(parseInt(limit, 10));

    const result = await pool.query(query, values);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('GetExpenseLogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense logs from PostgreSQL'
    });
  }
};

exports.addExpenseLog = async (req, res) => {
  try {
    const { userId, description, amount, category } = req.body;

    if (!userId || !description || !amount) {
      return res.status(400).json({
        success: false,
        message: 'userId, description, and amount are required'
      });
    }

    const query = `
      INSERT INTO expense_logs (user_id, description, amount, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [userId, description, parseFloat(amount), category || null]);

    res.status(201).json({
      success: true,
      message: 'Expense log added to PostgreSQL',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('AddExpenseLog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding expense log to PostgreSQL'
    });
  }
};

exports.getExpenseLogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const query = `
      SELECT
        category,
        COUNT(*) as count,
        SUM(amount) as total,
        AVG(amount) as average
      FROM expense_logs
      WHERE category = $1
      GROUP BY category
    `;

    const result = await pool.query(query, [category]);

    res.json({
      success: true,
      data: result.rows[0] || { category, count: 0, total: 0, average: 0 }
    });
  } catch (error) {
    console.error('GetExpenseLogsByCategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category stats from PostgreSQL'
    });
  }
};

exports.deleteExpenseLog = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM expense_logs WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [parseInt(id, 10)]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Expense log not found'
      });
    }

    res.json({
      success: true,
      message: 'Expense log deleted',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('DeleteExpenseLog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting expense log from PostgreSQL'
    });
  }
};
