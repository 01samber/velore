export default function CRMStatusBadge({ tone = 'neutral', children }) {
  const cls =
    tone === 'success'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : tone === 'warning'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : tone === 'danger'
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : 'bg-slate-50 text-slate-700 border-slate-200'

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${cls}`}>
      {children}
    </span>
  )
}

