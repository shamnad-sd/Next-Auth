import mysql from 'mysql2/promise'

let connection = null

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER|| 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nextauth_app',
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    })
  }
  return connection
}

export async function executeQuery(query, params = []) {
  try {
    const conn = await getConnection()
    const [results] = await conn.execute(query, params)
    return results
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}