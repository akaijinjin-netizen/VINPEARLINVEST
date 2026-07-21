'use client'

import { useState, useEffect } from 'react'

export default function AdminManagementPage() {
  // Main Admin password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')
  const [pwdError, setPwdError] = useState('')

  // Sub-Admin state
  const [subAdmins, setSubAdmins] = useState<any[]>([])
  const [showAddSubModal, setShowAddSubModal] = useState(false)
  const [subUsername, setSubUsername] = useState('')
  const [subPassword, setSubPassword] = useState('')
  const [subName, setSubName] = useState('')
  const [subRole, setSubRole] = useState('Admin Phụ (CSKH & Nạp Rút)')
  const [subMsg, setSubMsg] = useState('')

  useEffect(() => {
    const savedSubs = localStorage.getItem('subAdmins')
    if (savedSubs) {
      try {
        setSubAdmins(JSON.parse(savedSubs))
      } catch (e) {}
    }
  }, [])

  const handleChangeMainPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMsg('')
    setPwdError('')

    const actualCurrent = localStorage.getItem('adminMainPassword') || '668899@.'

    if (currentPassword !== actualCurrent) {
      setPwdError('Mật khẩu hiện tại không chính xác!')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPwdError('Mật khẩu mới nhập lại không khớp!')
      return
    }

    if (newPassword.length < 6) {
      setPwdError('Mật khẩu mới phải từ 6 ký tự trở lên!')
      return
    }

    // Save main password
    localStorage.setItem('adminMainPassword', newPassword)
    setPwdMsg('🎉 Đã đổi mật khẩu Admin thành công!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
    setTimeout(() => setPwdMsg(''), 3000)
  }

  const handleAddSubAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setSubMsg('')

    if (!subUsername || !subPassword) return

    const newSub = {
      id: Date.now().toString(),
      username: subUsername.trim().toLowerCase(),
      password: subPassword,
      name: subName || subUsername,
      role: subRole,
      createdAt: new Date().toLocaleDateString('vi-VN')
    }

    const updated = [...subAdmins, newSub]
    setSubAdmins(updated)
    localStorage.setItem('subAdmins', JSON.stringify(updated))

    setShowAddSubModal(false)
    setSubUsername('')
    setSubPassword('')
    setSubName('')
    setSubMsg('✓ Đã tạo tài khoản Admin phụ thành công!')
    setTimeout(() => setSubMsg(''), 3000)
  }

  const handleDeleteSubAdmin = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản Admin phụ này không?')) {
      const updated = subAdmins.filter(s => s.id !== id)
      setSubAdmins(updated)
      localStorage.setItem('subAdmins', JSON.stringify(updated))
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginBottom: 4 }}>
            🔐 Quản lý Tài khoản Admin & Bảo mật
          </h1>
          <p style={{ fontSize: 13, color: '#64748B' }}>
            Đổi mật khẩu Admin chính và phân quyền cấp tài khoản Admin phụ cho nhân viên Hậu đài
          </p>
        </div>
      </div>

      {subMsg && (
        <div style={{
          background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669',
          borderRadius: 12, padding: '14px 18px', fontSize: 14, fontWeight: 700, marginBottom: 24
        }}>
          {subMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Section 1: Change Password Form */}
        <div style={{
          background: 'white', borderRadius: 20, padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            🔑 Đổi mật khẩu Admin Chính
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
            Tài khoản Admin chính mặc định: <strong>admin</strong>
          </p>

          {pwdMsg && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', borderRadius: 10, padding: 12, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
              {pwdMsg}
            </div>
          )}

          {pwdError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: 10, padding: 12, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
              ⚠️ {pwdError}
            </div>
          )}

          <form onSubmit={handleChangeMainPassword}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                Mật khẩu hiện tại *
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại..."
                required
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                Mật khẩu mới *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (Ví dụ: 668899@.)..."
                required
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                Xác nhận mật khẩu mới *
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                required
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%', background: 'linear-gradient(135deg, #C8102E, #A00D25)',
                color: 'white', border: 'none', borderRadius: 10, padding: '12px',
                fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(200,16,46,0.25)'
              }}
            >
              💾 Cập Nhật Mật Khẩu Admin
            </button>
          </form>
        </div>

        {/* Section 2: Sub-Admin Overview */}
        <div style={{
          background: 'white', borderRadius: 20, padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                👥 Tài Khoản Admin Phụ
              </h2>
              <button
                onClick={() => setShowAddSubModal(true)}
                style={{
                  background: '#10B981', color: 'white', border: 'none',
                  borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer'
                }}
              >
                + Tạo Admin Phụ
              </button>
            </div>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>
              Tạo thêm tài khoản đăng nhập phụ cho nhân viên CSKH hoặc nhân viên duyệt lệnh nạp/rút.
            </p>

            <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#64748B' }}>TỔNG SỐ TÀI KHOẢN HẬU ĐÀI</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginTop: 2 }}>
                {1 + subAdmins.length} Tài khoản (1 Admin chính, {subAdmins.length} Admin phụ)
              </div>
            </div>
          </div>

          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '14px', color: '#B45309', fontSize: 13 }}>
            💡 <strong>Lưu ý bảo mật:</strong> Các tài khoản Admin phụ có thể dùng username và mật khẩu riêng để truy cập vào hệ thống Admin panel mà không cần biết mật khẩu Admin chính.
          </div>
        </div>
      </div>

      {/* Section 3: Admin Accounts Table */}
      <div style={{
        background: 'white', borderRadius: 20, padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0'
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>
          📋 Danh sách Tài khoản Quản trị Hậu đài
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#64748B', fontSize: 12, fontWeight: 700 }}>
              <th style={{ padding: '12px 16px' }}>TÊN ĐĂNG NHẬP</th>
              <th style={{ padding: '12px 16px' }}>TÊN HIỂN THỊ</th>
              <th style={{ padding: '12px 16px' }}>VAI TRÒ / PHÂN QUYỀN</th>
              <th style={{ padding: '12px 16px' }}>MẬT KHẨU</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {/* Main Admin Row */}
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '16px', fontWeight: 800, color: '#C8102E' }}>admin</td>
              <td style={{ padding: '16px', fontWeight: 700 }}>Admin Chính (Chủ hệ thống)</td>
              <td style={{ padding: '16px' }}>
                <span style={{ background: '#FEF2F2', color: '#C8102E', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  Quản trị viên Cao cấp
                </span>
              </td>
              <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700 }}>••••••••</td>
              <td style={{ padding: '16px', textAlign: 'right', fontSize: 12, color: '#94A3B8' }}>
                Gốc (Không thể xóa)
              </td>
            </tr>

            {/* Sub-Admins Rows */}
            {subAdmins.map(sub => (
              <tr key={sub.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '16px', fontWeight: 800, color: '#0F172A' }}>{sub.username}</td>
                <td style={{ padding: '16px', fontWeight: 600 }}>{sub.name}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                    {sub.role}
                  </span>
                </td>
                <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700 }}>{sub.password}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDeleteSubAdmin(sub.id)}
                    style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Sub-Admin */}
      {showAddSubModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: '28px',
            width: '100%', maxWidth: 440, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', marginBottom: 6 }}>
              ➕ Tạo Tài Khoản Admin Phụ Mới
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
              Nhập thông tin tài khoản phụ cho nhân viên đăng nhập Hậu đài
            </p>

            <form onSubmit={handleAddSubAdmin}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Tên hiển thị nhân viên *
                </label>
                <input
                  type="text"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A (CSKH Ca Sáng)..."
                  required
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Tên đăng nhập Admin phụ *
                </label>
                <input
                  type="text"
                  value={subUsername}
                  onChange={e => setSubUsername(e.target.value)}
                  placeholder="VD: admin_cskh1"
                  required
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Mật khẩu Admin phụ *
                </label>
                <input
                  type="text"
                  value={subPassword}
                  onChange={e => setSubPassword(e.target.value)}
                  placeholder="Nhập mật khẩu cho tài khoản phụ..."
                  required
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Vai trò / Phân quyền
                </label>
                <select
                  value={subRole}
                  onChange={e => setSubRole(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="Admin Phụ (CSKH & Nạp Rút)">Admin Phụ (CSKH & Nạp Rút)</option>
                  <option value="Quản lý Tài chính (Nạp/Rút)">Quản lý Tài chính (Nạp/Rút)</option>
                  <option value="Chăm sóc khách hàng (CSKH)">Chăm sóc khách hàng (CSKH)</option>
                  <option value="Quản lý Dự án">Quản lý Dự án</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddSubModal(false)}
                  style={{ flex: 1, padding: '12px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', background: '#10B981', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                >
                  💾 Tạo Admin Phụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
