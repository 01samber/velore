import { Lock } from 'lucide-react'

export default function CRMAccessDenied() {
  return (
    <div className="max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight">Access denied</h2>
            <p className="text-sm text-slate-600 mt-1">
              You do not have permission to view this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

