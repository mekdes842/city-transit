'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Location, Route } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  Plus, 
  MapPin, 
  Bus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Route as RouteIcon,
  RefreshCw
} from 'lucide-react';

export default function AdminPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Location Form State
  const [locName, setLocName] = useState('');
  const [locSubCity, setLocSubCity] = useState('');
  const [isSubmittingLoc, setIsSubmittingLoc] = useState(false);

  // New Route Form State
  const [routeName, setRouteName] = useState('');
  const [vehicleType, setVehicleType] = useState('Minibus Taxi');
  const [routeStops, setRouteStops] = useState<{ location_id: string; fare_from_start: number }[]>([
    { location_id: '', fare_from_start: 0 },
    { location_id: '', fare_from_start: 15 },
  ]);
  const [isSubmittingRoute, setIsSubmittingRoute] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'routes' | 'locations' | 'add-route' | 'add-loc'>('add-route');

  // Load locations and routes
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Locations
      const locRes = await fetch('/api/locations');
      const locData = await locRes.json();
      if (locData.locations) setLocations(locData.locations);

      // 2. Fetch Routes
      const routeRes = await fetch('/api/routes');
      const routeData = await routeRes.json();
      if (routeData.routes) setRoutes(routeData.routes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Location Creation
  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locName || !locSubCity) return;

    setIsSubmittingLoc(true);
    setMessage(null);

    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: locName, sub_city: locSubCity }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Location "${locName}" created successfully!` });
        setLocName('');
        setLocSubCity('');
        fetchData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create location.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error creating location.' });
    } finally {
      setIsSubmittingLoc(false);
    }
  };

  // Handle Route Creation
  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName || !vehicleType) return;

    const validStops = routeStops.filter((s) => s.location_id !== '');
    if (validStops.length < 2) {
      setMessage({ type: 'error', text: 'Please select at least 2 stops for the route sequence.' });
      return;
    }

    setIsSubmittingRoute(true);
    setMessage(null);

    try {
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route_name: routeName,
          vehicle_type: vehicleType,
          stops: validStops,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Route "${routeName}" created successfully!` });
        setRouteName('');
        setVehicleType('Minibus Taxi');
        setRouteStops([
          { location_id: '', fare_from_start: 0 },
          { location_id: '', fare_from_start: 15 },
        ]);
        fetchData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create route.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error creating route.' });
    } finally {
      setIsSubmittingRoute(false);
    }
  };

  const addStopRow = () => {
    const lastFare = routeStops.length > 0 ? routeStops[routeStops.length - 1].fare_from_start + 5 : 5;
    setRouteStops([...routeStops, { location_id: '', fare_from_start: lastFare }]);
  };

  const removeStopRow = (index: number) => {
    setRouteStops(routeStops.filter((_, i) => i !== index));
  };

  const updateStopRow = (index: number, field: 'location_id' | 'fare_from_start', value: any) => {
    const updated = [...routeStops];
    updated[index] = { ...updated[index], [field]: value };
    setRouteStops(updated);
  };

  const deleteLocation = async (id: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('locations').delete().eq('id', id);
    }
    setLocations(locations.filter((l) => l.id !== id));
    setMessage({ type: 'success', text: 'Location removed.' });
  };

  const deleteRoute = async (id: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('routes').delete().eq('id', id);
    }
    setRoutes(routes.filter((r) => r.id !== id));
    setMessage({ type: 'success', text: 'Route removed.' });
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                Admin Control Portal
              </span>
              {isSupabaseConfigured ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Supabase Live
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Offline/Fallback Mode
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black text-slate-900">Municipal Transport Manager</h1>
            <p className="text-slate-600 text-sm mt-1">
              Add transit routes, edit stop pricing, and manage locations across Addis Ababa sub-cities.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Status Alerts */}
        {message && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-semibold border ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Locations</p>
              <h3 className="text-2xl font-black text-slate-900">{locations.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <RouteIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Routes</p>
              <h3 className="text-2xl font-black text-slate-900">{routes.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sub-cities Covered</p>
              <h3 className="text-2xl font-black text-slate-900">
                {new Set(locations.map((l) => l.sub_city)).size}
              </h3>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 space-x-2">
          <button
            onClick={() => setActiveTab('add-route')}
            className={`py-3 px-5 font-bold text-sm rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'add-route'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Plus className="w-4 h-4" /> Add Transit Route
          </button>

          <button
            onClick={() => setActiveTab('add-loc')}
            className={`py-3 px-5 font-bold text-sm rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'add-loc'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Plus className="w-4 h-4" /> Add Location
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`py-3 px-5 font-bold text-sm rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'routes'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <RouteIcon className="w-4 h-4" /> Route Directory ({routes.length})
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`py-3 px-5 font-bold text-sm rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'locations'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <MapPin className="w-4 h-4" /> Location Directory ({locations.length})
          </button>
        </div>

        {/* Tab 1: Add Route Form */}
        {activeTab === 'add-route' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Bus className="w-5 h-5 text-emerald-600" /> Create New Public Transit Line
            </h2>

            <form onSubmit={handleAddRoute}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Route Name / Number
                  </label>
                  <input
                    type="text"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="e.g. Bole to Piazza Express"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Minibus Taxi">Minibus Taxi</option>
                    <option value="Sheger Bus">Sheger Bus</option>
                    <option value="Anbessa Bus">Anbessa Bus</option>
                    <option value="Light Rail">Light Rail Line</option>
                  </select>
                </div>
              </div>

              {/* Route Stops Sequence */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Route Stops & Fare Matrix
                  </h3>
                  <button
                    type="button"
                    onClick={addStopRow}
                    className="text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Stop
                  </button>
                </div>

                <div className="space-y-3">
                  {routeStops.map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      <div className="flex-1">
                        <select
                          value={stop.location_id}
                          onChange={(e) => updateStopRow(idx, 'location_id', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none"
                          required
                        >
                          <option value="">Select Stop Location...</option>
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name} ({loc.sub_city})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-36">
                        <div className="relative">
                          <input
                            type="number"
                            step="0.5"
                            value={stop.fare_from_start}
                            onChange={(e) => updateStopRow(idx, 'fare_from_start', parseFloat(e.target.value) || 0)}
                            placeholder="Fare"
                            className="w-full pr-10 pl-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            ETB
                          </span>
                        </div>
                      </div>

                      {routeStops.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeStopRow(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingRoute}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                {isSubmittingRoute ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" /> Save Route & Push to Database
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Add Location Form */}
        {activeTab === 'add-loc' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" /> Register New Transit Hub / Stop Location
            </h2>

            <form onSubmit={handleAddLocation}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={locName}
                    onChange={(e) => setLocName(e.target.value)}
                    placeholder="e.g. Tor Hailoch, Saris, Bole Atlas"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Sub-City
                  </label>
                  <input
                    type="text"
                    value={locSubCity}
                    onChange={(e) => setLocSubCity(e.target.value)}
                    placeholder="e.g. Bole, Kirkos, Arada, Yeka"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingLoc}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                {isSubmittingLoc ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" /> Save Location to Database
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Route Directory */}
        {activeTab === 'routes' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg">Active Transport Routes Directory</h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {routes.length} total lines
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {routes.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No routes registered yet.</div>
              ) : (
                routes.map((r) => (
                  <div key={r.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {r.vehicle_type}
                        </span>
                        <h3 className="font-bold text-slate-900">{r.route_name}</h3>
                      </div>
                      <p className="text-xs text-slate-500">
                        {r.route_stops ? `${r.route_stops.length} stops recorded` : 'Standard Transit Line'}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteRoute(r.id)}
                      className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                      title="Delete Route"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Location Directory */}
        {activeTab === 'locations' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg">Locations Directory</h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {locations.length} hubs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{loc.name}</h4>
                      <p className="text-xs text-slate-500">{loc.sub_city} Sub-City</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteLocation(loc.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}