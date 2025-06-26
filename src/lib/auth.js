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
      async authorize(credentials) {
        try {
          const filePath = path.join(process.cwd(), 'data', 'users.json')
          const fileData = fs.readFileSync(filePath, 'utf8')
          const userData = JSON.parse(fileData)
          
          const user = userData.users.find(
            u => u.username === credentials?.username && 
                 u.password === credentials?.password
          )
          
          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              username: user.username
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
      }
      return token
    },
    async session({ session, token }) {
      session.user.username = token.username
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

export const handler = NextAuth(authOptions)
