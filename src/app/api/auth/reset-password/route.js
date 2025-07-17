import { NextResponse } from 'next/server'
import { getPasswordResetToken, updateUserPassword, markTokenAsUsed } from '@/lib/userService'

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

    // Find and validate reset token
    const resetData = await getPasswordResetToken(token)
    
    if (!resetData) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }
    
    // Update password
    await updateUserPassword(resetData.user_id, newPassword)
    
    // Mark token as used
    await markTokenAsUsed(token)
    
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