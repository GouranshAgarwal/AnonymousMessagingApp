import { getToken } from 'next-auth/jwt'
import {NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req:request}); // why need?
    const url = request.nextUrl // need to know the current url to redirect effectively

    console.log("token : ",token);

    if(token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')
        )){
            console.log("redirecting");
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next(); // what is this 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
    ]
}