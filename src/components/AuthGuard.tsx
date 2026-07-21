'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // 1. Separate Admin Auth Guard logic
    if (pathname.startsWith('/admin')) {
      if (pathname === '/admin/login') {
        setAuthorized(true)
        return
      }

      const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn')
      if (isAdminLoggedIn !== 'true') {
        setAuthorized(false)
        router.push('/admin/login')
      } else {
        setAuthorized(true)
      }
      return
    }

    // 2. Public User App routes (Login & Register)
    if (pathname === '/' || pathname === '/register') {
      setAuthorized(true)
      return
    }

    // 3. User App Protected routes (Home, Invest, Profile, Withdraw, Deposit...)
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userPhone = localStorage.getItem('userPhone')

    if (isLoggedIn !== 'true' || !userPhone) {
      setAuthorized(false)
      router.push('/')
      return
    }

    setAuthorized(true)

    // 4. REAL-TIME ACCOUNT STATUS CHECK (Kick locked users out immediately)
    async function checkAccountStatus() {
      try {
        const supabase = createClient()
        const { data: profile } = await supabase
          .from('profiles')
          .select('status')
          .eq('phone', userPhone)
          .maybeSingle()

        if (profile && profile.status === 'locked') {
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('userPhone')
          alert('⚠️ Tài khoản của bạn đã bị KHÓA bởi Quản trị viên! Vui lòng liên hệ Bộ phận CSKH để được trợ giúp.')
          window.location.href = '/'
        }
      } catch (e) {
        console.log('Status check fallback:', e)
      }
    }

    // Check immediately on navigation
    checkAccountStatus()

    // Poll every 3 seconds for real-time status updates from Admin
    const interval = setInterval(checkAccountStatus, 3000)
    return () => clearInterval(interval)

  }, [pathname, router])

  // Prevent rendering protected content before authorization check passes
  if (!authorized) {
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') return null
    if (!pathname.startsWith('/admin') && pathname !== '/' && pathname !== '/register') return null
  }

  return <>{children}</>
}
