'use client'

import { useState, useEffect } from 'react'

export default function AdminCskhPage() {
  const [activeChannel, setActiveChannel] = useState<'telegram' | 'zalo' | 'both'>('telegram')
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/vinpearl_cskh')
  const [zaloUrl, setZaloUrl] = useState('https://zalo.me/0987654321')
  const [cskhSaved, setCskhSaved] = useState(false)

  useEffect(() => {
    const savedTg = localStorage.getItem('telegramUrl')
    const savedZalo = localStorage.getItem('zaloUrl')
    const savedChannel = localStorage.getItem('cskhActiveChannel')
    if (savedTg) setTelegramUrl(savedTg)
    if (savedZalo) setZaloUrl(savedZalo)
    if (savedChannel) setActiveChannel(savedChannel as any)
  }, [])

  const handleSaveCskh = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('telegramUrl', telegramUrl)
    localStorage.setItem('zaloUrl', zaloUrl)
    localStorage.setItem('cskhActiveChannel', activeChannel)
    setCskhSaved(true)
    setTimeout(() => setCskhSaved(false), 3000)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Quản lý Kênh CSKH (Telegram & Zalo)</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Cấu hình linh hoạt kênh hỗ trợ chăm sóc khách hàng trực tuyến ngoài App</p>
      </div>

      {cskhSaved && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '14px 20px', borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 700 }}>
          ✓ Đã lưu cài đặt Kênh CSKH thành công! Các thay đổi đã được áp dụng ngoài App.
        </div>
      )}

      {/* CSKH Channel Settings Form */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🎧</span> Cấu hình Kênh Chăm Sóc Khách Hàng Nổi Bật
        </h3>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>
          Khi khách hàng ấn vào nút <strong>"Quên mật khẩu?"</strong> hoặc <strong>"Hỗ trợ CSKH"</strong> ngoài App, ứng dụng sẽ mở kênh anh cấu hình dưới đây.
        </p>

        <form onSubmit={handleSaveCskh}>
          {/* Active Channel Selector */}
          <div style={{ marginBottom: 24, background: '#F8FAFC', padding: '20px', borderRadius: 14, border: '1px solid #E2E8F0' }}>
            <label style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 14 }}>
              📌 Kênh CSKH hiển thị khi khách hàng gửi yêu cầu hỗ trợ:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <label style={{
                background: activeChannel === 'telegram' ? '#EFF6FF' : 'white',
                border: `2px solid ${activeChannel === 'telegram' ? '#2563EB' : '#E2E8F0'}`,
                borderRadius: 12, padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10
              }}>
                <input
                  type="radio"
                  name="activeChannel"
                  value="telegram"
                  checked={activeChannel === 'telegram'}
                  onChange={() => setActiveChannel('telegram')}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#2563EB' }}>✈️ Chỉ Telegram</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Khách ấn sẽ mở ngay Telegram</div>
                </div>
              </label>

              <label style={{
                background: activeChannel === 'zalo' ? '#EFF6FF' : 'white',
                border: `2px solid ${activeChannel === 'zalo' ? '#2563EB' : '#E2E8F0'}`,
                borderRadius: 12, padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10
              }}>
                <input
                  type="radio"
                  name="activeChannel"
                  value="zalo"
                  checked={activeChannel === 'zalo'}
                  onChange={() => setActiveChannel('zalo')}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0284C7' }}>💬 Chỉ Zalo CSKH</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Khách ấn sẽ mở ngay Zalo Chat</div>
                </div>
              </label>

              <label style={{
                background: activeChannel === 'both' ? '#F8FAFC' : 'white',
                border: `2px solid ${activeChannel === 'both' ? '#0F172A' : '#E2E8F0'}`,
                borderRadius: 12, padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10
              }}>
                <input
                  type="radio"
                  name="activeChannel"
                  value="both"
                  checked={activeChannel === 'both'}
                  onChange={() => setActiveChannel('both')}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>🌐 Cả 2 kênh</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Hiện cả 2 nút Telegram & Zalo</div>
                </div>
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>
                ✈️ Đường Link Telegram CSKH *
              </label>
              <input
                type="url"
                value={telegramUrl}
                onChange={e => setTelegramUrl(e.target.value)}
                placeholder="https://t.me/vinpearl_cskh"
                required
                style={{
                  width: '100%', padding: '12px 14px', border: '1.5px solid #E5E7EB',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4, display: 'block' }}>Ví dụ: https://t.me/ten_taikhoan_cskh</span>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>
                💬 Đường Link Zalo CSKH *
              </label>
              <input
                type="url"
                value={zaloUrl}
                onChange={e => setZaloUrl(e.target.value)}
                placeholder="https://zalo.me/0987654321"
                required
                style={{
                  width: '100%', padding: '12px 14px', border: '1.5px solid #E5E7EB',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4, display: 'block' }}>Ví dụ: https://zalo.me/0987654321</span>
            </div>
          </div>

          <button type="submit" style={{
            background: 'linear-gradient(135deg, #C8102E, #A00D25)',
            color: 'white', border: 'none', borderRadius: 12,
            padding: '14px 28px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(200,16,46,0.3)'
          }}>
            💾 Lưu Cấu Hình CSKH
          </button>
        </form>
      </div>
    </div>
  )
}
