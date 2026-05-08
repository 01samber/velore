export default function CRMStatCard({ label, value, hint, icon: Icon, accent = 'teal' }) {
  const accentClass =
    accent === 'sky'
      ? 'bg-sky-50 text-sky-700'
      : accent === 'amber'
        ? 'bg-amber-50 text-amber-700'
        : accent === 'rose'
          ? 'bg-rose-50 text-rose-700'
          : 'bg-teal-50 text-teal-700'

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
          {hint ? <div className="mt-2 text-xs text-slate-600">{hint}</div> : null}
        </div>
        {Icon ? (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentClass}`}>
            <Icon className="w-5 h-5" />
          </div>
        ) : null}
      </div>
    </div>
  )
}

