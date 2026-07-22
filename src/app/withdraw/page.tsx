'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function WithdrawPage() {
  const [amount, setAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [profileId, setProfileId] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const phone = localStorage.getItem('userPhone') || ''
    setUserPhone(phone)

    async function loadUserWallet() {
      try {
        const supabase = createClient()
        if (phone) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, wallets(*)')
            .eq('phone', phone)
            .single()

          if (profile) {
            setProfileId(profile.id)
            setBankName(profile.bank_name || '')
            setAccountName(profile.bank_account_name || '')
            setAccountNumber(profile.bank_account_number || '')
            if (profile.wallets) {
              setUserBalance(profile.wallets.balance || 0)
            }
          }
        }
      } catch (e) {
        console.log('Error loading user wallet:', e)
      }
    }
    loadUserWallet()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const withdrawVal = parseFloat(amount)

    if (withdrawVal > userBalance) {
      setErrorMsg('⚠️ Số dư khả dụng trong ví không đủ để thực hiện lệnh rút tiền này!')
      setLoading(false)
      return
    }

    if (withdrawVal < 100000) {
      setErrorMsg('⚠️ Số tiền rút tối thiểu là 100,000 VND!')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // 1. Deduct balance from wallet
      const newBalance = userBalance - withdrawVal
      const { error: walletErr } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', profileId)

      if (walletErr) throw walletErr

      // 2. Insert withdrawal request
      const { error: withdrawErr } = await supabase
        .from('withdrawals')
        .insert({
          user_id: profileId,
          amount: withdrawVal,
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNumber,
          status: 'pending'
        })

      if (withdrawErr) {
        // Rollback balance if insert failed
        await supabase
          .from('wallets')
          .update({ balance: userBalance })
          .eq('user_id', profileId)
        throw withdrawErr
      }

      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Lỗi gửi yêu cầu rút tiền!')
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
        <div style={{ fontSize: 80, marginBottom: 20 }}>💸</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>
          Yêu cầu rút tiền thành công!
        </div>
        <div style={{ fontSize: 15, color: '#6B7280', marginBottom: 32, lineHeight: 1.6 }}>
          Lệnh rút tiền của bạn đang chờ quản trị viên phê duyệt. Tiền sẽ được chuyển về tài khoản ngân hàng của bạn ngay khi được duyệt.
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

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
            {errorMsg}
          </div>
        )}

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
                style={{ width: '100%', padding: '12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 15, boxSizing: 'border-box', outline: 'none' }}
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
                style={{ width: '100%', padding: '12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 15, boxSizing: 'border-box', outline: 'none', background: 'white' }}
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
                style={{ width: '100%', padding: '12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 15, boxSizing: 'border-box', outline: 'none' }}
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
                style={{ width: '100%', padding: '12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 15, boxSizing: 'border-box', outline: 'none', fontFamily: 'monospace' }}
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
