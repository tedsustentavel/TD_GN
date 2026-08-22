import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';

export async function GET(request) {
  const sessionCookie = request.cookies.get('colaborador_session');
  
  if (!sessionCookie) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  const payload = await verifySession(sessionCookie.value);
  if (!payload) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: payload,
  });
}
