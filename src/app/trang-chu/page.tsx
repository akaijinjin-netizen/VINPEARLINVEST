'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { SEED_PROJECTS } from '@/lib/data/projects'
import { createClient } from '@/lib/supabase/client'

function formatCurrency(n: number) {
  return n.toLocaleString('vi-VN') + ' VND'
}

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>(SEED_PROJECTS)
  const [userPhone, setUserPhone] = useState('')
  const [balance, setBalance] = useState(0)
  const [activeInvestmentsCount, setActiveInvestmentsCount] = useState(0)
  const [todayProfit, setTodayProfit] = useState(0)

  useEffect(() => {
    const phone = localStorage.getItem('userPhone') || ''
    setUserPhone(phone)

    async function loadUserData() {
      try {
        const supabase = createClient()
        
        // 1. Fetch projects
        const { data: projData, error: projErr } = await supabase
          .from('projects')
          .select('id, name, location, image_url, daily_profit_rate, min_investment, progress_percent')
          .order('sort_order', { ascending: true })
          .limit(20)

        if (!projErr && projData && projData.length > 0) {
          setFeaturedProjects(projData)
        }

        // 2. Fetch profile & wallet cleanly by phone number
        if (phone) {
          // Tự động kiểm tra và trả lãi cho các gói đầu tư hết chu kỳ khi vào trang chủ
          await supabase.rpc('process_expired_investments')

          const { data: profile } = await supabase
            .from('profiles')
            .select('id, phone, full_name')
            .eq('phone', phone)
            .maybeSingle()

          if (profile?.id) {
            const { data: wallet } = await supabase
              .from('wallets')
              .select('balance')
              .eq('user_id', profile.id)
              .maybeSingle()

            if (wallet) {
              setBalance(wallet.balance || 0)
            }

            const { count: invCount } = await supabase
              .from('investments')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', profile.id)
              .eq('status', 'active')

            setActiveInvestmentsCount(invCount || 0)

            // 3. Fetch today's profit
            const startOfDay = new Date()
            startOfDay.setHours(0, 0, 0, 0)
            const isoStartOfDay = startOfDay.toISOString()

            // Overnight interest logs
            const { data: interestLogs } = await supabase
              .from('overnight_interest_logs')
              .select('interest_amount')
              .eq('user_id', profile.id)
              .gte('created_at', isoStartOfDay)

            const totalInterest = interestLogs?.reduce((sum, log) => sum + (Number(log.interest_amount) || 0), 0) || 0

            // Investment cycle profits ended today
            const { data: endedInvestments } = await supabase
              .from('investments')
              .select('profit_earned, end_time, end_date')
              .eq('user_id', profile.id)
              .eq('status', 'ended')

            const todayStr = new Date().toDateString()
            const totalInvestmentProfit = endedInvestments?.filter(inv => {
              const dStr = inv.end_time || inv.end_date
              return dStr && new Date(dStr).toDateString() === todayStr
            }).reduce((sum, inv) => sum + (Number(inv.profit_earned) || 0), 0) || 0

            setTodayProfit(totalInterest + totalInvestmentProfit)
          }
        }
      } catch (e) {
        console.log('User data load fallback:', e)
      }
    }

    loadUserData()
  }, [])

  return (
    <div className="app-container" style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Top Brand Header */}
      <div style={{
        background: '#ffffff',
        height: 56,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #E2E8F0',
        boxSizing: 'border-box',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <img 
          src="/top-brand-logo.png" 
          alt="Vingroup Logo" 
          style={{ height: 40, objectFit: 'contain' }} 
        />
      </div>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #7B0A19 100%)',
        padding: '30px 20px 20px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', top: 20, right: 20,
          width: 80, height: 80,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 4 }}>
            Tài khoản: <span style={{ fontWeight: 700, color: '#F0C040' }}>{userPhone || 'Khách hàng'}</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
            <span style={{ color: '#F0C040' }}>V</span>INGROUP
          </div>
          <div style={{ fontSize: 13, opacity: 0.75 }}>Nền tảng đầu tư nghỉ dưỡng cao cấp</div>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div style={{
        margin: '-20px 16px 0', position: 'relative', zIndex: 5
      }}>
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: '16px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr 1px 1fr',
          gap: 0,
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#C8102E' }}>
              {balance.toLocaleString('vi-VN')}đ
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Số dư khả dụng</div>
          </div>

          <div style={{ height: 30, background: '#F0F0F0' }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>
              {activeInvestmentsCount}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Gói đầu tư</div>
          </div>

          <div style={{ height: 30, background: '#F0F0F0' }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#F59E0B' }}>
              +{todayProfit.toLocaleString('vi-VN')}đ
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Lợi nhuận hôm nay</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px 16px 90px' }}>
        {/* Quick Actions */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 12, marginBottom: 24 
        }}>
          {[
            { icon: '🏖️', label: 'Dự án', href: '/dau-tu' },
            { icon: '💬', label: 'CSKH', href: '/cskh' },
            { icon: '📤', label: 'Rút tiền', href: '/withdraw' },
            { icon: '🔔', label: 'Thông báo', href: '/notifications' },
          ].map((item, index) => (
            <Link key={index} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: 14,
                padding: '14px 8px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s ease'
              }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{item.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Projects Section Header */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', 
          alignItems: 'center', marginBottom: 14 
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>
            Dự Án Nổi Bật
          </h2>
          <Link href="/dau-tu" style={{ color: '#C8102E', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Xem tất cả →
          </Link>
        </div>

        {/* Featured Projects List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {featuredProjects.map((project) => (
            <Link 
              key={project.id} 
              href={`/dau-tu/${project.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 160 }}>
                  <img
                    src={project.image_url}
                    alt={project.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    background: '#C8102E', color: 'white',
                    fontSize: 11, fontWeight: 800,
                    padding: '3px 8px', borderRadius: 12
                  }}>
                    {project.daily_profit_rate}%/ngày
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 10, left: 10,
                    background: 'rgba(0,0,0,0.6)', color: 'white',
                    fontSize: 11, padding: '2px 8px', borderRadius: 10
                  }}>
                    📍 {project.location}
                  </div>
                </div>

                <div style={{ padding: '14px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>
                    {project.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280' }}>
                    <span>Đầu tư từ: <strong style={{ color: '#C8102E' }}>{((project.min_investment || 50000000)/1_000_000).toFixed(0)} triệu</strong></span>
                    <span>Tiến độ: <strong style={{ color: '#1A1A1A' }}>{project.progress_percent}%</strong></span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
