import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Location } from '@/lib/types';

// Fallback seed locations for offline/local state
const SEED_LOCATIONS: Location[] = [
  { id: 'loc-1', name: 'Bole', sub_city: 'Bole' },
  { id: 'loc-2', name: 'Megenagna', sub_city: 'Yeka' },
  { id: 'loc-3', name: 'Piazza', sub_city: 'Arada' },
  { id: 'loc-4', name: 'Mexico', sub_city: 'Kirkos' },
  { id: 'loc-5', name: '4 Kilo', sub_city: 'Arada' },
  { id: 'loc-6', name: 'Gotera', sub_city: 'Nifas Silk-Lafto' },
  { id: 'loc-7', name: 'Kality', sub_city: 'Akaki-Kality' },
  { id: 'loc-8', name: 'Saris', sub_city: 'Akaki-Kality' },
  { id: 'loc-9', name: 'CMC', sub_city: 'Yeka' },
  { id: 'loc-10', name: 'Ayat', sub_city: 'Yeka' },
];

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ locations: data, source: 'supabase' });
      }
    }
  } catch (err) {
    console.warn('Supabase fetch failed for locations, serving fallback seed.', err);
  }

  return NextResponse.json({ locations: SEED_LOCATIONS, source: 'seed' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, sub_city } = body;

    if (!name || !sub_city) {
      return NextResponse.json(
        { error: 'Both name and sub_city are required.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('locations')
        .insert([{ name, sub_city }])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ location: data, success: true }, { status: 201 });
    }

    // In-memory fallback create for local mode
    const newLocation: Location = {
      id: `loc-${Date.now()}`,
      name,
      sub_city,
    };
    SEED_LOCATIONS.push(newLocation);

    return NextResponse.json({ location: newLocation, success: true, note: 'Saved in local fallback' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
