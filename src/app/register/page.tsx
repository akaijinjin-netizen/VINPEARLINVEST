'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!')
      return
    }
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const supabase = createClient()

      // 1. Strict check if phone already exists in Supabase profiles
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, phone')
        .eq('phone', phone)
        .maybeSingle()

      if (existingProfile) {
        setError(`⚠️ Số điện thoại ${phone} đã được đăng ký tài khoản trên hệ thống! Vui lòng đăng nhập hoặc sử dụng SĐT khác.`)
        setLoading(false)
        return
      }

      const userId = crypto.randomUUID()

      // 2. Insert into profiles table
      const { data: newProfile, error: profileErr } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          phone: phone,
          full_name: fullName || `Khách hàng ${phone.slice(-4)}`,
          status: 'active',
          role: 'user'
        }])
        .select()
        .single()

      if (profileErr) {
        console.error('Lỗi tạo profile:', profileErr)
        if (profileErr.code === '23505') {
          setError(`⚠️ Số điện thoại ${phone} đã được đăng ký tài khoản! Vui lòng đăng nhập.`)
        } else {
          setError(`Lỗi tạo hồ sơ: ${profileErr.message}`)
        }
        setLoading(false)
        return
      }

      // 3. Insert into wallets table
      await supabase
        .from('wallets')
        .insert([{
          user_id: newProfile.id,
          balance: 0,
          pending_interest: 0,
          pending_principal: 0,
          total_deposited: 0,
          total_withdrawn: 0,
          total_earned: 0
        }])

      // Success: Save auth session state in localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userPhone', phone)

      setLoading(false)
      setSuccessMsg('🎉 Đăng ký tài khoản thành công! Đang chuyển đến trang chủ...')
      setTimeout(() => {
        window.location.href = '/home'
      }, 1500)

    } catch (err: any) {
      console.error('Lỗi hệ thống:', err)
      setError(`Lỗi hệ thống: ${err.message || 'Không thể tạo tài khoản'}`)
      setLoading(false)
    }
  }

  return (
    <div className="app-container" style={{ background: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '1px solid #F0F0F0'
      }}>
        <Link href="/" style={{
          textDecoration: 'none', color: '#1A1A1A',
          fontSize: 20, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>←</Link>
        <span style={{ fontSize: 18, fontWeight: 700, margin: '0 auto', paddingRight: 36 }}>ĐĂNG KÝ TÀI KHOẢN</span>
      </div>

      <div style={{ padding: '24px 20px 90px', background: 'white', minHeight: 'calc(100vh - 60px)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #C8102E, #A00D25)',
            color: 'white', borderRadius: 20, padding: '12px 24px',
            boxShadow: '0 4px 16px rgba(200,16,46,0.25)'
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
              <span style={{ color: '#F0C040' }}>V</span>INPEARL <span style={{ fontSize: 14, fontWeight: 600 }}>INVEST</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleRegister}>
          {successMsg && (
            <div style={{
              background: '#ECFDF5', border: '1px solid #A7F3D0',
              borderRadius: 12, padding: '14px 16px', marginBottom: 20,
              color: '#059669', fontSize: 14, fontWeight: 700, textAlign: 'center',
              boxShadow: '0 4px 12px rgba(16,185,129,0.15)',
              animation: 'fadeIn 0.2s ease'
            }}>
              {successMsg}
            </div>
          )}

          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: 10, padding: '14px 16px', marginBottom: 20,
              color: '#DC2626', fontSize: 14, fontWeight: 700,
              boxShadow: '0 2px 8px rgba(220,38,38,0.1)'
            }}>
              {error}
            </div>
          )}

          {/* Họ và tên */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Họ và tên *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Vui lòng nhập họ và tên..."
              required
              className="input-field"
            />
          </div>

          {/* SĐT */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Số điện thoại *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Vui lòng nhập số điện thoại..."
              required
              className="input-field"
            />
          </div>

          {/* Mật khẩu */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Mật khẩu đăng nhập *
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              required
              minLength={6}
              className="input-field"
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Xác nhận mật khẩu *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu..."
              required
              className="input-field"
            />
          </div>

          {/* Mã giới thiệu */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Mã giới thiệu (Nếu có)
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value)}
              placeholder="Nhập mã giới thiệu (không bắt buộc)"
              className="input-field"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !!successMsg}
            className="btn-primary"
            style={{
              width: '100%', padding: '14px',
              fontSize: 16, fontWeight: 700,
              borderRadius: 12, marginBottom: 16,
              opacity: loading || !!successMsg ? 0.7 : 1
            }}
          >
            {loading ? 'Đang kiểm tra & tạo tài khoản...' : 'Đăng Ký Ngay'}
          </button>

          <div style={{ textAlign: 'center', fontSize: 14, color: '#6B7280' }}>
            Đã có tài khoản?{' '}
            <Link href="/" style={{ color: '#C8102E', fontWeight: 700, textDecoration: 'none' }}>
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
