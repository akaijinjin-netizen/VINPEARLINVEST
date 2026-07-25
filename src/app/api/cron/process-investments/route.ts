import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Optional cron security verification
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

    // Trigger Supabase RPC to process all expired investments
    const { error } = await supabase.rpc('process_expired_investments')

    if (error) {
      console.error('Error processing investments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Processed expired investments successfully',
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    console.error('Process investments cron error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
