'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function IncomePage() {
  const [items, setItems] = useState<any[]>([])
  const [totalEarned, setTotalEarned] = useState(0)

  useEffect(() => {
    async function fetchIncomeData() {
      try {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getSession()

        if (session?.session?.user) {
          const { data } = await supabase
            .from('income_history')
            .select('*')
            .eq('user_id', session.session.user.id)
            .eq('type', 'profit')
            .order('created_at', { ascending: false })

          if (data && data.length > 0) {
            setItems(data.map(i => ({
              id: i.id,
              projectName: i.description || 'Vingroup QPL Resort & Spa',
              rate: '0.8%',
              amount: '+' + i.amount.toLocaleString('vi-VN') + ' VND',
              time: i.created_at ? i.created_at.split('T')[0] : 'Vừa xong'
            })))
            const sum = data.reduce((acc, curr) => acc + (curr.amount || 0), 0)
            setTotalEarned(sum)
          } else {
            setItems([])
            setTotalEarned(0)
          }
        } else {
          setItems([])
          setTotalEarned(0)
        }
      } catch (e) {
        setItems([])
        setTotalEarned(0)
      }
    }
    fetchIncomeData()
  }, [])

  return (
    <div className="app-container" style={{ background: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14, color: 'white'
      }}>
        <Link href="/cua-toi" style={{
          color: 'white', textDecoration: 'none',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%', width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>←</Link>
        <span style={{ fontSize: 18, fontWeight: 700 }}>Hồ sơ thu nhập</span>
      </div>

      <div style={{ padding: '16px', paddingBottom: 40 }}>
        {/* Total Earned Card */}
        <div style={{
          background: 'white', borderRadius: 16, padding: '24px',
          textAlign: 'center', marginBottom: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }}>Tổng thu nhập đã nhận</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#10B981' }}>
            +{totalEarned.toLocaleString('vi-VN')} VND
          </div>
        </div>

        {/* History */}
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 }}>
          Lịch sử chia cổ tức & Lợi nhuận
        </div>

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
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
                    {item.projectName}
                  </div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                    Lợi nhuận ({item.rate})
                  </div>
                  <div style={{ fontSize: 11, color: '#D1D5DB', marginTop: 2 }}>{item.time}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>
                  {item.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'white', borderRadius: 16, padding: '40px 20px',
            textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>💰</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>Chưa có thu nhập cổ tức</div>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Khi gói đầu tư của bạn sinh lãi theo chu kỳ, tiền lãi sẽ tự động cộng vào đây.</div>
          </div>
        )}
      </div>
    </div>
  )
}
