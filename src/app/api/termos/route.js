import dbConnect from '@/lib/db';
import Termo from '@/models/Termo';
import Status from '@/models/Status';
import Colaborador from '@/models/Colaborador';
import Tag from '@/models/Tag';
import { verifySession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const statusFilter = searchParams.get('status');
    const tagFilter = searchParams.get('tag');

    // Verificação de autenticação e papel de administrador
    const sessionCookie = request.cookies.get('colaborador_session');
    let isAdmin = false;
    if (sessionCookie) {
      const payload = await verifySession(sessionCookie.value);
      if (payload && payload.isAdmin) {
        isAdmin = true;
      }
    }

    let query = {};

    // Se o usuário não for administrador, ele só pode ver e pesquisar termos com status 'Publicado' ou 'Em obsolescência'
    if (!isAdmin) {
      const allowedStatuses = await Status.find({
        status: { $in: ['Publicado', 'Em obsolescência'] }
      });
      const allowedStatusIds = allowedStatuses.map(s => s._id.toString());

      if (statusFilter) {
        if (allowedStatusIds.includes(statusFilter)) {
          query.status_id = statusFilter;
        } else {
          // Se pediu um status não permitido, retorna vazio
          return NextResponse.json({ success: true, data: [] });
        }
      } else {
        query.status_id = { $in: allowedStatuses.map(s => s._id) };
      }
    } else {
      // Filtro por Status para admins
      if (statusFilter) {
        query.status_id = statusFilter;
      }
    }

    // Filtro por texto geral (termo, definição, acrônimo ou sinônimo)
    if (q) {
      query.$or = [
        { termo: { $regex: q, $options: 'i' } },
        { acronimos: { $regex: q, $options: 'i' } },
        { sinonimos: { $regex: q, $options: 'i' } },
        { definicao: { $regex: q, $options: 'i' } }
      ];
    }

    // Filtro por Tag
    if (tagFilter) {
      query.tags = tagFilter;
    }

    const termos = await Termo.find(query)
      .populate('status_id')
      .populate('owner_id')
      .populate('steward_id')
      .populate('tags')
      .sort({ termo: 1 });

    return NextResponse.json({ success: true, data: termos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newTermo = await Termo.create(body);
    return NextResponse.json({ success: true, data: newTermo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
