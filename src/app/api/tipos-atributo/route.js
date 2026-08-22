import dbConnect from '@/lib/db';
import TipoDeAtributo from '@/models/TipoDeAtributo';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const tipos = await TipoDeAtributo.find({}).sort({ tipo_de_atributo: 1 });
    return NextResponse.json({ success: true, data: tipos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const tipo = await TipoDeAtributo.create(body);
    return NextResponse.json({ success: true, data: tipo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
