import dbConnect from '@/lib/db';
import TipoDeControle from '@/models/TipoDeControle';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const tipos = await TipoDeControle.find({}).sort({ tipo_de_controle: 1 });
    return NextResponse.json({ success: true, data: tipos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const tipo = await TipoDeControle.create(body);
    return NextResponse.json({ success: true, data: tipo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
