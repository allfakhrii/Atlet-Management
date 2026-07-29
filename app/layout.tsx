import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  title: 'Taekwondo Coach Analytics Hub',
  description: 'Internal Dashboard for Taekwondo Coaches',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-900 text-slate-100 min-h-screen selection:bg-cyan-500/30">
        {children}
      </body>
    </html>
  )
}
