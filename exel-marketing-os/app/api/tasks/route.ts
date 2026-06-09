import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const monthKey = searchParams.get('month_key')
    const channelId = searchParams.get('channel_id')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const issueType = searchParams.get('issue_type')

    let query = supabase
      .from('tasks')
      .select(`
        *,
        channels (id, name, name_en)
      `)
      .order('created_at', { ascending: false })

    if (monthKey) query = query.eq('month_key', monthKey)
    if (channelId) query = query.eq('channel_id', channelId)
    if (status) query = query.eq('status', status)
    if (priority) query = query.eq('priority', priority)
    if (issueType) query = query.eq('issue_type', issueType)

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

    const {
      title,
      description,
      month_key,
      channel_id,
      issue_type = 'general',
      priority = 'medium',
      status = 'open',
      assigned_to,
      due_date,
      notes,
    } = body

    if (!title) {
      return NextResponse.json({ error: 'כותרת המשימה היא שדה חובה' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        month_key,
        channel_id: channel_id || null,
        issue_type,
        priority,
        status,
        assigned_to,
        due_date: due_date || null,
        notes,
      })
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

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    const updatePayload: Record<string, unknown> = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    if (updates.status === 'done' && !updates.completed_at) {
      updatePayload.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updatePayload)
      .eq('id', id)
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

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('tasks')
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
