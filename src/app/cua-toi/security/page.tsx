'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SecurityPage() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không trùng khớp!')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }, 1200)
  }

  return (
    <div className="app-container" style={{ background: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14, color: 'white'
      }}>
        <Link href="/cua-toi" style={{
          color: 'white', textDecoration: 'none',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%', width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>←</Link>
        <span style={{ fontSize: 18, fontWeight: 700 }}>Bảo mật tài khoản</span>
      </div>

      <div style={{ padding: '16px', paddingBottom: 40 }}>
        {success && (
          <div style={{
            background: '#ECFDF5', border: '1px solid #A7F3D0',
            borderRadius: 12, padding: '14px', color: '#059669',
            fontSize: 14, fontWeight: 600, marginBottom: 16
          }}>
            ✓ Đã đổi mật khẩu đăng nhập thành công!
          </div>
        )}

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 12, padding: '14px', color: '#DC2626',
            fontSize: 14, fontWeight: 600, marginBottom: 16
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div style={{
            background: 'white', borderRadius: 16, padding: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1A1A1A' }}>
              🔐 Đổi mật khẩu đăng nhập
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="input-field"
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
              color: 'white', border: 'none', borderRadius: 14,
              padding: '16px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(200,16,46,0.3)'
            }}
          >
            {loading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
          </button>
        </form>
      </div>
    </div>
  )
}
