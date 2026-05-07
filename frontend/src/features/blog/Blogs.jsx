import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../shared/services/apiClient'
import { resolveImageUrl } from '../../shared/utils/imageUrl'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/blogs')
      .then(res => setBlogs(res?.data || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen v-page">
      <section className="v-section-muted">
        <div className="v-container v-section">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Velore Journal
          </h1>
          <p className="text-gray-600 text-lg">
            Insights on eyewear trends, eye health, and style inspiration
          </p>
        </div>
        </div>
      </section>

      <section className="v-container v-section">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <Link key={blog.post_id} to={`/blogs/${blog.post_id}`} className="group">
                <div className="aspect-[4/3] v-card-media overflow-hidden mb-4">
                  {(() => {
                    const src = resolveImageUrl(blog.image)
                    return src ? (
                      <img
                        src={src}
                        alt={blog.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                        No image
                      </div>
                    )
                  })()}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>•</span>
                  <span>{blog.read_time || '5 min read'}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors mb-2">
                  {blog.title}
                </h2>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}