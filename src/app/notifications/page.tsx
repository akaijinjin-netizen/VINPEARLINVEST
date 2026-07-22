'use client'

import { useState } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

type UserNotif = {
  id: string
  title: string
  content: string
  time: string
  unread: boolean
  type: 'deposit' | 'profit' | 'system'
}

const MOCK_USER_NOTIFS: UserNotif[] = [
  {
    id: '1',
    type: 'deposit',
    title: '✅ Nạp tiền thành công',
    content: 'Tài khoản của bạn đã được cộng +50,000,000 VND từ lệnh nạp thành công.',
    time: '2026-07-21 14:15',
    unread: true,
  },
  {
    id: '2',
    type: 'profit',
    title: '💰 Nhận lợi nhuận hàng ngày',
    content: 'Bạn vừa nhận được +400,000 VND lợi nhuận cổ tức từ dự án Vingroup QPL Resort & Spa Hạ Long.',
    time: '2026-07-21 09:00',
    unread: true,
  },
  {
    id: '3',
    type: 'system',
    title: '📢 Thông báo cập nhật hệ thống',
    content: 'Vingroup QPL chính thức cập nhật thêm tính năng tra cứu Mã số pháp lý cho tất cả 10 dự án.',
    time: '2026-07-20 18:00',
    unread: false,
  },
]

export default function UserNotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_USER_NOTIFS)

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })))
  }

  return (
    <div className="app-container" style={{ background: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/trang-chu" style={{
            color: 'white', textDecoration: 'none',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%', width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>←</Link>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Thông báo & Tin tức</span>
        </div>
        <button
          onClick={markAllRead}
          style={{
            background: 'rgba(255,255,255,0.2)', color: 'white',
            border: 'none', borderRadius: 8, padding: '6px 12px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}
        >
          Đã đọc hết
        </button>
      </div>

      <div style={{ padding: '16px', paddingBottom: 90 }}>
        {notifs.map(n => (
          <div key={n.id} style={{
            background: n.unread ? '#FEF2F2' : 'white',
            borderRadius: 16, padding: '16px', marginBottom: 12,
            border: n.unread ? '1px solid #FECDD3' : '1px solid #E5E7EB',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1A1A1A' }}>{n.title}</div>
              {n.unread && (
                <span style={{
                  background: '#C8102E', color: 'white',
                  fontSize: 10, fontWeight: 800,
                  padding: '2px 8px', borderRadius: 10
                }}>Mới</span>
              )}
            </div>
            <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, marginBottom: 8 }}>
              {n.content}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{n.time}</div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
