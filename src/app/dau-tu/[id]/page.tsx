'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { SEED_PROJECTS } from '@/lib/data/projects'
import { createClient } from '@/lib/supabase/client'

function formatCurrency(n: number) {
  if (!n) return '0 VND'
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(0) + ' tỷ VND'
  if (n >= 1_000_000) return (n / 1_000_000).toLocaleString('vi-VN') + ' VND'
  return n.toLocaleString('vi-VN') + ' VND'
}

function formatCurrencyShort(n: number) {
  if (!n) return '0 VND'
  if (n >= 1_000_000) return (n / 1_000_000).toLocaleString('vi-VN') + ' triệu VND'
  return n.toLocaleString('vi-VN') + ' VND'
}

function formatMinutes(m: number) {
  if (!m) return '0 phút'
  if (m >= 1440) return Math.floor(m / 1440) + ' ngày'
  if (m >= 60) return Math.floor(m / 60) + ' giờ'
  return m + ' phút'
}

export default function InvestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadProject() {
      try {
        const supabase = createClient()
        const { data: dbProj, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single()

        if (!error && dbProj) {
          setProject(dbProj)
        } else {
          // Fallback to static SEED_PROJECTS
          const matched = SEED_PROJECTS.find(p => p.id === id) || SEED_PROJECTS[0]
          setProject(matched)
        }
      } catch (e) {
        console.error('Error loading project detail:', e)
        const matched = SEED_PROJECTS.find(p => p.id === id) || SEED_PROJECTS[0]
        setProject(matched)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  const handleCopyCode = () => {
    if (project && navigator.clipboard) {
      navigator.clipboard.writeText(project.project_code || 'MSDA-VINGROUP')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading || !project) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'white' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#6B7280' }}>Đang tải chi tiết dự án...</div>
      </div>
    )
  }

  const highlightsList = Array.isArray(project.highlights) 
    ? project.highlights 
    : ['Tra cứu pháp lý minh bạch', 'Bảo toàn nguồn vốn 100%', 'Lợi nhuận thanh toán định kỳ'];

  return (
    <div className="app-container" style={{ background: '#F5F5F5' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        position: 'relative', zIndex: 10
      }}>
        <Link href="/dau-tu" style={{ 
          color: 'white', textDecoration: 'none',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%', width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          ←
        </Link>
        <span style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>Chi tiết dự án & Pháp lý</span>
      </div>

      {/* Hero Image */}
      <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
        <img
          src={project.image_url}
          alt={project.name || project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)'
        }} />
        <div style={{
          position: 'absolute', bottom: 16, left: 16, right: 16,
          color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
        }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 4 }}>📍 {project.location || 'Hà Nội'}</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #0F172A, #1E293B)',
            color: '#F0C040', fontSize: 12, fontWeight: 800,
            padding: '6px 14px', borderRadius: 20,
            border: '1px solid rgba(240, 192, 64, 0.4)'
          }}>
            ✓ ĐÃ XÁC THỰC PHÁP LÝ
          </div>
        </div>
      </div>

      {/* Main Info Card */}
      <div style={{ margin: '-20px 16px 16px', position: 'relative', zIndex: 2 }}>
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1A', marginBottom: 16 }}>
            {project.name || project.title}
          </h1>

          {/* Legal verification box */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: 14, padding: '16px', color: 'white',
            marginBottom: 16, border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                MÃ SỐ TRA CỨU DỰ ÁN
              </div>
              <button
                onClick={handleCopyCode}
                style={{
                  background: copied ? '#10B981' : 'rgba(255,255,255,0.15)',
                  color: 'white', border: 'none', borderRadius: 6,
                  padding: '4px 10px', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {copied ? '✓ Đã sao chép' : '📋 Sao chép mã'}
              </button>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#F0C040', letterSpacing: 1, marginBottom: 8, fontFamily: 'monospace' }}>
              {project.project_code || 'MSDA-VINGROUP'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 6 }}>
              📜 {project.legal_doc || 'Quyết định đầu tư chính thức'}
            </div>
          </div>

          {/* Key metrics */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 12, marginBottom: 16
          }}>
            <div style={{
              background: '#FEF2F2',
              borderRadius: 12,
              padding: '14px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Mỗi cổ tức</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#C8102E' }}>
                {project.dividend_per_cycle ? project.dividend_per_cycle.toLocaleString('vi-VN') : '0'}
              </div>
              <div style={{ fontSize: 12, color: '#C8102E', fontWeight: 600 }}>VND</div>
            </div>
            <div style={{
              background: '#FEF2F2',
              borderRadius: 12,
              padding: '14px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Chu kỳ đầu tư</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#C8102E' }}>
                {formatMinutes(project.investment_cycle_minutes)}
              </div>
            </div>
          </div>

          {/* Details list */}
          {[
            { label: 'Phương pháp chia lợi nhuận', value: project.profit_method || 'Phân phối lợi nhuận hàng ngày' },
            { label: 'Số tiền đầu tư tối thiểu', value: formatCurrencyShort(project.min_investment) },
            { label: 'Quy mô dự án', value: formatCurrency(project.project_scale) },
            { label: 'Lợi nhuận hàng ngày', value: `${project.daily_profit_rate || 0}%` },
            { label: 'Bảo hộ pháp lý & vốn', value: project.risk_level || 'Bảo vệ vốn 100%' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '12px 0',
              borderBottom: i < 4 ? '1px solid #F5F5F5' : 'none',
              gap: 12
            }}>
              <span style={{ fontSize: 14, color: '#6B7280', flex: 1 }}>{item.label}:</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', textAlign: 'right', flex: 1 }}>
                {item.value}
              </span>
            </div>
          ))}

          {/* Progress */}
          <div style={{ marginTop: 12 }}>
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', 
              marginBottom: 8, fontSize: 13
            }}>
              <span style={{ color: '#6B7280' }}>Tiến độ gọi vốn</span>
              <span style={{ fontWeight: 700, color: '#C8102E' }}>{project.progress_percent || 0}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${project.progress_percent || 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div style={{ margin: '0 16px 16px' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '16px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#1A1A1A' }}>✨ Điểm nổi bật & Bảo chứng</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {highlightsList.map((h: any, i: number) => (
              <div key={i} style={{
                background: '#FEF2F2',
                color: '#C8102E',
                fontSize: 13, fontWeight: 500,
                padding: '6px 12px',
                borderRadius: 20,
                border: '1px solid #FECDD3'
              }}>
                ✓ {h}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{ margin: '0 16px 100px' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '16px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: '#1A1A1A' }}>📋 Mô tả chi tiết dự án</h3>
          <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.7 }}>
            {project.description}
          </p>
        </div>
      </div>

      {/* Invest CTA - Fixed bottom */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '12px 16px',
        background: 'white',
        borderTop: '1px solid #E5E5E5',
        zIndex: 50
      }}>
        {project.status === 'paused' || project.status === 'ended' ? (
          <button disabled style={{
            width: '100%',
            background: '#9CA3AF',
            color: 'white',
            border: 'none',
            borderRadius: 14,
            padding: '17px',
            fontSize: 17,
            fontWeight: 800,
            cursor: 'not-allowed',
            letterSpacing: 0.5
          }}>
            ⏸ Dự án đang tạm dừng
          </button>
        ) : (
          <Link href={`/dau-tu/${project.id}/order`} style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 14,
              padding: '17px',
              fontSize: 17,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(200,16,46,0.35)',
              letterSpacing: 0.5
            }}>
              🚀 Đầu tư ngay
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
