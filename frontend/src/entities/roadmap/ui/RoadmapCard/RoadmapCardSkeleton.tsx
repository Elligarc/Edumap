export function RoadmapCardSkeleton() {
  return (
    <div
      className="bg-white rounded-[4px] border border-[#cbd5e1] p-5 sm:p-6 animate-pulse"
      data-testid="roadmap-card-skeleton"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-20 bg-slate-200 rounded-[2px]" />
            <div className="h-3 w-16 bg-slate-100 rounded-[2px]" />
          </div>

          <div className="h-5 w-2/3 bg-slate-200 rounded-[2px]" />

          <div className="space-y-1.5 max-w-2xl">
            <div className="h-3.5 w-full bg-slate-100 rounded-[2px]" />
            <div className="h-3.5 w-4/5 bg-slate-100 rounded-[2px]" />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="h-3.5 w-16 bg-slate-100 rounded-[2px]" />
            <div className="h-3.5 w-24 bg-slate-100 rounded-[2px]" />
          </div>
        </div>

        <div className="flex sm:flex-col items-end justify-between sm:justify-between shrink-0 sm:self-stretch pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f1f5f9] min-w-[160px]">
          <div className="flex items-center gap-2">
            <div className="h-5 w-24 bg-slate-100 rounded-[2px]" />
            <div className="h-5 w-16 bg-slate-100 rounded-[2px]" />
          </div>

          <div className="flex items-center gap-3 mt-auto pt-2 sm:pt-4">
            <div className="h-5 w-16 bg-slate-200 rounded-[2px]" />
            <div className="h-8 w-8 bg-slate-100 rounded-[2px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
