import dbConnect from '@/lib/db';
import Source from '@/models/Source';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const source = await Source.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!source) {
      return NextResponse.json({ success: false, error: 'Source não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: source });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const result = await Source.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Source não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
