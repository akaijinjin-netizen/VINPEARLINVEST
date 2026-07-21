'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function WithdrawPage() {
  const [amount, setAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const userBalance = 0 // Mock user balance

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  if (success) {
    return (
      <div className="app-container" style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: 24, textAlign: 'center'
      }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>💸</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>
          Yêu cầu rút tiền thành công!
        </div>
        <div style={{ fontSize: 15, color: '#6B7280', marginBottom: 32, lineHeight: 1.6 }}>
          Lệnh rút tiền của bạn đang được duyệt. Tiền sẽ được chuyển về tài khoản trong vòng 1-2 giờ làm việc.
        </div>
        <Link href="/profile" style={{ textDecoration: 'none', width: '100%' }}>
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
            color: 'white', border: 'none',
            borderRadius: 14, padding: '16px',
            fontSize: 16, fontWeight: 700, cursor: 'pointer'
          }}>
            Về trang cá nhân
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="app-container" style={{ background: '#F5F5F5' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '1px solid #F0F0F0'
      }}>
        <Link href="/profile" style={{
          textDecoration: 'none', color: '#1A1A1A',
          fontSize: 20, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>←</Link>
        <span style={{ fontSize: 18, fontWeight: 700 }}>RÚT TIỀN</span>
      </div>

      <div style={{ padding: '16px', paddingBottom: 40 }}>
        {/* Balance Card */}
        <div style={{
          background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
          borderRadius: 16, padding: '20px', color: 'white',
          marginBottom: 16, boxShadow: '0 4px 16px rgba(200,16,46,0.25)'
        }}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>Số dư khả dụng rút</div>
          <div style={{ fontSize: 32, fontWeight: 900 }}>
            {userBalance.toLocaleString('vi-VN')} <span style={{ fontSize: 18 }}>VND</span>
          </div>
        </div>

        {/* Withdraw Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'white', borderRadius: 16,
            padding: '20px', marginBottom: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            {/* Số tiền rút */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: 8 }}>
                Số tiền muốn rút (VND)
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Nhập số tiền muốn rút"
                required
                min={100000}
                className="input-field"
              />
            </div>

            {/* Chọn ngân hàng */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: 8 }}>
                Ngân hàng nhận tiền
              </label>
              <select
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                required
                className="input-field"
                style={{ background: 'white' }}
              >
                <option value="">-- Chọn ngân hàng --</option>
                {['Vietcombank', 'ACB', 'Techcombank', 'BIDV', 'VPBank', 'MB Bank', 'Sacombank', 'Agribank', 'TPBank', 'VietinBank'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Tên chủ tài khoản */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: 8 }}>
                Tên chủ tài khoản (Viết hoa không dấu)
              </label>
              <input
                type="text"
                value={accountName}
                onChange={e => setAccountName(e.target.value.toUpperCase())}
                placeholder="VD: NGUYEN VAN A"
                required
                className="input-field"
              />
            </div>

            {/* Số tài khoản */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: 8 }}>
                Số tài khoản ngân hàng
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="Nhập số tài khoản"
                required
                className="input-field"
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          </div>

          {/* Quy định rút tiền */}
          <div style={{
            background: '#FFFBEB', borderRadius: 12,
            padding: '14px 16px', marginBottom: 20,
            border: '1px solid #FDE68A', fontSize: 13, color: '#92400E',
            lineHeight: 1.5
          }}>
            📌 <strong>Lưu ý rút tiền:</strong>
            <ul style={{ paddingLeft: 18, marginTop: 6 }}>
              <li>Số tiền rút tối thiểu: 100,000 VND</li>
              <li>Thời gian xử lý: 24/7 từ 15-60 phút</li>
              <li>Đảm bảo nhập chính xác tên và số tài khoản ngân hàng</li>
            </ul>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !amount || !bankName || !accountName || !accountNumber}
            style={{
              width: '100%',
              background: loading || !amount ? '#E5E5E5' : 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
              color: 'white', border: 'none', borderRadius: 14,
              padding: '17px', fontSize: 17, fontWeight: 800,
              cursor: !amount ? 'not-allowed' : 'pointer',
              boxShadow: !amount ? 'none' : '0 6px 20px rgba(200,16,46,0.35)',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Đang gửi yêu cầu...' : 'Xác nhận Rút tiền'}
          </button>
        </form>
      </div>
    </div>
  )
}
