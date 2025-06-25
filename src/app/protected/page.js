import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Server-Side Protected Page</h1>
          <p>This page is protected on the server side.</p>
          <p>Welcome, {session.user.name}!</p>
        </div>
      </div>
    </div>
  )
}