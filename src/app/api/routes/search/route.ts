import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { RouteResult } from '@/lib/types';

// Fallback Seed Data for route matching when Supabase isn't reachable
const SEED_LOCATIONS_MAP: Record<string, string> = {
  'loc-1': 'Bole',
  'loc-2': 'Megenagna',
  'loc-3': 'Piazza',
  'loc-4': 'Mexico',
  'loc-5': '4 Kilo',
  'loc-6': 'Gotera',
  'loc-7': 'Kality',
  'loc-8': 'Saris',
  'loc-9': 'CMC',
  'loc-10': 'Ayat',
  'Bole': 'Bole',
  'Megenagna': 'Megenagna',
  'Piazza': 'Piazza',
  'Mexico': 'Mexico',
  '4 Kilo': '4 Kilo',
  'Gotera': 'Gotera',
  'Kality': 'Kality',
  'Saris': 'Saris',
  'CMC': 'CMC',
  'Ayat': 'Ayat',
};

interface SeedRoute {
  id: string;
  name: string;
  vehicle_type: string;
  stops: { location_id: string; location_name: string; fare_from_start: number; order: number }[];
}

const SEED_ROUTES: SeedRoute[] = [
  {
    id: 'a1b2c3d4-0001-0000-0000-000000000001',
    name: 'Bole to Piazza Direct',
    vehicle_type: 'Minibus Taxi',
    stops: [
      { location_id: 'loc-1', location_name: 'Bole', fare_from_start: 0, order: 1 },
      { location_id: 'loc-6', location_name: 'Gotera', fare_from_start: 10, order: 2 },
      { location_id: 'loc-4', location_name: 'Mexico', fare_from_start: 15, order: 3 },
      { location_id: 'loc-3', location_name: 'Piazza', fare_from_start: 25, order: 4 },
    ],
  },
  {
    id: 'a1b2c3d4-0002-0000-0000-000000000002',
    name: 'Megenagna to Mexico Express',
    vehicle_type: 'Sheger Bus',
    stops: [
      { location_id: 'loc-2', location_name: 'Megenagna', fare_from_start: 0, order: 1 },
      { location_id: 'loc-5', location_name: '4 Kilo', fare_from_start: 7, order: 2 },
      { location_id: 'loc-4', location_name: 'Mexico', fare_from_start: 12, order: 3 },
    ],
  },
  {
    id: 'a1b2c3d4-0003-0000-0000-000000000003',
    name: 'Kality to 4 Kilo Rail Line',
    vehicle_type: 'Light Rail',
    stops: [
      { location_id: 'loc-7', location_name: 'Kality', fare_from_start: 0, order: 1 },
      { location_id: 'loc-8', location_name: 'Saris', fare_from_start: 5, order: 2 },
      { location_id: 'loc-6', location_name: 'Gotera', fare_from_start: 10, order: 3 },
      { location_id: 'loc-4', location_name: 'Mexico', fare_from_start: 15, order: 4 },
      { location_id: 'loc-5', location_name: '4 Kilo', fare_from_start: 20, order: 5 },
    ],
  },
  {
    id: 'a1b2c3d4-0004-0000-0000-000000000004',
    name: 'Ayat to Mexico Commuter',
    vehicle_type: 'Anbessa Bus',
    stops: [
      { location_id: 'loc-10', location_name: 'Ayat', fare_from_start: 0, order: 1 },
      { location_id: 'loc-9', location_name: 'CMC', fare_from_start: 6, order: 2 },
      { location_id: 'loc-2', location_name: 'Megenagna', fare_from_start: 10, order: 3 },
      { location_id: 'loc-4', location_name: 'Mexico', fare_from_start: 18, order: 4 },
    ],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin_id = searchParams.get('origin_id');
  const destination_id = searchParams.get('destination_id');

  if (!origin_id || !destination_id) {
    return NextResponse.json(
      { error: 'Both origin_id and destination_id query parameters are required.' },
      { status: 400 }
    );
  }

  // Attempt real Supabase query first if configured
  if (isSupabaseConfigured) {
    try {
      const results: RouteResult[] = [];

      // 1. Fetch all stops for both locations
      const { data: originStops } = await supabase
        .from('route_stops')
        .select('route_id, stop_order, fare_from_start, locations(id, name)')
        .eq('location_id', origin_id);

      const { data: destStops } = await supabase
        .from('route_stops')
        .select('route_id, stop_order, fare_from_start, locations(id, name)')
        .eq('location_id', destination_id);

      if (originStops && destStops) {
        // Find matching direct routes where origin comes before destination
        for (const oStop of originStops) {
          const dStop = destStops.find(
            (d) => d.route_id === oStop.route_id && d.stop_order > oStop.stop_order
          );

          if (dStop) {
            // Fetch route details
            const { data: routeData } = await supabase
              .from('routes')
              .select('*')
              .eq('id', oStop.route_id)
              .single();

            // Fetch all intermediate stops for this route segment
            const { data: segmentStops } = await supabase
              .from('route_stops')
              .select('stop_order, locations(name)')
              .eq('route_id', oStop.route_id)
              .gte('stop_order', oStop.stop_order)
              .lte('stop_order', dStop.stop_order)
              .order('stop_order', { ascending: true });

            const fare = Math.max(0, Number(dStop.fare_from_start) - Number(oStop.fare_from_start));
            const stopsBreakdown = segmentStops
              ? segmentStops.map((s: any) => s.locations?.name || 'Unknown Stop')
              : [];

            if (routeData) {
              results.push({
                route_id: routeData.id,
                route_name: routeData.route_name,
                vehicle_type: routeData.vehicle_type,
                origin_stop: origin_id,
                destination_stop: destination_id,
                total_fare: fare > 0 ? fare : 15.0,
                stops_breakdown: stopsBreakdown,
              });
            }
          }
        }
      }

      if (results.length > 0) {
        return NextResponse.json({ routes: results, source: 'supabase' });
      }
    } catch (err) {
      console.warn('Supabase search failed, executing fallback route search engine:', err);
    }
  }

  // Fallback In-Memory Route Matching Engine
  const matchingResults: RouteResult[] = [];

  SEED_ROUTES.forEach((route) => {
    const oStop = route.stops.find(
      (s) => s.location_id === origin_id || s.location_name === SEED_LOCATIONS_MAP[origin_id] || s.location_name === origin_id
    );
    const dStop = route.stops.find(
      (s) => s.location_id === destination_id || s.location_name === SEED_LOCATIONS_MAP[destination_id] || s.location_name === destination_id
    );

    if (oStop && dStop && oStop.order < dStop.order) {
      const fare = Math.max(0, dStop.fare_from_start - oStop.fare_from_start);
      const intermediateStops = route.stops
        .filter((s) => s.order >= oStop.order && s.order <= dStop.order)
        .map((s) => s.location_name);

      matchingResults.push({
        route_id: route.id,
        route_name: route.name,
        vehicle_type: route.vehicle_type,
        origin_stop: origin_id,
        destination_stop: destination_id,
        total_fare: fare > 0 ? fare : 15.0,
        stops_breakdown: intermediateStops,
      });
    }
  });

  // If no direct routes match, generate transfer route suggestions
  if (matchingResults.length === 0) {
    SEED_ROUTES.forEach((route1) => {
      const oStop = route1.stops.find(
        (s) => s.location_id === origin_id || s.location_name === SEED_LOCATIONS_MAP[origin_id] || s.location_name === origin_id
      );
      if (!oStop) return;

      SEED_ROUTES.forEach((route2) => {
        if (route1.id === route2.id) return;

        const dStop = route2.stops.find(
          (s) => s.location_id === destination_id || s.location_name === SEED_LOCATIONS_MAP[destination_id] || s.location_name === destination_id
        );
        if (!dStop) return;

        // Find transfer intersection stop
        const transferStop1 = route1.stops.find(
          (s1) => s1.order > oStop.order && route2.stops.some((s2) => s2.location_name === s1.location_name && s2.order < dStop.order)
        );

        if (transferStop1) {
          const transferStop2 = route2.stops.find((s2) => s2.location_name === transferStop1.location_name);
          if (transferStop2 && transferStop2.order < dStop.order) {
            const fare1 = transferStop1.fare_from_start - oStop.fare_from_start;
            const fare2 = dStop.fare_from_start - transferStop2.fare_from_start;

            const segment1 = route1.stops
              .filter((s) => s.order >= oStop.order && s.order <= transferStop1.order)
              .map((s) => s.location_name);
            const segment2 = route2.stops
              .filter((s) => s.order >= transferStop2.order && s.order <= dStop.order)
              .map((s) => s.location_name);

            matchingResults.push({
              route_id: `transfer-${route1.id}-${route2.id}`,
              route_name: `${route1.name} ➔ Transfer at ${transferStop1.location_name} ➔ ${route2.name}`,
              vehicle_type: `${route1.vehicle_type} + ${route2.vehicle_type}`,
              origin_stop: origin_id,
              destination_stop: destination_id,
              total_fare: fare1 + fare2,
              stops_breakdown: Array.from(new Set([...segment1, `(Transfer at ${transferStop1.location_name})`, ...segment2])),
              is_transfer: true,
              transfer_point: transferStop1.location_name,
            });
          }
        }
      });
    });
  }

  return NextResponse.json({ routes: matchingResults, source: 'engine' });
}
