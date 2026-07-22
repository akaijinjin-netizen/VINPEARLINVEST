'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { createClient } from '@/lib/supabase/client'

const MOCK_NOTIFICATIONS = [
  { id: 1, title: '🎉 Chúc mừng thành viên mới', content: 'Chào mừng bạn đã gia nhập Quỹ Huy Động Vốn VINGROUP. Tài khoản của bạn đã hoạt động thành công và an toàn.', time: 'Hôm nay' },
  { id: 2, title: '🔒 Xác thực tài khoản thành công', content: 'Cập nhật thông tin định danh thành công. Giờ đây tài khoản của bạn đã đủ điều kiện rút tiền nhanh 24/7.', time: 'Hôm qua' },
  { id: 3, title: '📞 Hệ thống hỗ trợ online hoạt động', content: 'Hệ thống hỗ trợ trực tuyến đã hoạt động trở lại. Nhấn vào bong bóng chát CSKH góc màn hình để trò chuyện.', time: '3 ngày trước' }
]

const MOCK_EVENTS = [
  { id: 1, title: '🔥 Tham gia góp vốn nhận ưu đãi khủng', content: 'Nhận ngay mức hoa hồng lợi nhuận ngày hấp dẫn lên tới 3.89%/ngày khi tham gia các dự án năng lượng và đô thị tương lai mới ra mắt.', time: '22/07/2026 - 31/07/2026' },
  { id: 2, title: '🎁 Mời bạn bè đăng ký tài khoản', content: 'Mỗi lượt giới thiệu thành công bạn bè tham gia đầu tư, bạn sẽ nhận được phần thưởng hoa hồng trực tiếp cộng thẳng vào số dư ví của mình.', time: 'Dài hạn' },
  { id: 3, title: '💎 Chương trình Đại hội Cổ Đông thường niên', content: 'Vingroup công bố lộ trình báo cáo tài chính năm và triển khai các dự án quy mô lớn. Chi tiết cập nhật tại mục tài liệu cổ đông.', time: 'Sắp diễn ra' }
]

const MENU_ITEMS = [
  {
    href: '/cua-toi/investments',
    label: 'Khoản tiền gửi',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <circle cx="17.5" cy="17.5" r="2.5" />
        <line x1="19.5" y1="19.5" x2="21.5" y2="21.5" />
      </svg>
    )
  },
  {
    href: '/cua-toi/bank',
    label: 'Liên kết tài khoản',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polyline points="17 11 19 13 23 9" />
      </svg>
    )
  },
  {
    href: '/cua-toi/deposits',
    label: 'Lịch sử gửi tiền',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  },
  {
    href: '/deposit',
    label: 'Tôi muốn gửi tiền',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    )
  },
  {
    href: '/withdraw',
    label: 'Tôi muốn rút tiền',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    )
  },
  {
    href: '/cua-toi/withdrawals',
    label: 'Lịch sử rút tiền',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="15" x2="15" y2="15" />
        <polyline points="12 12 15 15 12 18" />
      </svg>
    )
  }
]

