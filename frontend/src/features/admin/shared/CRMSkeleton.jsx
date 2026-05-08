export default function CRMSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="animate-pulse space-y-3">
        <div className="h-5 w-40 rounded bg-slate-100" />
        <div className="h-4 w-64 rounded bg-slate-100" />
        <div className="pt-2 space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  )
}

