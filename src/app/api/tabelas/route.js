import dbConnect from '@/lib/db';
import Tabela from '@/models/Tabela';
import TipoDeTabela from '@/models/TipoDeTabela';
import Source from '@/models/Source';
import Colaborador from '@/models/Colaborador';
import TipoDeAtributo from '@/models/TipoDeAtributo';
import TipoDeControle from '@/models/TipoDeControle';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const tabelas = await Tabela.find({})
      .populate('tipo_de_tabela_id')
      .populate('source_id')
      .populate('owner_id')
      .populate('steward_id')
      .populate('dba_id')
      .populate('atributos.tipo_de_atributo_id')
      .populate('atributos.tipo_de_controle_id')
      .sort({ nome: 1 });
    return NextResponse.json({ success: true, data: tabelas });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const tabela = await Tabela.create(body);
    return NextResponse.json({ success: true, data: tabela }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
