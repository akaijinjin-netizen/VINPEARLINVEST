'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/BottomNav'

export default function UserBankPage() {
  const [activeTab, setActiveTab] = useState<'verify' | 'password'>('verify')
  
  // Profile Info Form States
  const [profileId, setProfileId] = useState('')
  const [loginPhone, setLoginPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [address, setAddress] = useState('')
  const [phoneNum, setPhoneNum] = useState('')
  const [idCard, setIdCard] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')

  // Password Reset Form States
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(true)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const phone = localStorage.getItem('userPhone') || ''
    setLoginPhone(phone)

    async function loadUserBankInfo() {
      try {
        const supabase = createClient()
        if (phone) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('phone', phone)
            .single()

          if (profile) {
            setProfileId(profile.id)
            setFullName(profile.full_name || '')
            setAddress(profile.address || '')
            setPhoneNum(profile.phone || '')
            setIdCard(profile.id_card || '')
            setBankName(profile.bank_name || '')
            setAccountName(profile.bank_account_name || '')
            setAccountNumber(profile.bank_account_number || '')
          }
        }
      } catch (e) {
        console.log('Error loading profile info:', e)
      } finally {
        setLoading(false)
      }
    }
    loadUserBankInfo()
  }, [])

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          address: address,
          phone: phoneNum,
          id_card: idCard,
          bank_name: bankName,
          bank_account_name: accountName,
          bank_account_number: accountNumber
        })
        .eq('id', profileId)

      if (error) throw error
      
      setSuccessMsg('✓ Cập nhật thông tin xác thực thành công!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Lỗi cập nhật thông tin!')
      setTimeout(() => setErrorMsg(''), 3500)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (newPassword !== confirmPassword) {
      setErrorMsg('⚠️ Mật khẩu xác nhận không khớp!')
      return
    }

    try {
      const supabase = createClient()
      // Store in profiles table password column if it exists
      const { error } = await supabase
        .from('profiles')
        .update({
          password: newPassword
        })
        .eq('id', profileId)

      if (error) throw error

      setSuccessMsg('✓ Đổi mật khẩu tài khoản thành công!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Lỗi đổi mật khẩu!')
      setTimeout(() => setErrorMsg(''), 3500)
    }
  }

  return (
    <div className="app-container" style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: 90 }}>
      {/* Vingroup Logo Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <Link href="/cua-toi" style={{
          position: 'absolute',
          left: 16,
          fontSize: 20,
          color: '#4B5563',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>←</Link>
        <img src="/top-brand-logo.png" alt="Vingroup" style={{ height: 40, objectFit: 'contain' }} />
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        background: '#F1F5F9',
        padding: '4px',
        margin: '16px',
        borderRadius: 12,
        gap: 4
      }}>
        <button
          onClick={() => { setActiveTab('verify'); setSuccessMsg(''); setErrorMsg(''); }}
          style={{
            flex: 1,
            padding: '10px 4px',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            background: activeTab === 'verify' ? 'white' : 'transparent',
            color: activeTab === 'verify' ? '#1E293B' : '#3B82F6',
            cursor: 'pointer',
            boxShadow: activeTab === 'verify' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          Xác thực thông tin
        </button>
        <button
          onClick={() => { setActiveTab('password'); setSuccessMsg(''); setErrorMsg(''); }}
          style={{
            flex: 1,
            padding: '10px 4px',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            background: activeTab === 'password' ? 'white' : 'transparent',
            color: activeTab === 'password' ? '#1E293B' : '#3B82F6',
            cursor: 'pointer',
            boxShadow: activeTab === 'password' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          Đổi mật khẩu
        </button>
      </div>

      {/* Success/Error Alerts */}
      <div style={{ padding: '0 16px' }}>
        {successMsg && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
            {errorMsg}
          </div>
        )}
      </div>

      {/* Form Content */}
      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontSize: 14 }}>
            Đang tải dữ liệu...
          </div>
        ) : activeTab === 'verify' ? (
          <form onSubmit={handleUpdateInfo} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Tên người dùng (Số điện thoại đăng nhập)</label>
              <input
                type="text"
                value={loginPhone}
                disabled
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', background: '#F1F5F9', color: '#64748B', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Tên người dùng</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Nhập họ và tên..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', color: '#1E293B', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Địa chỉ</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Nhập địa chỉ của bạn..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', color: '#1E293B', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Số điện thoại</label>
              <input
                type="tel"
                value={phoneNum}
                onChange={e => setPhoneNum(e.target.value)}
                placeholder="Nhập số điện thoại..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', color: '#1E293B', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Số CCCD *</label>
              <input
                type="text"
                value={idCard}
                onChange={e => setIdCard(e.target.value)}
                placeholder="Nhập số căn cước công dân..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', color: '#1E293B', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Số tài khoản</label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="Nhập số tài khoản ngân hàng..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', color: '#1E293B', fontFamily: 'monospace', fontWeight: 600, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Ngân hàng</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                placeholder="Ví dụ: vietcombank, acb..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', color: '#1E293B', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Chủ tài khoản</label>
              <input
                type="text"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                placeholder="Nhập tên chủ tài khoản (Viết hoa không dấu)..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', color: '#1E293B', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#0068FF',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '14px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 8,
                boxShadow: '0 4px 12px rgba(0, 104, 255, 0.15)'
              }}
            >
              Cập nhật thông tin
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Mật khẩu cũ</label>
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', color: '#1E293B', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', color: '#1E293B', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', display: 'block', marginBottom: 4 }}>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', color: '#1E293B', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#0068FF',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '14px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 8,
                boxShadow: '0 4px 12px rgba(0, 104, 255, 0.15)'
              }}
            >
              Đổi mật khẩu
            </button>
          </form>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
