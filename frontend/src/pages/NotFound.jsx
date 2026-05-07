import { Link } from 'react-router-dom'
import { Glasses } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="v-page">
      <section className="v-container v-section">
        <div className="v-empty">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[rgba(var(--velore-accent),0.10)] border border-[rgba(var(--velore-border-soft),0.95)] flex items-center justify-center">
            <Glasses size={22} aria-hidden="true" />
          </div>
          <div className="text-lg font-semibold text-gray-900 mb-2">Page not found</div>
          <div className="v-body">The page you’re looking for doesn’t exist, or it has moved.</div>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link to="/" className="v-btn-secondary">Home</Link>
            <Link to="/shop" className="v-btn-primary">Shop</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

