export default function CRMActionButton({ tone = 'primary', disabled, children, ...props }) {
  const cls =
    tone === 'secondary'
      ? 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50'
      : tone === 'danger'
        ? 'bg-rose-600 text-white hover:bg-rose-700'
        : 'bg-slate-900 text-white hover:bg-slate-800'

  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors',
        cls,
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}

