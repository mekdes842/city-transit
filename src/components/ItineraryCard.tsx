import { RouteResult } from '@/lib/types';
import { Bus, Train, Navigation, ArrowRightLeft } from 'lucide-react';

interface Props {
  route: RouteResult;
}

export default function ItineraryCard({ route }: Props) {
  const getVehicleBadge = (type: string) => {
    if (type.includes('Rail')) {
      return { bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: Train };
    }
    if (type.includes('Bus')) {
      return { bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: Bus };
    }
    if (type.includes('+') || route.is_transfer) {
      return { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: ArrowRightLeft };
    }
    return { bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: Navigation };
  };

  const badge = getVehicleBadge(route.vehicle_type);
  const IconComponent = badge.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
              <IconComponent className="w-3.5 h-3.5" />
              {route.vehicle_type}
            </span>
            {route.is_transfer && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                1 Transfer Required
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">{route.route_name}</h3>
        </div>

        <div className="flex items-baseline gap-1 md:text-right bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 self-start md:self-auto">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Fare:</span>
          <span className="text-2xl font-black text-emerald-600">{route.total_fare.toFixed(2)}</span>
          <span className="text-xs font-extrabold text-emerald-800">ETB</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Step-by-Step Route & Stop Sequence
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700 font-medium">
          {route.stops_breakdown.map((stop, index) => {
            const isTransferStep = stop.includes('Transfer');
            const isOriginOrDest = index === 0 || index === route.stops_breakdown.length - 1;

            return (
              <span key={index} className="flex items-center gap-2">
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    isTransferStep
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                      : isOriginOrDest
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {stop}
                </span>
                {index < route.stops_breakdown.length - 1 && (
                  <span className="text-slate-300 font-bold">→</span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}