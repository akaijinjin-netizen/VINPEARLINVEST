'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function formatCurrency(n: number) {
  return n.toLocaleString('vi-VN') + ' VND'
}
function formatDate(str: string) {
  if (!str) return '—'
  const d = new Date(str)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

type TxType = 'all' | 'deposit' | 'withdraw' | 'invest' | 'profit' | 'overnight'

interface TxItem {
  id: string
  type: TxType
  label: string
  desc: string
  amount: number
  date: string
  status?: string
}

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  deposit:   { icon: '⬇️', color: '#10B981', bg: '#ECFDF5' },
  withdraw:  { icon: '⬆️', color: '#EF4444', bg: '#FEF2F2' },
  invest:    { icon: '📥', color: '#F59E0B', bg: '#FFFBEB' },
  profit:    { icon: '💰', color: '#10B981', bg: '#ECFDF5' },
  overnight: { icon: '🌙', color: '#8B5CF6', bg: '#F5F3FF' },
}

const TAB_LABELS: { key: TxType; label: string }[] = [
  { key: 'all',      label: 'Tất cả' },
  { key: 'deposit',  label: 'Nạp tiền' },
  { key: 'withdraw', label: 'Rút tiền' },
  { key: 'invest',   label: 'Đầu tư' },
  { key: 'profit',   label: 'Lợi nhuận' },
  { key: 'overnight',label: '0.5% đêm' },
]

