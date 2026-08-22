import dbConnect from '@/lib/db';
import TipoDeAtributo from '@/models/TipoDeAtributo';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const tipo = await TipoDeAtributo.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!tipo) {
      return NextResponse.json({ success: false, error: 'Tipo não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: tipo });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const result = await TipoDeAtributo.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Tipo não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
