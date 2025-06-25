import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request) {
  try {
    const { username, newPassword } = await request.json()
    
    if (!username || !newPassword) {
      return NextResponse.json(
        { error: 'Username and new password are required' },
        { status: 400 }
      )
    }

    // Read the JSON file
    const filePath = path.join(process.cwd(), 'data', 'users.json')
    const fileData = fs.readFileSync(filePath, 'utf8')
    const userData = JSON.parse(fileData)
    
    // Find user by username
    const userIndex = userData.users.findIndex(u => u.username === username)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Update password
    userData.users[userIndex].password = newPassword
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2))
    
    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}