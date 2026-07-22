'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { SEED_PROJECTS } from '@/lib/data/projects'
import { createClient } from '@/lib/supabase/client'

function formatCurrency(n: number) {
  if (!n) return '0 VND'
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(0) + ' tỷ VND'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(0) + ' triệu VND'
  return n.toLocaleString('vi-VN') + ' VND'
}

function formatMinutes(m: number) {
  if (!m) return '0 phút'
  if (m >= 1440) return Math.floor(m / 1440) + ' ngày'
  if (m >= 60) return Math.floor(m / 60) + ' giờ'
  return m + ' phút'
}

export default function InvestPage() {
  const [projects, setProjects] = useState<any[]>(SEED_PROJECTS)

  useEffect(() => {
    async function loadProjectsFromSupabase() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true })

        if (!error && data && data.length > 0) {
          setProjects(data)
        }
      } catch (err) {
        console.log('Loaded seed fallback:', err)
      }
    }
    loadProjectsFromSupabase()
  }, [])

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
        padding: '50px 20px 20px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Danh mục chính thức</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>DỰ ÁN ĐẦU TƯ</div>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: 20, 
            padding: '6px 14px',
            fontSize: 13, fontWeight: 600
          }}>
            {projects.length} Dự án
          </div>
        </div>
      </div>

      {/* Project List */}
      <div style={{ 
        padding: '16px', 
        paddingBottom: 90,
        background: '#F5F5F5',
        minHeight: 'calc(100vh - 100px)'
      }}>
        {projects.map((project, index) => (
          <Link 
            key={project.id} 
            href={`/dau-tu/${project.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div 
              className="project-card fade-in"
              style={{ 
                marginBottom: 16,
                animationDelay: `${index * 0.05}s`,
                opacity: 1
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                <img
                  src={project.image_url}
                  alt={project.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                />
                {/* Location badge */}
                <div style={{
                  position: 'absolute', bottom: 12, left: 12,
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(4px)',
                  color: 'white', fontSize: 12, fontWeight: 500,
                  padding: '4px 10px', borderRadius: 20
                }}>
                  📍 {project.location}
                </div>

                {/* Project Code Badge */}
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: 'linear-gradient(135deg, #0F172A, #1E293B)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#F0C040', fontSize: 11, fontWeight: 800,
                  padding: '4px 10px', borderRadius: 20,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  🔍 {project.project_code || 'MSDA-VINGROUP QPL'}
                </div>

                {/* Status badge */}
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  background: project.status === 'paused' || project.status === 'ended' ? '#F59E0B' : '#10B981',
                  color: 'white', fontSize: 11, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 20,
                  display: 'flex', alignItems: 'center', gap: 4
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'white',
                    display: 'inline-block'
                  }} />
                  {project.status === 'paused' || project.status === 'ended' ? 'Tạm dừng' : 'Đang mở'}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
                  {project.name}
                </h3>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 14 }}>
                  Pháp lý: <span style={{ color: '#0F172A', fontWeight: 600 }}>{project.legal_doc || 'Quyết định chủ trương đầu tư'}</span>
                </div>

                {/* Stats row */}
                <div style={{ 
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 8, marginBottom: 14
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#C8102E' }}>
                      {project.daily_profit_rate}%
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Lợi nhuận</div>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid #E5E5E5', borderRight: '1px solid #E5E5E5' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#C8102E' }}>
                      {formatMinutes(project.investment_cycle_minutes)}
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Chu kỳ đầu tư</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#C8102E' }}>
                      {(() => {
                        const v = project.min_investment || 0
                        if (v >= 1_000_000_000) {
                          const ty = v / 1_000_000_000
                          return `${ty % 1 === 0 ? ty.toFixed(0) : ty.toFixed(1)} tỷ`
                        }
                        if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)} triệu`
                        return `${v.toLocaleString('vi-VN')}đ`
                      })()}
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Tối thiểu</div>
                  </div>
                </div>

                {/* Scale */}
                <div style={{ 
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 10, fontSize: 13
                }}>
                  <span style={{ color: '#6B7280' }}>Quy mô dự án:</span>
                  <span style={{ fontWeight: 700, color: '#C8102E' }}>
                    {formatCurrency(project.project_scale)}
                  </span>
                </div>

                {/* Progress */}
                <div>
                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', 
                    marginBottom: 6, fontSize: 12, color: '#6B7280' 
                  }}>
                    <span>Tiến độ</span>
                    <span style={{ fontWeight: 700, color: '#1A1A1A' }}>{project.progress_percent}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${project.progress_percent}%` }} />
                  </div>
                </div>

                {/* CTA Button */}
                <button style={{
                  width: '100%',
                  background: project.status === 'paused' || project.status === 'ended'
                    ? '#9CA3AF'
                    : 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: project.status === 'paused' || project.status === 'ended' ? 'not-allowed' : 'pointer',
                  marginTop: 14,
                  boxShadow: project.status === 'paused' || project.status === 'ended' ? 'none' : '0 4px 12px rgba(200,16,46,0.25)',
                  transition: 'all 0.2s ease'
                }}>
                  {project.status === 'paused' || project.status === 'ended' ? '⏸ Tạm dừng gọi vốn' : 'Đầu tư ngay →'}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
