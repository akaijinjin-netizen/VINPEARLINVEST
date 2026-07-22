'use client'

import { useState, useEffect } from 'react'

type Bank = { id: string; bank: string; accountName: string; accountNumber: string; isActive: boolean }

const DEFAULT_BANKS: Bank[] = [
  { id: '1', bank: 'ACB', accountName: 'CONG TY TNHH QLQ DAU TU VINGROUP QPL', accountNumber: '41561027', isActive: true },
  { id: '2', bank: 'Techcombank', accountName: 'CONG TY TNHH QLQ DAU TU VINGROUP QPL', accountNumber: '19036789015', isActive: false },
]

export default function AdminBankPage() {
  const [banks, setBanks] = useState<Bank[]>(DEFAULT_BANKS)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ bank: '', accountName: '', accountNumber: '' })
  const [saved, setSaved] = useState(false)
  const [isAdminMain, setIsAdminMain] = useState(true)

  useEffect(() => {
    // Check if main admin or sub-admin
    const adminUser = localStorage.getItem('currentAdminUser') || 'admin'
    setIsAdminMain(adminUser === 'admin')

    const savedBanks = localStorage.getItem('adminBanks')
    if (savedBanks) {
      try {
        setBanks(JSON.parse(savedBanks))
      } catch (e) {}
    }
  }, [])

  const saveBanksToStorage = (newBanks: Bank[]) => {
    setBanks(newBanks)
    localStorage.setItem('adminBanks', JSON.stringify(newBanks))
  }

  const handleSave = () => {
    if (!isAdminMain) {
      alert('⚠️ Bạn không có quyền thêm hoặc sửa tài khoản ngân hàng!')
      return
    }
    let updated: Bank[] = []
    if (editId) {
      updated = banks.map(b => b.id === editId ? { ...b, ...form } : b)
    } else {
      updated = [...banks, { id: Date.now().toString(), ...form, isActive: false }]
    }
    saveBanksToStorage(updated)
    setShowForm(false)
    setEditId(null)
    setForm({ bank: '', accountName: '', accountNumber: '' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleActive = (id: string) => {
    if (!isAdminMain) return
    const updated = banks.map(b => ({ ...b, isActive: b.id === id }))
    saveBanksToStorage(updated)
  }

  const deleteBank = (id: string) => {
    if (!isAdminMain) return
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản ngân hàng này không?')) {
      const updated = banks.filter(b => b.id !== id)
      saveBanksToStorage(updated)
    }
  }

  const startEdit = (b: Bank) => {
    if (!isAdminMain) return
    setEditId(b.id)
    setForm({ bank: b.bank, accountName: b.accountName, accountNumber: b.accountNumber })
    setShowForm(true)
  }

  const BANKS_LIST = ['ACB', 'Vietcombank', 'Techcombank', 'BIDV', 'VPBank', 'MB Bank', 'Sacombank', 'Agribank', 'TPBank', 'VietinBank']

  return (
    <div>
      {/* Restrict sub-admin notification */}
      {!isAdminMain && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
          borderRadius: 14, padding: '16px 20px', fontSize: 13, fontWeight: 700, marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          🛡️ <span><strong>Hạn chế quyền hạn:</strong> Tài khoản của bạn là <strong>Admin Phụ</strong>. Bạn chỉ có quyền Xem (Read-only) và không thể thay đổi thông tin ngân hàng của công ty.</span>
        </div>
      )}

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Cài đặt ngân hàng</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Quản lý các tài khoản ngân hàng nhận tiền nạp của hệ thống</p>
        </div>
        {isAdminMain && (
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ bank: '', accountName: '', accountNumber: '' }) }} style={{
            background: 'linear-gradient(135deg, #C8102E, #A00D25)',
            color: 'white', border: 'none', borderRadius: 10,
            padding: '11px 20px', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(200,16,46,0.25)'
          }}>
            + Thêm ngân hàng
          </button>
        )}
      </div>

      {saved && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 600 }}>
          ✓ Đã lưu cài đặt ngân hàng thành công!
        </div>
      )}

      {/* 2. Bank Accounts List Section */}
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>
        🏦 Danh sách tài khoản ngân hàng nhận tiền
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {banks.map(bank => (
          <div key={bank.id} style={{
            background: 'white', borderRadius: 16, padding: '20px',
            border: `2px solid ${bank.isActive ? '#C8102E' : '#E5E7EB'}`,
            position: 'relative', transition: 'all 0.2s',
          }}>
            {bank.isActive && (
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: '#C8102E', color: 'white',
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20
              }}>
                ✓ Đang dùng nhận nạp
              </div>
            )}
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>{bank.bank}</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>Chủ tài khoản:</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>{bank.accountName}</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>Số tài khoản:</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#C8102E', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 16 }}>{bank.accountNumber}</div>

            {isAdminMain ? (
              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #F3F4F6', paddingTop: 14 }}>
                {!bank.isActive && (
                  <button onClick={() => toggleActive(bank.id)} style={{
                    flex: 1, background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0',
                    borderRadius: 8, padding: '7px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                  }}>
                    Dùng làm mặc định
                  </button>
                )}
                <button onClick={() => startEdit(bank)} style={{
                  background: '#F3F4F6', color: '#374151', border: 'none',
                  borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                }}>
                  ✏️ Sửa
                </button>
                <button onClick={() => deleteBank(bank.id)} style={{
                  background: '#FEF2F2', color: '#DC2626', border: 'none',
                  borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                }}>
                  🗑️ Xóa
                </button>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 14, textAlign: 'center', fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                🔒 Cài đặt Ngân hàng bị Khóa (Chỉ có quyền xem)
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {showForm && isAdminMain && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '24px', width: 440 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>{editId ? 'Sửa ngân hàng' : 'Thêm ngân hàng mới'}</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Tên ngân hàng *</label>
              <select value={form.bank} onChange={e => setForm(p => ({ ...p, bank: e.target.value }))} style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none' }}>
                <option value="">-- Chọn ngân hàng --</option>
                {BANKS_LIST.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Tên chủ tài khoản (Viết hoa không dấu) *</label>
              <input value={form.accountName} onChange={e => setForm(p => ({ ...p, accountName: e.target.value.toUpperCase() }))} placeholder="VD: CONG TY TNHH QLQ DAU TU VINGROUP QPL" style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Số tài khoản *</label>
              <input value={form.accountNumber} onChange={e => setForm(p => ({ ...p, accountNumber: e.target.value }))} placeholder="Nhập số tài khoản ngân hàng..." style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Hủy bỏ</button>
              <button onClick={handleSave} style={{ flex: 1, background: '#C8102E', color: 'white', border: 'none', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Lưu ngân hàng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
