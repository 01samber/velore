import { Link } from 'react-router-dom'
import { useFavorites } from '../../shared/contexts'  // ← FIXED
import { EyewearCard } from '../../shared/components/eyewear'  // ← FIXED
import { Heart, Glasses } from 'lucide-react'

const Favorite = () => {
  const { favorites, clearFavorites, error, reloadFavorites } = useFavorites()

  return (
    <div className="v-page">
      <div className="v-container v-section-tight">
        <p className="v-eyebrow mb-3">Saved</p>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="v-h1 !text-3xl md:!text-5xl">Your favorites</h1>
            <p className="v-lead mt-4 max-w-2xl">Save frames to compare later — a calm shortlist for decision-making.</p>
          </div>
          {favorites.length > 0 ? (
            <button
              onClick={clearFavorites}
              className="v-btn-secondary !py-2.5 !px-4"
              type="button"
            >
              Clear all
            </button>
          ) : null}
        </div>
      </div>
      <div className="v-container"><div className="v-divider" /></div>

      <div className="v-container v-section">
        {error && (
          <div className="v-banner-error mb-8">
            <span className="min-w-0">{error}</span>
            <button onClick={reloadFavorites} className="underline whitespace-nowrap">Retry</button>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="v-empty">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-800">
              <div className="relative">
                <Glasses size={20} aria-hidden="true" />
                <Heart size={12} className="absolute -right-2 -top-2 text-red-500" aria-hidden="true" />
              </div>
            </div>
            <p className="v-eyebrow mb-2">Saved items</p>
            <p className="v-h2 !text-xl mb-2">No favorites yet</p>
            <p className="v-lead mb-7">As you browse, tap the heart to build a shortlist you can compare.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/shop" className="v-btn-primary">Browse shop</Link>
              <Link to="/ai-advisor" className="v-btn-secondary">Virtual try‑on</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favorites.map(product => (
              <EyewearCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorite