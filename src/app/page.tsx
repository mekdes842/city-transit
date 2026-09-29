'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SearchForm from '@/components/SearchForm';
import ItineraryCard from '@/components/ItineraryCard';
import { Location, RouteResult } from '@/lib/types';

// Mock location data (matches Addis Ababa sub-cities)
const MOCK_LOCATIONS: Location[] = [
  { id: 'loc-1', name: 'Bole', sub_city: 'Bole' },
  { id: 'loc-2', name: 'Megenagna', sub_city: 'Yeka' },
  { id: 'loc-3', name: 'Piazza', sub_city: 'Arada' },
  { id: 'loc-4', name: 'Mexico', sub_city: 'Kirkos' },
  { id: 'loc-5', name: '4 Kilo', sub_city: 'Arada' },
  { id: 'loc-6', name: 'Gotera', sub_city: 'Nifas Silk-Lafto' },
  { id: 'loc-7', name: 'Kality', sub_city: 'Akaki-Kality' },
];

// Mock route data
const ALL_MOCK_ROUTES: RouteResult[] = [
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
  {
    route_id: '3',
    route_name: 'Megenagna to Mexico Express',
    vehicle_type: 'Sheger Bus',
    origin_stop: 'loc-2',
    destination_stop: 'loc-4',
    total_fare: 12.0,
    stops_breakdown: ['Megenagna', '4 Kilo', 'Mexico'],
  },
];

export default function Home() {
  const [filteredRoutes, setFilteredRoutes] = useState<RouteResult[]>(ALL_MOCK_ROUTES);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (originId: string, destinationId: string) => {
    setHasSearched(true);
    // Filter routes that contain the origin/destination or match the endpoints
    const matches = ALL_MOCK_ROUTES.filter(
      (route) => route.origin_stop === originId || route.destination_stop === destinationId
    );
    setFilteredRoutes(matches.length > 0 ? matches : ALL_MOCK_ROUTES);
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

        {/* Search Component */}
        <SearchForm locations={MOCK_LOCATIONS} onSearch={handleSearch} />

        {/* Results Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              {hasSearched ? 'Search Results' : 'Available Routes'}
            </h2>
            <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
              {filteredRoutes.length} options found
            </span>
          </div>

          {filteredRoutes.map((route) => (
            <ItineraryCard key={route.route_id} route={route} />
          ))}
        </div>
      </div>
    </main>
  );
}