'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // If accessing the login page, bypass check
    if (pathname === '/admin/login') {
      setAuthorized(true)
      return
    }

    // Check admin session
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn')
    if (isAdminLoggedIn !== 'true') {
      window.location.href = '/admin/login'
    } else {
      setAuthorized(true)
    }
  }, [pathname])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!authorized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F0F2F5' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#6B7280' }}>Đang xác thực quyền quản trị...</div>
      </div>
    )
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
