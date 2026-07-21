'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function UserInvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserInvestments() {
      try {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getSession()

        if (session?.session?.user) {
          const { data } = await supabase
            .from('investments')
            .select('*, projects(*)')
            .eq('user_id', session.session.user.id)
            .order('created_at', { ascending: false })

          if (data && data.length > 0) {
            setInvestments(data.map(i => ({
              id: i.id,
              projectName: i.projects?.name || 'Dự án đầu tư Vinpearl',
              amount: i.amount || 0,
              dailyProfit: Math.floor((i.amount || 0) * (i.projects?.daily_profit_rate || 0.8) / 100),
              dailyRate: i.projects?.daily_profit_rate || 0.8,
              profitEarned: i.profit_earned || 0,
              startDate: i.start_time ? i.start_time.split('T')[0] : '2026-07-21',
              endDate: i.end_time ? i.end_time.split('T')[0] : '2026-10-21',
              status: i.status || 'active',
            })))
          } else {
            setInvestments([])
          }
        } else {
          setInvestments([])
        }
      } catch (e) {
        setInvestments([])
      } finally {
        setLoading(false)
      }
    }
    fetchUserInvestments()
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
        <span style={{ fontSize: 18, fontWeight: 700 }}>Hồ sơ đầu tư</span>
      </div>

      <div style={{ padding: '16px', paddingBottom: 40 }}>
        {investments.length > 0 ? (
          investments.map(item => (
            <div key={item.id} style={{
              background: 'white', borderRadius: 16, padding: '20px',
              marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1A1A1A' }}>{item.projectName}</h3>
                <span style={{
                  background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0',
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20
                }}>
                  ● Đang hoạt động
                </span>
              </div>

              <div style={{ background: '#FEF2F2', borderRadius: 12, padding: '14px', marginBottom: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Số tiền đầu tư</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#C8102E', marginTop: 2 }}>
                      {item.amount.toLocaleString('vi-VN')} VND
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Lợi nhuận đã nhận</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981', marginTop: 2 }}>
                      +{item.profitEarned.toLocaleString('vi-VN')} VND
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Lợi nhuận hàng ngày:</span>
                  <span style={{ fontWeight: 700, color: '#C8102E' }}>
                    {item.dailyRate}% ({item.dailyProfit.toLocaleString('vi-VN')}đ/ngày)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Ngày bắt đầu:</span>
                  <span style={{ fontWeight: 500, color: '#1A1A1A' }}>{item.startDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Ngày đáo hạn:</span>
                  <span style={{ fontWeight: 500, color: '#1A1A1A' }}>{item.endDate}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            background: 'white', borderRadius: 16, padding: '40px 20px',
            textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📈</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>Chưa có hợp đồng đầu tư</div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20 }}>Tài khoản của bạn chưa kích hoạt dự án đầu tư nào.</div>
            <Link href="/invest" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #C8102E, #A00D25)',
                color: 'white', border: 'none', borderRadius: 10,
                padding: '12px 24px', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(200,16,46,0.25)'
              }}>
                Khám phá các Dự án Đầu tư →
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
