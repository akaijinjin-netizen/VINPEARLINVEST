'use client'

import { useState } from 'react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const inputUser = username.trim().toLowerCase()

    // 1. Get Main Admin password (default: '668899@.')
    const mainPassword = localStorage.getItem('adminMainPassword') || '668899@.'

    // 2. Get Sub-Admin accounts
    const subAdminsRaw = localStorage.getItem('subAdmins')
    const subAdmins: any[] = subAdminsRaw ? JSON.parse(subAdminsRaw) : []

    let isValid = false
    let loggedAdminRole = 'Quản trị viên chính'
    let loggedAdminName = 'Admin'

    if (inputUser === 'admin' && password === mainPassword) {
      isValid = true
      loggedAdminRole = 'Quản trị viên cao cấp'
      loggedAdminName = 'Admin Chính'
    } else {
      // Check sub-admins
      const foundSub = subAdmins.find(sub => sub.username.toLowerCase() === inputUser && sub.password === password)
      if (foundSub) {
        isValid = true
        loggedAdminRole = foundSub.role || 'Admin Phụ'
        loggedAdminName = foundSub.name || foundSub.username
      }
    }

    if (isValid) {
      localStorage.setItem('isAdminLoggedIn', 'true')
      localStorage.setItem('currentAdminUser', inputUser)
      localStorage.setItem('currentAdminName', loggedAdminName)
      localStorage.setItem('currentAdminRole', loggedAdminRole)

      setTimeout(() => {
        setLoading(false)
        window.location.href = '/admin'
      }, 600)
    } else {
      setTimeout(() => {
        setLoading(false)
        setError('⚠️ Tên đăng nhập hoặc Mật khẩu Admin không chính xác!')
      }, 500)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'fixed', inset: 0, zIndex: 9999
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: '36px 32px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        {/* Admin Brand Logo */}
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg, #C8102E, #A00D25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(200,16,46,0.35)'
        }}>
          <span style={{ color: '#F0C040', fontSize: 32, fontWeight: 900 }}>V</span>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', marginBottom: 4, letterSpacing: -0.5 }}>
          VINPEARL INVEST
        </h2>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#C8102E', letterSpacing: 2, marginBottom: 24 }}>
          KHÓA ĐĂNG NHẬP BẢO MẬT HẬU ĐÀI ADMIN
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            color: '#DC2626', borderRadius: 10, padding: 12,
            fontSize: 13, marginBottom: 20, fontWeight: 700
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin}>
          <div style={{ textAlign: 'left', marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
              Tài khoản Quản trị *
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập Admin..."
              required
              style={{
                width: '100%', padding: '12px 14px', border: '1.5px solid #E5E7EB',
                borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
              Mật khẩu Admin *
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              required
              style={{
                width: '100%', padding: '12px 14px', border: '1.5px solid #E5E7EB',
                borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
              color: 'white', border: 'none', borderRadius: 12,
              padding: '14px', fontSize: 16, fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(200,16,46,0.35)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Đang xác thực khóa Admin...' : '🔐 Đăng Nhập Hậu Đài Admin'}
          </button>
        </form>

        <div style={{ marginTop: 24, fontSize: 12, color: '#9CA3AF' }}>
          Hệ thống bảo vệ phân quyền Admin Vinpearl Invest v2.5
        </div>
      </div>
    </div>
  )
}
