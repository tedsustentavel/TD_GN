import dbConnect from '@/lib/db';
import Source from '@/models/Source';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const sources = await Source.find({}).sort({ nome: 1 });
    return NextResponse.json({ success: true, data: sources });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const source = await Source.create(body);
    return NextResponse.json({ success: true, data: source }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
