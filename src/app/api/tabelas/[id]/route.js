import dbConnect from '@/lib/db';
import Tabela from '@/models/Tabela';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const tabela = await Tabela.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!tabela) {
      return NextResponse.json({ success: false, error: 'Tabela não encontrada' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: tabela });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const result = await Tabela.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Tabela não encontrada' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
