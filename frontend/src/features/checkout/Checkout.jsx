import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Truck, ShieldCheck, RotateCcw, Tag, CheckCircle, X, ShoppingBag, Glasses } from 'lucide-react'
import cartService from '../cart/cartService'
import orderService from './orderService'
import { extractApiError } from '../../shared/services/apiHelpers'

const COUNTRIES = ['Lebanon', 'United States', 'Canada', 'United Kingdom', 'France', 'UAE']
const FREE_SHIPPING_THRESHOLD = 50

// ─── Brand Logos ──────────────────────────────────────────────────────────────

const WhishLogo = () => (
  <svg width="70" height="26" viewBox="0 0 140 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="140" height="52" rx="7" fill="#E8001C"/>
    <text x="13" y="36" fontFamily="'Arial Black', 'Arial Bold', Arial, sans-serif" fontSize="25" fontWeight="900" fill="white" letterSpacing="-0.5">whish</text>
    <circle cx="120" cy="18" r="4.5" fill="white" opacity="0.85"/>
    <circle cx="128" cy="26" r="3.5" fill="white" opacity="0.6"/>
    <circle cx="120" cy="34" r="2.5" fill="white" opacity="0.4"/>
  </svg>
)

const VisaLogo = () => (
  <svg width="44" height="28" viewBox="0 0 880 560" xmlns="http://www.w3.org/2000/svg">
    <rect width="880" height="560" rx="50" fill="#1A1F71"/>
    <rect y="460" width="880" height="100" rx="0" fill="#F7A600"/>
    <text x="440" y="390" textAnchor="middle" fontFamily="'Times New Roman', Georgia, serif" fontSize="310" fontWeight="bold" fontStyle="italic" fill="white">VISA</text>
  </svg>
)

const MastercardLogo = () => (
  <svg width="44" height="28" viewBox="0 0 152 96" xmlns="http://www.w3.org/2000/svg">
    <rect width="152" height="96" rx="9" fill="#1A1A1A"/>
    <circle cx="55" cy="48" r="32" fill="#EB001B"/>
    <circle cx="97" cy="48" r="32" fill="#F79E1B"/>
    <path d="M76 20.5a32 32 0 0 1 0 55A32 32 0 0 1 76 20.5z" fill="#FF5F00"/>
  </svg>
)

const PAYMENT_METHODS = [
  {
    id: 'whish',
    name: 'Whish Money',
    description: 'Redirects you to the Whish app or website to complete payment',
    logo: <WhishLogo />,
  },
  {
    id: 'mastercard',
    name: 'Credit / Debit Card',
    description: 'Redirects you to our secure Stripe payment page',
    logo: (
      <div className="flex items-center gap-1.5">
        <VisaLogo />
        <MastercardLogo />
      </div>
    ),
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay in cash when your order arrives',
    logo: <span className="text-2xl">💵</span>,
  },
]

