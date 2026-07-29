export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    // Protect dashboard and athlete profiles
    "/",
    "/athletes/:path*",
    // Exclude API routes, static files, and auth pages
    // Note: NextAuth middleware doesn't need to protect /login and /register
  ]
}
