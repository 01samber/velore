import { AlertTriangle } from 'lucide-react'

export default function CRMErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">{title}</div>
          {message ? <div className="text-sm text-slate-600 mt-1">{message}</div> : null}
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Retry
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

