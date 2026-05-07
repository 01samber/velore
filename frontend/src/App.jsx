// src/App.jsx - Updated for new feature-based structure
import { useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'

// Layout Components (from shared/)
import { Navbar, Footer, ScrollToTop } from './shared/components/layout'
import { ContactModal } from './shared/components/ui'

// Feature Components (from features/)
import { Home } from './features/home'
import { Shop } from './features/shop'
import { ProductDetail } from './features/product'
import { Login, Signup, ForgotPassword, ResetPassword } from './features/auth'
import { CartSidebar } from './features/cart'
import { Checkout, PaymentSuccess } from './features/checkout'
import { AIAdvisor } from './features/ai-advisor'
import { Favorite } from './features/favorite'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import Profile from './pages/Profile'

// Admin
import VeloreAdmin from './features/admin/VeloreAdminUI'

// Context
import { FavoritesProvider, useFavorites } from './shared/contexts'

// Lazy loaded features
const Blogs = lazy(() => import('./features/blog/Blogs'))
const BlogPost = lazy(() => import('./features/blog/BlogPost'))

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

const NotFound = () => (
  <div className="min-h-screen bg-white flex items-center justify-center px-6">
    <div className="text-center max-w-md">
      <p className="text-xs tracking-widest text-gray-400 mb-3">404</p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 mb-6">
        The page you’re looking for doesn’t exist or was moved.
      </p>
      <Link to="/" className="inline-block bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors">
        Back to home
      </Link>
    </div>
  </div>
)

// Toast notification for favorites
function Toast() {
  const { toast } = useFavorites()
  if (!toast) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg animate-fade-in-up">
      ❤️ {toast}
    </div>
  )
}

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <BrowserRouter>
      <FavoritesProvider>
        <ScrollToTop />
        <Routes>

          {/* ─── Admin (no Navbar/Footer) ─────────────────────────── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<VeloreAdmin />} />

          {/* ─── Public routes (with Navbar/Footer) ──────────────── */}
          <Route path="/*" element={
            <>
              <Navbar
                onCartOpen={() => setCartOpen(true)}
                onContactOpen={() => setContactOpen(true)}
              />
              <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
              <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
              <Toast />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/products" element={<Navigate to="/shop" replace />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/register" element={<Navigate to="/signup" replace />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/ai-advisor" element={<AIAdvisor />} />
                <Route path="/favorite" element={<Favorite />} />
                <Route path="/favorites" element={<Navigate to="/favorite" replace />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/blogs" element={
                  <Suspense fallback={<PageLoader />}><Blogs /></Suspense>
                } />
                <Route path="/blogs/:id" element={
                  <Suspense fallback={<PageLoader />}><BlogPost /></Suspense>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>

              <Footer />
            </>
          } />

        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  )
}

export default App