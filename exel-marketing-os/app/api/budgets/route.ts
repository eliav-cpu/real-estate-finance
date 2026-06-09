import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const monthKey = searchParams.get('month_key')
    const channelId = searchParams.get('channel_id')

    let query = supabase
      .from('budgets')
      .select(`
        *,
        channels (id, name, name_en)
      `)
      .order('month_key', { ascending: false })

    if (monthKey) query = query.eq('month_key', monthKey)
    if (channelId) query = query.eq('channel_id', channelId)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { month_key, channel_id, planned_budget, notes } = body

    if (!month_key || !channel_id || planned_budget === undefined) {
      return NextResponse.json(
        { error: 'חודש, ערוץ, ותקציב הם שדות חובה' },
        { status: 400 }
      )
    }

    // Upsert: update if exists, insert if not
    const { data, error } = await supabase
      .from('budgets')
      .upsert(
        {
          month_key,
          channel_id,
          planned_budget,
          notes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'month_key,channel_id' }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Budget ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
