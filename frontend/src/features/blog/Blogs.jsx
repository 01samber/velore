import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../shared/services/apiClient'
import { extractApiError } from '../../shared/services/apiHelpers'
import { Sparkles, Eye } from 'lucide-react'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/blogs')
      setBlogs(Array.isArray(res?.data) ? res.data : [])
    } catch (e) {
      const apiErr = extractApiError(e, 'Failed to load blog posts')
      setError(apiErr.message)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="v-page">
      <section className="v-section-muted">
        <div className="v-container v-section-tight">
          <p className="v-eyebrow mb-3">Journal</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="v-h1 !text-3xl md:!text-5xl">Velore Journal</h1>
              <p className="v-lead mt-4 max-w-2xl">
                Editorial notes on eyewear, fit, and style — curated with restraint.
              </p>
            </div>
            <Link to="/shop" className="v-btn-secondary">Browse frames</Link>
          </div>
        </div>
        <div className="v-container"><div className="v-divider" /></div>
      </section>

      <section className="v-container v-section">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="v-card overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="v-empty">
            <p className="text-sm font-medium text-gray-900 mb-1">Couldn’t load blog posts</p>
            <p className="v-muted mb-5">{error}</p>
            <button onClick={load} className="v-btn-secondary">Retry</button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="v-empty">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-800">
              <div className="relative">
                <Eye size={20} aria-hidden="true" />
                <Sparkles size={12} className="absolute -right-2 -top-2 text-gray-700" aria-hidden="true" />
              </div>
            </div>
            <p className="v-eyebrow mb-2">Editorial</p>
            <p className="v-h2 !text-xl mb-2">No posts yet</p>
            <p className="v-lead mb-6">We’ll publish style guides, care tips, and new arrivals here soon.</p>
            <Link to="/shop" className="v-btn-secondary">Browse frames</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <Link key={blog.post_id} to={`/blogs/${blog.post_id}`} className="group v-card-luxury overflow-hidden v-hover-lift">
                <div className="aspect-[4/3] v-card-media border-b border-[rgba(var(--velore-border-soft),0.9)] overflow-hidden">
                  {blog.image ? (
                    <img 
                      src={blog.image}
                      alt={blog.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                      No image available
                    </div>
                  )}
                </div>
                <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>•</span>
                  <span>{blog.read_time || '5 min read'}</span>
                </div>
                <h2 className="text-[18px] font-semibold text-gray-900 group-hover:text-gray-700 transition-colors mb-2">
                  {blog.title}
                </h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}