import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import fs from 'fs'
import path from 'path'


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        try {
          const filePath = path.join(process.cwd(), 'data', 'users.json')
          const fileData = fs.readFileSync(filePath, 'utf8')
          const userData = JSON.parse(fileData)
          
          const user = userData.users.find(
            u => u.username === credentials?.username && 
                 u.password === credentials?.password
          )
          
          if (user) {
            // Update last_login and last_ip_address
            const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: false })
            
            // Get IP address from request
            let clientIP = 'unknown'
            if (req && req.headers) {
              const forwarded = req.headers['x-forwarded-for']
              const realIP = req.headers['x-real-ip']
              const cfConnectingIP = req.headers['cf-connecting-ip']
              
              if (forwarded) {
                clientIP = forwarded.split(',')[0].trim()
              } else if (realIP) {
                clientIP = realIP
              } else if (cfConnectingIP) {
                clientIP = cfConnectingIP
              }
            }
            
            // Update user data
            const userIndex = userData.users.findIndex(u => u.id === user.id)
            userData.users[userIndex].last_login = now
            userData.users[userIndex].last_ip_address = clientIP
            
            // Write back to file
            fs.writeFileSync(filePath, JSON.stringify(userData, null, 2))
            
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              username: user.username,
              last_login: now,
              last_ip_address: clientIP
            }
          }
          
          return null
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
        token.last_login = user.last_login
        token.last_ip_address = user.last_ip_address
      }
      return token
    },
    async session({ session, token }) {
      session.user.username = token.username
      session.user.last_login = token.last_login
      session.user.last_ip_address = token.last_ip_address
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || nextKey
}

export const handler = NextAuth(authOptions)