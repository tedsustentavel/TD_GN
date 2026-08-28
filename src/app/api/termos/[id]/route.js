import dbConnect from '@/lib/db';
import Termo from '@/models/Termo';
import Status from '@/models/Status';
import Colaborador from '@/models/Colaborador';
import Tag from '@/models/Tag';
import { verifySession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Verificação de autenticação e papel de administrador
    const sessionCookie = request.cookies.get('colaborador_session');
    let isAdmin = false;
    if (sessionCookie) {
      const payload = await verifySession(sessionCookie.value);
      if (payload && payload.isAdmin) {
        isAdmin = true;
      }
    }

    const termo = await Termo.findById(id)
      .populate('status_id')
      .populate('owner_id')
      .populate('steward_id')
      .populate('tags')
      .populate('termos_relacionados');

    if (!termo) {
      return NextResponse.json({ success: false, error: 'Termo não encontrado' }, { status: 404 });
    }

    // Se o usuário não for administrador, verificar se o status do termo é 'Publicado' ou 'Em obsolescência'
    if (!isAdmin) {
      const statusName = termo.status_id?.status;
      if (statusName !== 'Publicado' && statusName !== 'Em obsolescência') {
        return NextResponse.json({ success: false, error: 'Acesso negado. Apenas administradores podem ver este termo.' }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, data: termo });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const termo = await Termo.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!termo) {
      return NextResponse.json({ success: false, error: 'Termo não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: termo });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const termo = await Termo.findByIdAndDelete(id);

    if (!termo) {
      return NextResponse.json({ success: false, error: 'Termo não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
