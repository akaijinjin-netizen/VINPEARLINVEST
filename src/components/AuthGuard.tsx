'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const PUBLIC_PATHS = [
  '/',
  '/dang-nhap',
  '/dang-ky',
  '/linh-vuc-hoat-dong',
  '/phat-trien-ben-vung',
  '/quan-he-co-dong',
  '/tin-tuc-su-kien',
  '/tuyen-dung',
  '/gioi-thieu',
  '/lien-he',
  '/about'
]

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // 1. If it is an admin path, bypass user auth check (handled independently in AdminLayout)
    if (pathname.startsWith('/admin')) {
      setAuthorized(true)
      return
    }

    // 2. If it's a public path, allow access
    if (PUBLIC_PATHS.includes(pathname)) {
      setAuthorized(true)
      return
    }

    // 3. Check client session phone
    const isLoggedIn = localStorage.getItem('userPhone')
    if (!isLoggedIn) {
      window.location.href = '/dang-nhap'
    } else {
      setAuthorized(true)
    }
  }, [pathname])

  if (!authorized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'white' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#6B7280' }}>Đang xác thực tài khoản...</div>
      </div>
    )
  }

  return <>{children}</>
}
