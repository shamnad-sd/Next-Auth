import { executeQuery } from './db'

export async function getUserByUsername(username) {
  const query = 'SELECT * FROM users WHERE username = ?'
  const results = await executeQuery(query, [username])
  return results[0] || null
}

export async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ?'
  const results = await executeQuery(query, [email])
  return results[0] || null
}

export async function getUserById(id) {
  const query = 'SELECT * FROM users WHERE id = ?'
  const results = await executeQuery(query, [id])
  return results[0] || null
}

export async function updateUserPassword(userId, newPassword) {
  const query = 'UPDATE users SET password = ? WHERE id = ?'
  await executeQuery(query, [newPassword, userId])
}

export async function createPasswordResetToken(userId, token, expiresAt) {
  // First, remove any existing tokens for this user
  await executeQuery('DELETE FROM password_resets WHERE user_id = ?', [userId])
  
  // Then insert the new token
  const query = 'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)'
  await executeQuery(query, [userId, token, expiresAt])
}

export async function getPasswordResetToken(token) {
  const query = `
    SELECT pr.*, u.id as user_id, u.email, u.name 
    FROM password_resets pr 
    JOIN users u ON pr.user_id = u.id 
    WHERE pr.token = ? AND pr.used = FALSE AND pr.expires_at > NOW()
  `
  const results = await executeQuery(query, [token])
  return results[0] || null
}

export async function markTokenAsUsed(token) {
  const query = 'UPDATE password_resets SET used = TRUE WHERE token = ?'
  await executeQuery(query, [token])
}