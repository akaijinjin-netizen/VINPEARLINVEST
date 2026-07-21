'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DepositPage() {
  const [amount, setAmount] = useState('')
  const [bill, setBill] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const bankInfo = {
    bank: 'ACB',
    accountName: 'CONG TY TNHH QLQ DAU TU VINPEARL',
    accountNumber: '41561027',
    transferContent: 'NAPTIEN 278'
  }

  const quickAmounts = [10_000_000, 20_000_000, 50_000_000, 100_000_000]

  const handleSubmit = async (e: React.FormEvent) => {
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
        <div style={{ fontSize: 80, marginBottom: 20 }}>✅</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>
          Yêu cầu đã được gửi!
        </div>
        <div style={{ fontSize: 15, color: '#6B7280', marginBottom: 32, lineHeight: 1.6 }}>
          Chúng tôi sẽ xác nhận và cộng tiền vào tài khoản của bạn trong vòng 15 phút.
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
        <span style={{ fontSize: 18, fontWeight: 700 }}>NẠP TIỀN</span>
      </div>

      <div style={{ padding: '16px', paddingBottom: 24 }}>
        {/* Bank Info Card */}
        <div style={{
          background: 'white', borderRadius: 16,
          overflow: 'hidden', marginBottom: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
            padding: '14px 20px', color: 'white',
            fontSize: 14, fontWeight: 700
          }}>
            🏦 Thông tin chuyển khoản
          </div>
          {[
            { label: 'Ngân hàng', value: bankInfo.bank, color: '#2563EB' },
            { label: 'Chủ tài khoản', value: bankInfo.accountName },
            { label: 'Số tài khoản', value: bankInfo.accountNumber },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 20px',
              borderBottom: i < 2 ? '1px solid #F5F5F5' : 'none'
            }}>
              <span style={{ fontSize: 14, color: '#6B7280' }}>{row.label}</span>
              <span style={{ 
                fontSize: 14, fontWeight: 700,
                color: row.color || '#1A1A1A'
              }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'white', borderRadius: 16,
            padding: '20px', marginBottom: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            {/* Amount */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: 10 }}>
                Số tiền nạp
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Nhập số tiền"
                required
                min={1000000}
                className="input-field"
              />
              {/* Quick amount buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {quickAmounts.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(a.toString())}
                    style={{
                      background: amount === a.toString() ? '#C8102E' : '#F5F5F5',
                      color: amount === a.toString() ? 'white' : '#374151',
                      border: 'none', borderRadius: 20,
                      padding: '6px 12px', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {(a / 1_000_000).toFixed(0)}tr
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer content */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 6 }}>Nội dung chuyển khoản</div>
              <div style={{
                background: '#FEF2F2', borderRadius: 10,
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#C8102E', letterSpacing: 1 }}>
                  {bankInfo.transferContent}
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(bankInfo.transferContent)}
                  style={{
                    background: '#C8102E', color: 'white',
                    border: 'none', borderRadius: 8,
                    padding: '4px 10px', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Sao chép
                </button>
              </div>
            </div>

            {/* Bill upload */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>
                Bill chuyển khoản
              </div>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                border: '2px dashed #E5E5E5', borderRadius: 12,
                padding: '20px', cursor: 'pointer',
                background: bill ? '#F0FDF4' : '#FAFAFA',
                borderColor: bill ? '#10B981' : '#E5E5E5',
                transition: 'all 0.2s'
              }}>
                <span style={{ fontSize: 32, marginBottom: 8 }}>{bill ? '✅' : '📎'}</span>
                <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>
                  {bill ? bill.name : 'Chọn ảnh bill chuyển khoản'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => setBill(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          {/* Warning */}
          <div style={{
            background: '#FEF3C7', borderRadius: 12,
            padding: '12px 16px', marginBottom: 16,
            border: '1px solid #FDE68A'
          }}>
            <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
              ⚠️ Vui lòng chuyển khoản đúng nội dung <strong>{bankInfo.transferContent}</strong> để hệ thống tự động xác nhận. Sai nội dung sẽ gây chậm trễ xử lý.
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !amount}
            style={{
              width: '100%',
              background: loading || !amount ? '#E5E5E5' : 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
              color: loading || !amount ? '#9CA3AF' : 'white',
              border: 'none', borderRadius: 14,
              padding: '17px', fontSize: 17,
              fontWeight: 800, cursor: !amount ? 'not-allowed' : 'pointer',
              boxShadow: !amount ? 'none' : '0 6px 20px rgba(200,16,46,0.35)',
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 18, height: 18, border: '2px solid white',
                  borderTopColor: 'transparent', borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Đang xử lý...
              </>
            ) : 'Xác nhận nạp tiền'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
