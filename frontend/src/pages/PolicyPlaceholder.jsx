import { Link, useLocation } from 'react-router-dom'

const TITLES = {
  '/shipping-policy': 'Shipping policy',
  '/refund-policy': 'Returns & refunds',
  '/privacy-policy': 'Privacy policy',
  '/terms-of-service': 'Terms of service',
}

export default function PolicyPlaceholder() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'Policy'

  return (
    <div className="bg-white">
      <div className="v-container v-section">
        <p className="v-eyebrow mb-3">Velore</p>
        <h1 className="v-h1 mb-3">{title}</h1>
        <p className="v-lead max-w-2xl">
          This page is being prepared. For now, contact us if you need details for your order.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/contact" className="v-btn-primary">Contact</Link>
          <Link to="/shop" className="v-btn-secondary">Browse shop</Link>
        </div>
      </div>
    </div>
  )
}

