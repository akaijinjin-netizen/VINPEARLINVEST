'use client'

import { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'
import { createClient } from '@/lib/supabase/client'

type User = {
  id: string
  phone: string
  fullName: string
  balance: number
  totalDeposited: number
  totalWithdrawn: number
  status: 'active' | 'locked'
  createdAt: string
  bankName?: string
  bankAccountName?: string
  bankAccountNumber?: string
  vipLevel?: number
  address?: string
  idCard?: string
  password?: string
  referralCode?: string
  referrerPhone?: string
}

const MOCK_USERS: User[] = [
  { id: '1', phone: '0987654321', fullName: 'Nguyễn Văn A', balance: 50000000, totalDeposited: 100000000, totalWithdrawn: 50000000, status: 'active', createdAt: '2026-07-20', bankName: 'Vietcombank', bankAccountName: 'NGUYEN VAN A', bankAccountNumber: '1234567890', vipLevel: 1 },
  { id: '2', phone: '0912345678', fullName: 'Trần Thị B', balance: 120000000, totalDeposited: 150000000, totalWithdrawn: 30000000, status: 'active', createdAt: '2026-07-19', bankName: 'ACB', bankAccountName: 'TRAN THI B', bankAccountNumber: '9876543210', vipLevel: 2 },
  { id: '3', phone: '0967891234', fullName: 'Lê Văn C', balance: 0, totalDeposited: 25000000, totalWithdrawn: 25000000, status: 'locked', createdAt: '2026-07-18', bankName: 'Techcombank', bankAccountName: 'LE VAN C', bankAccountNumber: '5555666677', vipLevel: 0 },
]

const BANKS_LIST = ['Vietcombank', 'ACB', 'Techcombank', 'BIDV', 'MB Bank', 'VPBank', 'Sacombank', 'Agribank', 'TPBank', 'VietinBank']
const ITEMS_PER_PAGE = 10

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const [adjustAmount, setAdjustAmount] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Edit user form state
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    newPassword: '',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    vipLevel: 0,
    address: '',
    idCard: '',
    referralCode: '',
    referrerPhone: ''
  })
  const [editSaved, setEditSaved] = useState(false)

  async function fetchUsersFromSupabase() {
    try {
      const supabase = createClient()
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*, wallets(*)')
        .order('created_at', { ascending: false })

      if (!error && profiles && profiles.length > 0) {
        // Create local map for user_id -> phone to resolve referrerPhone
        const phoneMap: Record<string, string> = {}
        profiles.forEach(p => {
          if (p.id && p.phone) {
            phoneMap[p.id] = p.phone
          }
        })

        const mapped: User[] = profiles.map(p => ({
          id: p.id,
          phone: p.phone || 'Chưa cập nhật',
          fullName: p.full_name || 'Người dùng mới',
          balance: p.wallets?.balance || 0,
          totalDeposited: p.wallets?.total_deposited || 0,
          totalWithdrawn: p.wallets?.total_withdrawn || 0,
          status: (p.status as any) || 'active',
          createdAt: p.created_at ? p.created_at.split('T')[0] : '2026-07-21',
          bankName: p.bank_name || '',
          bankAccountName: p.bank_account_name || '',
          bankAccountNumber: p.bank_account_number || '',
          vipLevel: p.vip_level ?? 0,
          address: p.address || '',
          idCard: p.id_card || '',
          password: p.password || '',
          referralCode: p.referral_code || '',
          referrerPhone: p.referrer_id ? (phoneMap[p.referrer_id] || 'N/A') : 'Không có'
        }))
        setUsers(mapped)
      }
    } catch (err) {
      console.log('Error fetching user list:', err)
    }
  }

  useEffect(() => {
    fetchUsersFromSupabase()
  }, [])

  const filtered = users.filter(u =>
    u.phone.includes(search) || u.fullName.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const toggleStatus = async (id: string) => {
    const target = users.find(u => u.id === id)
    if (!target) return
    const newStatus = target.status === 'active' ? 'locked' : 'active'

    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u))

    try {
      const supabase = createClient()
      await supabase.from('profiles').update({ status: newStatus }).eq('id', id)
    } catch (e) {
      console.log('Local status update:', e)
    }
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setEditForm({
      fullName: user.fullName,
      phone: user.phone,
      newPassword: user.password || '',
      bankName: user.bankName || 'Vietcombank',
      bankAccountName: user.bankAccountName || user.fullName.toUpperCase(),
      bankAccountNumber: user.bankAccountNumber || '',
      vipLevel: user.vipLevel ?? 0,
      address: user.address || '',
      idCard: user.idCard || '',
      referralCode: user.referralCode || '',
      referrerPhone: user.referrerPhone || ''
    })
  }

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const supabase = createClient()
      
      // 1. Resolve referrer_id from referrerPhone
      let resolvedReferrerId: string | null = null
      if (editForm.referrerPhone && editForm.referrerPhone !== 'Không có' && editForm.referrerPhone !== 'N/A') {
        const { data: refProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('phone', editForm.referrerPhone.trim())
          .maybeSingle()

        if (refProfile) {
          resolvedReferrerId = refProfile.id
        }
      }

      // 2. Update profiles table
      const { error } = await supabase.from('profiles').update({
        full_name: editForm.fullName,
        phone: editForm.phone,
        bank_name: editForm.bankName,
        bank_account_name: editForm.bankAccountName,
        bank_account_number: editForm.bankAccountNumber,
        vip_level: editForm.vipLevel,
        address: editForm.address,
        id_card: editForm.idCard,
        password: editForm.newPassword,
        referral_code: editForm.referralCode,
        referrer_id: resolvedReferrerId
      }).eq('id', editingUser.id)

      if (error) throw error

      setEditSaved(true)
      setTimeout(() => {
        setEditSaved(false)
        setEditingUser(null)
        fetchUsersFromSupabase()
      }, 1500)
    } catch (e: any) {
      alert('Lỗi khi cập nhật thông tin: ' + e.message)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    const id = userToDelete.id

    setUsers(prev => prev.filter(u => u.id !== id))
    setUserToDelete(null)

    try {
      const supabase = createClient()
      await supabase.from('profiles').delete().eq('id', id)
    } catch (e) {
      console.log('Local delete simulated:', e)
    }
  }

  const handleAdjustBalance = async (type: 'add' | 'subtract') => {
    if (!selectedUser || !adjustAmount) return
    const delta = parseFloat(adjustAmount) * (type === 'subtract' ? -1 : 1)
    const newBalance = Math.max(0, selectedUser.balance + delta)

    setUsers(prev => prev.map(u =>
      u.id === selectedUser.id ? { ...u, balance: newBalance } : u
    ))

    try {
      const supabase = createClient()
      await supabase.from('wallets').update({ balance: newBalance }).eq('user_id', selectedUser.id)
    } catch (e) {
      console.log('Local wallet update:', e)
    }

    setSelectedUser(null)
    setAdjustAmount('')
  }

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Quản lý người dùng</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Tổng cộng {users.length} tài khoản người dùng (Phân trang 10 dòng/trang)</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <input
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="🔍 Tìm theo SĐT hoặc Họ tên..."
          style={{
            width: '100%', padding: '10px 14px 10px 16px',
            border: '1.5px solid #E5E7EB', borderRadius: 10,
            fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'white'
          }}
        />
      </div>

      {/* Users Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>NGƯỜI DÙNG / GIỚI THIỆU</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>NGÂN HÀNG</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>SỐ DƯ VÍ</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>TỔNG NẠP</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>TRẠNG THÁI</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((user, i) => (
              <tr key={user.id} style={{ borderBottom: i < paginatedItems.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{user.fullName}</span>
                    <span style={{
                      background: 'linear-gradient(135deg, #F0C040 0%, #D4A373 100%)',
                      color: '#4A3B18',
                      fontSize: 9,
                      fontWeight: 900,
                      padding: '2px 5px',
                      borderRadius: 4,
                      lineHeight: '10px'
                    }}>VIP {user.vipLevel ?? 0}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>📱 {user.phone}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>
                    🔑 Mã GT: <strong style={{ color: '#0F172A' }}>{user.referralCode || 'Không có'}</strong>
                  </div>
                  <div style={{ fontSize: 11, color: '#0068FF', marginTop: 1 }}>
                    🔗 Được GT bởi: <strong style={{ color: '#0068FF' }}>{user.referrerPhone || 'Không có'}</strong>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>🏦 {user.bankName || 'Chưa liên kết'}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>{user.bankAccountName}</div>
                  <div style={{ fontSize: 12, color: '#C8102E', fontFamily: 'monospace', fontWeight: 700 }}>{user.bankAccountNumber}</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#C8102E' }}>
                    {user.balance.toLocaleString('vi-VN')}đ
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 14, color: '#10B981', fontWeight: 600 }}>
                  +{user.totalDeposited.toLocaleString('vi-VN')}đ
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    background: user.status === 'active' ? '#ECFDF5' : '#FEF2F2',
                    color: user.status === 'active' ? '#059669' : '#DC2626',
                    border: `1px solid ${user.status === 'active' ? '#A7F3D0' : '#FECACA'}`,
                    fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20
                  }}>
                    {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => openEditModal(user)} style={{
                      background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1',
                      borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                    }}>
                      ✏️ Sửa TT
                    </button>
                    <button onClick={() => setSelectedUser(user)} style={{
                      background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE',
                      borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                    }}>
                      💵 Ví tiền
                    </button>
                    <button onClick={() => toggleStatus(user.id)} style={{
                      background: user.status === 'active' ? '#FEF3C7' : '#ECFDF5',
                      color: user.status === 'active' ? '#D97706' : '#059669',
                      border: `1px solid ${user.status === 'active' ? '#FDE68A' : '#A7F3D0'}`,
                      borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                    }}>
                      {user.status === 'active' ? '🔒 Khóa' : '🔓 Mở'}
                    </button>
                    <button onClick={() => setUserToDelete(user)} style={{
                      background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
                      borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                    }}>
                      🗑️ Xóa
                    </button>
                  </div>
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

      {/* Comprehensive Edit User Info Modal */}
      {editingUser && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ background: 'white', borderRadius: 20, padding: '24px', width: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>
              ✏️ Chỉnh sửa thông tin người dùng
            </h3>

            {editSaved && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                ✓ Đã cập nhật thông tin thành công lên Supabase!
              </div>
            )}

            <form onSubmit={handleSaveUserEdit}>
              {/* Account Info Section */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>👤 Thông tin cá nhân & Đăng nhập</div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Cấp độ VIP *</label>
                  <select
                    value={editForm.vipLevel}
                    onChange={e => setEditForm(p => ({ ...p, vipLevel: parseInt(e.target.value) }))}
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none' }}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                      <option key={v} value={v}>VIP {v}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Họ và tên *</label>
                  <input
                    value={editForm.fullName}
                    onChange={e => setEditForm(p => ({ ...p, fullName: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Số điện thoại đăng nhập *</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Địa chỉ</label>
                  <input
                    value={editForm.address}
                    onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))}
                    placeholder="Nhập địa chỉ..."
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Số CCCD</label>
                  <input
                    value={editForm.idCard}
                    onChange={e => setEditForm(p => ({ ...p, idCard: e.target.value }))}
                    placeholder="Nhập số CCCD..."
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Mật khẩu đăng nhập</label>
                  <input
                    value={editForm.newPassword}
                    onChange={e => setEditForm(p => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Nhập mật khẩu..."
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Mã giới thiệu của user</label>
                  <input
                    value={editForm.referralCode}
                    onChange={e => setEditForm(p => ({ ...p, referralCode: e.target.value }))}
                    placeholder="Ví dụ: VINXYZ"
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>SĐT người giới thiệu (Mã giới thiệu của họ)</label>
                  <input
                    value={editForm.referrerPhone}
                    onChange={e => setEditForm(p => ({ ...p, referrerPhone: e.target.value }))}
                    placeholder="Ví dụ: 0987654321"
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Bank Account Linking Section */}
              <div style={{ background: '#FFFBEB', padding: '16px', borderRadius: 12, border: '1px solid #FDE68A', marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#D97706', marginBottom: 12 }}>🏦 Liên kết Ngân hàng nhận tiền rút</div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Tên ngân hàng</label>
                  <select
                    value={editForm.bankName}
                    onChange={e => setEditForm(p => ({ ...p, bankName: e.target.value }))}
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none' }}
                  >
                    <option value="">-- Chưa liên kết --</option>
                    {BANKS_LIST.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Tên chủ tài khoản (Viết hoa không dấu)</label>
                  <input
                    value={editForm.bankAccountName}
                    onChange={e => setEditForm(p => ({ ...p, bankAccountName: e.target.value.toUpperCase() }))}
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Số tài khoản ngân hàng</label>
                  <input
                    value={editForm.bankAccountNumber}
                    onChange={e => setEditForm(p => ({ ...p, bankAccountNumber: e.target.value }))}
                    style={{ width: '100%', padding: '10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'monospace', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setEditingUser(null)} style={{ flex: 1, background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Hủy bỏ
                </button>
                <button type="submit" style={{ flex: 1, background: '#C8102E', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  💾 Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {selectedUser && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '24px', width: 400 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Điều chỉnh số dư trên Supabase</h3>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
              Tài khoản: <strong>{selectedUser.fullName} ({selectedUser.phone})</strong><br />
              Số dư hiện tại: <strong style={{ color: '#C8102E' }}>{selectedUser.balance.toLocaleString('vi-VN')} VND</strong>
            </p>
            <input
              type="number"
              value={adjustAmount}
              onChange={e => setAdjustAmount(e.target.value)}
              placeholder="Nhập số tiền muốn cộng/trừ"
              style={{
                width: '100%', padding: '12px', border: '1.5px solid #E5E7EB',
                borderRadius: 10, fontSize: 16, marginBottom: 20, boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleAdjustBalance('add')} style={{
                flex: 1, background: '#10B981', color: 'white', border: 'none',
                borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer'
              }}>
                + Cộng tiền
              </button>
              <button onClick={() => handleAdjustBalance('subtract')} style={{
                flex: 1, background: '#DC2626', color: 'white', border: 'none',
                borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer'
              }}>
                - Trừ tiền
              </button>
            </div>
            <button onClick={() => setSelectedUser(null)} style={{
              width: '100%', background: '#F3F4F6', color: '#374151', border: 'none',
              borderRadius: 10, padding: '10px', marginTop: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>
              Hủy bỏ
            </button>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '24px', width: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#DC2626', marginBottom: 12 }}>Xác nhận xóa tài khoản</h3>
            <p style={{ fontSize: 14, color: '#4B5563', marginBottom: 24, lineHeight: 1.5 }}>
              Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản <strong>{userToDelete.fullName} ({userToDelete.phone})</strong> khỏi hệ thống Supabase không?<br />
              <span style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>Thao tác này không thể hoàn tác!</span>
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setUserToDelete(null)} style={{
                flex: 1, background: '#F3F4F6', color: '#374151', border: 'none',
                borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer'
              }}>
                Hủy bỏ
              </button>
              <button onClick={handleDeleteUser} style={{
                flex: 1, background: '#DC2626', color: 'white', border: 'none',
                borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer'
              }}>
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
