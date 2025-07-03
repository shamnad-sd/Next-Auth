import { frontendUrl } from '@/utils/url'
import { emailPassword, emailUsername, hostName, portNumber, siteEmail, siteFromEmail } from '@/utils/variable'
import nodemailer from 'nodemailer'

// Create transporter with your email service configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // or 'outlook', 'yahoo', etc.
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// })

// Alternative configuration for custom SMTP
const transporter = nodemailer.createTransport({
  host: hostName,
  port: portNumber,
  secure: false, // true for 465, false for other ports
  auth: {
    user: emailUsername,
    pass: emailPassword
  }
})

export async function sendPasswordResetEmail(email, resetToken, userName) {
  const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`
  
  const mailOptions = {
    from: siteFromEmail || siteEmail,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #4f46e5; 
            color: white; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
          }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>We received a request to reset your password for your account.</p>
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>For security reasons, please do not share this link with anyone.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
  
  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}