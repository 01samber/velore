import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EyewearCard } from '../../shared/components/eyewear'
import shopService from './shopService'
import { extractApiError } from '../../shared/services/apiHelpers'
import { Glasses } from 'lucide-react'

const MAX_PRICE = 450
const BRANDS = ['Velore', 'Ray-Ban', 'MIU MIU']
const FRAME_SHAPES = ['Round', 'Square', 'Rectangle', 'Cat eye', 'Aviator']
const FACE_SHAPES = ['Round Face', 'Oval Face', 'Square Face', 'Heart Face', 'Diamond Face']
const LENS_COLORS = ['Clear', 'Green', 'Blue', 'Grey', 'Gradient']
const PURPOSES = ['Driving', 'Screen Use', 'Outdoor', 'Sports', 'Night Driving']
const LENS_FEATURES = ['Polarized', 'UV 400 Protection', 'Blue Light Blocking', 'Anti-Reflective', 'Scratch Resistant', 'Anti-Fog']

const categories = [
  { key: 'all', label: 'All' },
  { key: 'glasses', label: 'Glasses' },
  { key: 'sunglasses', label: 'Sunglasses' },
  { key: 'lenses', label: 'Lenses' },
]

const sortOptions = [
  { key: 'default', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'name', label: 'Name A–Z' },
]

