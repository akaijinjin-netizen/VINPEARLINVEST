'use client'

import { useState } from 'react'
import Pagination from '@/components/Pagination'

type Status = 'pending' | 'approved' | 'rejected'

const MOCK_DEPOSITS = [
  { id: '1', user: '0987654321', userName: 'Nguyễn Văn A', amount: 50_000_000, bank: 'ACB', content: 'NAPTIEN 278', time: '2026-07-21 14:15', status: 'pending' as Status },
  { id: '2', user: '0912345678', userName: 'Trần Thị B', amount: 100_000_000, bank: 'Vietcombank', content: 'NAPTIEN 279', time: '2026-07-21 14:02', status: 'pending' as Status },
  { id: '3', user: '0967891234', userName: 'Lê Văn C', amount: 25_000_000, bank: 'Techcombank', content: 'NAPTIEN 280', time: '2026-07-21 13:45', status: 'pending' as Status },
  { id: '4', user: '0956789012', userName: 'Phạm Thị D', amount: 200_000_000, bank: 'ACB', content: 'NAPTIEN 281', time: '2026-07-21 12:30', status: 'approved' as Status },
  { id: '5', user: '0934567890', userName: 'Hoàng Văn E', amount: 75_000_000, bank: 'BIDV', content: 'NAPTIEN 282', time: '2026-07-21 11:10', status: 'rejected' as Status },
  { id: '6', user: '0941122334', userName: 'Đỗ Văn F', amount: 30_000_000, bank: 'MB Bank', content: 'NAPTIEN 283', time: '2026-07-21 10:45', status: 'pending' as Status },
  { id: '7', user: '0977889900', userName: 'Vũ Thị G', amount: 150_000_000, bank: 'Vietcombank', content: 'NAPTIEN 284', time: '2026-07-21 10:15', status: 'approved' as Status },
  { id: '8', user: '0981122334', userName: 'Bùi Văn H', amount: 80_000_000, bank: 'ACB', content: 'NAPTIEN 285', time: '2026-07-21 09:50', status: 'pending' as Status },
  { id: '9', user: '0919988776', userName: 'Đặng Thị K', amount: 40_000_000, bank: 'Techcombank', content: 'NAPTIEN 286', time: '2026-07-21 09:20', status: 'pending' as Status },
  { id: '10', user: '0933445566', userName: 'Phan Văn L', amount: 120_000_000, bank: 'BIDV', content: 'NAPTIEN 287', time: '2026-07-21 08:40', status: 'approved' as Status },
  { id: '11', user: '0966778899', userName: 'Trịnh Thị M', amount: 60_000_000, bank: 'VPBank', content: 'NAPTIEN 288', time: '2026-07-20 22:10', status: 'pending' as Status },
  { id: '12', user: '0922334455', userName: 'Dương Văn N', amount: 90_000_000, bank: 'ACB', content: 'NAPTIEN 289', time: '2026-07-20 21:30', status: 'approved' as Status },
  { id: '13', user: '0944556677', userName: 'Lý Thị P', amount: 110_000_000, bank: 'Vietcombank', content: 'NAPTIEN 290', time: '2026-07-20 20:00', status: 'rejected' as Status },
]

const STATUS_MAP: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  pending:  { label: 'Chờ duyệt', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  approved: { label: 'Đã duyệt',  color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  rejected: { label: 'Từ chối',   color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
}

const ITEMS_PER_PAGE = 10

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState(MOCK_DEPOSITS)
  const [filter, setFilter] = useState<'all' | Status>('pending')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const approve = (id: string) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' as Status } : d))
  }
  const reject = (id: string) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' as Status } : d))
  }

  const filtered = deposits.filter(d => {
    const matchesFilter = filter === 'all' ? true : d.status === filter
    const matchesSearch = d.userName.toLowerCase().includes(search.toLowerCase()) ||
                          d.user.includes(search) ||
                          d.content.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleFilterChange = (f: 'all' | Status) => {
    setFilter(f)
    setCurrentPage(1)
  }

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const counts = {
    pending: deposits.filter(d => d.status === 'pending').length,
    approved: deposits.filter(d => d.status === 'approved').length,
    rejected: deposits.filter(d => d.status === 'rejected').length,
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Duyệt nạp tiền</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Quản lý các lệnh nạp tiền (Phân trang 10 dòng/trang)</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {(['pending', 'approved', 'rejected'] as Status[]).map(s => (
          <div key={s} style={{
            background: 'white', borderRadius: 14, padding: '20px',
            border: `1px solid ${STATUS_MAP[s].border}`,
            cursor: 'pointer',
            outline: filter === s ? `2px solid ${STATUS_MAP[s].color}` : 'none',
            transition: 'all 0.2s'
          }} onClick={() => handleFilterChange(s)}>
            <div style={{ fontSize: 28, fontWeight: 800, color: STATUS_MAP[s].color }}>{counts[s]}</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{STATUS_MAP[s].label}</div>
          </div>
        ))}
      </div>

      {/* Filter and Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
            <button key={tab} onClick={() => handleFilterChange(tab)} style={{
              background: filter === tab ? '#0F172A' : 'white',
              color: filter === tab ? 'white' : '#374151',
              border: '1px solid #E5E7EB', borderRadius: 8,
              padding: '8px 18px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s'
            }}>
              {tab === 'all' ? 'Tất cả' : STATUS_MAP[tab].label}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="🔍 Tìm theo Tên, SĐT, Mã nạp..."
          style={{
            width: 280, padding: '9px 14px', border: '1.5px solid #E5E7EB',
            borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white'
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              {['Người dùng', 'Số tiền nạp', 'Ngân hàng & Mã nạp', 'Thời gian', 'Trạng thái', 'Thao tác'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((dep, i) => (
              <tr key={dep.id} style={{ borderBottom: i < paginatedItems.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{dep.userName}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{dep.user}</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>
                    +{dep.amount.toLocaleString('vi-VN')}đ
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{dep.bank}</div>
                  <div style={{ fontSize: 12, color: '#C8102E', fontWeight: 700, letterSpacing: 0.5, marginTop: 2 }}>
                    {dep.content}
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6B7280' }}>
                  {dep.time}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    background: STATUS_MAP[dep.status].bg,
                    color: STATUS_MAP[dep.status].color,
                    border: `1px solid ${STATUS_MAP[dep.status].border}`,
                    fontSize: 12, fontWeight: 700,
                    padding: '4px 12px', borderRadius: 20
                  }}>
                    {STATUS_MAP[dep.status].label}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {dep.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => approve(dep.id)} style={{
                        background: '#ECFDF5', color: '#059669',
                        border: '1px solid #A7F3D0', borderRadius: 8,
                        padding: '6px 14px', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer'
                      }}>
                        ✓ Duyệt
                      </button>
                      <button onClick={() => reject(dep.id)} style={{
                        background: '#FEF2F2', color: '#DC2626',
                        border: '1px solid #FECACA', borderRadius: 8,
                        padding: '6px 14px', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer'
                      }}>
                        ✕ Từ chối
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Đã xử lý</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Không có lệnh nạp nào</div>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
