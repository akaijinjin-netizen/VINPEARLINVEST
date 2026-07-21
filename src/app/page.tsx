'use client'

import { useState, useEffect } from 'react'
import BottomNav from '@/components/BottomNav'
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
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/vinpearl_cskh')
  const [zaloUrl, setZaloUrl] = useState('https://zalo.me/0987654321')

  useEffect(() => {
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
      window.location.href = '/home'
    }, 600)
  }

  const handleSendResetRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotPhone) return
    setForgotSubmitted(true)
  }

  const handleCloseModal = () => {
    setShowForgotPasswordModal(false)
    setForgotSubmitted(false)
    setForgotPhone('')
  }

  return (
    <div className="app-container" style={{ background: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header Banner */}
      <div style={{
        background: 'white',
        padding: '20px',
        textAlign: 'center',
        borderBottom: '1px solid #F0F0F0'
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>ĐĂNG NHẬP</span>
      </div>

      <div style={{ padding: '24px 20px', background: 'white', minHeight: 'calc(100vh - 60px)' }}>
        {/* Logo Banner */}
        <div style={{
          textAlign: 'center',
          marginBottom: 32,
          padding: '24px 0',
          background: 'url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 16,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-block',
              background: 'white',
              borderRadius: 20,
              padding: '12px 24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#C8102E', letterSpacing: -0.5 }}>
                VINPEARL <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>INVEST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              color: '#DC2626', fontSize: 14, fontWeight: 700,
              boxShadow: '0 2px 8px rgba(220,38,38,0.1)'
            }}>
              {error}
            </div>
          )}

          {/* Account/Phone */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: '1.5px solid #E5E7EB', borderRadius: 12,
              padding: '4px 16px', background: '#FAFAFA'
            }}>
              <span style={{ fontSize: 14, color: '#374151', minWidth: 80, fontWeight: 600 }}>Tài khoản</span>
              <div style={{ width: 1, height: 20, background: '#E5E7EB', margin: '0 12px' }} />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Vui lòng nhập số điện thoại"
                required
                style={{
                  border: 'none', background: 'transparent',
                  padding: '12px 0', width: '100%', fontSize: 14,
                  outline: 'none', color: '#1A1A1A'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: '1.5px solid #E5E7EB', borderRadius: 12,
              padding: '4px 16px', background: '#FAFAFA'
            }}>
              <span style={{ fontSize: 14, color: '#374151', minWidth: 80, fontWeight: 600 }}>Mật khẩu</span>
              <div style={{ width: 1, height: 20, background: '#E5E7EB', margin: '0 12px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Vui lòng nhập mật khẩu đăng nhập"
                required
                style={{
                  border: 'none', background: 'transparent',
                  padding: '12px 0', width: '100%', fontSize: 14,
                  outline: 'none', color: '#1A1A1A'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: '#9CA3AF' }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%', padding: '14px',
              fontSize: 16, fontWeight: 700,
              borderRadius: 12, marginBottom: 20,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Đang kiểm tra đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        {/* Action Links */}
        <div style={{
          background: '#FAFAFA', borderRadius: 12, padding: '16px',
          display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center'
        }}>
          <Link href="/register" style={{
            color: '#C8102E', fontSize: 14, fontWeight: 700,
            textDecoration: 'none'
          }}>
            Đăng Ký Tài Khoản
          </Link>
          <button
            type="button"
            onClick={() => setShowForgotPasswordModal(true)}
            style={{
              color: '#6B7280', fontSize: 13, textDecoration: 'underline',
              border: 'none', background: 'none', cursor: 'pointer'
            }}
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: '24px 20px',
            width: '100%', maxWidth: 380, boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            textAlign: 'center', animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔒</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>
              Quên mật khẩu
            </h3>

            {!forgotSubmitted ? (
              <form onSubmit={handleSendResetRequest}>
                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, lineHeight: 1.5 }}>
                  Vui lòng nhập <strong>Số điện thoại</strong> đăng ký của bạn để yêu cầu bộ phận CSKH hỗ trợ cấp lại mật khẩu.
                </p>

                <input
                  type="tel"
                  value={forgotPhone}
                  onChange={e => setForgotPhone(e.target.value)}
                  placeholder="Nhập số điện thoại cần lấy lại MK..."
                  required
                  style={{
                    width: '100%', padding: '12px 14px', border: '1.5px solid #E5E7EB',
                    borderRadius: 10, fontSize: 14, outline: 'none', marginBottom: 16,
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      flex: 1, padding: '12px', background: '#F3F4F6', color: '#374151',
                      border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1, padding: '12px', background: '#C8102E', color: 'white',
                      border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Gửi yêu cầu
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p style={{ fontSize: 13, color: '#059669', marginBottom: 16, lineHeight: 1.5, fontWeight: 600 }}>
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
                        borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                      }}
                    >
                      ✈️ Liên hệ qua Telegram CSKH
                    </a>
                  )}

                  {(activeChannel === 'zalo' || activeChannel === 'both') && (
                    <a
                      href={zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#0068ff', color: 'white', textDecoration: 'none',
                        borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                      }}
                    >
                      💬 Liên hệ qua Zalo CSKH
                    </a>
                  )}
                </div>

                <button
                  onClick={handleCloseModal}
                  style={{
                    width: '100%', padding: '10px', background: '#F3F4F6', color: '#374151',
                    border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Đóng cửa sổ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
