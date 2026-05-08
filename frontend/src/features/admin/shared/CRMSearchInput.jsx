import { Search } from 'lucide-react'

export default function CRMSearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-300"
      />
    </div>
  )
}

