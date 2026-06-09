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

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('category')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return as key-value map for easy consumption
    const settingsMap = (data || []).reduce(
      (acc, s) => ({ ...acc, [s.key]: s.value }),
      {} as Record<string, string>
    )

    return NextResponse.json({ data, settingsMap })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { key, value } = body

    if (!key) {
      return NextResponse.json({ error: 'Setting key is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select()
      .single()

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
    const { key, value, label, category = 'general' } = body

    if (!key || !label) {
      return NextResponse.json({ error: 'Key and label are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('settings')
      .upsert(
        { key, value, label, category, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
