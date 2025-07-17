import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'
import { getUserByEmail, createPasswordResetToken } from '@/lib/userService'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await getUserByEmail(email)
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link.' },
        { status: 200 }
      )
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now
    
    // Store reset token in database
    await createPasswordResetToken(user.id, resetToken, expiresAt)
    
    // Send email
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.name)
    
    if (emailResult.success) {
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link.' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}