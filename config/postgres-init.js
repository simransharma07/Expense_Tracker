const pool = require('./postgres');

const initPostgres = async () => {
  try {
    const client = await pool.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS expense_logs (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          category VARCHAR(100),
          logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_expense_logs_user_id ON expense_logs(user_id);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_expense_logs_logged_at ON expense_logs(logged_at);
      `);

      console.log('✓ PostgreSQL tables initialized');
    } catch (error) {
      console.error('✗ PostgreSQL table creation error:', error.message);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('✗ PostgreSQL connection error:', error.message);
    console.log('⚠ PostgreSQL features will be unavailable until database is connected');
  }
};

module.exports = initPostgres;
