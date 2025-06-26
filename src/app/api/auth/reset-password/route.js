import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json()
    
    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Validate password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Read the JSON file
    const filePath = path.join(process.cwd(), 'data', 'users.json')
    const fileData = fs.readFileSync(filePath, 'utf8')
    const userData = JSON.parse(fileData)
    
    // Find reset token
    const resetRequest = userData.passwordResets?.find(
      reset => reset.token === token && !reset.used
    )
    
    if (!resetRequest) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }
    
    // Check if token is expired
    const now = new Date()
    const tokenExpiry = new Date(resetRequest.expiry)
    
    if (now > tokenExpiry) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      )
    }
    
    // Find user and update password
    const userIndex = userData.users.findIndex(u => u.id === resetRequest.userId)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Update password
    userData.users[userIndex].password = newPassword
    
    // Mark token as used
    const resetIndex = userData.passwordResets.findIndex(
      reset => reset.token === token
    )
    userData.passwordResets[resetIndex].used = true
    
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