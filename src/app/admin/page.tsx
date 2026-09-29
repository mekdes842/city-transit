'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { PlusCircle, List, Bus, Shield } from 'lucide-react';

export default function AdminPage() {
  const [routeName, setRouteName] = useState('');
  const [vehicleType, setVehicleType] = useState('Minibus Taxi');
  const [stops, setStops] = useState('');
  const [baseFare, setBaseFare] = useState('');

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mock Route Created:\nName: ${routeName}\nVehicle: ${vehicleType}\nStops: ${stops}\nBase Fare: ${baseFare} ETB`);
    setRouteName('');
    setStops('');
    setBaseFare('');
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Transit System Administration</h1>
            <p className="text-slate-600 text-sm">Add and manage public transport routes, vehicle types, and fare tables.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="md:col-span-2">
            <form onSubmit={handleAddRoute} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>Create New Route</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Route Name
                  </label>
                  <input
                    type="text"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="e.g. Bole to Piazza Express"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Minibus Taxi">Minibus Taxi</option>
                    <option value="Anbessa Bus">Anbessa Bus</option>
                    <option value="Sheger Bus">Sheger Bus</option>
                    <option value="Light Rail">Light Rail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Stop Sequence (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={stops}
                    onChange={(e) => setStops(e.target.value)}
                    placeholder="e.g. Bole, Gotera, Mexico, Piazza"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Estimated Base Fare (ETB)
                  </label>
                  <input
                    type="number"
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                    placeholder="e.g. 15.00"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm mt-2"
                >
                  Publish Route to Network
                </button>
              </div>
            </form>
          </div>

          {/* Quick Stats Panel */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <List className="w-4 h-4 text-emerald-600" />
                <span>System Overview</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Active Locations</span>
                  <span className="font-bold text-slate-900">7 Sub-cities</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Active Routes</span>
                  <span className="font-bold text-slate-900">3 Lines</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Vehicle Types</span>
                  <span className="font-bold text-slate-900">4 Categories</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950 text-emerald-100 p-5 rounded-2xl border border-emerald-800">
              <div className="flex items-center gap-2 mb-2 font-bold text-emerald-400 text-sm">
                <Bus className="w-4 h-4" />
                <span>Operator Tip</span>
              </div>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Ensure stop names match exact location records to enable multi-line transfers in route search.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}