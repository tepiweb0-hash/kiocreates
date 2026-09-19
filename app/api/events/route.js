import { NextResponse } from 'next/server';
import { getPublicSupabase } from '../../../lib/supabase';

const EVENTS = new Set(['post_view','post_open','cta_impression','cta_click','facebook_share','copy_caption','copy_link','outbound_click']);
const ENTITIES = new Set(['post','cta','site']);

export async function POST(request) {
  try {
    const body = await request.json();
    if (!EVENTS.has(body.event_type) || !ENTITIES.has(body.entity_type)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (typeof body.session_hash !== 'string' || body.session_hash.length < 16 || body.session_hash.length > 128) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const payload = {
      event_type: body.event_type,
      entity_type: body.entity_type,
      entity_id: body.entity_id || null,
      session_hash: body.session_hash,
      path: typeof body.path === 'string' ? body.path.slice(0, 500) : null
    };
    const supabase = getPublicSupabase();
    const { error } = await supabase.from('analytics_events').insert(payload);
    if (error && error.code !== '23505') throw error;
    return NextResponse.json({ ok: true });
  } catch (_) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
