import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET: listar mezclas (todas, o filtradas por user_id)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  let query = supabase.from('mixes').select('*').order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST: crear nueva mezcla
export async function POST(request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('mixes')
    .insert([body])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}