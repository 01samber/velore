
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Testimonials from '../../shared/components/eyewear/Testimonials'
import { EyewearCard } from '../../shared/components/eyewear'
import sketchImage from '../../assets/Veloresketch.jpeg'
import shopService from '../shop/shopService'
import apiClient from '../../shared/services/apiClient'
import { extractApiError } from '../../shared/services/apiHelpers'

function SectionHeader({ eyebrow, title, desc, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
      <div>
        {eyebrow ? <p className="v-eyebrow mb-3">{eyebrow}</p> : null}
        <h2 className="v-h2">{title}</h2>
        {desc ? <p className="v-lead mt-3 max-w-2xl">{desc}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export default function Home() {
  const [newProducts, setNewProducts] = useState([])
  const [approvedReviews, setApprovedReviews] = useState([])
  const [blogs, setBlogs] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState(null)
  const [reviewsError, setReviewsError] = useState(null)
  const [blogsError, setBlogsError] = useState(null)

  const normalizeCardProduct = (p) => {
    const productId = p?.product_id ?? p?.id ?? p?.productId
    const variants = Array.isArray(p?.product_variants) ? p.product_variants : []
    const image = variants?.[0]?.images?.[0] || p?.image || ''
    const colors = variants?.map(v => v?.color_hex).filter(Boolean) || []
    return {
      ...p,
      id: productId,
      product_id: productId,
      image,
      colors,
      price: Number(p?.price || 0),
    }
  }

  useEffect(() => {
    loadNewCollection()
    loadApprovedReviews()
    loadBlogs()
  }, [])

  const loadNewCollection = async () => {
    setProductsLoading(true)
    setProductsError(null)
    try {
      const result = await shopService.getProducts({ limit: 5 })
      const list = Array.isArray(result?.data) ? result.data : (Array.isArray(result?.data?.products) ? result.data.products : [])
      setNewProducts(list.slice(0, 5).map(normalizeCardProduct))
    } catch (error) {
      const apiErr = extractApiError(error, 'Failed to load products')
      setProductsError(apiErr.message)
      setNewProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  const loadApprovedReviews = async () => {
    setReviewsError(null)
    try {
      const result = await apiClient.get('/reviews/approved')
      const data = result?.data || []
      const mapped = Array.isArray(data)
        ? data.map((item) => ({
            name: item.users?.name || 'Velore Customer',
            rating: item.rating || 0,
            review: item.comment || ''
          }))
        : []
      setApprovedReviews(mapped)
    } catch (error) {
      const apiErr = extractApiError(error, 'Failed to load reviews')
      setReviewsError(apiErr.message)
      setApprovedReviews([])
    }
  }

  const loadBlogs = async () => {
    setBlogsError(null)
    try {
      const result = await apiClient.get('/blogs')
      const data = result?.data || []
      const mapped = Array.isArray(data)
        ? data
            .filter((blog) => blog.is_published === true)
            .map((blog) => ({
              id: blog.post_id,
              image: blog.image || '',
              title: blog.title
            }))
        : []
      setBlogs(mapped)
    } catch (error) {
      const apiErr = extractApiError(error, 'Failed to load blogs')
      setBlogsError(apiErr.message)
      setBlogs([])
    }
  }

  return (
    <div className="v-page">
      {/* HERO SECTION — unchanged */}
      <section className="relative w-full h-[72vh] md:h-[88vh] overflow-hidden -mt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white/10 z-10" />
        <img
          src="https://images.unsplash.com/photo-1731983061288-a851eb9c9cb7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGdsYXNzZXMlMjBtb2RlbHxlbnwwfHwwfHx8MA%3D%3D"
          alt="Eyewear"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 z-20 flex items-end pb-12 md:pb-16">
          <div className="v-container w-full">
            <div className="max-w-xl">
              <p className="v-eyebrow text-white/80 mb-5">Virtual fit • Modern frames</p>
              <h1 className="v-h1 text-white mb-5">
                Eyewear that feels right — before you buy.
              </h1>
              <p className="v-lead text-white/75 mb-9 max-w-lg">
                Discover frames crafted for your unique face shape, then try them on with Velore’s virtual experience.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/shop" className="v-btn-primary !bg-white !text-gray-900 hover:!bg-white/90">
                  Shop the collection
                </Link>
                <Link to="/ai-advisor" className="v-btn-secondary !border-white/35 !bg-white/0 !text-white hover:!bg-white/10">
                  Virtual try‑on
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase text-white/80">Secure checkout</span>
                <span className="inline-flex items-center rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase text-white/80">Fast shipping</span>
                <span className="inline-flex items-center rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase text-white/80">Easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW COLLECTION SECTION — UPDATED */}
      <section className="v-section-muted">
        <div className="v-container v-section">
        <SectionHeader
          eyebrow="New arrivals"
          title="New collection"
          desc="Curated frames designed to feel refined — minimal lines, elevated materials, and modern fit."
          action={<Link to="/shop" className="v-btn-ghost">View all</Link>}
        />

        {productsLoading ? (
          <div className="flex justify-center py-14"><div className="v-loading">Loading collection…</div></div>
        ) : productsError ? (
          <div className="v-empty">
            <p className="v-eyebrow mb-2">Collection unavailable</p>
            <p className="v-h2 !text-xl mb-2">We couldn’t load products</p>
            <p className="v-lead mb-6">{productsError}</p>
            <button onClick={loadNewCollection} className="v-btn-secondary">Retry</button>
          </div>
        ) : newProducts.length === 0 ? (
          <div className="v-empty">
            <p className="v-eyebrow mb-2">Nothing here yet</p>
            <p className="v-h2 !text-xl mb-2">No products available</p>
            <p className="v-lead mb-6">Check back soon — new frames are added regularly.</p>
            <Link to="/shop" className="v-btn-primary">Browse shop</Link>
          </div>
        ) : (
          <>
            {/* Mobile — horizontal scroll */}
            <div className="flex md:hidden gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {newProducts.map((product) => (
                <div key={product.product_id} className="w-[45vw] flex-shrink-0">
                  <EyewearCard {...product} />
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <EyewearCard key={product.product_id} {...product} />
              ))}
            </div>
          </>
        )}
        </div>
      </section>

      {/* AI ASSISTANT SECTION — unchanged */}
      <section className="v-container v-section">
        <div className="v-card-luxury p-8 md:p-12 overflow-hidden">
          <div className="v-grid-editorial">
            <div className="md:col-span-6">
              <p className="v-eyebrow mb-3">Velore AI</p>
              <h2 className="v-h2 mb-4">Find frames that suit your face</h2>
              <p className="v-lead mb-8">
                Ask questions, compare styles, and get guided recommendations — then try on your favorites.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/ai-advisor" className="v-btn-primary">Start virtual try‑on</Link>
                <Link to="/shop" className="v-btn-secondary">Browse frames</Link>
              </div>
            </div>
            <div className="hidden md:block md:col-span-6">
              <div className="grid grid-cols-2 gap-4 items-end justify-end">
                <div className="v-surface p-6 h-52 v-hover-lift">
                  <p className="v-eyebrow mb-2">Confidence</p>
                  <p className="v-body text-gray-700">Try before you buy — reduce uncertainty and returns.</p>
                </div>
                <div className="v-surface p-6 h-64 v-hover-lift">
                  <p className="v-eyebrow mb-2">Fit</p>
                  <p className="v-body text-gray-700">Face-shape guidance + curated picks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials, About us, Latest News — unchanged */}
      {reviewsError ? (
        <section className="v-container v-section">
          <SectionHeader eyebrow="Proof" title="Testimonials" desc="Real feedback from customers who found their fit." />
          <div className="v-banner-error">
            <span className="min-w-0">{reviewsError}</span>
            <button onClick={loadApprovedReviews} className="underline whitespace-nowrap">Retry</button>
          </div>
        </section>
      ) : approvedReviews.length > 0 ? (
        <Testimonials testimonials={approvedReviews} />
      ) : (
        <section className="v-container v-section">
          <SectionHeader eyebrow="Proof" title="Testimonials" desc="We’re building a collection of verified reviews." />
          <div className="v-empty">
            <p className="v-eyebrow mb-2">Coming soon</p>
            <p className="v-h2 !text-xl mb-2">No reviews yet</p>
            <p className="v-lead">Be the first to share your experience.</p>
          </div>
        </section>
      )}

      <section id="about-us" className="v-container v-section">
        <SectionHeader eyebrow="Velore" title="About us" desc="A calm, premium eyewear experience — built around fit, trust, and modern design." action={<Link to="/about" className="v-btn-ghost">Read the story</Link>} />
        <div className="flex flex-row items-center gap-6 md:gap-16">
          <div className="flex flex-col items-center flex-1">
            <h2 className="text-6xl md:text-8xl font-semibold tracking-tight text-gray-900 leading-none mb-4">20+</h2>
            <p className="text-xs md:text-sm leading-relaxed text-gray-600 text-center max-w-xs">
              years of experience, Velore has been dedicated to selecting only the finest quality products for our customers.
            </p>
          </div>
          <div className="flex-1">
            <div className="v-card-luxury overflow-hidden">
              <div className="p-6 v-card-media">
                <img src={sketchImage} alt="Eyewear design sketches" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="latest-news" className="v-section-muted">
        <div className="v-container v-section">
        <SectionHeader eyebrow="Journal" title="Latest news" desc="Editorial picks on eyewear, style, and care — curated by Velore." action={<Link to="/blogs" className="v-btn-ghost">View journal</Link>} />
        {blogsError && (
          <div className="v-banner-error mb-6">
            <span className="min-w-0">{blogsError}</span>
            <button onClick={loadBlogs} className="underline whitespace-nowrap">Retry</button>
          </div>
        )}
        {blogs.length === 0 && !blogsError ? (
          <div className="v-empty">
            <p className="v-eyebrow mb-2">Editorial</p>
            <p className="v-h2 !text-xl mb-2">No posts yet</p>
            <p className="v-lead mb-6">We’ll publish style guides, care tips, and brand updates here soon.</p>
            <Link to="/shop" className="v-btn-secondary">Browse frames</Link>
          </div>
        ) : (
          <>
            <div className="flex md:hidden gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {blogs.map((blog) => (
                <Link key={blog.id} to={`/blogs/${blog.id}`} className="min-w-[70vw] flex-shrink-0 group v-card-luxury overflow-hidden">
                  <div className="h-56 v-card-media">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="v-eyebrow mb-2">Velore Journal</p>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{blog.title}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="hidden md:grid grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link key={blog.id} to={`/blogs/${blog.id}`} className="group v-card-luxury overflow-hidden v-hover-lift">
                  <div className="h-72 v-card-media">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="v-eyebrow mb-2">Velore Journal</p>
                    <p className="text-base font-medium text-gray-900 line-clamp-2">{blog.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
        </div>
      </section>
    </div>
  )
}