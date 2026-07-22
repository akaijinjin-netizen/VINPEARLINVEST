'use client'

import { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'
import { createClient } from '@/lib/supabase/client'

type Status = 'pending' | 'approved' | 'rejected'

type Deposit = {
  id: string
  user_id: string
  user: string // phone
  userName: string // fullName
  amount: number
  bank: string
  content: string
  time: string
  status: Status
  billImage?: string
}

const STATUS_MAP: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  pending:  { label: 'Chờ duyệt', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  approved: { label: 'Đã duyệt',  color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  rejected: { label: 'Từ chối',   color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
}

const ITEMS_PER_PAGE = 10

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [filter, setFilter] = useState<'all' | Status>('pending')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBill, setSelectedBill] = useState<string | null>(null)

  async function fetchDepositsFromSupabase() {
    try {
      const supabase = createClient()
      const { data: depData, error } = await supabase
        .from('deposits')
        .select('*, profiles!deposits_user_id_fkey(phone, full_name)')
        .order('created_at', { ascending: false })

      if (!error && depData) {
        const mapped: Deposit[] = depData.map(d => ({
          id: d.id,
          user_id: d.user_id,
          user: d.profiles?.phone || 'N/A',
          userName: d.profiles?.full_name || 'Khách hàng',
          amount: d.amount || 0,
          bank: d.bank_name || 'ACB',
          content: d.transfer_content || '',
          time: d.created_at ? d.created_at.replace('T', ' ').slice(0, 16) : 'Vừa xong',
          status: d.status as Status,
          billImage: d.bill_image || undefined
        }))
        setDeposits(mapped)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchDepositsFromSupabase()
  }, [])

  const approve = async (id: string) => {
    const dep = deposits.find(d => d.id === id)
    if (!dep) return

    try {
      const supabase = createClient()
      
      // 1. Update deposit status to approved
      const { error: depErr } = await supabase
        .from('deposits')
        .update({ status: 'approved' })
        .eq('id', id)

      if (depErr) throw depErr

      // 2. Fetch current user wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance, total_deposited')
        .eq('user_id', dep.user_id)
        .single()

      if (wallet) {
        const newBalance = (wallet.balance || 0) + dep.amount
        const newTotalDep = (wallet.total_deposited || 0) + dep.amount

        // 3. Update user wallet balance & total deposited
        await supabase
          .from('wallets')
          .update({
            balance: newBalance,
            total_deposited: newTotalDep
          })
          .eq('user_id', dep.user_id)
      }

      setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' as Status } : d))
    } catch (e: any) {
      alert('Lỗi phê duyệt nạp tiền: ' + e.message)
    }
  }

  const reject = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('deposits')
        .update({ status: 'rejected' })
        .eq('id', id)

      if (error) throw error

      setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' as Status } : d))
    } catch (e: any) {
      alert('Lỗi từ chối nạp tiền: ' + e.message)
    }
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
              {['Người dùng', 'Số tiền nạp', 'Ngân hàng & Mã nạp', 'Bill chuyển tiền', 'Thời gian', 'Trạng thái', 'Thao tác'].map(h => (
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
                <td style={{ padding: '14px 20px' }}>
                  {dep.billImage ? (
                    <button
                      onClick={() => setSelectedBill(dep.billImage || null)}
                      style={{
                        background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE',
                        borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      🖼️ Xem ảnh
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Không có ảnh</span>
                  )}
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

      {/* Bill image modal viewer */}
      {selectedBill && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
          padding: 20
        }} onClick={() => setSelectedBill(null)}>
          <div style={{ maxWidth: '90%', maxHeight: '90%' }}>
            <img
              src={selectedBill}
              alt="Hóa đơn chuyển khoản"
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 8, border: '4px solid white' }}
            />
            <div style={{ color: 'white', textAlign: 'center', marginTop: 12, fontSize: 14, fontWeight: 700 }}>
              Nhấp vào bất kỳ đâu để đóng ảnh
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
