import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import TopHeader from '@/components/layout/TopHeader'

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
      <body className="bg-slate-900 text-slate-100 flex min-h-screen selection:bg-cyan-500/30">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <TopHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
