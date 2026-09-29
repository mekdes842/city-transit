'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SearchForm from '@/components/SearchForm';
import ItineraryCard from '@/components/ItineraryCard';
import SkeletonCard from '@/components/SkeletonCard';
import { Location, RouteResult } from '@/lib/types';
import { supabase } from '@/lib/supabase';

const FALLBACK_LOCATIONS: Location[] = [
  { id: 'loc-1', name: 'Bole', sub_city: 'Bole' },
  { id: 'loc-2', name: 'Megenagna', sub_city: 'Yeka' },
  { id: 'loc-3', name: 'Piazza', sub_city: 'Arada' },
  { id: 'loc-4', name: 'Mexico', sub_city: 'Kirkos' },
  { id: 'loc-5', name: '4 Kilo', sub_city: 'Arada' },
  { id: 'loc-6', name: 'Gotera', sub_city: 'Nifas Silk-Lafto' },
  { id: 'loc-7', name: 'Kality', sub_city: 'Akaki-Kality' },
];

const FALLBACK_ROUTES: RouteResult[] = [
  {
    route_id: '1',
    route_name: 'Bole to Piazza Direct',
    vehicle_type: 'Minibus Taxi',
    origin_stop: 'loc-1',
    destination_stop: 'loc-3',
    total_fare: 25.0,
    stops_breakdown: ['Bole', 'Gotera', 'Mexico', 'Piazza'],
  },
  {
    route_id: '2',
    route_name: 'Kality to 4 Kilo Rail Line',
    vehicle_type: 'Light Rail',
    origin_stop: 'loc-7',
    destination_stop: 'loc-5',
    total_fare: 10.0,
    stops_breakdown: ['Kality', 'Saris', 'Gotera', 'Mexico', '4 Kilo'],
  },
];

export default function Home() {
  const [locations, setLocations] = useState<Location[]>(FALLBACK_LOCATIONS);
  const [filteredRoutes, setFilteredRoutes] = useState<RouteResult[]>(FALLBACK_ROUTES);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch locations on mount
  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data, error } = await supabase.from('locations').select('*');
        if (data && data.length > 0) {
          setLocations(data);
        }
      } catch (err) {
        console.log('Using local fallback locations until Supabase is live.');
      }
    }
    fetchLocations();
  }, []);

  const handleSearch = async (originId: string, destinationId: string) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      // Query routes matching origin/destination from Supabase
      const { data, error } = await supabase
        .from('routes')
        .select('*');

      if (data && data.length > 0) {
        // Map database response to UI structure
        const mapped: RouteResult[] = data.map((r) => ({
          route_id: r.id,
          route_name: r.route_name,
          vehicle_type: r.vehicle_type,
          origin_stop: originId,
          destination_stop: destinationId,
          total_fare: parseFloat(r.base_fare),
          stops_breakdown: [r.route_name],
        }));
        setFilteredRoutes(mapped);
      } else {
        // Fallback filter logic
        const matches = FALLBACK_ROUTES.filter(
          (route) => route.origin_stop === originId || route.destination_stop === destinationId
        );
        setFilteredRoutes(matches.length > 0 ? matches : FALLBACK_ROUTES);
      }
    } catch (err) {
      console.log('Query fallback executed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Addis Ababa Transit & Fare Finder
          </h1>
          <p className="text-slate-600">
            Find real-time public transport routes, fares, and stop sequences across sub-cities.
          </p>
        </div>

        <SearchForm locations={locations} onSearch={handleSearch} />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              {hasSearched ? 'Search Results' : 'Available Routes'}
            </h2>
            <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
              {isLoading ? 'Searching...' : `${filteredRoutes.length} options found`}
            </span>
          </div>

          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            filteredRoutes.map((route) => (
              <ItineraryCard key={route.route_id} route={route} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}