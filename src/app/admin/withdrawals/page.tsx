'use client'

import { useState } from 'react'
import Pagination from '@/components/Pagination'

type Status = 'pending' | 'approved' | 'rejected'

const MOCK_WITHDRAWALS = [
  { id: '1', name: 'Phạm Văn D', user: '0978123456', amount: 30_000_000, bank: 'Vietcombank', accountName: 'PHAM VAN D', accountNo: '1234567890', time: '2026-07-21 14:08', status: 'pending' as Status },
  { id: '2', name: 'Hoàng Thị E', user: '0945678901', amount: 75_000_000, bank: 'ACB', accountName: 'HOANG THI E', accountNo: '9876543210', time: '2026-07-21 13:55', status: 'pending' as Status },
  { id: '3', name: 'Nguyễn Văn F', user: '0923456789', amount: 50_000_000, bank: 'Techcombank', accountName: 'NGUYEN VAN F', accountNo: '5555666677', time: '2026-07-21 12:30', status: 'approved' as Status },
  { id: '4', name: 'Trần Thị G', user: '0934561234', amount: 20_000_000, bank: 'BIDV', accountName: 'TRAN THI G', accountNo: '1111222233', time: '2026-07-21 11:00', status: 'rejected' as Status },
  { id: '5', name: 'Vũ Văn H', user: '0966554433', amount: 45_000_000, bank: 'MB Bank', accountName: 'VU VAN H', accountNo: '8888999900', time: '2026-07-21 10:20', status: 'pending' as Status },
  { id: '6', name: 'Bùi Thị K', user: '0911223344', amount: 90_000_000, bank: 'Vietcombank', accountName: 'BUI THI K', accountNo: '4444555566', time: '2026-07-21 09:40', status: 'approved' as Status },
  { id: '7', name: 'Đặng Văn L', user: '0977881122', amount: 15_000_000, bank: 'ACB', accountName: 'DANG VAN L', accountNo: '7777888899', time: '2026-07-21 09:10', status: 'pending' as Status },
  { id: '8', name: 'Phan Thị M', user: '0933221100', amount: 65_000_000, bank: 'Techcombank', accountName: 'PHAN THI M', accountNo: '2222333344', time: '2026-07-21 08:30', status: 'pending' as Status },
  { id: '9', name: 'Lê Văn N', user: '0988776655', amount: 110_000_000, bank: 'BIDV', accountName: 'LE VAN N', accountNo: '9999000011', time: '2026-07-20 23:15', status: 'approved' as Status },
  { id: '10', name: 'Trịnh Thị P', user: '0922114433', amount: 40_000_000, bank: 'VPBank', accountName: 'TRINH THI P', accountNo: '3333444455', time: '2026-07-20 22:00', status: 'pending' as Status },
  { id: '11', name: 'Đỗ Văn Q', user: '0944332211', amount: 85_000_000, bank: 'ACB', accountName: 'DO VAN Q', accountNo: '6666777788', time: '2026-07-20 20:45', status: 'approved' as Status },
  { id: '12', name: 'Vũ Thị R', user: '0955667788', amount: 25_000_000, bank: 'Vietcombank', accountName: 'VU THI R', accountNo: '1122334455', time: '2026-07-20 19:30', status: 'rejected' as Status },
]

const STATUS_MAP: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  pending:  { label: 'Chờ duyệt', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  approved: { label: 'Đã duyệt',  color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  rejected: { label: 'Từ chối',   color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
}

const ITEMS_PER_PAGE = 10

export default function AdminWithdrawalsPage() {
  const [items, setItems] = useState(MOCK_WITHDRAWALS)
  const [filter, setFilter] = useState<'all' | Status>('pending')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const approve = (id: string) => setItems(p => p.map(i => i.id === id ? { ...i, status: 'approved' as Status } : i))
  const reject  = (id: string) => setItems(p => p.map(i => i.id === id ? { ...i, status: 'rejected' as Status } : i))

  const filtered = items.filter(i => {
    const matchesFilter = filter === 'all' ? true : i.status === filter
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
                          i.user.includes(search) ||
                          i.bank.toLowerCase().includes(search.toLowerCase()) ||
                          i.accountNo.includes(search)
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

  const counts = { pending: items.filter(i => i.status === 'pending').length, approved: items.filter(i => i.status === 'approved').length, rejected: items.filter(i => i.status === 'rejected').length }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Duyệt rút tiền</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Quản lý lệnh rút tiền (Phân trang 10 dòng/trang)</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {(['pending', 'approved', 'rejected'] as Status[]).map(s => (
          <div key={s} style={{
            background: 'white', borderRadius: 14, padding: '20px',
            border: `1px solid ${STATUS_MAP[s].border}`,
            cursor: 'pointer',
            outline: filter === s ? `2px solid ${STATUS_MAP[s].color}` : 'none',
          }} onClick={() => handleFilterChange(s)}>
            <div style={{ fontSize: 28, fontWeight: 800, color: STATUS_MAP[s].color }}>{counts[s]}</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{STATUS_MAP[s].label}</div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
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
          placeholder="🔍 Tìm theo Tên, SĐT, STK..."
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
              {['Người dùng', 'Số tiền rút', 'Ngân hàng & Tài khoản', 'Thời gian', 'Trạng thái', 'Thao tác'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((row, i) => (
              <tr key={row.id} style={{ borderBottom: i < paginatedItems.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{row.name}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{row.user}</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#F59E0B' }}>
                    -{row.amount.toLocaleString('vi-VN')}đ
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{row.bank}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{row.accountName}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', fontFamily: 'monospace' }}>{row.accountNo}</div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6B7280' }}>{row.time}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    background: STATUS_MAP[row.status].bg,
                    color: STATUS_MAP[row.status].color,
                    border: `1px solid ${STATUS_MAP[row.status].border}`,
                    fontSize: 12, fontWeight: 700,
                    padding: '4px 12px', borderRadius: 20
                  }}>
                    {STATUS_MAP[row.status].label}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {row.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => approve(row.id)} style={{
                        background: '#ECFDF5', color: '#059669',
                        border: '1px solid #A7F3D0', borderRadius: 8,
                        padding: '6px 14px', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer'
                      }}>
                        ✓ Duyệt
                      </button>
                      <button onClick={() => reject(row.id)} style={{
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
            <div style={{ fontSize: 15, fontWeight: 600 }}>Không có lệnh rút nào</div>
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
