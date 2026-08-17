import dbConnect from '@/lib/db';
import Termo from '@/models/Termo';
import Status from '@/models/Status';
import Colaborador from '@/models/Colaborador';
import Tag from '@/models/Tag';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const statusFilter = searchParams.get('status');
    const tagFilter = searchParams.get('tag');

    let query = {};

    // Filtro por texto geral (termo, definição, acrônimo ou sinônimo)
    if (q) {
      query.$or = [
        { termo: { $regex: q, $options: 'i' } },
        { acronimos: { $regex: q, $options: 'i' } },
        { sinonimos: { $regex: q, $options: 'i' } },
        { definicao: { $regex: q, $options: 'i' } }
      ];
    }

    // Filtro por Status
    if (statusFilter) {
      query.status_id = statusFilter;
    }

    // Filtro por Tag
    if (tagFilter) {
      query.tags = tagFilter;
    }

    const termos = await Termo.find(query)
      .populate('status_id')
      .populate('owner_id')
      .populate('steward_id')
      .populate('tags')
      .sort({ termo: 1 });

    return NextResponse.json({ success: true, data: termos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newTermo = await Termo.create(body);
    return NextResponse.json({ success: true, data: newTermo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
