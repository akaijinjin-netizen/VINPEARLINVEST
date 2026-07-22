'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

export default function AdminHeader() {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [readNotifIds, setReadNotifIds] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifs.filter(n => n.unread).length

  useEffect(() => {
    // Load read notifications from localStorage
    const saved = localStorage.getItem('readAdminNotifIds')
    if (saved) {
      try {
        setReadNotifIds(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  async function fetchRealNotifications() {
    try {
      const supabase = createClient()
      const newNotifs: Notification[] = []

      // 1. Fetch pending deposits
      const { data: deps } = await supabase
        .from('deposits')
        .select('*, profiles(phone, full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (deps) {
        deps.forEach(d => {
          const id = `dep_${d.id}`
          const isUnread = !readNotifIds.includes(id)
          newNotifs.push({
            id,
            type: 'deposit',
            icon: '⬇️',
            title: 'Lệnh nạp tiền mới chờ duyệt',
            desc: `Khách ${d.profiles?.full_name || 'Khách hàng'} (${d.profiles?.phone || 'N/A'}) vừa nạp ${d.amount?.toLocaleString('vi-VN')}đ`,
            time: d.created_at ? d.created_at.replace('T', ' ').slice(11, 16) : 'Vừa xong',
            unread: isUnread,
            link: '/admin/deposits'
          })
        })
      }

      // 2. Fetch pending withdrawals
      const { data: withs } = await supabase
        .from('withdrawals')
        .select('*, profiles(phone, full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (withs) {
        withs.forEach(w => {
          const id = `with_${w.id}`
          const isUnread = !readNotifIds.includes(id)
          newNotifs.push({
            id,
            type: 'withdrawal',
            icon: '⬆️',
            title: 'Yêu cầu rút tiền mới',
            desc: `Khách ${w.profiles?.full_name || 'Khách hàng'} (${w.profiles?.phone || 'N/A'}) gửi yêu cầu rút ${w.amount?.toLocaleString('vi-VN')}đ`,
            time: w.created_at ? w.created_at.replace('T', ' ').slice(11, 16) : 'Vừa xong',
            unread: isUnread,
            link: '/admin/withdrawals'
          })
        })
      }

      // 3. Fetch last 3 registered users
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(3)

      if (users) {
        users.forEach(u => {
          const id = `user_${u.id}`
          const isUnread = !readNotifIds.includes(id)
          newNotifs.push({
            id,
            type: 'user',
            icon: '👤',
            title: 'Thành viên mới đăng ký',
            desc: `Số điện thoại ${u.phone || 'N/A'} vừa đăng ký tài khoản thành công`,
            time: u.created_at ? u.created_at.replace('T', ' ').slice(11, 16) : 'Vừa xong',
            unread: isUnread,
            link: '/admin/users'
          })
        })
      }

      // Sort notifications so unread are first
      newNotifs.sort((a, b) => (a.unread === b.unread ? 0 : a.unread ? -1 : 1))

      setNotifs(newNotifs)
    } catch (e) {
      console.log('Error loading notifications:', e)
    }
  }

  useEffect(() => {
    fetchRealNotifications()
    // Poll notifications every 10 seconds
    const interval = setInterval(fetchRealNotifications, 10000)
    return () => clearInterval(interval)
  }, [readNotifIds])

  const markAllAsRead = () => {
    const allIds = notifs.map(n => n.id)
    const updated = Array.from(new Set([...readNotifIds, ...allIds]))
    setReadNotifIds(updated)
    localStorage.setItem('readAdminNotifIds', JSON.stringify(updated))
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleItemClick = (n: Notification) => {
    const updated = Array.from(new Set([...readNotifIds, n.id]))
    setReadNotifIds(updated)
    localStorage.setItem('readAdminNotifIds', JSON.stringify(updated))
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
                {notifs.length > 0 ? (
                  notifs.map(n => (
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
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF', fontSize: 13 }}>
                    🎉 Không có thông báo giao dịch chờ duyệt!
                  </div>
                )}
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
