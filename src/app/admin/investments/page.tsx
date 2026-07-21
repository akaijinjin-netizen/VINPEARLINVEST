'use client'

import { useState } from 'react'
import Pagination from '@/components/Pagination'

const MOCK_INVESTMENTS = [
  { id: '1', user: '0987654321', userName: 'Nguyễn Văn A', projectName: 'Vinpearl Resort & Spa Hạ Long', amount: 50000000, profitEarned: 1200000, dailyRate: 0.8, status: 'active', startTime: '2026-07-15' },
  { id: '2', user: '0912345678', userName: 'Trần Thị B', projectName: 'Grand World Phú Quốc', amount: 200000000, profitEarned: 6000000, dailyRate: 1.0, status: 'active', startTime: '2026-07-12' },
  { id: '3', user: '0956789012', userName: 'Phạm Thị D', projectName: 'Vinpearl Resort & Golf Nam Hội An', amount: 75000000, profitEarned: 2250000, dailyRate: 0.85, status: 'active', startTime: '2026-07-10' },
  { id: '4', user: '0967891234', userName: 'Lê Văn C', projectName: 'Vinpearl Resort & Spa Nha Trang Bay', amount: 30000000, profitEarned: 1620000, dailyRate: 0.9, status: 'completed', startTime: '2026-06-15' },
  { id: '5', user: '0941122334', userName: 'Đỗ Văn F', projectName: 'Vinpearl Discovery Wonderworld', amount: 50000000, profitEarned: 1050000, dailyRate: 0.7, status: 'active', startTime: '2026-07-14' },
  { id: '6', user: '0977889900', userName: 'Vũ Thị G', projectName: 'Khu Du Lịch Làng Vân - Đà Nẵng', amount: 100000000, profitEarned: 2850000, dailyRate: 0.95, status: 'active', startTime: '2026-07-11' },
  { id: '7', user: '0981122334', userName: 'Bùi Văn H', projectName: 'VinWonders Vũ Yên - Hải Phòng', amount: 40000000, profitEarned: 960000, dailyRate: 0.8, status: 'active', startTime: '2026-07-13' },
  { id: '8', user: '0919988776', userName: 'Đặng Thị K', projectName: 'Vinhomes Pearl Bay Nha Trang', amount: 150000000, profitEarned: 2925000, dailyRate: 0.65, status: 'active', startTime: '2026-07-09' },
  { id: '9', user: '0933445566', userName: 'Phan Văn L', projectName: 'Vinpearl Resort & Spa Hội An', amount: 50000000, profitEarned: 1125000, dailyRate: 0.75, status: 'active', startTime: '2026-07-16' },
  { id: '10', user: '0966778899', userName: 'Trịnh Thị M', projectName: 'Vinpearl Resort & Golf Phú Quốc', amount: 100000000, profitEarned: 2250000, dailyRate: 0.75, status: 'active', startTime: '2026-07-17' },
  { id: '11', user: '0922334455', userName: 'Dương Văn N', projectName: 'Vinpearl Resort & Spa Hạ Long', amount: 50000000, profitEarned: 1600000, dailyRate: 0.8, status: 'active', startTime: '2026-07-08' },
  { id: '12', user: '0944556677', userName: 'Lý Thị P', projectName: 'Grand World Phú Quốc', amount: 200000000, profitEarned: 8000000, dailyRate: 1.0, status: 'completed', startTime: '2026-06-01' },
]

const ITEMS_PER_PAGE = 10

export default function AdminInvestmentsPage() {
  const [investments] = useState(MOCK_INVESTMENTS)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = investments.filter(i =>
    i.userName.toLowerCase().includes(search.toLowerCase()) ||
    i.user.includes(search) ||
    i.projectName.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Quản lý lệnh đầu tư</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Tổng cộng {investments.length} hợp đồng (Phân trang 10 dòng/trang)</p>
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>NGƯỜI DÙNG</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>DỰ ÁN</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>SỐ TIỀN ĐẦU TƯ</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>LÃI ĐÃ NHẬN</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>LÃI / NGÀY</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: i < paginatedItems.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{item.userName}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{item.user}</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{item.projectName}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Từ {item.startTime}</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#C8102E' }}>
                    {item.amount.toLocaleString('vi-VN')}đ
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 14, color: '#10B981', fontWeight: 700 }}>
                  +{item.profitEarned.toLocaleString('vi-VN')}đ
                </td>
                <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#374151' }}>
                  {item.dailyRate}%
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    background: item.status === 'active' ? '#ECFDF5' : '#F3F4F6',
                    color: item.status === 'active' ? '#059669' : '#6B7280',
                    border: `1px solid ${item.status === 'active' ? '#A7F3D0' : '#E5E7EB'}`,
                    fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20
                  }}>
                    {item.status === 'active' ? 'Đang sinh lãi' : 'Đã hoàn thành'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
