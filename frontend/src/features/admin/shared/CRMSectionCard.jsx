export default function CRMSectionCard({ title, subtitle, children, right }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl">
      {(title || right) && (
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title ? <div className="text-sm font-semibold">{title}</div> : null}
            {subtitle ? <div className="text-xs text-slate-500 mt-1">{subtitle}</div> : null}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

