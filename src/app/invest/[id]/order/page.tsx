'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { SEED_PROJECTS } from '@/lib/data/projects'

function formatCurrency(n: number) {
  return n.toLocaleString('vi-VN') + ' VND'
}

export default function InvestmentOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = SEED_PROJECTS.find(p => p.id === id) || SEED_PROJECTS[0]

  const [amount, setAmount] = useState(project.min_investment.toString())
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const numAmount = parseFloat(amount) || 0
  const estimatedProfit = numAmount * (project.daily_profit_rate / 100)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  if (success) {
    return (
      <div className="app-container" style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: 24, textAlign: 'center'
      }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>
          Đầu tư thành công!
        </div>
        <div style={{ fontSize: 15, color: '#6B7280', marginBottom: 24, lineHeight: 1.6 }}>
          Bạn đã đầu tư <strong>{formatCurrency(numAmount)}</strong> vào dự án <strong>{project.name}</strong>.
        </div>
        <div style={{
          background: '#FEF2F2', borderRadius: 16, padding: '16px',
          width: '100%', marginBottom: 32, textAlign: 'left', border: '1px solid #FECDD3'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: '#6B7280' }}>Lợi nhuận/ngày dự kiến:</span>
            <span style={{ fontWeight: 800, color: '#C8102E' }}>+{formatCurrency(estimatedProfit)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#6B7280' }}>Trạng thái:</span>
            <span style={{ fontWeight: 700, color: '#10B981' }}>● Đang hoạt động</span>
          </div>
        </div>
        <Link href="/profile" style={{ textDecoration: 'none', width: '100%' }}>
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
        <Link href={`/invest/${project.id}`} style={{
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
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>{project.name}</div>
            <div style={{ fontSize: 13, color: '#C8102E', fontWeight: 700, marginTop: 4 }}>
              Lợi nhuận {project.daily_profit_rate}% / ngày
            </div>
          </div>
        </div>

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
              style={{ fontSize: 18, fontWeight: 700, color: '#C8102E' }}
            />

            {/* Estimated calculation */}
            <div style={{
              background: '#FEF2F2', borderRadius: 12, padding: '14px',
              marginTop: 16, border: '1px solid #FECDD3'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>Lãi nhận mỗi ngày:</span>
                <span style={{ fontWeight: 800, color: '#C8102E' }}>
                  +{formatCurrency(estimatedProfit)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>Bảo hiểm rủi ro:</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>🛡 {project.risk_level}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || numAmount < project.min_investment}
            style={{
              width: '100%',
              background: loading || numAmount < project.min_investment ? '#E5E5E5' : 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
              color: 'white', border: 'none', borderRadius: 14,
              padding: '17px', fontSize: 17, fontWeight: 800,
              cursor: numAmount < project.min_investment ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 20px rgba(200,16,46,0.35)',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Đang giao dịch...' : 'Xác nhận Đầu Tư Ngay'}
          </button>
        </form>
      </div>
    </div>
  )
}
