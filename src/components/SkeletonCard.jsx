export default function SkeletonCard() {
  return (
    <div className="bg-white/80 border border-slate-200 rounded-xl overflow-hidden animate-pulse dark:bg-slate-900/80 dark:border-slate-800">
      <div className="aspect-square bg-slate-200 dark:bg-slate-800" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 bg-slate-200 rounded dark:bg-slate-800" />
        <div className="h-3 w-1/2 bg-slate-200 rounded dark:bg-slate-800" />
        <div className="flex gap-2 pt-1">
          <div className="h-8 w-10 bg-slate-200 rounded dark:bg-slate-800" />
          <div className="h-8 w-16 bg-slate-200 rounded dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}