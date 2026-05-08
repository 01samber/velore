import CRMSkeleton from './CRMSkeleton'

export default function CRMLoadingState({ label = 'Loading…' }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600">{label}</div>
      <CRMSkeleton rows={6} />
    </div>
  )
}

