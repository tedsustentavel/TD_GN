import dbConnect from '@/lib/db';
import Termo from '@/models/Termo';
import Status from '@/models/Status';
import { verifySession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Get session
    const sessionCookie = request.cookies.get('colaborador_session');
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado. Por favor, realize o login.' }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Sessão inválida ou expirada.' }, { status: 401 });
    }

    const userId = payload.id;
    const isAdmin = payload.isAdmin === true;

    // Find term
    const termo = await Termo.findById(id)
      .populate('status_id')
      .populate('owner_id');

    if (!termo) {
      return NextResponse.json({ success: false, error: 'Termo não encontrado.' }, { status: 404 });
    }

    const currentStatus = termo.status_id?.status;
    const ownerId = termo.owner_id?._id?.toString() || termo.owner_id?.toString();
    const isOwner = userId && ownerId && userId === ownerId;

    // Check permissions: only administrators or the owner can approve
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ success: false, error: 'Acesso negado. Apenas o proprietário (owner) ou administradores podem aprovar este termo.' }, { status: 403 });
    }

    // Check status: must be 'Em aprovação' to be approved
    if (currentStatus !== 'Em aprovação') {
      return NextResponse.json({ success: false, error: `Este termo não pode ser aprovado pois seu status atual é '${currentStatus || 'desconhecido'}'.` }, { status: 400 });
    }

    // Find "Publicado" status
    const statusPublicado = await Status.findOne({ status: 'Publicado' });
    if (!statusPublicado) {
      return NextResponse.json({ success: false, error: "Status 'Publicado' não encontrado no sistema." }, { status: 500 });
    }

    // Update term status
    termo.status_id = statusPublicado._id;
    await termo.save();

    return NextResponse.json({
      success: true,
      message: 'Termo aprovado com sucesso!',
      data: termo
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
