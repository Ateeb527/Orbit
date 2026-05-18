const { Pool } = require('pg');

const pool = new Pool({
  // Changed the port at the end to 6543!
  connectionString: "postgresql://postgres.dsbjdgacxmoukpwsijwj:TahirAhmed1234@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('🚀 SUCCESS: Connected to Supabase Pooler!');
});

pool.on('error', (err) => {
  console.error('❌ DATABASE POOL ERROR:', err.message);
});

module.exports = pool;