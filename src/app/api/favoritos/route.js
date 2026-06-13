import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'user_id requerido' }, { status: 400 });
  }

 const { data, error } = await supabase
  .from('favorites')
  .select('id, user_id, drink_id, mix_id, drinks(*), mixes(*)')
  .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}


export async function POST(request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('favorites')
    .insert([body])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}