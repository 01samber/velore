import { useCallback, useEffect, useMemo, useState } from 'react'
import { Package } from 'lucide-react'

import { adminProductService } from '../services/adminProductService'
import CRMPageHeader from '../shared/CRMPageHeader'
import CRMSectionCard from '../shared/CRMSectionCard'
import CRMSearchInput from '../shared/CRMSearchInput'
import CRMLoadingState from '../shared/CRMLoadingState'
import CRMErrorState from '../shared/CRMErrorState'
import CRMEmptyState from '../shared/CRMEmptyState'
import CRMDataTable from '../shared/CRMDataTable'
import CRMStatusBadge from '../shared/CRMStatusBadge'
import CRMActionButton from '../shared/CRMActionButton'

export default function CRMProducts() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [state, setState] = useState({ loading: true, error: null, rows: [], pagination: null })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const res = await adminProductService.list({ page, limit: 20, search })
      setState({ loading: false, error: null, rows: res.data || [], pagination: res.pagination || null })
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e?.message || e?.error || 'Failed to load products' }))
    }
  }, [page, search])

  useEffect(() => {
    load()
  }, [load])

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Product',
        cell: (p) => (
          <div className="flex items-center gap-3 min-w-[240px]">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">{p.name}</div>
              <div className="text-xs text-slate-500 truncate">#{p.id}</div>
            </div>
          </div>
        ),
      },
      { key: 'brand', header: 'Brand', cell: (p) => <span className="text-slate-700">{p.brand || '—'}</span> },
      { key: 'category', header: 'Category', cell: (p) => <span className="text-slate-700">{p.category || '—'}</span> },
      {
        key: 'price',
        header: 'Price',
        cell: (p) => <span className="font-semibold tabular-nums">${Number(p.price || 0).toFixed(2)}</span>,
      },
      {
        key: 'variants_count',
        header: 'Variants',
        cell: (p) => <span className="text-slate-700 tabular-nums">{p.variants_count ?? '—'}</span>,
      },
      {
        key: 'is_active',
        header: 'Status',
        cell: (p) =>
          p.is_active ? (
            <CRMStatusBadge tone="success">Active</CRMStatusBadge>
          ) : (
            <CRMStatusBadge tone="danger">Inactive</CRMStatusBadge>
          ),
      },
    ],
    []
  )

  const paginationUi = state.pagination ? (
    <div className="flex items-center justify-between gap-3 text-xs text-slate-600">
      <div>
        Page <span className="font-semibold">{state.pagination.page}</span> of{' '}
        <span className="font-semibold">{state.pagination.pages}</span> ·{' '}
        <span className="font-semibold">{state.pagination.total}</span> total
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
          disabled={state.pagination.page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <button
          type="button"
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
          disabled={state.pagination.page >= state.pagination.pages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  ) : null

  return (
    <div className="space-y-6">
      <CRMPageHeader
        title="Products"
        subtitle="Real product data from the backend admin endpoint."
        right={
          <CRMActionButton tone="secondary" disabled>
            Add product (coming soon)
          </CRMActionButton>
        }
      />

      <CRMSectionCard
        title="Product catalog"
        subtitle="Search by product name"
        right={<div className="w-72 max-w-full"><CRMSearchInput value={search} onChange={(v) => { setPage(1); setSearch(v) }} placeholder="Search products…" /></div>}
      >
        {state.loading ? <CRMLoadingState label="Loading products…" /> : null}
        {!state.loading && state.error ? <CRMErrorState message={state.error} onRetry={load} /> : null}
        {!state.loading && !state.error && state.rows.length === 0 ? (
          <CRMEmptyState title="No products found" message="Try adjusting your search." />
        ) : null}
        {!state.loading && !state.error && state.rows.length > 0 ? (
          <div className="space-y-4">
            <CRMDataTable columns={columns} rows={state.rows} rowKey={(r) => r.id} />
            {paginationUi}
          </div>
        ) : null}
      </CRMSectionCard>
    </div>
  )
}

