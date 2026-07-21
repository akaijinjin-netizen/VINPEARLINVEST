'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { createClient } from '@/lib/supabase/client'

const MENU_ITEMS = [
  { icon: '📋', label: 'Chi tiết tài chính', bg: '#FEF2F2', iconBg: '#FECDD3', href: '/profile/finance' },
  { icon: '📈', label: 'Hồ sơ đầu tư', bg: '#EFF6FF', iconBg: '#BFDBFE', href: '/profile/investments' },
  { icon: '💰', label: 'Hồ sơ thu nhập', bg: '#F0FDF4', iconBg: '#A7F3D0', href: '/profile/income' },
  { icon: '🏦', label: 'Chi tiết nạp tiền', bg: '#FEF3C7', iconBg: '#FDE68A', href: '/profile/deposits' },
  { icon: '💸', label: 'Hồ sơ rút tiền', bg: '#F5F3FF', iconBg: '#DDD6FE', href: '/profile/withdrawals' },
]

const SECURITY_ITEMS = [
  { icon: '🔐', label: 'Bảo mật tài khoản', bg: '#FEF2F2', iconBg: '#FECDD3', href: '/profile/security' },
  { icon: '💳', label: 'Liên kết thẻ ngân hàng', bg: '#F0FDF4', iconBg: '#A7F3D0', href: '/profile/bank' },
]

export default function ProfilePage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [balance, setBalance] = useState(0)
  const [pendingInterest, setPendingInterest] = useState(0)
  const [pendingPrincipal, setPendingPrincipal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userPhone = localStorage.getItem('userPhone')

    if (!isLoggedIn || isLoggedIn !== 'true') {
      // Redirect unauthenticated user to login page
      router.push('/')
      return
    }

    setPhone(userPhone || '0987654321')

    async function fetchUserData() {
      try {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getSession()
        if (session?.session?.user) {
          const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', session.session.user.id).single()
          if (wallet) {
            setBalance(wallet.balance || 0)
            setPendingInterest(wallet.pending_interest || 0)
            setPendingPrincipal(wallet.pending_principal || 0)
          }
        }
      } catch (e) {
        console.log('Session query fallback:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userPhone')
    router.push('/')
  }

  return (
    <div className="app-container" style={{ background: '#F5F5F5' }}>
      {/* Header with balance */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #7B0A19 100%)',
        padding: '50px 20px 30px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 160, height: 160,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 20 }}>
            Tài khoản của tôi: <span style={{ fontWeight: 700 }}>{phone}</span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ 
              fontSize: 48, fontWeight: 900, 
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
              {balance.toLocaleString('vi-VN')}
            </div>
            <div style={{ fontSize: 15, opacity: 0.85, marginTop: 4 }}>Số dư tài khoản (VND)</div>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1px 1fr',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            borderRadius: 14, padding: '14px 10px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{pendingInterest.toLocaleString('vi-VN')}đ</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Tiền lãi sắp nhận</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{pendingPrincipal.toLocaleString('vi-VN')}đ</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Tiền gốc sắp nhận</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 12, padding: '16px 16px 0'
      }}>
        <Link href="/deposit" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white', border: 'none', borderRadius: 12,
            padding: '14px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            📥 Nạp tiền
          </button>
        </Link>

        <Link href="/withdraw" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: 'white', border: 'none', borderRadius: 12,
            padding: '14px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            📤 Rút tiền
          </button>
        </Link>
      </div>

      {/* Main menu */}
      <div style={{ padding: '16px', paddingBottom: 90 }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          {MENU_ITEMS.map((item, index) => (
            <Link key={index} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: index < MENU_ITEMS.length - 1 ? '1px solid #F3F4F6' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: item.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{item.label}</span>
                </div>
                <span style={{ color: '#9CA3AF', fontSize: 18 }}>›</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Security section */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 8, paddingLeft: 4 }}>
          BẢO MẬT & TÀI KHOẢN
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          {SECURITY_ITEMS.map((item, index) => (
            <Link key={index} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: index < SECURITY_ITEMS.length - 1 ? '1px solid #F3F4F6' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: item.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{item.label}</span>
                </div>
                <span style={{ color: '#9CA3AF', fontSize: 18 }}>›</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            background: 'white',
            border: '1.5px solid #FCA5A5',
            color: '#DC2626',
            borderRadius: 12,
            padding: '14px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          🚪 Đăng xuất tài khoản
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
