import dbConnect from '@/lib/db';
import Tag from '@/models/Tag';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const result = await Tag.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Tag não encontrada' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
