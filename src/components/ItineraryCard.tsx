import { RouteResult } from '@/lib/types';
import { Bus, Train, Navigation } from 'lucide-react';

interface Props {
  route: RouteResult;
}

export default function ItineraryCard({ route }: Props) {
  const getVehicleBadge = (type: string) => {
    switch (type) {
      case 'Light Rail':
        return { bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: Train };
      case 'Sheger Bus':
      case 'Anbessa Bus':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: Bus };
      default:
        return { bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: Navigation };
    }
  };

  const badge = getVehicleBadge(route.vehicle_type);
  const IconComponent = badge.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
            <IconComponent className="w-3.5 h-3.5" />
            {route.vehicle_type}
          </span>
          <h3 className="font-bold text-slate-800 text-lg">{route.route_name}</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-emerald-600">{route.total_fare.toFixed(2)}</span>
          <span className="text-xs font-bold text-slate-500 ml-1">ETB</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Route Stop Sequence</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700 font-medium">
          {route.stops_breakdown.map((stop, index) => (
            <span key={index} className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md ${index === 0 || index === route.stops_breakdown.length - 1 ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                {stop}
              </span>
              {index < route.stops_breakdown.length - 1 && <span className="text-slate-300">→</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}