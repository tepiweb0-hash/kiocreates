import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const secret = request.headers.get('x-revalidate-secret');
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');
  return NextResponse.json({ ok: true, revalidated_at: new Date().toISOString() });
}
