import { AlertTriangle } from 'lucide-react'

export default function CRMUnavailableState({ title = 'Unavailable', message, details }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">{title}</div>
          {message ? <div className="text-sm text-slate-600 mt-1">{message}</div> : null}
          {details ? (
            <pre className="mt-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-x-auto text-slate-700">
              {details}
            </pre>
          ) : null}
        </div>
      </div>
    </div>
  )
}

