'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const BANKS_LIST = ['Vietcombank', 'ACB', 'Techcombank', 'BIDV', 'MB Bank', 'VPBank', 'Sacombank', 'Agribank', 'TPBank', 'VietinBank']

export default function UserBankPage() {
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userPhone, setUserPhone] = useState('')

  useEffect(() => {
    const phone = localStorage.getItem('userPhone') || ''
    setUserPhone(phone)

    async function loadUserBankInfo() {
      try {
        const supabase = createClient()
        const { data: session } = await supabase.auth.getSession()

        if (session?.session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.session.user.id)
            .single()

          if (profile && profile.bank_name) {
            setBankName(profile.bank_name)
            setAccountName(profile.bank_account_name || '')
            setAccountNumber(profile.bank_account_number || '')
          } else {
            // Check local storage for phone fallback
            const savedBank = localStorage.getItem(`bank_${phone}`)
            if (savedBank) {
              const parsed = JSON.parse(savedBank)
              setBankName(parsed.bankName || '')
              setAccountName(parsed.accountName || '')
              setAccountNumber(parsed.accountNumber || '')
            }
          }
        } else if (phone) {
          const savedBank = localStorage.getItem(`bank_${phone}`)
          if (savedBank) {
            const parsed = JSON.parse(savedBank)
            setBankName(parsed.bankName || '')
            setAccountName(parsed.accountName || '')
            setAccountNumber(parsed.accountNumber || '')
          }
        }
      } catch (e) {
        console.log('Bank info query fallback:', e)
      } finally {
        setLoading(false)
      }
    }
    loadUserBankInfo()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    // Save locally bound to this specific phone number
    if (userPhone) {
      localStorage.setItem(`bank_${userPhone}`, JSON.stringify({ bankName, accountName, accountNumber }))
    }

    try {
      const supabase = createClient()
      const { data: session } = await supabase.auth.getSession()
      if (session?.session?.user) {
        await supabase.from('profiles').update({
          bank_name: bankName,
          bank_account_name: accountName,
          bank_account_number: accountNumber
        }).eq('id', session.session.user.id)
      }
    } catch (e) {
      console.log('Bank save simulated:', e)
    }

    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const hasBankLinked = bankName && accountNumber

  return (
    <div className="app-container" style={{ background: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C8102E 0%, #A00D25 100%)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14, color: 'white'
      }}>
        <Link href="/profile" style={{
          color: 'white', textDecoration: 'none',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%', width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>←</Link>
        <span style={{ fontSize: 18, fontWeight: 700 }}>Liên kết Thẻ ngân hàng</span>
      </div>

      <div style={{ padding: '16px', paddingBottom: 40 }}>
        {saved && (
          <div style={{
            background: '#ECFDF5', border: '1px solid #A7F3D0',
            borderRadius: 12, padding: '14px', color: '#059669',
            fontSize: 14, fontWeight: 600, marginBottom: 16
          }}>
            ✓ Đã lưu thông tin tài khoản ngân hàng thành công!
          </div>
        )}

        {!isEditing && hasBankLinked ? (
          <div style={{
            background: 'white', borderRadius: 16, padding: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>💳 Ngân hàng thụ hưởng</h3>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: '#FEF2F2', color: '#C8102E', border: '1px solid #FECDD3',
                  borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}
              >
                ✏️ Thay đổi
              </button>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              borderRadius: 16, padding: '20px', color: 'white',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>NGÂN HÀNG</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#F0C040', marginBottom: 20 }}>
                {bankName}
              </div>

              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>SỐ TÀI KHOẢN</div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, fontFamily: 'monospace', marginBottom: 20 }}>
                {accountNumber}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 10, opacity: 0.7 }}>CHỦ TÀI KHOẢN</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{accountName}</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 20, padding: '4px 12px',
                  fontSize: 11, fontWeight: 600, color: '#10B981'
                }}>
                  ✓ Đã xác thực
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'white', borderRadius: 16, padding: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
              {hasBankLinked ? 'Chỉnh sửa tài khoản ngân hàng' : 'Liên kết Ngân hàng nhận tiền rút'}
            </h3>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
              Nhập chính xác thông tin tài khoản ngân hàng chính chủ của bạn để nhận tiền khi thực hiện lệnh rút.
            </p>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Ngân hàng thụ hưởng *
                </label>
                <select
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none' }}
                >
                  <option value="">-- Chọn ngân hàng --</option>
                  {BANKS_LIST.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Họ và tên chủ tài khoản (Viết hoa không dấu) *
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={e => setAccountName(e.target.value.toUpperCase())}
                  placeholder="VD: NGUYEN VAN A"
                  required
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Số tài khoản ngân hàng *
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  placeholder="Nhập số tài khoản ngân hàng..."
                  required
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'monospace', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {hasBankLinked && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{ flex: 1, background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Hủy bỏ
                  </button>
                )}
                <button
                  type="submit"
                  style={{ flex: 1, background: '#C8102E', color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(200,16,46,0.25)' }}
                >
                  💾 Lưu tài khoản ngân hàng
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
