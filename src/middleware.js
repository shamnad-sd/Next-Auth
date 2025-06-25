import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any additional logic here
    console.log('Middleware executed for:', req.nextUrl.pathname)
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

// Apply middleware to specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/protected/:path*', '/admin/:path*',]
}