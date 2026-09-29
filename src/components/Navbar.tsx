import Link from 'next/link';
import { Bus, MapPin, Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400">
          <Bus className="w-6 h-6 text-emerald-400" />
          <span>CityTransit ET</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
            <MapPin className="w-4 h-4" />
            <span>Route Finder</span>
          </Link>
          <Link href="/admin" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
            <Shield className="w-4 h-4" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}