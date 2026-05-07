import { Suspense, lazy, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'

import { Footer, Navbar, ScrollToTop } from './shared/components/layout'
import { FavoritesProvider, useFavorites } from './shared/contexts'

const Home = lazy(() => import('./features/home/Home'))
const Shop = lazy(() => import('./features/shop/Shop'))
const ProductDetail = lazy(() => import('./features/product/ProductDetail'))
const Favorite = lazy(() => import('./features/favorite/Favorite'))
const Checkout = lazy(() => import('./features/checkout/Checkout'))
const PaymentSuccess = lazy(() => import('./features/checkout/PaymentSuccess'))
const AIAdvisor = lazy(() => import('./features/ai-advisor/AIAdvisor'))
const Blogs = lazy(() => import('./features/blog/Blogs'))
const BlogPost = lazy(() => import('./features/blog/BlogPost'))

const Login = lazy(() => import('./features/auth/Login'))
const Signup = lazy(() => import('./features/auth/Signup'))
const ForgotPassword = lazy(() => import('./features/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./features/auth/ResetPassword'))

const Profile = lazy(() => import('./pages/Profile'))
const About = lazy(() => import('./pages/About'))
const PolicyPlaceholder = lazy(() => import('./pages/PolicyPlaceholder'))

const Admin = lazy(() => import('./pages/Admin'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const VeloreAdmin = lazy(() => import('./features/admin/VeloreAdminUI'))

const CartSidebar = lazy(() => import('./features/cart/CartSidebar'))
const ContactModal = lazy(() => import('./shared/components/ui/ContactModal'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="v-page flex items-center justify-center">
      <div className="v-card-luxury px-6 py-5 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-gray-700">Loading…</div>
      </div>
    </div>
  )
}

function RouteTransition({ children }) {
  const location = useLocation()
  const key = useMemo(() => location.pathname, [location.pathname])
  return (
    <div key={key} className="v-route-enter">
      {children}
    </div>
  )
}

function Toast() {
  const { toast } = useFavorites()
  if (!toast) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg v-fade-up">
      ❤️ {toast}
    </div>
  )
}

function PublicLayout() {
  const [cartOpen, setCartOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} onContactOpen={() => setContactOpen(true)} />

      <Suspense fallback={null}>
        <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </Suspense>
      <Suspense fallback={null}>
        <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      </Suspense>

      <Toast />

      <RouteTransition>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </RouteTransition>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <ScrollToTop />

        <Routes>
          {/* Admin (no Navbar/Footer) */}
          <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={<PageLoader />}><Admin /></Suspense>} />
          <Route path="/admin/*" element={<Suspense fallback={<PageLoader />}><VeloreAdmin /></Suspense>} />

          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/products" element={<Navigate to="/shop" replace />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogPost />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/register" element={<Navigate to="/signup" replace />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            <Route path="/favorite" element={<Favorite />} />
            <Route path="/favorites" element={<Navigate to="/favorite" replace />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/about" element={<About />} />

            <Route path="/ai-advisor" element={<AIAdvisor />} />

            <Route path="/refund-policy" element={<PolicyPlaceholder title="Refund Policy" />} />
            <Route path="/privacy-policy" element={<PolicyPlaceholder title="Privacy Policy" />} />
            <Route path="/terms-of-service" element={<PolicyPlaceholder title="Terms of Service" />} />
            <Route path="/shipping-policy" element={<PolicyPlaceholder title="Shipping Policy" />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  )
}