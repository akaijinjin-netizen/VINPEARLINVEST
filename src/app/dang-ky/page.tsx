'use client'

import { useState, useEffect } from 'react'
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
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    document.title = 'Đăng ký | Quỹ Huy Động Vốn VINGROUP'
    window.scrollTo(0, 0)
  }, [])

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

      // 1. Check if phone/email already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, phone')
        .eq('phone', phone)
        .maybeSingle()

      if (existingProfile) {
        setError(`⚠️ Tài khoản ${phone} đã tồn tại! Vui lòng đăng nhập hoặc dùng tài khoản khác.`)
        setLoading(false)
        return
      }

      // 2. Validate Referral Code is required and exists
      if (!referralCode.trim()) {
        setError('⚠️ Vui lòng nhập mã giới thiệu để tiến hành đăng ký!')
        setLoading(false)
        return
      }

      const { data: referrerProfile, error: refError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode.trim().toUpperCase())
        .maybeSingle()

      if (refError || !referrerProfile) {
        setError('⚠️ Mã giới thiệu không hợp lệ hoặc không tồn tại trên hệ thống!')
        setLoading(false)
        return
      }

      // Generate unique referral code for the new user
      const myReferralCode = 'VIN' + Math.random().toString(36).substring(2, 7).toUpperCase()
      const userId = crypto.randomUUID()

      // 3. Insert profile
      const { data: newProfile, error: profileErr } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          phone: phone,
          full_name: fullName || `Khách hàng ${phone.slice(-4)}`,
          status: 'active',
          role: 'user',
          password: password,
          referral_code: myReferralCode,
          referrer_id: referrerProfile.id
        }])
        .select()
        .single()

      if (profileErr) {
        console.error('Lỗi tạo profile:', profileErr)
        setError(`Lỗi tạo hồ sơ: ${profileErr.message}`)
        setLoading(false)
        return
      }

      // 3. Insert wallet
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

      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userPhone', phone)

      setLoading(false)
      setSuccessMsg('🎉 Đăng ký tài khoản thành công! Đang chuyển đến trang chủ...')
      setTimeout(() => {
        window.location.href = '/trang-chu'
      }, 1500)

    } catch (err: any) {
      console.error('Lỗi hệ thống:', err)
      setError(`Lỗi hệ thống: ${err.message || 'Không thể tạo tài khoản'}`)
      setLoading(false)
    }
  }

  return (
    <div className="app-container" style={{ 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80) bottom center no-repeat',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>


      {/* Dark overlay: body:before in website_res.css */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        background: '#000',
        opacity: 0.6,
        zIndex: 1
      }} />

      {/* Main Content Area */}
      <div style={{ 
        position: 'relative', 
        zIndex: 2, 
        padding: '0 24px',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        flex: 1,
        paddingBottom: 40
      }}>
        {/* Logo Container */}
        <div style={{ textAlign: 'center', marginTop: 30, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ maxWidth: '50%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Card Form */}
        <div style={{
          background: 'white',
          borderRadius: 15,
          border: 'none',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          marginBottom: 20,
          overflow: 'hidden'
        }}>
          {/* Card Header */}
          <div style={{
            background: '#e32823',
            color: 'white',
            borderRadius: '15px 15px 0 0',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: 15,
            fontSize: '1.1rem'
          }}>
            ĐĂNG KÝ TÀI KHOẢN
          </div>

          <div style={{ padding: 25 }}>
            <p style={{ 
              fontSize: 14,
              color: '#334155',
              textAlign: 'center',
              marginBottom: '1.5rem',
              lineHeight: 1.5
            }}>
              Đăng ký để sử dụng dịch vụ của chúng tôi
            </p>

            <form onSubmit={handleRegister}>
              {successMsg && (
                <div style={{
                  background: '#ECFDF5', border: '1px solid #A7F3D0',
                  borderRadius: 10, padding: 12, marginBottom: 15,
                  color: '#059669', fontSize: 13, fontWeight: 700, textAlign: 'center'
                }}>
                  {successMsg}
                </div>
              )}

              {error && (
                <div style={{
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: 10, padding: 12, marginBottom: 15,
                  color: '#DC2626', fontSize: 13, fontWeight: 700
                }}>
                  {error}
                </div>
              )}

              {/* Họ tên */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Họ tên *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Nhập họ tên"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: 10,
                    border: '1px solid #ddd',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#fff',
                    color: '#1e293b'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#d82c2c'
                    e.target.style.boxShadow = '0 0 0 0.25rem rgba(216, 44, 44, 0.25)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#ddd'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Email / SĐT */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Email / Số điện thoại
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Email là tên đăng nhập"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: 10,
                    border: '1px solid #ddd',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#fff',
                    color: '#1e293b'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#d82c2c'
                    e.target.style.boxShadow = '0 0 0 0.25rem rgba(216, 44, 44, 0.25)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#ddd'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Mật khẩu */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Mật khẩu *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: '12px 48px 12px 15px',
                      borderRadius: 10,
                      border: '1px solid #ddd',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#fff',
                      color: '#1e293b'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#d82c2c'
                      e.target.style.boxShadow = '0 0 0 0.25rem rgba(216, 44, 44, 0.25)'
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#ddd'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 15,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#777',
                      padding: 4
                    }}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Nhập lại mật khẩu */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Nhập lại mật khẩu *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 48px 12px 15px',
                      borderRadius: 10,
                      border: '1px solid #ddd',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#fff',
                      color: '#1e293b'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#d82c2c'
                      e.target.style.boxShadow = '0 0 0 0.25rem rgba(216, 44, 44, 0.25)'
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#ddd'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: 15,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#777',
                      padding: 4
                    }}
                  >
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Mã giới thiệu */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Mã giới thiệu *
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={e => setReferralCode(e.target.value)}
                  placeholder="Nhập mã giới thiệu"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: 10,
                    border: '1px solid #ddd',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#fff',
                    color: '#1e293b'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#d82c2c'
                    e.target.style.boxShadow = '0 0 0 0.25rem rgba(216, 44, 44, 0.25)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#ddd'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !!successMsg}
                style={{
                  backgroundColor: '#e32823',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  padding: 12,
                  width: '100%',
                  fontWeight: 'bold',
                  marginTop: 10,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  opacity: loading || !!successMsg ? 0.75 : 1
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#b82424'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#e32823'}
              >
                {loading ? 'ĐANG KHỞI TẠO...' : 'ĐĂNG KÝ'}
              </button>
            </form>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 13, color: '#64748B', marginTop: 16 }}>
          Đã có tài khoản?{' '}
          <Link href="/dang-nhap" style={{ color: '#e32823', fontWeight: 'bold', textDecoration: 'none' }}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
