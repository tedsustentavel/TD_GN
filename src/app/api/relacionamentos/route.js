import dbConnect from '@/lib/db';
import Relacionamento from '@/models/Relacionamento';
import TipoDeRelacionamento from '@/models/TipoDeRelacionamento';
import Tabela from '@/models/Tabela';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const relacionamentos = await Relacionamento.find({})
      .populate('tipo_de_relacionamento_id')
      .populate('tabela_origem_id')
      .populate('tabela_destino_id')
      .sort({ criado_em: -1 });
    return NextResponse.json({ success: true, data: relacionamentos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const relacionamento = await Relacionamento.create(body);
    return NextResponse.json({ success: true, data: relacionamento }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
