'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Standalone full-screen login page (no sidebar, no header)
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F2F5' }}>
      <AdminSidebar />
      <div style={{
        flex: 1,
        marginLeft: 260,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top Bar */}
        <AdminHeader />

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
