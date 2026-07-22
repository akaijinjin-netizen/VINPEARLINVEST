'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DepositPage() {
  const [amount, setAmount] = useState('')
  const [bill, setBill] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [userPhone, setUserPhone] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const bankInfo = {
    bank: 'ACB',
    accountName: 'CONG TY TNHH QLQ DAU TU VINGROUP QPL',
    accountNumber: '41561027'
  }

  const quickAmounts = [10_000_000, 20_000_000, 50_000_000, 100_000_000]

  useEffect(() => {
    const phone = localStorage.getItem('userPhone') || ''
    setUserPhone(phone)
  }, [])

  const transferContent = userPhone ? `NAP ${userPhone}` : 'NAPTIEN'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const supabase = createClient()
      
      // 1. Get profile ID
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .single()

      if (profileErr || !profile) {
        throw new Error('Không tìm thấy tài khoản người dùng!')
      }

      // Convert bill image to base64 if selected
      let billBase64 = ''
      if (bill) {
        billBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = error => reject(error)
          reader.readAsDataURL(bill)
        })
      }

      // 2. Insert deposit request
      const { error: insertErr } = await supabase
        .from('deposits')
        .insert({
          user_id: profile.id,
          amount: parseFloat(amount),
          bank_name: bankInfo.bank,
          transfer_content: transferContent,
          status: 'pending',
          bill_image: billBase64 || null
        })

      if (insertErr) throw insertErr

      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Lỗi gửi yêu cầu nạp tiền!')
    } finally {
      setLoading(false)
    }
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
          Chúng tôi sẽ xác nhận và cộng tiền vào tài khoản của bạn sau khi đối chiếu giao dịch thành công.
        </div>
        <Link href="/cua-toi" style={{ textDecoration: 'none', width: '100%' }}>
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
        <Link href="/cua-toi" style={{
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

        {/* Error alert */}
        {errorMsg && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
            {errorMsg}
          </div>
        )}

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
                style={{ width: '100%', padding: '12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 15, boxSizing: 'border-box', outline: 'none' }}
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
                  {transferContent}
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(transferContent)}
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
            {loading ? 'Đang xử lý...' : 'Xác nhận nạp tiền'}
          </button>
        </form>
      </div>
    </div>
  )
}