// ─── COD Success Modal ────────────────────────────────────────────────────────
function OrderConfirmationModal({ orderNumber, total, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={36} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Order Confirmed!</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your order has been placed. We'll prepare it and deliver it to you shortly.
          </p>
          <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order #</span>
              <span className="font-semibold text-gray-900 font-mono text-xs">{orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="font-semibold text-gray-900">Cash on Delivery</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-gray-900">${total}</span>
            </div>
          </div>
          <Link
            to="/shop"
            className="w-full text-center py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition"
            onClick={onClose}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main Checkout Component ──────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const [showCODModal, setShowCODModal] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  const [contactInfo, setContactInfo] = useState({ email: '' })
  const [shippingAddress, setShippingAddress] = useState({
    country: 'Lebanon', firstName: '', lastName: '', address: '',
    city: '', postalCode: '', phone: ''
  })
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [discountCode, setDiscountCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)

  useEffect(() => {
    loadCart()
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const loadCart = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      try {
        const result = await cartService.getCart()
        const cart = result?.data || {}
        const items = cart?.cart_items || []
        setCartItems(items)
        setCartTotal(parseFloat(cart?.total || 0))
      } catch { loadGuestCart() }
    } else {
      loadGuestCart()
    }
  }

  const loadGuestCart = () => {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
    setCartItems(guestCart.map(item => ({
      product_id: item.productId,
      quantity: item.quantity,
      products: { name: item.name, price: item.price, image: item.image },
      product_variants: null,
      prescriptionData: item.prescriptionData || null
    })))
    const total = guestCart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
    setCartTotal(total)
  }

  const hasItems = cartItems.length > 0
  const subtotal = hasItems ? cartTotal : 0
  const shipping = hasItems ? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 3) : 0
  const discount = hasItems ? Math.min(discountAmount, subtotal + shipping) : 0
  const total = Math.max(0, subtotal + shipping - discount)

  useEffect(() => {
    if (!hasItems && (discountAmount !== 0 || discountApplied)) {
      setDiscountAmount(0)
      setDiscountApplied(false)
      setDiscountCode('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasItems])

  const applyDiscount = () => {
    if (!hasItems) return
    if (discountCode.toUpperCase() === 'WELCOME10' && !discountApplied) {
      setDiscountAmount(subtotal * 0.1); setDiscountApplied(true)
    } else if (discountCode.toUpperCase() === 'FREESHIP' && !discountApplied) {
      setDiscountAmount(shipping); setDiscountApplied(true)
    } else {
      alert('Invalid discount code')
    }
  }

  const validateForm = () => {
    const errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!contactInfo.email.trim()) errors.email = 'Email is required'
    else if (!emailRegex.test(contactInfo.email)) errors.email = 'Please enter a valid email (e.g., user@gmail.com)'
    if (!shippingAddress.firstName.trim()) errors.firstName = 'First name is required'
    if (!shippingAddress.lastName.trim()) errors.lastName = 'Last name is required'
    if (!shippingAddress.address.trim()) errors.address = 'Address is required'
    if (!shippingAddress.city.trim()) errors.city = 'City is required'
    if (!shippingAddress.phone.trim()) errors.phone = 'Phone is required'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const generateOrderNumber = () =>
    `VEL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

  // ✅ Builds the payload — includes guestItems so backend can process guest cart
const buildOrderPayload = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  
  const payload = {
    payment_method: selectedPayment,
    email: contactInfo.email,
    name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
    phone: shippingAddress.phone,
    address: {
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode || '',
      country: shippingAddress.country
    }
  }

  // ✅ For guests: send cart items
  if (!token) {
    payload.guestItems = cartItems.map(item => ({
      product_id: Number(item.product_id || item.productId),
      quantity: item.quantity || 1,
      price: parseFloat(item.products?.price || item.price || 0)
    }))
  }

  return payload
}

  const createOrder = async () => {
    const orderNumber = generateOrderNumber()
    const response = await orderService.checkout(buildOrderPayload())
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) localStorage.removeItem('guestCart')
    // Use orderNumber from backend response if available, otherwise use generated one
    return { response, orderNumber: response?.data?.orderNumber || orderNumber }
  }

  // ✅ COD — show in-page success modal
  const handleCODCheckout = async () => {
    setLoading(true)
    try {
      const { response, orderNumber } = await createOrder()
      setConfirmedOrder({ orderNumber, orderId: response?.data?.order_id })
      setShowCODModal(true)
    } catch (err) {
      const apiErr = extractApiError(err, 'Checkout failed. Please try again.')
      setError(apiErr.message)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Whish — deep-link to native app, fall back to web after 1.5s
  const handleWhishCheckout = async () => {
    setLoading(true)
    try {
      const { orderNumber } = await createOrder()
      const returnUrl = `${window.location.origin}/payment-success`
      const appUrl = `whish://pay?amount=${total.toFixed(2)}&currency=USD&orderId=${orderNumber}&callback=${encodeURIComponent(returnUrl)}`
      const webUrl = `https://web.whish.money/pay?amount=${total.toFixed(2)}&currency=USD&orderId=${orderNumber}&callback=${encodeURIComponent(returnUrl)}`
      window.location.href = appUrl
      setTimeout(() => { window.location.href = webUrl }, 1500)
    } catch (err) {
      const apiErr = extractApiError(err, 'Checkout failed. Please try again.')
      setError(apiErr.message)
      setLoading(false)
    }
  }

  // ✅ Card — redirect to Stripe hosted checkout
  const handleCardCheckout = async () => {
    setLoading(true)
    try {
      const { response, orderNumber } = await createOrder()

      // Backend must provide a checkout/payment URL for card flows. Do not use placeholders.
      const checkoutUrl =
        response?.data?.checkout_url ||
        response?.data?.payment_url ||
        response?.data?.url ||
        null

      if (!checkoutUrl) {
        const msg = response?.message || 'Card payments are not configured yet.'
        throw { isApiError: true, status: 400, message: msg, errors: response?.errors || [], raw: response }
      }

      // Optionally append returnUrl if backend supports it.
      const returnUrl = `${window.location.origin}/payment-success?orderNumber=${encodeURIComponent(orderNumber)}&amount=${encodeURIComponent(total.toFixed(2))}`
      const urlWithReturn = checkoutUrl.includes('returnUrl=')
        ? checkoutUrl
        : checkoutUrl + (checkoutUrl.includes('?') ? '&' : '?') + `returnUrl=${encodeURIComponent(returnUrl)}`

      window.location.href = urlWithReturn
    } catch (err) {
      const apiErr = extractApiError(err, 'Checkout failed. Please try again.')
      setError(apiErr.message)
      setLoading(false)
    }
  }

  const handleCheckout = () => {
    setError('')
    if (!hasItems || loading) return
    if (!validateForm()) return
    if (selectedPayment === 'cod') handleCODCheckout()
    else if (selectedPayment === 'whish') handleWhishCheckout()
    else if (selectedPayment === 'mastercard') handleCardCheckout()
  }

  const handleShippingChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }))
    setFieldErrors(prev => ({ ...prev, [field]: '' }))
  }

  const ctaLabel = () => {
    if (loading) return 'Processing...'
    if (!hasItems) return 'Cart is empty'
    if (selectedPayment === 'whish') return `PAY WITH WHISH  •  $${total.toFixed(2)}`
    if (selectedPayment === 'mastercard') return `PAY BY CARD  •  $${total.toFixed(2)}`
    return `CONFIRM ORDER  •  $${total.toFixed(2)}`
  }

  return (
    <div className="v-page">
      {showCODModal && confirmedOrder && (
        <OrderConfirmationModal
          orderNumber={confirmedOrder.orderNumber}
          total={total.toFixed(2)}
          onClose={() => { setShowCODModal(false); navigate('/shop') }}
        />
      )}

      <div className="v-container py-10">
        <div className="max-w-6xl mx-auto">
          <p className="v-eyebrow mb-3">Checkout</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h1 className="v-h1 !text-3xl md:!text-5xl">Secure checkout</h1>
              <p className="v-lead mt-4 max-w-2xl">
                Complete your order with a calm, guided flow — your details stay private and protected.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-[11px] tracking-[0.14em] uppercase text-gray-700"><ShieldCheck size={14} className="mr-2" /> Secure</span>
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-[11px] tracking-[0.14em] uppercase text-gray-700"><Truck size={14} className="mr-2" /> Shipping</span>
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-[11px] tracking-[0.14em] uppercase text-gray-700"><RotateCcw size={14} className="mr-2" /> Returns</span>
            </div>
          </div>

          {error && (
            <div className="v-banner-error mb-4">
              {error}
            </div>
          )}

          {!isLoggedIn && (
            <div className="mb-8 v-surface p-5 md:p-6">
              <p className="text-sm text-gray-700">
                You’re checking out as a guest.{' '}
                <Link to="/login" className="v-link font-medium text-gray-900">Sign in</Link>{' '}
                for faster checkout and order tracking.
              </p>
            </div>
          )}

          {!hasItems && (
            <div className="v-empty mb-10">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-800">
                <div className="relative">
                  <ShoppingBag size={18} aria-hidden="true" />
                  <Glasses size={14} className="absolute -right-2 -top-2 text-gray-700" aria-hidden="true" />
                </div>
              </div>
              <p className="v-eyebrow mb-2">Nothing to checkout</p>
              <p className="v-h2 !text-xl mb-2">Your cart is empty</p>
              <p className="v-lead mb-8">Add frames to your cart to continue to checkout.</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/shop" className="v-btn-primary">Continue shopping</Link>
                <Link to="/favorite" className="v-btn-secondary">View favorites</Link>
              </div>
            </div>
          )}

          <div className={`flex flex-col lg:flex-row gap-8 ${!hasItems ? 'opacity-60 pointer-events-none select-none' : ''}`}>
            <div className="flex-1 space-y-6">

              {/* 1. Contact */}
              <div className="v-form-card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  Contact
                </h2>
                <input
                  type="email" placeholder="Email" value={contactInfo.email}
                  onChange={(e) => { setContactInfo({ email: e.target.value }); setFieldErrors(p => ({ ...p, email: '' })) }}
                  disabled={!hasItems || loading}
                  className={`v-input ${fieldErrors.email ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''} disabled:bg-gray-50`}
                />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
              </div>

              {/* 2. Delivery */}
              <div className="v-form-card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  Delivery
                </h2>
                <div className="space-y-4">
                  <select value={shippingAddress.country} onChange={(e) => handleShippingChange('country', e.target.value)} disabled={!hasItems || loading} className="v-select disabled:bg-gray-50">
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input type="text" placeholder="First name" value={shippingAddress.firstName} onChange={(e) => handleShippingChange('firstName', e.target.value)} disabled={!hasItems || loading} className={`v-input disabled:bg-gray-50 ${fieldErrors.firstName ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''}`} />
                      {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
                    </div>
                    <div>
                      <input type="text" placeholder="Last name" value={shippingAddress.lastName} onChange={(e) => handleShippingChange('lastName', e.target.value)} disabled={!hasItems || loading} className={`v-input disabled:bg-gray-50 ${fieldErrors.lastName ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''}`} />
                      {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <input type="text" placeholder="Address" value={shippingAddress.address} onChange={(e) => handleShippingChange('address', e.target.value)} disabled={!hasItems || loading} className={`v-input disabled:bg-gray-50 ${fieldErrors.address ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''}`} />
                    {fieldErrors.address && <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input type="text" placeholder="City" value={shippingAddress.city} onChange={(e) => handleShippingChange('city', e.target.value)} disabled={!hasItems || loading} className={`v-input disabled:bg-gray-50 ${fieldErrors.city ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''}`} />
                      {fieldErrors.city && <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>}
                    </div>
                    <input type="text" placeholder="Postal code" value={shippingAddress.postalCode} onChange={(e) => handleShippingChange('postalCode', e.target.value)} disabled={!hasItems || loading} className="v-input disabled:bg-gray-50" />
                  </div>
                  <div>
                    <input type="tel" placeholder="Phone" value={shippingAddress.phone} onChange={(e) => handleShippingChange('phone', e.target.value)} disabled={!hasItems || loading} className={`v-input disabled:bg-gray-50 ${fieldErrors.phone ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''}`} />
                    {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* 3. Payment */}
              <div className="v-form-card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  Payment
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(method => (
                    <label
                      key={method.id}
                      className={[
                        "flex items-center gap-4 p-4 border rounded-lg v-motion",
                        !hasItems
                          ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                          : selectedPayment === method.id
                            ? "border-gray-900 bg-gray-50 cursor-pointer"
                            : "border-gray-200 hover:border-gray-300 cursor-pointer hover:-translate-y-[1px]",
                      ].join(" ")}
                    >
                      <input type="radio" name="payment" value={method.id} checked={selectedPayment === method.id} onChange={(e) => setSelectedPayment(e.target.value)} className="w-4 h-4" disabled={!hasItems || loading} />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 block">{method.name}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                      </div>
                      <div className="flex-shrink-0">{method.logo}</div>
                      {selectedPayment === method.id && <span className="text-green-600 text-xs font-medium ml-1">✓ Selected</span>}
                    </label>
                  ))}
                </div>
                {selectedPayment === 'whish' && (
                  <p className="mt-3 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded p-3">
                    🔗 You'll be redirected to the <strong>Whish app</strong> (or website if not installed) to complete payment.
                  </p>
                )}
                {selectedPayment === 'mastercard' && (
                  <p className="mt-3 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded p-3">
                    🔒 You'll be redirected to our <strong>secure Stripe payment page</strong> to enter your card details.
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="v-card-luxury p-6 sticky top-28">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="v-eyebrow mb-2">Order</p>
                    <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
                  </div>
                  <Link to="/shop" className="text-xs text-gray-600 hover:text-gray-900 underline">Continue shopping</Link>
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500 mb-4">Your cart is empty</p>
                ) : (
                  cartItems.map((item, index) => {
                    const prescription = item.prescription_data || item.prescriptionData || null
                    const hasPrescription = prescription && (prescription.sph_r || prescription.sph_l || prescription.cyl_r || prescription.cyl_l || prescription.axis || prescription.pd)
                    const itemName = item.products?.name || item.name || 'Product'
                    const itemPrice = parseFloat(item.products?.price || item.price || 0)
                    const itemImage = item.products?.image || item.products?.product_variants?.[0]?.images?.[0] || item.image || null

                    return (
                      <div key={index} className="flex gap-3 pb-4 mb-4 border-b border-gray-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                          {itemImage
                            ? <img src={itemImage} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No img</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{itemName}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          {hasPrescription && (
                            <div className="mt-1 p-1.5 bg-blue-50 rounded-sm border border-blue-100">
                              <p className="text-xs font-medium text-blue-700">Prescription:</p>
                              <div className="text-xs text-blue-600 space-y-0.5">
                                {(prescription.sph_r || prescription.sph_l) && <p>SPH: R {prescription.sph_r || '0.00'} / L {prescription.sph_l || '0.00'}</p>}
                                {(prescription.cyl_r || prescription.cyl_l) && <p>CYL: R {prescription.cyl_r || '0.00'} / L {prescription.cyl_l || '0.00'}</p>}
                                {prescription.axis && <p>Axis: {prescription.axis}°</p>}
                                {prescription.pd && <p>PD: {prescription.pd}mm</p>}
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-semibold">${(itemPrice * item.quantity).toFixed(2)}</p>
                      </div>
                    )
                  })
                )}

                {/* Discount Code */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex gap-2">
                    <input type="text" placeholder="Discount code" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} disabled={!hasItems || discountApplied || loading} className="v-input !py-2 disabled:bg-gray-50" />
                    <button onClick={applyDiscount} disabled={!hasItems || loading || discountApplied || !discountCode} className="v-btn-secondary !py-2.5 !px-4">Apply</button>
                  </div>
                  {discountApplied && (
                    <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                      <Tag size={12} /> Discount applied!
                      <button onClick={() => { setDiscountApplied(false); setDiscountAmount(0); setDiscountCode('') }} className="text-gray-400 hover:text-gray-600 ml-2">Remove</button>
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="tabular-nums">${subtotal.toFixed(2)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-base"><span>Total</span><span className="tabular-nums">${total.toFixed(2)}</span></div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 my-6">
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase text-gray-700"><ShieldCheck size={14} className="mr-2" /> Secure</span>
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase text-gray-700"><Truck size={14} className="mr-2" /> Shipping</span>
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase text-gray-700"><RotateCcw size={14} className="mr-2" /> Returns</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!hasItems || loading}
                  className="w-full v-btn-primary !rounded-xl !tracking-[0.12em] !text-[12px]"
                >
                  {ctaLabel()}
                </button>

                <Link to="/shop" className="flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-gray-900 mt-5">
                  <ChevronLeft size={16} /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}