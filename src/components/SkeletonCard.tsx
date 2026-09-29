export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-4 animate-pulse">
      {/* Header section placeholder */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-28 bg-slate-200 rounded-full"></div>
          <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
        </div>
        <div className="h-7 w-20 bg-slate-200 rounded-md"></div>
      </div>

      {/* Stops breakdown placeholder */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="h-3 w-32 bg-slate-200 rounded mb-3"></div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-20 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-4 bg-slate-200 rounded"></div>
          <div className="h-7 w-24 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-4 bg-slate-200 rounded"></div>
          <div className="h-7 w-20 bg-slate-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}