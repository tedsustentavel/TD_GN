import dbConnect from '@/lib/db';
import Status from '@/models/Status';
import { verifySession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();

    // Verificação de autenticação e papel de administrador
    const sessionCookie = request.cookies.get('colaborador_session');
    let isAdmin = false;
    if (sessionCookie) {
      const payload = await verifySession(sessionCookie.value);
      if (payload && payload.isAdmin) {
        isAdmin = true;
      }
    }

    let filter = {};
    if (!isAdmin) {
      filter.status = { $in: ['Publicado', 'Em obsolescência'] };
    }

    const statuses = await Status.find(filter).sort({ status: 1 });
    return NextResponse.json({ success: true, data: statuses });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const statusObj = await Status.create(body);
    return NextResponse.json({ success: true, data: statusObj }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
