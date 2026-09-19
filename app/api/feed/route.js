import { NextResponse } from 'next/server';
import { getPosts } from '../../../lib/data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const offset = Math.max(0, Number(searchParams.get('offset') || 0));
  const limit = Math.min(24, Math.max(1, Number(searchParams.get('limit') || 12)));
  const category = searchParams.get('category') || null;
  try {
    const posts = await getPosts({ offset, limit, category });
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: 'feed_unavailable' }, { status: 500 });
  }
}
