'use client'

import { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'
import { createClient } from '@/lib/supabase/client'

type Status = 'pending' | 'approved' | 'rejected'

type Withdrawal = {
  id: string
  user_id: string
  name: string
  user: string // phone
  amount: number
  bank: string
  accountName: string
  accountNo: string
  time: string
  status: Status
}

const STATUS_MAP: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  pending:  { label: 'Chờ duyệt', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  approved: { label: 'Đã duyệt',  color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  rejected: { label: 'Từ chối',   color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
}

const ITEMS_PER_PAGE = 10

export default function AdminWithdrawalsPage() {
  const [items, setItems] = useState<Withdrawal[]>([])
  const [filter, setFilter] = useState<'all' | Status>('pending')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  async function fetchWithdrawalsFromSupabase() {
    try {
      const supabase = createClient()
      const { data: withData, error } = await supabase
        .from('withdrawals')
        .select('*, profiles!withdrawals_user_id_fkey(phone, full_name)')
        .order('created_at', { ascending: false })

      if (!error && withData) {
        const mapped: Withdrawal[] = withData.map(w => ({
          id: w.id,
          user_id: w.user_id,
          name: w.profiles?.full_name || 'Khách hàng',
          user: w.profiles?.phone || 'N/A',
          amount: w.amount || 0,
          bank: w.bank_name || 'Vietcombank',
          accountName: w.bank_account_name || '',
          accountNo: w.bank_account_number || '',
          time: w.created_at ? w.created_at.replace('T', ' ').slice(0, 16) : 'Vừa xong',
          status: w.status as Status
        }))
        setItems(mapped)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchWithdrawalsFromSupabase()
  }, [])

  const approve = async (id: string) => {
    const item = items.find(i => i.id === id)
    if (!item) return

    try {
      const supabase = createClient()
      
      // 1. Update status to approved
      const { error: withErr } = await supabase
        .from('withdrawals')
        .update({ status: 'approved' })
        .eq('id', id)

      if (withErr) throw withErr

      // 2. Fetch current wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('total_withdrawn')
        .eq('user_id', item.user_id)
        .single()

      if (wallet) {
        const newTotalWithdrawn = (wallet.total_withdrawn || 0) + item.amount
        
        // 3. Update total withdrawn
        await supabase
          .from('wallets')
          .update({ total_withdrawn: newTotalWithdrawn })
          .eq('user_id', item.user_id)
      }

      setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' as Status } : i))
    } catch (e: any) {
      alert('Lỗi duyệt rút tiền: ' + e.message)
    }
  }

  const reject = async (id: string) => {
    const item = items.find(i => i.id === id)
    if (!item) return

    try {
      const supabase = createClient()
      
      // 1. Update status to rejected
      const { error: withErr } = await supabase
        .from('withdrawals')
        .update({ status: 'rejected' })
        .eq('id', id)

      if (withErr) throw withErr

      // 2. Fetch current wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', item.user_id)
        .single()

      if (wallet) {
        // Refund withdrawal amount back to user wallet balance
        const newBalance = (wallet.balance || 0) + item.amount
        
        // 3. Update wallet balance
        await supabase
          .from('wallets')
          .update({ balance: newBalance })
          .eq('user_id', item.user_id)
      }

      setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected' as Status } : i))
    } catch (e: any) {
      alert('Lỗi từ chối rút tiền: ' + e.message)
    }
  }

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

  const counts = {
    pending: items.filter(i => i.status === 'pending').length,
    approved: items.filter(i => i.status === 'approved').length,
    rejected: items.filter(i => i.status === 'rejected').length
  }

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
