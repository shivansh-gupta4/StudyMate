import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request })
  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isLearningChoicePage = request.nextUrl.pathname.startsWith('/learning_choice')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
  const isLearningPage = request.nextUrl.pathname.startsWith('/learning')

  // Handle auth pages (login, register)
  if (isAuthPage || isLearningChoicePage) {
    if (token?.courseFilled) {
      // If user is authenticated and tries to access auth pages, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard/calendar', request.url))
    }
    return null
  }

  // Handle learning choice page
  if (isLearningPage || isDashboardPage) {
    if (!isAuth) {
      // If user is not authenticated, redirect to login
      return NextResponse.redirect(
        new URL(`/auth/login`, request.url)
      )
    }
    return null
  }

  return null
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/dashboard/:path*',
    '/learning/:path*',
    '/learning_choice/:path*',
    '/auth/:path*',
  ],
} 