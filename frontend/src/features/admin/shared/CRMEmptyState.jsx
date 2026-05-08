import { Info } from 'lucide-react'

export default function CRMEmptyState({ title = 'Nothing here yet', message }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
          <Info className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">{title}</div>
          {message ? <div className="text-sm text-slate-600 mt-1">{message}</div> : null}
        </div>
      </div>
    </div>
  )
}