export default function FinanceDetailPage() {
  const [filter, setFilter] = useState<TxType>('all')
  const [items, setItems] = useState<TxItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const supabase = createClient()
        const phone = localStorage.getItem('userPhone')
        if (!phone) { setLoading(false); return }

        const { data: profile } = await supabase
          .from('profiles').select('id').eq('phone', phone).maybeSingle()
        if (!profile?.id) { setLoading(false); return }

        const uid = profile.id
        const txList: TxItem[] = []

        // 1. Nạp tiền
        const { data: deposits } = await supabase
          .from('deposits')
          .select('id, amount, created_at, status')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
        deposits?.forEach(d => {
          txList.push({
            id: 'dep_' + d.id,
            type: 'deposit',
            label: 'Nạp tiền vào quỹ',
            desc: d.status === 'approved' ? '✓ Xác nhận thành công' : d.status === 'rejected' ? '✗ Bị từ chối' : '⏳ Đang xử lý',
            amount: d.status === 'approved' ? +d.amount : 0,
            date: d.created_at,
            status: d.status,
          })
        })

        // 2. Rút tiền
        const { data: withdrawals } = await supabase
          .from('withdrawals')
          .select('id, amount, created_at, status')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
        withdrawals?.forEach(w => {
          txList.push({
            id: 'wd_' + w.id,
            type: 'withdraw',
            label: 'Rút tiền về ngân hàng',
            desc: w.status === 'approved' ? '✓ Đã chuyển khoản' : w.status === 'rejected' ? '✗ Bị từ chối' : '⏳ Đang xử lý',
            amount: w.status === 'rejected' ? 0 : -Math.abs(+w.amount),
            date: w.created_at,
            status: w.status,
          })
        })

        // 3. Đầu tư (trừ tiền) + hoàn gốc + lợi nhuận đầu tư
        const { data: investments } = await supabase
          .from('investments')
          .select('id, amount, profit_earned, status, created_at, start_time, end_time, projects(name)')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
        investments?.forEach(inv => {
          const projName = (inv.projects as any)?.name || 'Dự án'
          // Trừ tiền khi đầu tư
          txList.push({
            id: 'inv_out_' + inv.id,
            type: 'invest',
            label: `Đầu tư: ${projName}`,
            desc: `Bắt đầu ${formatDate(inv.start_time || inv.created_at)}`,
            amount: -Math.abs(+inv.amount),
            date: inv.start_time || inv.created_at,
          })
          // Nhận lại gốc + lãi khi kết thúc
          if (inv.status === 'ended' && inv.end_time) {
            txList.push({
              id: 'inv_in_' + inv.id,
              type: 'profit',
              label: `Nhận vốn + lãi: ${projName}`,
              desc: `Gốc ${formatCurrency(+inv.amount)} + Lãi ${formatCurrency(+inv.profit_earned)}`,
              amount: +(inv.amount) + +(inv.profit_earned),
              date: inv.end_time,
            })
          }
        })

        // 4. Lãi 0.5% qua đêm
        const { data: overnightLogs } = await supabase
          .from('overnight_interest_logs')
          .select('id, interest_amount, wallet_balance_before, created_at')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
        overnightLogs?.forEach(log => {
          txList.push({
            id: 'oi_' + log.id,
            type: 'overnight',
            label: 'Lợi nhuận 0.5% qua đêm',
            desc: `Số dư trước: ${formatCurrency(+log.wallet_balance_before)}`,
            amount: +log.interest_amount,
            date: log.created_at,
          })
        })

        // 5. Điều chỉnh số dư từ Admin
        const { data: adjustments } = await supabase
          .from('balance_adjustments')
          .select('id, amount, type, reason, created_at')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
        adjustments?.forEach(adj => {
          txList.push({
            id: 'adj_' + adj.id,
            type: adj.type === 'subtract' ? 'withdraw' : 'deposit',
            label: adj.reason || (adj.type === 'subtract' ? 'Trừ tiền tài khoản' : 'Cộng tiền tài khoản'),
            desc: 'Hệ thống điều chỉnh',
            amount: adj.type === 'subtract' ? -Math.abs(+adj.amount) : +adj.amount,
            date: adj.created_at,
          })
        })

        // Sắp xếp mới nhất lên đầu
        txList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setItems(txList)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

  const totalIn  = items.filter(i => i.amount > 0).reduce((s, i) => s + i.amount, 0)
  const totalOut = items.filter(i => i.amount < 0).reduce((s, i) => s + Math.abs(i.amount), 0)

  return (
    <div className="app-container" style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #7B0A19 100%)',
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14
      }}>
        <Link href="/cua-toi" style={{
          color: 'white', textDecoration: 'none',
          background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>←</Link>
        <span style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>Chi tiết tài chính</span>
      </div>

      {/* Summary card */}
      <div style={{ margin: '16px 16px 0' }}>
        <div style={{
          background: 'white', borderRadius: 16, padding: '16px 20px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0, alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>TỔNG VÀO</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>+{totalIn.toLocaleString('vi-VN')}đ</div>
          </div>
          <div style={{ height: 36, background: '#F0F0F0' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>TỔNG RA</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#EF4444' }}>-{totalOut.toLocaleString('vi-VN')}đ</div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ padding: '12px 16px 0', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
          {TAB_LABELS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '7px 14px', borderRadius: 20, border: 'none',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: filter === tab.key ? '#C8102E' : '#F1F5F9',
                color: filter === tab.key ? 'white' : '#64748B',
                transition: 'all 0.15s'
              }}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div style={{ padding: '12px 16px 40px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF', fontSize: 14 }}>
            Đang tải lịch sử...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 16, padding: '50px 20px',
            textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>Chưa có giao dịch</div>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Các giao dịch tài chính sẽ hiển thị ở đây.</div>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            {filtered.map((tx, i) => {
              const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.deposit
              const isPositive = tx.amount > 0
              return (
                <div key={tx.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px',
                  borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none'
                }}>
                  {/* Icon */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    background: cfg.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20
                  }}>
                    {cfg.icon}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
                      {tx.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{tx.desc}</div>
                    <div style={{ fontSize: 11, color: '#D1D5DB', marginTop: 2 }}>{formatDate(tx.date)}</div>
                  </div>

                  {/* Amount */}
                  <div style={{
                    fontSize: 15, fontWeight: 800, flexShrink: 0,
                    color: isPositive ? '#10B981' : '#EF4444',
                    textAlign: 'right'
                  }}>
                    {isPositive ? '+' : ''}{tx.amount.toLocaleString('vi-VN')}đ
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
