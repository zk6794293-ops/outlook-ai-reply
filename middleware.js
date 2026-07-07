import { NextResponse } from 'next/server'

export function middleware(req) {
  const url = req.nextUrl.pathname
  const method = req.method
  const headers = Object.fromEntries(req.headers.entries())
  
  console.log('━━━━━━━━━━━━')
  console.log('🔍 INCOMING REQUEST')
  console.log('URL:', url)
  console.log('Method:', method)
  console.log('User-Agent:', headers['user-agent'])
  console.log('━━━━━━━━━━━━')

  // Home page check
  if (url === '/') {
    console.log('📄 HOME PAGE REQUESTED')
    console.log('⚠️  If you see 404, it means app/page.js not detected by Vercel')
    console.log('✅ Required: app/page.js must exist in root')
  }

  // API route check  
  if (url.startsWith('/api/')) {
    console.log('🔌 API ROUTE REQUESTED:', url)
    console.log('⚠️  If 500 error, check api/reply/route.js + GROK_API_KEY env')
  }

  // Static files check
  if (url.includes('.') && !url.startsWith('/api/')) {
    console.log('📦 STATIC FILE:', url)
  }

  // 404 Debug Info
  console.log('Next.js App Router Active: YES')
  console.log('Expected file for "/": app/page.js')
  console.log('Expected API for "/api/reply": api/reply/route.js')
  console.log('━━━━━━━━━━━━\n')

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}