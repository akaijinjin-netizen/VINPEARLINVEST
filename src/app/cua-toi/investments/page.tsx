'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function UserInvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'ended'>('active')

  useEffect(() => {
    async function fetchUserInvestments() {
      try {
        const supabase = createClient()
        const userPhone = localStorage.getItem('userPhone')
        if (userPhone) {
          // Tự động kiểm tra và trả lãi cho các gói đầu tư hết chu kỳ khi vào danh sách
          await supabase.rpc('process_expired_investments')

          const { data: profile } = await supabase.from('profiles').select('id').eq('phone', userPhone).single()
          if (profile) {
            const { data } = await supabase
              .from('investments')
              .select('*, projects(*)')
              .eq('user_id', profile.id)
              .order('created_at', { ascending: false })

            if (data && data.length > 0) {
              setInvestments(data.map(i => ({
                id: i.id,
                projectName: i.projects?.name || i.projects?.title || 'Dự án đầu tư Vingroup QPL',
                amount: i.amount || 0,
                dailyProfit: Math.floor((i.amount || 0) * (i.projects?.daily_profit_rate || i.interest_rate || 0.8) / 100),
                dailyRate: i.projects?.daily_profit_rate || i.interest_rate || 0.8,
                profitEarned: i.profit_earned || 0,
                startDate: (i.start_time || i.start_date || i.created_at || '').slice(0, 10),
                endDate: (i.end_time || i.end_date || '').slice(0, 10) || '—',
                status: i.status || 'active',
              })))
            } else {
              setInvestments([])
            }
          }
        }
      } catch (e) {
        console.log('Error loading investments:', e)
        setInvestments([])
      } finally {
        setLoading(false)
      }
    }
    fetchUserInvestments()
  }, [])

  const filtered = investments.filter(item => {
    if (activeTab === 'active') {
      return item.status === 'active' || item.status === 'contributing' || item.status === 'running'
    } else {
      return item.status === 'ended' || item.status === 'finished' || item.status === 'completed'
    }
  })

  return (
    <div className="app-container" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
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

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        background: '#F1F5F9',
        padding: '4px',
        margin: '16px',
        borderRadius: 12,
        gap: 4
      }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            background: activeTab === 'active' ? 'white' : 'transparent',
            color: activeTab === 'active' ? '#1E293B' : '#3B82F6',
            cursor: 'pointer',
            boxShadow: activeTab === 'active' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          Đang góp vốn
        </button>
        <button
          onClick={() => setActiveTab('ended')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            background: activeTab === 'ended' ? 'white' : 'transparent',
            color: activeTab === 'ended' ? '#1E293B' : '#3B82F6',
            cursor: 'pointer',
            boxShadow: activeTab === 'ended' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          Đã kết thúc
        </button>
      </div>

      <div style={{ padding: '0 16px 40px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontSize: 14 }}>
            Đang tải hồ sơ đầu tư...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map(item => (
            <div key={item.id} style={{
              background: 'white', borderRadius: 16, padding: '20px',
              marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              border: '1px solid #F1F5F9'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{item.projectName}</h3>
                <span style={{
                  background: item.status === 'active' ? '#ECFDF5' : '#F1F5F9',
                  color: item.status === 'active' ? '#059669' : '#64748B',
                  border: `1px solid ${item.status === 'active' ? '#A7F3D0' : '#E2E8F0'}`,
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20
                }}>
                  {item.status === 'active' ? '● Đang hoạt động' : '● Đã kết thúc'}
                </span>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px', marginBottom: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Số tiền đầu tư</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#C8102E', marginTop: 2 }}>
                      {item.amount.toLocaleString('vi-VN')} VND
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Lợi nhận tích lũy</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981', marginTop: 2 }}>
                      +{item.profitEarned.toLocaleString('vi-VN')} VND
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Lợi nhuận:</span>
                  <span style={{ fontWeight: 700, color: '#C8102E' }}>
                    {item.dailyRate}% ({item.dailyProfit.toLocaleString('vi-VN')}đ)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Ngày bắt đầu:</span>
                  <span style={{ fontWeight: 500, color: '#0F172A' }}>{item.startDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Ngày đáo hạn:</span>
                  <span style={{ fontWeight: 500, color: '#0F172A' }}>{item.endDate}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
            textAlign: 'center'
          }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
              <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
              <path d="M12 11l4 4M16 11l-4 4" />
            </svg>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8' }}>
              {activeTab === 'active' ? 'Không có dự án đang góp vốn' : 'Không có dự án đã kết thúc'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
