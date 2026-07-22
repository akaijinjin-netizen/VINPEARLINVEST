import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Vercel tự động gửi header Authorization: Bearer <CRON_SECRET> khi gọi cron
// Thêm CRON_SECRET vào Vercel Environment Variables để bảo mật
export async function GET(request: NextRequest) {
  try {
    // Kiểm tra bảo mật nếu có CRON_SECRET
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret) {
      const authHeader = request.headers.get('authorization')
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Lấy tất cả ví của user đang hoạt động có số dư > 0
    const { data: wallets, error: walletErr } = await supabase
      .from('wallets')
      .select('id, user_id, balance, profiles!inner(role, status)')
      .gt('balance', 0)
      .eq('profiles.role', 'user')
      .eq('profiles.status', 'active')

    if (walletErr) {
      console.error('Error fetching wallets:', walletErr)
      return NextResponse.json({ error: walletErr.message }, { status: 500 })
    }

    if (!wallets || wallets.length === 0) {
      return NextResponse.json({ message: 'Không có ví nào cần cộng lãi', count: 0 })
    }

    const INTEREST_RATE = 0.005 // 0.5%
    let processedCount = 0
    let totalInterestPaid = 0

    for (const wallet of wallets) {
      const interest = Math.floor(wallet.balance * INTEREST_RATE)
      if (interest <= 0) continue

      // Cộng lãi vào ví
      const { error: updateErr } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance + interest })
        .eq('id', wallet.id)

      if (updateErr) {
        console.error(`Lỗi cộng lãi ví ${wallet.id}:`, updateErr)
        continue
      }

      // Ghi log lịch sử
      await supabase.from('overnight_interest_logs').insert({
        user_id: wallet.user_id,
        wallet_balance_before: wallet.balance,
        interest_amount: interest,
        interest_rate: INTEREST_RATE,
      })

      processedCount++
      totalInterestPaid += interest
    }

    console.log(`[Overnight Interest] Đã cộng lãi cho ${processedCount} tài khoản, tổng: ${totalInterestPaid.toLocaleString('vi-VN')} VND`)

    return NextResponse.json({
      success: true,
      message: `Đã cộng lãi 0.5% cho ${processedCount} tài khoản`,
      totalInterestPaid,
      processedCount,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('Overnight interest error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
