// src/App.jsx - Updated for new feature-based structure
import { useCallback, useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'

// Layout Components (from shared/)
import { Navbar, Footer, ScrollToTop } from './shared/components/layout'

// Context
import { FavoritesProvider, useFavorites } from './shared/contexts'

// Lazy-loaded routes (route-level code splitting)
const Home = lazy(() => import('./features/home/Home'))
const Shop = lazy(() => import('./features/shop/Shop'))
const ProductDetail = lazy(() => import('./features/product/ProductDetail'))
const Login = lazy(() => import('./features/auth/Login'))
const Signup = lazy(() => import('./features/auth/Signup'))
const ForgotPassword = lazy(() => import('./features/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./features/auth/ResetPassword'))
const Checkout = lazy(() => import('./features/checkout/Checkout'))
const PaymentSuccess = lazy(() => import('./features/checkout/PaymentSuccess'))
const AIAdvisor = lazy(() => import('./features/ai-advisor/AIAdvisor'))
const Favorite = lazy(() => import('./features/favorite/Favorite'))
const Blogs = lazy(() => import('./features/blog/Blogs'))
const BlogPost = lazy(() => import('./features/blog/BlogPost'))
const Profile = lazy(() => import('./pages/Profile'))
const About = lazy(() => import('./pages/About'))
const PolicyPlaceholder = lazy(() => import('./pages/PolicyPlaceholder'))

// Admin (lazy, isolated)
const Admin = lazy(() => import('./pages/Admin'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const VeloreAdmin = lazy(() => import('./features/admin/VeloreAdminUI'))

// Lazy-loaded modals/sidebars (safe: only visible when open)
const CartSidebar = lazy(() => import('./features/cart/CartSidebar'))
const ContactModal = lazy(() => import('./shared/components/ui/ContactModal'))

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-6 bg-[rgb(var(--velore-canvas))]">
    <div className="text-center max-w-md v-card-luxury p-6">
      <p className="v-eyebrow mb-3">Velore</p>
      <p className="v-h2 !text-xl mb-3">Loading</p>
      <div className="mx-auto h-1.5 w-40 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full w-1/3 bg-gray-900/60 animate-pulse" />
      </div>
    </div>
  </div>
)

function LazyPage({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

function RouteTransition({ children }) {
  const location = useLocation()
  return (
    <div key={location.pathname} className="v-route-enter">
      {children}
    </div>
  )
}

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

function ContactRoute({ onOpen }) {
  useEffect(() => {
    onOpen?.()
  }, [onOpen])

  return (
    <div className="min-h-[60vh] bg-white flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full v-card p-6 text-center">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">Contact</h1>
        <p className="v-muted mb-6">
          The contact form should open in a modal. If it didn’t, use the button below.
        </p>
        <button onClick={onOpen} className="v-btn-primary w-full">Open contact form</button>
        <Link to="/" className="inline-block mt-4 text-sm text-gray-600 underline hover:text-gray-900">Back to home</Link>
      </div>
    </div>
  )
}

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
  const openContact = useCallback(() => setContactOpen(true), [])

  return (
    <BrowserRouter>
      <FavoritesProvider>
        <ScrollToTop />
        <Routes>

          {/* ─── Admin (no Navbar/Footer) ─────────────────────────── */}
          <Route path="/admin/login" element={<LazyPage><AdminLogin /></LazyPage>} />
          <Route path="/admin" element={<LazyPage><Admin /></LazyPage>} />
          <Route path="/admin/*" element={<LazyPage><VeloreAdmin /></LazyPage>} />

          {/* ─── Public routes (with Navbar/Footer) ──────────────── */}
          <Route path="/*" element={
            <>
              <Navbar
                onCartOpen={() => setCartOpen(true)}
                onContactOpen={() => setContactOpen(true)}
              />
              <Suspense fallback={cartOpen ? <div className="fixed inset-0 z-50" /> : null}>
                <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
              </Suspense>
              <Suspense fallback={contactOpen ? <div className="fixed inset-0 z-50 bg-black/30" /> : null}>
                <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
              </Suspense>
              <Toast />

              <RouteTransition>
                <Routes>
                  <Route path="/" element={<LazyPage><Home /></LazyPage>} />
                  <Route path="/shop" element={<LazyPage><Shop /></LazyPage>} />
                  <Route path="/products" element={<Navigate to="/shop" replace />} />
                  <Route path="/product/:id" element={<LazyPage><ProductDetail /></LazyPage>} />
                  <Route path="/about" element={<LazyPage><About /></LazyPage>} />
                  <Route path="/contact" element={<ContactRoute onOpen={openContact} />} />
                  <Route path="/shipping-policy" element={<LazyPage><PolicyPlaceholder /></LazyPage>} />
                  <Route path="/refund-policy" element={<LazyPage><PolicyPlaceholder /></LazyPage>} />
                  <Route path="/privacy-policy" element={<LazyPage><PolicyPlaceholder /></LazyPage>} />
                  <Route path="/terms-of-service" element={<LazyPage><PolicyPlaceholder /></LazyPage>} />
                  <Route path="/login" element={<LazyPage><Login /></LazyPage>} />
                  <Route path="/signup" element={<LazyPage><Signup /></LazyPage>} />
                  <Route path="/register" element={<Navigate to="/signup" replace />} />
                  <Route path="/forgot-password" element={<LazyPage><ForgotPassword /></LazyPage>} />
                  <Route path="/reset-password" element={<LazyPage><ResetPassword /></LazyPage>} />
                  <Route path="/checkout" element={<LazyPage><Checkout /></LazyPage>} />
                  <Route path="/payment-success" element={<LazyPage><PaymentSuccess /></LazyPage>} />
                  <Route path="/ai-advisor" element={<LazyPage><AIAdvisor /></LazyPage>} />
                  <Route path="/favorite" element={<LazyPage><Favorite /></LazyPage>} />
                  <Route path="/favorites" element={<Navigate to="/favorite" replace />} />
                  <Route path="/profile" element={<LazyPage><Profile /></LazyPage>} />

                  <Route path="/blogs" element={<LazyPage><Blogs /></LazyPage>} />
                  <Route path="/blogs/:id" element={<LazyPage><BlogPost /></LazyPage>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </RouteTransition>

              <Footer />
            </>
          } />

        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  )
}

export default App