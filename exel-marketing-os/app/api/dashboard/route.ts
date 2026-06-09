import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { aggregateKPIs, buildChannelSummaries, buildFunnelData } from '@/lib/calculations'
import type { MonthlyRecord } from '@/types'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const month_key = searchParams.get('month_key') || ''

  const { data, error } = await supabase
    .from('monthly_marketing_records')
    .select('*, channel:channels(*)')
    .eq('month_key', month_key)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const records = (data || []) as MonthlyRecord[]
  const kpis = aggregateKPIs(records)
  const channelSummaries = buildChannelSummaries(records)
  const funnel = buildFunnelData(records)

  return NextResponse.json({ kpis, channelSummaries, funnel, recordCount: records.length })
}
