'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Notification = {
  id: string
  title: string
  desc: string
  time: string
  unread: boolean
  link: string
  icon: string
  type: 'deposit' | 'withdrawal' | 'user' | 'investment'
}

const MOCK_ADMIN_NOTIFS: Notification[] = [
  {
    id: '1',
    type: 'deposit',
    icon: '⬇️',
    title: 'Lệnh nạp tiền mới chờ duyệt',
    desc: 'Khách Nguyễn Văn A (0987654321) vừa nạp 50,000,000 VND (Mã: NAPTIEN 278)',
    time: '5 phút trước',
    unread: true,
    link: '/admin/deposits',
  },
  {
    id: '2',
    type: 'withdrawal',
    icon: '⬆️',
    title: 'Yêu cầu rút tiền mới',
    desc: 'Khách Phạm Văn D (0978123456) gửi yêu cầu rút 30,000,000 VND về Vietcombank',
    time: '8 phút trước',
    unread: true,
    link: '/admin/withdrawals',
  },
  {
    id: '3',
    type: 'user',
    icon: '👤',
    title: 'Thành viên mới đăng ký',
    desc: 'Số điện thoại 0941122334 vừa đăng ký tài khoản thành công',
    time: '15 phút trước',
    unread: true,
    link: '/admin/users',
  },
  {
    id: '4',
    type: 'investment',
    icon: '📈',
    title: 'Lệnh đầu tư mới phát sinh',
    desc: 'Trần Thị B vừa đầu tư 200,000,000 VND vào Grand World Phú Quốc',
    time: '25 phút trước',
    unread: true,
    link: '/admin/investments',
  },
]

export default function AdminHeader() {
  const [notifs, setNotifs] = useState<Notification[]>(MOCK_ADMIN_NOTIFS)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifs.filter(n => n.unread).length

  const markAllAsRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleItemClick = (n: Notification) => {
    setNotifs(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item))
    setIsOpen(false)
    router.push(n.link)
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #E5E7EB',
      padding: '0 32px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      {/* Active System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#10B981',
          boxShadow: '0 0 0 3px rgba(16,185,129,0.2)',
        }} />
        <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
          Hệ thống Vingroup QPL đang hoạt động
        </span>
      </div>

      {/* Right widgets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Notifications bell dropdown container */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            style={{
              position: 'relative', cursor: 'pointer',
              width: 40, height: 40,
              background: isOpen ? '#FEF2F2' : '#F9FAFB',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: isOpen ? '1px solid #FECDD3' : '1px solid #E5E7EB',
              transition: 'all 0.2s',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={unreadCount > 0 ? '#C8102E' : '#6B7280'} strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>

            {/* Red Badge */}
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#C8102E', color: 'white',
                fontSize: 10, fontWeight: 800,
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid white',
                boxShadow: '0 2px 6px rgba(200,16,46,0.4)',
                animation: 'pulse 1.5s infinite'
              }}>
                {unreadCount}
              </span>
            )}
          </div>

          {/* Dropdown Panel */}
          {isOpen && (
            <div style={{
              position: 'absolute', top: 50, right: 0,
              width: 380, background: 'white',
              borderRadius: 16,
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              border: '1px solid #E5E7EB',
              zIndex: 100, overflow: 'hidden'
            }}>
              {/* Dropdown Header */}
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid #F3F4F6',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: 'white'
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>Thông báo hệ thống</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                    {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Không có thông báo mới'}
                  </div>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: 'rgba(255,255,255,0.15)', color: 'white',
                      border: 'none', borderRadius: 6,
                      padding: '4px 10px', fontSize: 11, fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Đọc tất cả
                  </button>
                )}
              </div>

              {/* Items List */}
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {notifs.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid #F9FAFB',
                      background: n.unread ? '#FEF2F2' : 'white',
                      cursor: 'pointer', display: 'flex', gap: 12,
                      alignItems: 'flex-start', transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#FEF2F2' : 'white'}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{n.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: n.unread ? 800 : 600, color: '#0F172A' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2, lineHeight: 1.4 }}>
                        {n.desc}
                      </div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                        {n.time}
                      </div>
                    </div>
                    {n.unread && (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#C8102E', flexShrink: 0, marginTop: 6
                      }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Dropdown Footer */}
              <div style={{
                padding: '12px', textAlign: 'center', background: '#F9FAFB',
                borderTop: '1px solid #F3F4F6'
              }}>
                <Link href="/admin/deposits" onClick={() => setIsOpen(false)} style={{
                  color: '#C8102E', fontSize: 13, fontWeight: 700, textDecoration: 'none'
                }}>
                  Xem tất cả các luồng duyệt →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin avatar widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #C8102E, #A00D25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 14, fontWeight: 700,
            boxShadow: '0 2px 8px rgba(200,16,46,0.3)'
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>Admin</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>Quản trị viên</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </header>
  )
}
