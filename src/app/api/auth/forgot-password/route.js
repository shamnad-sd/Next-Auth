import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Read the JSON file
    const filePath = path.join(process.cwd(), 'data', 'users.json')
    const fileData = fs.readFileSync(filePath, 'utf8')
    const userData = JSON.parse(fileData)
    
    // Find user by email
    const user = userData.users.find(u => u.email === email)
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link.' },
        { status: 200 }
      )
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now
    
    // Store reset token
    if (!userData.passwordResets) {
      userData.passwordResets = []
    }
    
    // Remove any existing tokens for this user
    userData.passwordResets = userData.passwordResets.filter(
      reset => reset.userId !== user.id
    )
    
    // Add new reset token
    userData.passwordResets.push({
      userId: user.id,
      token: resetToken,
      expiry: tokenExpiry.toISOString(),
      used: false
    })
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2))
    
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
