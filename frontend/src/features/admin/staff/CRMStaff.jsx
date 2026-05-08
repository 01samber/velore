import { useCallback, useEffect, useMemo, useState } from 'react'
import { ShieldCheck } from 'lucide-react'

import { adminStaffService } from '../services/adminStaffService'
import CRMPageHeader from '../shared/CRMPageHeader'
import CRMSectionCard from '../shared/CRMSectionCard'
import CRMLoadingState from '../shared/CRMLoadingState'
import CRMErrorState from '../shared/CRMErrorState'
import CRMEmptyState from '../shared/CRMEmptyState'
import CRMDataTable from '../shared/CRMDataTable'
import CRMActionButton from '../shared/CRMActionButton'
import CRMUnavailableState from '../shared/CRMUnavailableState'
import CRMStatusBadge from '../shared/CRMStatusBadge'

export default function CRMStaff() {
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'staff_admin' })
  const [state, setState] = useState({ loading: true, error: null, rows: [] })

  const load = useCallback(async () => {
    setState({ loading: true, error: null, rows: [] })
    try {
      const res = await adminStaffService.list()
      setState({ loading: false, error: null, rows: res.data || [] })
    } catch (e) {
      setState({ loading: false, error: e?.message || e?.error || 'Failed to load staff accounts', rows: [] })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const columns = useMemo(
    () => [
      {
        key: 'email',
        header: 'Staff',
        cell: (a) => (
          <div className="min-w-[260px]">
            <div className="font-semibold">{a.email}</div>
            <div className="text-xs text-slate-500">{a.name || '—'}</div>
          </div>
        ),
      },
      {
        key: 'role',
        header: 'Role',
        cell: (a) => (
          <CRMStatusBadge tone={a.role === 'super_admin' ? 'warning' : 'neutral'}>
            {a.role}
          </CRMStatusBadge>
        ),
      },
      {
        key: 'created_at',
        header: 'Created',
        cell: (a) => <span className="text-slate-700">{a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</span>,
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <CRMPageHeader
        title="Staff"
        subtitle="Super Admin only. Manage staff accounts supported by backend."
      />

      <CRMUnavailableState
        title="Not yet supported: freeze/reset/delete staff"
        message="Backend and DB do not support disabling staff accounts or password resets yet (e.g., missing admin.is_active). This CRM page only supports list + create."
      />

      <CRMSectionCard title="Create staff admin" subtitle="Creates a new admin account (Super Admin only).">
        {createError ? (
          <div className="mb-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
            {createError}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Email"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
          />
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Name (optional)"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
          />
          <input
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Password"
            type="password"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
          />
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
          >
            <option value="staff_admin">staff_admin</option>
            <option value="super_admin">super_admin</option>
          </select>
        </div>
        <div className="mt-4">
          <CRMActionButton
            disabled={creating || !form.email || !form.password}
            onClick={async () => {
              setCreateError(null)
              setCreating(true)
              try {
                await adminStaffService.create(form)
                setForm({ email: '', password: '', name: '', role: 'staff_admin' })
                await load()
              } catch (e) {
                setCreateError(e?.message || e?.error || 'Failed to create staff account')
              } finally {
                setCreating(false)
              }
            }}
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            {creating ? 'Creating…' : 'Create staff'}
          </CRMActionButton>
        </div>
      </CRMSectionCard>

      <CRMSectionCard title="Staff accounts" subtitle="Real data from GET /api/v1/admin/admins">
        {state.loading ? <CRMLoadingState label="Loading staff…" /> : null}
        {!state.loading && state.error ? <CRMErrorState message={state.error} onRetry={load} /> : null}
        {!state.loading && !state.error && state.rows.length === 0 ? (
          <CRMEmptyState title="No staff accounts" message="Create a staff account to see it listed here." />
        ) : null}
        {!state.loading && !state.error && state.rows.length > 0 ? (
          <CRMDataTable columns={columns} rows={state.rows} rowKey={(r) => r.id} />
        ) : null}
      </CRMSectionCard>
    </div>
  )
}

