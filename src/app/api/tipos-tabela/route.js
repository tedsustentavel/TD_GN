import dbConnect from '@/lib/db';
import TipoDeTabela from '@/models/TipoDeTabela';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const tipos = await TipoDeTabela.find({}).sort({ tipo_de_tabela: 1 });
    return NextResponse.json({ success: true, data: tipos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const tipo = await TipoDeTabela.create(body);
    return NextResponse.json({ success: true, data: tipo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
