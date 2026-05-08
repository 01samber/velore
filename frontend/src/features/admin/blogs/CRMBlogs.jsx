import { useCallback, useEffect, useMemo, useState } from 'react'
import { ImageOff } from 'lucide-react'

import { adminBlogService } from '../services/adminBlogService'
import { resolveImageUrl } from '../../../shared/utils/imageUrl'
import CRMPageHeader from '../shared/CRMPageHeader'
import CRMSectionCard from '../shared/CRMSectionCard'
import CRMLoadingState from '../shared/CRMLoadingState'
import CRMErrorState from '../shared/CRMErrorState'
import CRMEmptyState from '../shared/CRMEmptyState'
import CRMDataTable from '../shared/CRMDataTable'
import CRMStatusBadge from '../shared/CRMStatusBadge'
import CRMUnavailableState from '../shared/CRMUnavailableState'

export default function CRMBlogs() {
  const [state, setState] = useState({ loading: true, error: null, rows: [] })

  const load = useCallback(async () => {
    setState({ loading: true, error: null, rows: [] })
    try {
      const res = await adminBlogService.listPublished()
      setState({ loading: false, error: null, rows: res.data || [] })
    } catch (e) {
      setState({ loading: false, error: e?.message || e?.error || 'Failed to load blogs', rows: [] })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const columns = useMemo(
    () => [
      {
        key: 'title',
        header: 'Post',
        cell: (b) => {
          const url = resolveImageUrl(b.image)
          return (
            <div className="flex items-center gap-3 min-w-[320px]">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                {url ? (
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <ImageOff className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <div className="font-semibold truncate">{b.title}</div>
                <div className="text-xs text-slate-500 truncate">{b.slug}</div>
              </div>
            </div>
          )
        },
      },
      { key: 'category', header: 'Category', cell: (b) => <span className="text-slate-700">{b.category || '—'}</span> },
      { key: 'author', header: 'Author', cell: (b) => <span className="text-slate-700">{b.author || '—'}</span> },
      {
        key: 'is_published',
        header: 'Status',
        cell: (b) => (
          <CRMStatusBadge tone={b.is_published ? 'success' : 'neutral'}>
            {b.is_published ? 'Published' : 'Unpublished'}
          </CRMStatusBadge>
        ),
      },
      {
        key: 'published_at',
        header: 'Published',
        cell: (b) => <span className="text-slate-700">{b.published_at ? new Date(b.published_at).toLocaleDateString() : '—'}</span>,
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <CRMPageHeader title="Blogs" subtitle="Published posts from the real blogs endpoint." />

      <CRMUnavailableState
        title="Drafts/unpublished posts are not available"
        message="The backend currently exposes only published blogs via GET /api/v1/blogs. To manage drafts in the CRM, add an admin list-all endpoint."
        details={['Current: GET /api/v1/blogs (published only)', 'Missing: GET /api/v1/admin/blogs (all posts)'].join('\n')}
      />

      <CRMSectionCard title="Published posts" subtitle="Real data, no mock rows">
        {state.loading ? <CRMLoadingState label="Loading blogs…" /> : null}
        {!state.loading && state.error ? <CRMErrorState message={state.error} onRetry={load} /> : null}
        {!state.loading && !state.error && state.rows.length === 0 ? (
          <CRMEmptyState title="No published posts" message="Publish a post to see it here." />
        ) : null}
        {!state.loading && !state.error && state.rows.length > 0 ? (
          <CRMDataTable columns={columns} rows={state.rows} rowKey={(r) => r.post_id} />
        ) : null}
      </CRMSectionCard>
    </div>
  )
}

