import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Route } from '@/lib/types';

const SEED_ROUTES_LIST = [
  {
    id: 'a1b2c3d4-0001-0000-0000-000000000001',
    route_name: 'Bole to Piazza Direct',
    vehicle_type: 'Minibus Taxi',
    base_fare: 25.0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'a1b2c3d4-0002-0000-0000-000000000002',
    route_name: 'Megenagna to Mexico Express',
    vehicle_type: 'Sheger Bus',
    base_fare: 12.0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'a1b2c3d4-0003-0000-0000-000000000003',
    route_name: 'Kality to 4 Kilo Rail Line',
    vehicle_type: 'Light Rail',
    base_fare: 20.0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'a1b2c3d4-0004-0000-0000-000000000004',
    route_name: 'Ayat to Mexico Commuter',
    vehicle_type: 'Anbessa Bus',
    base_fare: 18.0,
    created_at: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('routes')
        .select(`
          *,
          route_stops (
            id,
            stop_order,
            fare_from_start,
            location_id,
            locations ( name, sub_city )
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ routes: data, source: 'supabase' });
      }
    }
  } catch (err) {
    console.warn('Supabase fetch routes failed, serving seed data.', err);
  }

  return NextResponse.json({ routes: SEED_ROUTES_LIST, source: 'seed' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { route_name, vehicle_type, stops } = body;

    if (!route_name || !vehicle_type) {
      return NextResponse.json(
        { error: 'route_name and vehicle_type are required.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      // 1. Create the main route
      const { data: newRoute, error: routeError } = await supabase
        .from('routes')
        .insert([{ route_name, vehicle_type }])
        .select()
        .single();

      if (routeError) {
        return NextResponse.json({ error: routeError.message }, { status: 500 });
      }

      // 2. Insert stops if provided
      if (stops && Array.isArray(stops) && stops.length > 0) {
        const stopsPayload = stops.map((stop: any, idx: number) => ({
          route_id: newRoute.id,
          location_id: stop.location_id,
          stop_order: idx + 1,
          fare_from_start: stop.fare_from_start || 0,
        }));

        const { error: stopsError } = await supabase
          .from('route_stops')
          .insert(stopsPayload);

        if (stopsError) {
          console.error('Error inserting route_stops:', stopsError);
        }
      }

      return NextResponse.json({ route: newRoute, success: true }, { status: 201 });
    }

    // In-memory fallback
    const fallbackRoute = {
      id: `route-${Date.now()}`,
      route_name,
      vehicle_type,
      base_fare: stops && stops.length > 0 ? stops[stops.length - 1].fare_from_start || 15 : 15,
      created_at: new Date().toISOString(),
    };
    SEED_ROUTES_LIST.unshift(fallbackRoute);

    return NextResponse.json(
      { route: fallbackRoute, success: true, note: 'Saved in local memory fallback' },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
