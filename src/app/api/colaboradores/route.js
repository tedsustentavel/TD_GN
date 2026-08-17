import dbConnect from '@/lib/db';
import Colaborador from '@/models/Colaborador';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const colaboradores = await Colaborador.find({}).sort({ nome: 1 });
    return NextResponse.json({ success: true, data: colaboradores });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const colaborador = await Colaborador.create(body);
    return NextResponse.json({ success: true, data: colaborador }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
