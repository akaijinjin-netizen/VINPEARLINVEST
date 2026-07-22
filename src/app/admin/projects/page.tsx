'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SEED_PROJECTS } from '@/lib/data/projects'
import Pagination from '@/components/Pagination'
import { createClient } from '@/lib/supabase/client'

const ITEMS_PER_PAGE = 10

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>(SEED_PROJECTS)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProjectsFromSupabase() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          const mapped = data.map(p => ({
            id: p.id,
            project_code: p.project_code || p.code || 'MSDA-2026',
            legal_doc: p.legal_doc || p.legal || 'Quyết định pháp lý số 01/QĐ-VINGROUP',
            name: p.name || p.title || 'Dự án đầu tư Vingroup QPL',
            location: p.location || 'Hà Nội',
            description: p.description || '',
            daily_profit_rate: p.daily_profit_rate ?? p.interest_rate ?? 0.8,
            min_investment: p.min_investment ?? 100000,
            progress_percent: p.progress_percent ?? 50,
            status: p.status || 'active',
            image_url: p.image_url || '/project_vinschool.webp'
          }))
          setProjects(mapped)
        }
      } catch (err) {
        console.log('Fallback to seed projects:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProjectsFromSupabase()
  }, [])

  const filtered = projects.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.location || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.project_code || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const toggleStatus = async (id: string) => {
    const current = projects.find(p => p.id === id)
    if (!current) return
    const newStatus = current.status === 'active' ? 'paused' : 'active'

    // Update local state immediately for instant feedback
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, status: newStatus } : p
    ))

    // Persist permanently in Supabase
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        console.error('Failed to update project status in Supabase:', error.message)
      }
    } catch (e) {
      console.error('Error updating project status:', e)
    }
  }

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Dự án đầu tư & Pháp lý</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
            {loading ? 'Đang tải danh sách...' : `Tổng số ${projects.length} dự án (Phân trang 10 dòng/trang)`}
          </p>
        </div>
        <Link href="/admin/projects/new" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'linear-gradient(135deg, #C8102E, #A00D25)',
            color: 'white', border: 'none', borderRadius: 10,
            padding: '11px 20px', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(200,16,46,0.25)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Thêm dự án
          </button>
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <input
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="🔍 Tìm theo Tên, Mã số dự án (MSDA)..."
          style={{
            width: '100%', padding: '10px 14px 10px 16px',
            border: '1.5px solid #E5E7EB', borderRadius: 10,
            fontSize: 14, fontFamily: 'inherit', outline: 'none',
            background: 'white',
          }}
        />
      </div>

      {/* Projects Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5 }}>DỰ ÁN</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5 }}>MÃ SỐ PHÁP LÝ</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5 }}>LỢI NHUẬN</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5 }}>ĐẦU TƯ TỐI THIỂU</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5 }}>TIẾN ĐỘ</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5 }}>TRẠNG THÁI</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5 }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((project, i) => (
              <tr key={project.id} style={{ borderBottom: i < paginatedItems.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <img
                      src={project.image_url}
                      alt={project.name}
                      style={{ width: 56, height: 42, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', maxWidth: 200 }}>{project.name}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>📍 {project.location}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
                    {project.project_code}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                    {project.legal_doc}
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#C8102E' }}>{project.daily_profit_rate}%</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                    {project.min_investment >= 1_000_000 ? `${(project.min_investment / 1_000_000).toFixed(0)}tr VND` : `${(project.min_investment || 0).toLocaleString('vi-VN')} VND`}
                  </div>
                </td>
                <td style={{ padding: '14px 20px', minWidth: 120 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        background: 'linear-gradient(90deg, #C8102E, #E8192E)',
                        width: `${project.progress_percent}%`
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', minWidth: 32 }}>
                      {project.progress_percent}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    background: project.status === 'active' ? '#ECFDF5' : '#FEF3C7',
                    color: project.status === 'active' ? '#059669' : '#D97706',
                    border: `1px solid ${project.status === 'active' ? '#A7F3D0' : '#FDE68A'}`,
                    fontSize: 12, fontWeight: 700,
                    padding: '4px 12px', borderRadius: 20
                  }}>
                    {project.status === 'active' ? '● Đang mở' : '⏸ Tạm dừng'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/admin/projects/${project.id}`}>
                      <button style={{
                        background: '#EFF6FF', color: '#2563EB',
                        border: '1px solid #BFDBFE', borderRadius: 8,
                        padding: '6px 12px', fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                      }}>
                        ✏️ Sửa
                      </button>
                    </Link>
                    <button
                      onClick={() => toggleStatus(project.id)}
                      style={{
                        background: project.status === 'active' ? '#FFFBEB' : '#ECFDF5',
                        color: project.status === 'active' ? '#D97706' : '#059669',
                        border: `1px solid ${project.status === 'active' ? '#FDE68A' : '#A7F3D0'}`,
                        borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {project.status === 'active' ? '⏸ Tạm dừng' : '▶ Kích hoạt'}
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Bạn có chắc chắn muốn xóa dự án "${project.name}"?`)) {
                          setProjects(prev => prev.filter(p => p.id !== project.id))
                          try {
                            const supabase = createClient()
                            await supabase.from('projects').delete().eq('id', project.id)
                          } catch (e) {
                            console.error('Error deleting project:', e)
                          }
                        }
                      }}
                      style={{
                        background: '#FEF2F2', color: '#DC2626',
                        border: '1px solid #FECACA', borderRadius: 8,
                        padding: '6px 12px', fontSize: 12, fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}
