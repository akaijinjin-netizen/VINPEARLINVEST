'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/BottomNav'

export default function UserDepositsHistoryPage() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'loan'>('deposit')
  const [deposits, setDeposits] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userPhone = localStorage.getItem('userPhone') || '0987654321'
    setPhone(userPhone)

    async function loadData() {
      try {
        const supabase = createClient()
        const { data: profile } = await supabase.from('profiles').select('id').eq('phone', userPhone).single()
        if (profile) {
          // Fetch deposits
          const { data: depData } = await supabase
            .from('deposits')
            .select('*')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })

          if (depData) {
            setDeposits(depData.map(d => ({
              id: d.id,
              date: d.created_at ? d.created_at.split('T')[0] : 'Vừa xong',
              member: userPhone,
              amount: d.amount || 0,
              status: d.status || 'pending',
              statusText: d.status === 'approved' ? 'Thành công' : d.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'
            })))
          }

          // Fetch withdrawals
          const { data: withData } = await supabase
            .from('withdrawals')
            .select('*')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })

          if (withData) {
            setWithdrawals(withData.map(w => ({
              id: w.id,
              date: w.created_at ? w.created_at.split('T')[0] : 'Vừa xong',
              member: userPhone,
              amount: w.amount || 0,
              status: w.status || 'pending',
              statusText: w.status === 'approved' ? 'Thành công' : w.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'
            })))
          }
        }
      } catch (err) {
        console.log('Error loading history:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const currentItems = activeTab === 'deposit' ? deposits : activeTab === 'withdraw' ? withdrawals : []

  return (
    <div className="app-container" style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: 90 }}>
      {/* Vingroup Logo Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <Link href="/cua-toi" style={{
          position: 'absolute',
          left: 16,
          fontSize: 20,
          color: '#4B5563',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>←</Link>
        <img src="/top-brand-logo.png" alt="Vingroup" style={{ height: 40, objectFit: 'contain' }} />
      </div>

      {/* Tabs Container */}
      <div style={{
        padding: '16px 16px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('deposit')}
            style={{
              flex: 1,
              padding: '10px 4px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              background: activeTab === 'deposit' ? '#C8102E' : 'white',
              color: activeTab === 'deposit' ? 'white' : '#475569',
              border: activeTab === 'deposit' ? '1px solid #C8102E' : '1px solid #E2E8F0',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            Hồ sơ gửi tiền
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            style={{
              flex: 1,
              padding: '10px 4px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              background: activeTab === 'withdraw' ? '#C8102E' : 'white',
              color: activeTab === 'withdraw' ? 'white' : '#475569',
              border: activeTab === 'withdraw' ? '1px solid #C8102E' : '1px solid #E2E8F0',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            Hồ sơ rút tiền
          </button>
        </div>
        <div style={{ display: 'flex' }}>
          <button
            onClick={() => setActiveTab('loan')}
            style={{
              flex: 1,
              padding: '10px 4px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              background: activeTab === 'loan' ? '#C8102E' : 'white',
              color: activeTab === 'loan' ? 'white' : '#475569',
              border: activeTab === 'loan' ? '1px solid #C8102E' : '1px solid #E2E8F0',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            Hồ sơ vay vốn
          </button>
        </div>
      </div>

      {/* History Data Table Container */}
      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontSize: 14 }}>
            Đang tải lịch sử giao dịch...
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
            {/* Table Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.2fr 1fr',
              background: '#F8FAFC',
              padding: '12px 6px',
              borderBottom: '1px solid #E2E8F0',
              fontSize: 12,
              fontWeight: 700,
              color: '#475569',
              textAlign: 'center'
            }}>
              <div>Ngày giao dịch</div>
              <div>Thành viên</div>
              <div>Số tiền</div>
              <div>Trạng thái</div>
            </div>

            {currentItems.length > 0 ? (
              currentItems.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1.2fr 1fr',
                    padding: '14px 6px',
                    borderBottom: idx < currentItems.length - 1 ? '1px solid #F1F5F9' : 'none',
                    fontSize: 12,
                    color: '#334155',
                    textAlign: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ color: '#64748B' }}>{item.date}</div>
                  <div style={{ wordBreak: 'break-all', fontSize: 11 }}>{item.member}</div>
                  <div style={{ fontWeight: 800, color: activeTab === 'deposit' ? '#10B981' : '#EF4444' }}>
                    {activeTab === 'deposit' ? '+' : '-'}{item.amount.toLocaleString('vi-VN')} đ
                  </div>
                  <div>
                    <span style={{
                      background: item.status === 'approved' ? '#ECFDF5' : item.status === 'rejected' ? '#FEF2F2' : '#FFFBEB',
                      color: item.status === 'approved' ? '#059669' : item.status === 'rejected' ? '#DC2626' : '#D97706',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontWeight: 700,
                      fontSize: 10
                    }}>
                      {item.statusText}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '50px 20px',
                color: '#94A3B8',
                fontSize: 14
              }}>
                Không có dữ liệu
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
