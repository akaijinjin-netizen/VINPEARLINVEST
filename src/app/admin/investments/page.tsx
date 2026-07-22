'use client'

import { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'
import { createClient } from '@/lib/supabase/client'

const ITEMS_PER_PAGE = 10

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchInvestments() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('investments')
          .select(`
            *,
            profiles!investments_user_id_fkey(full_name, phone),
            projects(name, daily_profit_rate)
          `)
          .order('created_at', { ascending: false })

        if (!error && data) {
          setInvestments(data)
        }
      } catch (e) {
        console.error('Error fetching investments:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchInvestments()
  }, [])

  const filtered = investments.filter(i => {
    const name = i.profiles?.full_name || ''
    const phone = i.profiles?.phone || ''
    const project = i.projects?.name || ''
    const q = search.toLowerCase()
    return name.toLowerCase().includes(q) || phone.includes(q) || project.toLowerCase().includes(q)
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  function formatMoney(n: number) {
    return (n || 0).toLocaleString('vi-VN') + 'đ'
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'active':
      case 'running':
      case 'contributing': return 'Đang sinh lãi'
      case 'ended':
      case 'finished':
      case 'completed': return 'Đã hoàn thành'
      default: return status || 'Không rõ'
    }
  }

  function getStatusColors(status: string) {
    const active = ['active', 'running', 'contributing'].includes(status)
    return {
      background: active ? '#ECFDF5' : '#F3F4F6',
      color: active ? '#059669' : '#6B7280',
      border: `1px solid ${active ? '#A7F3D0' : '#E5E7EB'}`,
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Quản lý lệnh đầu tư</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
          {loading ? 'Đang tải dữ liệu...' : `Tổng cộng ${investments.length} hợp đồng (Phân trang 10 dòng/trang)`}
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <input
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="🔍 Tìm theo Tên, SĐT hoặc Dự án..."
          style={{
            width: '100%', padding: '10px 14px 10px 16px',
            border: '1.5px solid #E5E7EB', borderRadius: 10,
            fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'white'
          }}
        />
      </div>

      {/* Investments Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
            Đang tải dữ liệu từ Supabase...
          </div>
        ) : paginatedItems.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
            Chưa có hợp đồng đầu tư nào.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>NGƯỜI DÙNG</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>DỰ ÁN</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>SỐ TIỀN ĐẦU TƯ</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>LÃI ĐÃ NHẬN</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>LÃI / CHU KỲ</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item: any, i: number) => (
                <tr key={item.id} style={{ borderBottom: i < paginatedItems.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{item.profiles?.full_name || 'Người dùng'}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{item.profiles?.phone || '—'}</div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{item.projects?.name || item.project_id || '—'}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                      Từ {item.start_time ? item.start_time.slice(0, 10) : (item.created_at ? item.created_at.slice(0, 10) : '—')}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#C8102E' }}>
                      {formatMoney(item.amount)}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: '#10B981', fontWeight: 700 }}>
                    +{formatMoney(item.profit_earned || 0)}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#374151' }}>
                    {item.projects?.daily_profit_rate || item.interest_rate || 0}%
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ ...getStatusColors(item.status), fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && paginatedItems.length > 0 && (
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