function initFilters() {
  return {
    priceMin: 0, priceMax: MAX_PRICE,
    isBundle: false,
    brands: [], sizes: [], frameShapes: [], faceShapes: [],
    lensColors: [], purposes: [], lensFeatures: [], genders: [],
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm font-medium text-gray-900"
      >
        {title}
        <span className="text-lg leading-none text-gray-400">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-1" onClick={onChange}>
      <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${checked ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500'}`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
    </label>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState('default')
  const [sortOpen, setSortOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState(initFilters())
  const [appliedFilters, setAppliedFilters] = useState(initFilters())
  
  // ✅ NEW: Real data from API
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [brandOptions, setBrandOptions] = useState(BRANDS)
  const [apiCategories, setApiCategories] = useState([])

  const activeCategory = searchParams.get('category') || 'all'
  const searchQuery = searchParams.get('search') || ''
  const isLenses = activeCategory === 'lenses'
  const showFrameFilters = activeCategory === 'glasses' || activeCategory === 'sunglasses'
  const showFilterBtn = activeCategory !== 'all'

  const normalizeProduct = (p) => {
    const productId = p?.product_id ?? p?.id ?? p?.productId
    const variants = Array.isArray(p?.product_variants) ? p.product_variants : (Array.isArray(p?.variants) ? p.variants : [])
    const firstImage = variants?.[0]?.images?.[0] || p?.image || ''
    const colors = variants?.map(v => v?.color_hex).filter(Boolean) || p?.colors || []
    return {
      ...p,
      id: productId,
      product_id: productId,
      name: p?.name || '',
      description: p?.description || '',
      price: Number(p?.price || 0),
      image: firstImage,
      colors,
      brand: p?.brands?.name || p?.brand || '',
      gender: p?.gender || '',
      isBundle: !!(p?.is_bundle ?? p?.isBundle),
      size: p?.size || '',
      frameShape: p?.frame_shape || p?.frameShape || '',
      faceShape: p?.face_shape || p?.faceShape || '',
      lensColor: p?.lens_color || p?.lensColor || '',
      purpose: p?.purpose || '',
      lensFeature: p?.lens_feature || p?.lensFeature || '',
    }
  }

  const loadMeta = async () => {
    try {
      const [brandsRes, categoriesRes] = await Promise.all([
        shopService.getBrands(),
        shopService.getCategories(),
      ])
      const brands = Array.isArray(brandsRes?.data) ? brandsRes.data : []
      const categories = Array.isArray(categoriesRes?.data) ? categoriesRes.data : []

      if (brands.length > 0) {
        const names = brands.map(b => b?.name).filter(Boolean)
        if (names.length > 0) setBrandOptions(names)
      }
      setApiCategories(categories)
    } catch {
      // Non-blocking: shop still works without meta.
    }
  }

  // Fetch brands/categories once (if available)
  useEffect(() => {
    loadMeta()
  }, [])

  // Fetch products from backend when category/search/meta changes
  useEffect(() => {
    loadProducts(activeCategory)
  }, [activeCategory, searchQuery, apiCategories])

  const loadProducts = async () => {
  setLoading(true)
  setError(null)
  try {
    const params = {}
    const normalizedCategoryKey = (activeCategory || '').toLowerCase()

    // Prefer backend categories if available (avoid hardcoded IDs).
    if (normalizedCategoryKey !== 'all' && Array.isArray(apiCategories) && apiCategories.length > 0) {
      const match = apiCategories.find(c => (c?.name || '').toLowerCase().includes(normalizedCategoryKey))
      if (match?.category_id || match?.id) {
        params.category_id = match.category_id || match.id
      }
    }

    let response
    if (searchQuery && searchQuery.trim().length >= 2) {
      response = await shopService.searchProducts(searchQuery.trim(), params)
    } else {
      response = await shopService.getProducts(params)
    }

    const data = response?.data
    const list = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : [])
    setAllProducts(list.map(normalizeProduct))

  } catch (err) {
    const apiErr = extractApiError(err, 'Failed to load products')
    setError(apiErr.message)
  } finally {
    setLoading(false)
  }
}

  const setCategory = (key) => {
    setSearchParams(key === 'all' ? {} : { category: key })
    const reset = initFilters()
    setFilters(reset)
    setAppliedFilters(reset)
    setFilterOpen(false)
    window.scrollTo(0, 0)
  }

  const toggle = (key, value) => {
    setFilters(prev => {
      const arr = prev[key]
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
    })
  }

  const applyFilters = () => { setAppliedFilters({ ...filters }); setFilterOpen(false) }
  const resetFilters = () => { const r = initFilters(); setFilters(r); setAppliedFilters(r) }

  const activeFilterCount = [
    appliedFilters.isBundle,
    appliedFilters.brands.length > 0,
    appliedFilters.sizes.length > 0,
    appliedFilters.frameShapes.length > 0,
    appliedFilters.faceShapes.length > 0,
    appliedFilters.lensColors.length > 0,
    appliedFilters.purposes.length > 0,
    appliedFilters.lensFeatures.length > 0,
    appliedFilters.genders.length > 0,
    appliedFilters.priceMin > 0 || appliedFilters.priceMax < MAX_PRICE,
  ].filter(Boolean).length

  // ✅ UPDATED: Filter from API data
  const baseProducts = allProducts

  const filtered = baseProducts.filter(p => {
    const f = appliedFilters
    if (p.price < f.priceMin || p.price > f.priceMax) return false
    if (f.isBundle && !p.isBundle) return false
    if (f.brands.length && !f.brands.includes(p.brand)) return false
    if (f.genders.length && !f.genders.includes(p.gender)) return false
    if (f.sizes.length && !f.sizes.includes(p.size)) return false
    if (f.frameShapes.length && !f.frameShapes.includes(p.frameShape)) return false
    if (f.faceShapes.length && !f.faceShapes.includes(p.faceShape)) return false
    if (f.lensColors.length && !f.lensColors.includes(p.lensColor)) return false
    if (f.purposes.length && !f.purposes.includes(p.purpose)) return false
    if (f.lensFeatures.length && !f.lensFeatures.includes(p.lensFeature)) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  const hasQuery = (searchQuery || '').trim().length >= 2

  const ProductSkeleton = () => (
    <div className="v-card overflow-hidden">
      <div className="bg-gray-100 h-40 md:h-52 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 w-full bg-gray-100 rounded-xl animate-pulse mt-2" />
      </div>
    </div>
  )

  return (
    <div className="v-page">
      {/* ── Editorial header ── */}
      <div className="v-section-muted">
        <div className="v-container v-section-tight">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="v-eyebrow mb-3">Shop</p>
              <h1 className="v-h1 !text-3xl md:!text-5xl">Frames & lenses</h1>
              <p className="v-lead mt-4 max-w-2xl">
                Browse a curated selection of premium eyewear. Use filters to narrow your fit.
              </p>
              {hasQuery ? (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
                  <span className="text-gray-500">Search</span>
                  <span className="font-medium">“{searchQuery.trim()}”</span>
                  <button
                    className="ml-2 text-xs text-gray-500 hover:text-gray-900 underline"
                    onClick={() => setSearchParams(activeCategory === 'all' ? {} : { category: activeCategory })}
                    type="button"
                  >
                    Clear
                  </button>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              {showFilterBtn && (
                <button
                  onClick={() => setFilterOpen(true)}
                  className="v-btn-secondary !py-2.5 !px-4"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-gray-900 text-white text-[11px] px-2 py-0.5 rounded-full tabular-nums">{activeFilterCount}</span>
                  )}
                </button>
              )}

              <div className="relative">
                <button onClick={() => setSortOpen(!sortOpen)} className="v-btn-secondary !py-2.5 !px-4" type="button" aria-haspopup="menu" aria-expanded={sortOpen}>
                  Sort
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-12 z-50 min-w-[220px] v-popover v-popover-anim">
                    <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-200/60">
                      <p className="v-eyebrow">Sort</p>
                    </div>
                    {sortOptions.map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => { setSortBy(key); setSortOpen(false) }}
                        className="v-menu-item"
                      >
                        <span className={sortBy === key ? 'text-gray-900 font-medium' : 'text-gray-700'}>{label}</span>
                        {sortBy === key ? <span className="text-xs text-gray-500">Selected</span> : null}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {activeFilterCount > 0 ? (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="v-eyebrow">Active filters</span>
              <button onClick={resetFilters} className="text-xs text-gray-600 hover:text-gray-900 underline" type="button">
                Clear all
              </button>
            </div>
          ) : null}
        </div>
        <div className="v-container"><div className="v-divider" /></div>
      </div>

      {/* ── Category Tab Bar ── */}
      <div className="sticky top-[80px] z-40 bg-[rgb(var(--velore-pearl))]/75 backdrop-blur border-b border-[rgba(var(--velore-border-soft),0.85)]">
        <div className="v-container flex items-center gap-3 overflow-x-auto scrollbar-hide py-3">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`relative px-4 py-2 text-sm whitespace-nowrap transition-colors flex-shrink-0 rounded-full border ${
                activeCategory === key
                  ? 'text-gray-900 font-semibold border-gray-900 bg-[rgba(var(--velore-accent),0.06)]'
                  : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-[rgba(var(--velore-border-soft),0.95)] hover:bg-[rgba(var(--velore-accent),0.04)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="v-container pb-20 pt-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="v-empty">
            <p className="v-eyebrow mb-2">Shop unavailable</p>
            <p className="v-h2 !text-xl mb-2">We couldn’t load products</p>
            <p className="v-lead mb-6">{error}</p>
            <button onClick={() => loadProducts(activeCategory)} className="v-btn-secondary">Retry</button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="v-empty">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700">
              <Glasses size={20} aria-hidden="true" />
            </div>
            <p className="v-eyebrow mb-2">No matches</p>
            <p className="v-h2 !text-xl mb-2">Nothing fits these filters</p>
            <p className="v-lead mb-7">Try widening the price range, removing one filter, or browsing the full collection.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={resetFilters} className="v-btn-secondary" type="button">Reset filters</button>
              <Link to="/shop" className="v-btn-ghost">View all</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sorted.map(product => <EyewearCard key={product.product_id || product.id} {...product} />)}
          </div>
        )}
      </div>

      {/* ── Backdrop ── */}
      {filterOpen && <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setFilterOpen(false)} />}

      {/* ── Filter Panel ── */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[rgb(var(--velore-pearl))] z-50 flex flex-col transition-transform duration-300 ease-in-out ${filterOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-[rgba(var(--velore-border-soft),0.9)]`}>

        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200/70 flex-shrink-0">
          <div>
            <p className="v-eyebrow mb-1">Refine</p>
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <button onClick={() => setFilterOpen(false)} className="v-icon-btn text-gray-700" aria-label="Close filters" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6">
          {/* Price */}
          <FilterSection title="Price">
            <p className="text-xs text-gray-400 mb-3">The highest price is ${MAX_PRICE}</p>
            <input
              type="range" min={0} max={MAX_PRICE} value={filters.priceMax}
              onChange={e => setFilters(prev => ({ ...prev, priceMax: Number(e.target.value) }))}
              className="w-full accent-gray-900 mb-3"
            />
            <div className="flex gap-3">
              {['priceMin', 'priceMax'].map((key) => (
                <div key={key} className="flex items-center border border-gray-200/70 rounded-lg px-3 py-2 flex-1 bg-white">
                  <span className="text-gray-400 text-sm mr-1">$</span>
                  <input
                    type="number" value={filters[key]}
                    onChange={e => setFilters(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                    className="w-full outline-none text-sm text-gray-700 bg-transparent"
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* isBundle */}
          <FilterSection title="Is Bundle">
            <Checkbox label="Bundle deals only" checked={filters.isBundle}
              onChange={() => setFilters(prev => ({ ...prev, isBundle: !prev.isBundle }))} />
          </FilterSection>

          {/* Brand */}
          <FilterSection title="Brand">
            {brandOptions.map(b => <Checkbox key={b} label={b} checked={filters.brands.includes(b)} onChange={() => toggle('brands', b)} />)}
          </FilterSection>

          {/* ── Glasses / Sunglasses only ── */}
          {showFrameFilters && (
            <>
              <FilterSection title="Size">
                <div className="flex gap-2 mt-1 flex-wrap">
                  {['Small', 'Medium', 'Large'].map(s => (
                    <button key={s} onClick={() => toggle('sizes', s)}
                      type="button"
                      className={`px-3 py-2 text-[11px] tracking-[0.14em] uppercase rounded-full border transition ${filters.sizes.includes(s) ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'}`}>
                      {s === 'Small' ? 'S' : s === 'Medium' ? 'M' : 'L'}
                    </button>
                  ))}
                  <button type="button" className="px-3 py-2 text-[11px] tracking-[0.14em] uppercase rounded-full border border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition">
                    Size Guide
                  </button>
                </div>
              </FilterSection>

              <FilterSection title="Frame Shape">
                {FRAME_SHAPES.map(s => <Checkbox key={s} label={s} checked={filters.frameShapes.includes(s)} onChange={() => toggle('frameShapes', s)} />)}
              </FilterSection>

              <FilterSection title="Face Shape">
                {FACE_SHAPES.map(s => <Checkbox key={s} label={s} checked={filters.faceShapes.includes(s)} onChange={() => toggle('faceShapes', s)} />)}
              </FilterSection>
            </>
          )}

          {/* ── Lenses only ── */}
          {isLenses && (
            <>
              <FilterSection title="Lens Color">
                {LENS_COLORS.map(c => <Checkbox key={c} label={c} checked={filters.lensColors.includes(c)} onChange={() => toggle('lensColors', c)} />)}
              </FilterSection>

              <FilterSection title="Purpose">
                {PURPOSES.map(p => <Checkbox key={p} label={p} checked={filters.purposes.includes(p)} onChange={() => toggle('purposes', p)} />)}
              </FilterSection>

              <FilterSection title="Lens Feature">
                {LENS_FEATURES.map(f => <Checkbox key={f} label={f} checked={filters.lensFeatures.includes(f)} onChange={() => toggle('lensFeatures', f)} />)}
              </FilterSection>
            </>
          )}

          {/* Gender — always shown for specific categories */}
          {(showFrameFilters || isLenses) && (
            <FilterSection title="Gender">
              {['Female', 'Male'].map(g => <Checkbox key={g} label={g} checked={filters.genders.includes(g)} onChange={() => toggle('genders', g)} />)}
            </FilterSection>
          )}
        </div>

        {/* Apply */}
        <div className="px-6 py-6 border-t border-[rgba(var(--velore-border-soft),0.9)] flex-shrink-0 bg-[rgb(var(--velore-pearl))]">
          <div className="flex gap-3">
            <button onClick={resetFilters} className="v-btn-secondary flex-1 !py-2.5" type="button">Reset</button>
            <button onClick={applyFilters} className="v-btn-primary flex-1 !py-2.5" type="button">Apply</button>
          </div>
        </div>
      </div>
    </div>
  )
}