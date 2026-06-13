import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  let query = supabase.from('drinks').select('*').order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}