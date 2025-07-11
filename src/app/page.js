import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }
  else {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to NextAuth App
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            With Email-based Password Reset
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">You are not logged in</p>
          <Link
            href="/auth/signin"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
          >
            Sign In
          </Link>
        </div>
      </div> */}
    </div>
  )
}