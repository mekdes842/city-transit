'use client';

import { useState } from 'react';
import { Location } from '@/lib/types';
import { Search, MapPin } from 'lucide-react';

interface Props {
  locations: Location[];
  onSearch: (originId: string, destinationId: string) => void;
}

export default function SearchForm({ locations, onSearch }: Props) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      onSearch(origin, destination);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Origin Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Starting Location (Origin)
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none"
              required
            >
              <option value="">Select Origin...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.sub_city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Destination Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Destination Location
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none"
              required
            >
              <option value="">Select Destination...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.sub_city})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <Search className="w-5 h-5" />
        <span>Find Routes & Calculate Fare</span>
      </button>
    </form>
  );
}