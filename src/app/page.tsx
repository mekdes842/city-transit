'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SearchForm from '@/components/SearchForm';
import ItineraryCard from '@/components/ItineraryCard';
import SkeletonCard from '@/components/SkeletonCard';
import { Location, RouteResult } from '@/lib/types';
import { Route as RouteIcon, Info, MapPin } from 'lucide-react';

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch Locations for Search Dropdowns
  useEffect(() => {
    async function loadLocations() {
      try {
        const res = await fetch('/api/locations');
        const data = await res.json();
        if (data.locations) {
          setLocations(data.locations);
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadLocations();
  }, []);

  // Handle Search Execution
  const handleSearch = async (originId: string, destinationId: string) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/routes/search?origin_id=${originId}&destination_id=${destinationId}`);
      const data = await res.json();
      if (data.routes) {
        setRoutes(data.routes);
      } else {
        setRoutes([]);
      }
    } catch (err) {
      console.error('Search API request failed:', err);
      setRoutes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Banner */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs mb-3">
            <RouteIcon className="w-3.5 h-3.5" /> Addis Ababa Transit Network
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Public Transport Route & Fare Finder
          </h1>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Search direct lines & transfers across Minibus Taxis, Sheger & Anbessa Buses, and Light Rail with real-time fare estimates.
          </p>
        </div>

        {/* Search Form */}
        <SearchForm locations={locations} onSearch={handleSearch} />

        {/* Results Section Header */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              {hasSearched ? 'Search Results' : 'Recommended Transit Lines'}
            </h2>
            <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
              {isLoading ? 'Calculating...' : `${routes.length} options found`}
            </span>
          </div>

          {/* Results List */}
          {isLoading || isInitialLoading ? (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : routes.length > 0 ? (
            routes.map((route) => (
              <ItineraryCard key={route.route_id} route={route} />
            ))
          ) : hasSearched ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">No Direct Route Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                No direct public transport line connects these two locations directly. Try selecting a major transit hub like Megenagna or Mexico as a transfer point.
              </p>
            </div>
          ) : (
            <div className="bg-slate-100/60 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-slate-500 text-sm font-medium">
                Select your origin and destination above to view live transit routes, exact fare rates, and stop sequences.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}