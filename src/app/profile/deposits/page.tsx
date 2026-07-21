'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function UserDepositsHistoryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserDeposits() {
      try {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getSession()

        if (session?.session?.user) {
          const { data } = await supabase
            .from('deposits')
            .select('*')
            .eq('user_id', session.session.user.id)
            .order('created_at', { ascending: false })

          if (data && data.length > 0) {
            setItems(data.map(i => ({
              id: i.id,
              amount: '+' + (i.amount || 0).toLocaleString('vi-VN') + ' VND',
              bank: i.bank_name || 'ACB',
              code: i.transfer_content || 'NAPTIEN',
              time: i.created_at ? i.created_at.replace('T', ' ').slice(0, 16) : 'Vừa xong',
              status: i.status || 'pending',
            })))
          } else {
            setItems([])
          }
        } else {
          setItems([])
        }
      } catch (e) {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchUserDeposits()
  }, [])

  return (
    <div className="app-container" style={{ background: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14, color: 'white'
      }}>
        <Link href="/profile" style={{
          color: 'white', textDecoration: 'none',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%', width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>←</Link>
        <span style={{ fontSize: 18, fontWeight: 700 }}>Chi tiết nạp tiền</span>
      </div>

      <div style={{ padding: '16px', paddingBottom: 40 }}>
        {items.length > 0 ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {items.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: index < items.length - 1 ? '1px solid #F3F4F6' : 'none'
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981', marginBottom: 4 }}>
                    {item.amount}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>
                    {item.bank} • Nội dung: <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{item.code}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{item.time}</div>
                </div>

                <span style={{
                  background: item.status === 'approved' ? '#ECFDF5' : item.status === 'rejected' ? '#FEF2F2' : '#FFFBEB',
                  color: item.status === 'approved' ? '#059669' : item.status === 'rejected' ? '#DC2626' : '#D97706',
                  border: `1px solid ${item.status === 'approved' ? '#A7F3D0' : item.status === 'rejected' ? '#FECACA' : '#FDE68A'}`,
                  fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20
                }}>
                  {item.status === 'approved' ? 'Thành công' : item.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'white', borderRadius: 16, padding: '40px 20px',
            textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🏦</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>Chưa có lệnh nạp tiền</div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20 }}>Bạn chưa thực hiện lệnh nạp tiền nào vào ví.</div>
            <Link href="/deposit" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white', border: 'none', borderRadius: 10,
                padding: '12px 24px', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.25)'
              }}>
                + Thực hiện nạp tiền ngay
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