export default function ProfilePage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [balance, setBalance] = useState(0)
  const [pendingInterest, setPendingInterest] = useState(0)
  const [pendingPrincipal, setPendingPrincipal] = useState(0)
  const [vipLevel, setVipLevel] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showNotifModal, setShowNotifModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)

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
        const { data: profile } = await supabase
          .from('profiles')
          .select('*, wallets(*)')
          .eq('phone', userPhone || '')
          .single()

        if (profile) {
          setVipLevel(profile.vip_level ?? 0)
          if (profile.wallets) {
            setBalance(profile.wallets.balance || 0)
            setPendingInterest(profile.wallets.pending_interest || 0)
            setPendingPrincipal(profile.wallets.pending_principal || 0)
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
    router.push('/dang-nhap')
  }

  return (
    <div className="app-container" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Vingroup Logo Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img src="/top-brand-logo.png" alt="Vingroup" style={{ height: 40, objectFit: 'contain' }} />
      </div>

      {/* User Info Gradient Card */}
      <div style={{
        background: 'linear-gradient(180deg, #C8102E 0%, #990B1E 100%)',
        padding: '24px 16px 40px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Avatar Placeholder */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{phone}</div>
            {!loading && (
              <span style={{
                background: 'linear-gradient(135deg, #F0C040 0%, #D4A373 100%)',
                color: '#4A3B18',
                fontSize: 10,
                fontWeight: 900,
                padding: '2px 6px',
                borderRadius: 6,
                boxShadow: '0 2px 5px rgba(240,192,64,0.3)',
                display: 'inline-block',
                lineHeight: '13px',
                marginTop: 4
              }}>VIP {vipLevel}</span>
            )}
          </div>
        </div>

        {/* Right side icons */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Calendar Icon */}
          <div onClick={() => setShowEventModal(true)} style={{ color: 'white', cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          {/* Bell Icon */}
          <div onClick={() => setShowNotifModal(true)} style={{ color: 'white', cursor: 'pointer', position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        </div>
      </div>

      {/* Rút tiền / Gửi tiền Quick Actions Banner */}
      <div style={{
        display: 'flex',
        background: '#34455E',
        borderRadius: 10,
        margin: '-20px 16px 0',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
      }}>
        <Link href="/withdraw" style={{
          flex: 1,
          textAlign: 'center',
          padding: '12px 0',
          color: 'white',
          fontWeight: 700,
          fontSize: 14,
          textDecoration: 'none',
          borderRight: '1px solid rgba(255,255,255,0.1)'
        }}>
          Rút tiền
        </Link>
        <Link href="/deposit" style={{
          flex: 1,
          textAlign: 'center',
          padding: '12px 0',
          color: 'white',
          fontWeight: 700,
          fontSize: 14,
          textDecoration: 'none'
        }}>
          Gửi tiền
        </Link>
      </div>

      {/* Balance Details White Card */}
      <div style={{
        background: 'white',
        borderRadius: 12,
        margin: '16px',
        padding: '16px 20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid #F1F5F9',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ flex: 1, borderRight: '1px solid #F1F5F9', paddingRight: 10 }}>
          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, lineHeight: 1.4 }}>Số dư tài khoản(VND)</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B', marginTop: 8 }}>
            {balance.toLocaleString('vi-VN')} đ
          </div>
        </div>
        <div style={{ flex: 1, paddingLeft: 20 }}>
          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, lineHeight: 1.4 }}>Thu nhập tích luỹ(VND)</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B', marginTop: 8 }}>
            {pendingInterest.toLocaleString('vi-VN')} đ
          </div>
        </div>
      </div>

      {/* Main Menu List */}
      <div style={{ padding: '0 16px', paddingBottom: 110 }}>
        <div style={{
          background: 'white',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #F1F5F9',
          boxShadow: '0 2px 10px rgba(0,0,0,0.01)'
        }}>
          {MENU_ITEMS.map((item, index) => (
            <Link key={index} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: index < MENU_ITEMS.length - 1 ? '1px solid #F1F5F9' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: '#FEF2F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>{item.label}</span>
                </div>
                <span style={{ color: '#94A3B8', fontSize: 18, fontWeight: 'bold' }}>›</span>
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
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
          }}
        >
          Đăng xuất tài khoản
        </button>
      </div>

      {/* Modal Notification */}
      {showNotifModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: 20, width: '100%', maxWidth: 360,
            maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}>
            <div style={{ background: '#C8102E', color: 'white', padding: '16px 20px', fontSize: 16, fontWeight: 800, textAlign: 'center' }}>
              🔔 Thông báo hệ thống
            </div>
            <div style={{ overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {MOCK_NOTIFICATIONS.map(n => (
                <div key={n.id} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, color: '#1E293B', fontSize: 13 }}>{n.title}</span>
                    <span style={{ color: '#94A3B8', fontSize: 11 }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, margin: 0 }}>{n.content}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowNotifModal(false)} style={{
              background: '#F1F5F9', border: 'none', padding: '14px', fontSize: 14, fontWeight: 700,
              color: '#475569', cursor: 'pointer', borderTop: '1px solid #E2E8F0'
            }}>Đóng</button>
          </div>
        </div>
      )}

      {/* Modal Event */}
      {showEventModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: 20, width: '100%', maxWidth: 360,
            maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}>
            <div style={{ background: '#C8102E', color: 'white', padding: '16px 20px', fontSize: 16, fontWeight: 800, textAlign: 'center' }}>
              📅 Sự kiện & Khuyến mãi
            </div>
            <div style={{ overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {MOCK_EVENTS.map(e => (
                <div key={e.id} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, color: '#C8102E', fontSize: 13 }}>{e.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, margin: '0 0 6px' }}>{e.content}</p>
                  <span style={{ color: '#94A3B8', fontSize: 10, display: 'block' }}>Thời gian: {e.time}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowEventModal(false)} style={{
              background: '#F1F5F9', border: 'none', padding: '14px', fontSize: 14, fontWeight: 700,
              color: '#475569', cursor: 'pointer', borderTop: '1px solid #E2E8F0'
            }}>Đóng</button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
