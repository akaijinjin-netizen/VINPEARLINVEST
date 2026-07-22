'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { SEED_PROJECTS } from '@/lib/data/projects'
import { createClient } from '@/lib/supabase/client'

function formatCurrency(n: number) {
  if (!n) return '0 VND'
  return n.toLocaleString('vi-VN') + ' VND'
}

export default function InvestmentOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userWallet, setUserWallet] = useState<any>(null)
  const [amount, setAmount] = useState('0')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient()

        // 1. Fetch project details
        const { data: dbProj, error: projErr } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single()

        let currentProject = null
        if (!projErr && dbProj) {
          currentProject = dbProj
        } else {
          currentProject = SEED_PROJECTS.find(p => p.id === id) || SEED_PROJECTS[0]
        }
        setProject(currentProject)
        setAmount(currentProject.min_investment.toString())

        // 2. Fetch user wallet
        const userPhone = localStorage.getItem('userPhone')
        if (userPhone) {
          const { data: profile, error: profErr } = await supabase
            .from('profiles')
            .select('*, wallets(*)')
            .eq('phone', userPhone)
            .single()

          if (!profErr && profile) {
            setUserProfile(profile)
            setUserWallet(profile.wallets)
          }
        }
      } catch (e) {
        console.error('Error loading order data:', e)
        // Fallback to static SEED_PROJECTS
        const fallbackProj = SEED_PROJECTS.find(p => p.id === id) || SEED_PROJECTS[0]
        setProject(fallbackProj)
        setAmount(fallbackProj.min_investment.toString())
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const numAmount = parseFloat(amount) || 0
  const dailyProfitRate = project ? (project.daily_profit_rate || 0) : 0
  const estimatedProfit = numAmount * (dailyProfitRate / 100)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project || !userProfile || !userWallet) {
      setErrorMsg('Vui lòng đăng nhập để thực hiện đầu tư!')
      return
    }

    if (numAmount < project.min_investment) {
      setErrorMsg(`Số tiền đầu tư tối thiểu là ${formatCurrency(project.min_investment)}!`)
      return
    }

    if (userWallet.balance < numAmount) {
      setErrorMsg(`Số dư tài khoản không đủ để thực hiện đầu tư! Số dư hiện tại của bạn là ${formatCurrency(userWallet.balance)}.`)
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const supabase = createClient()
      const newBalance = userWallet.balance - numAmount

      // 1. Deduct wallet balance
      const { error: walletErr } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', userProfile.id)

      if (walletErr) throw walletErr

      // 2. Insert new investment record
      const { error: investErr } = await supabase
        .from('investments')
        .insert({
          user_id: userProfile.id,
          project_id: project.id,
          amount: numAmount,
          interest_rate: dailyProfitRate,
          status: 'active',
          start_time: new Date().toISOString()
        })

      if (investErr) {
        // Rollback wallet balance on insert error
        await supabase
          .from('wallets')
          .update({ balance: userWallet.balance })
          .eq('user_id', userProfile.id)
        throw investErr
      }

      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Lỗi xảy ra trong quá trình đầu tư!')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !project) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'white' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#6B7280' }}>Đang tải thông tin giao dịch...</div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="app-container" style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: 24, textAlign: 'center',
        background: 'white'
      }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>
          Đầu tư thành công!
        </div>
        <div style={{ fontSize: 15, color: '#6B7280', marginBottom: 24, lineHeight: 1.6 }}>
          Bạn đã đầu tư <strong>{formatCurrency(numAmount)}</strong> vào dự án <strong>{project.name || project.title}</strong>.
        </div>
        <div style={{
          background: '#FEF2F2', borderRadius: 16, padding: '16px',
          width: '100%', marginBottom: 32, textAlign: 'left', border: '1px solid #FECDD3'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: '#6B7280' }}>Lợi nhuận dự kiến:</span>
            <span style={{ fontWeight: 800, color: '#C8102E' }}>+{formatCurrency(estimatedProfit)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#6B7280' }}>Trạng thái:</span>
            <span style={{ fontWeight: 700, color: '#10B981' }}>● Đang hoạt động</span>
          </div>
        </div>
        <Link href="/cua-toi/investments" style={{ textDecoration: 'none', width: '100%' }}>
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
            color: 'white', border: 'none',
            borderRadius: 14, padding: '16px',
            fontSize: 16, fontWeight: 700, cursor: 'pointer'
          }}>
            Xem hồ sơ đầu tư
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="app-container" style={{ background: '#F5F5F5' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14
      }}>
        <Link href={`/dau-tu/${project.id}`} style={{
          color: 'white', textDecoration: 'none',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%', width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>←</Link>
        <span style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>Xác nhận đầu tư</span>
      </div>

      <div style={{ padding: '16px', paddingBottom: 40 }}>
        {/* Project Summary */}
        <div style={{
          background: 'white', borderRadius: 16, padding: '16px',
          marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          display: 'flex', gap: 14, alignItems: 'center'
        }}>
          <img src={project.image_url} alt="" style={{ width: 80, height: 64, borderRadius: 10, objectFit: 'cover' }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>{project.name || project.title}</div>
            <div style={{ fontSize: 13, color: '#C8102E', fontWeight: 700, marginTop: 4 }}>
              Lợi nhuận {dailyProfitRate}%
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C',
            padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 16
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Investment Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'white', borderRadius: 16, padding: '20px',
            marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: 8 }}>
              Số tiền đầu tư (Tối thiểu: {formatCurrency(project.min_investment)})
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min={project.min_investment}
              step={1000000}
              required
              className="input-field"
              style={{ fontSize: 18, fontWeight: 700, color: '#C8102E', width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', boxSizing: 'border-box' }}
            />

            {/* Wallet Balance Display */}
            {userWallet && (
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
                Số dư ví khả dụng: <strong style={{ color: '#10B981' }}>{formatCurrency(userWallet.balance)}</strong>
              </div>
            )}

            {/* Estimated calculation */}
            <div style={{
              background: '#FEF2F2', borderRadius: 12, padding: '14px',
              marginTop: 16, border: '1px solid #FECDD3'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>Lãi nhận dự kiến:</span>
                <span style={{ fontWeight: 800, color: '#C8102E' }}>
                  +{formatCurrency(estimatedProfit)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>Bảo hiểm rủi ro:</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>🛡 {project.risk_level || 'Bảo vệ vốn 100%'}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || numAmount < project.min_investment || !userWallet || userWallet.balance < numAmount}
            style={{
              width: '100%',
              background: isSubmitting || numAmount < project.min_investment || !userWallet || userWallet.balance < numAmount
                ? '#E5E5E5' 
                : 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
              color: isSubmitting || numAmount < project.min_investment || !userWallet || userWallet.balance < numAmount ? '#9CA3AF' : 'white', 
              border: 'none', borderRadius: 14,
              padding: '17px', fontSize: 17, fontWeight: 800,
              cursor: isSubmitting || numAmount < project.min_investment || !userWallet || userWallet.balance < numAmount ? 'not-allowed' : 'pointer',
              boxShadow: isSubmitting || numAmount < project.min_investment || !userWallet || userWallet.balance < numAmount ? 'none' : '0 6px 20px rgba(200,16,46,0.35)',
              transition: 'all 0.3s'
            }}
          >
            {isSubmitting ? 'Đang thực hiện đầu tư...' : 'Xác nhận Đầu Tư Ngay'}
          </button>
        </form>
      </div>
    </div>
  )
}
