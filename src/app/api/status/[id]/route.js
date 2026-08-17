import dbConnect from '@/lib/db';
import Status from '@/models/Status';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const result = await Status.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Status não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
