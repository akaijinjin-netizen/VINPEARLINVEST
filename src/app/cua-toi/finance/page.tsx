'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function FinanceDetailPage() {
  const [filter, setFilter] = useState('all')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFinanceData() {
      try {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getSession()

        if (session?.session?.user) {
          const { data } = await supabase
            .from('income_history')
            .select('*')
            .eq('user_id', session.session.user.id)
            .order('created_at', { ascending: false })

          if (data && data.length > 0) {
            setItems(data.map(i => ({
              id: i.id,
              type: i.type,
              title: i.description || 'Giao dịch tài chính',
              amount: (i.amount > 0 ? '+' : '') + i.amount.toLocaleString('vi-VN') + ' VND',
              time: i.created_at ? i.created_at.split('T')[0] : 'Vừa xong',
              status: 'success'
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
    fetchFinanceData()
  }, [])

  const filtered = filter === 'all' ? items : items.filter(item => item.type === filter)

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
        <span style={{ fontSize: 18, fontWeight: 700 }}>Chi tiết tài chính</span>
      </div>

      <div style={{ padding: '16px', paddingBottom: 40 }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'deposit', label: 'Nạp tiền' },
            { key: 'profit', label: 'Lợi nhuận' },
            { key: 'investment', label: 'Đầu tư' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                background: filter === tab.key ? '#C8102E' : 'white',
                color: filter === tab.key ? 'white' : '#374151',
                border: 'none', borderRadius: 20,
                padding: '8px 16px', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', flexShrink: 0,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transaction History List */}
        {filtered.length > 0 ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {filtered.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: index < filtered.length - 1 ? '1px solid #F3F4F6' : 'none'
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{item.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: 15, fontWeight: 800,
                    color: item.amount.startsWith('+') ? '#10B981' : '#C8102E'
                  }}>
                    {item.amount}
                  </div>
                  <div style={{ fontSize: 11, color: '#10B981', marginTop: 2, fontWeight: 500 }}>
                    Thành công
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'white', borderRadius: 16, padding: '40px 20px',
            textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>Chưa có giao dịch tài chính</div>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Bạn chưa có lịch sử biến động số dư nào trong tài khoản.</div>
          </div>
        )}
      </div>
    </div>
  )
}
