export function middleware(request) {
  console.log('🔍 REQUEST:', request.nextUrl.pathname)
  
  if (request.nextUrl.pathname === '/') {
    console.log('📄 HOME PAGE HIT - If 404, app/page.js missing')
  }
  
  return Response.next()
}

export const config = {
  matcher: '/:path*',
}