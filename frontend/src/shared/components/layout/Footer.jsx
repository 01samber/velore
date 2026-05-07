import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/logoEye-blue.png'
import { ChevronDown, Phone, Mail, MapPin, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react'

function SelectMenu({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (!e.target.closest?.('.footer-select')) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const active = options.find(o => o.value === value) || options[0]

  return (
    <div className="relative footer-select" ref={ref}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
        className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] tracking-[0.14em] uppercase transition border border-gray-200 hover:border-gray-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
      >
        <span className="text-gray-900">{active.label}</span>
        {active.detail ? <span className="text-gray-500">{active.detail}</span> : null}
        <ChevronDown size={14} className={["text-gray-500 transition", open ? "rotate-180" : ""].join(" ")} />
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-3 w-[min(14rem,calc(100vw-2rem))] v-popover v-popover-anim z-50">
          <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-200/60">
            <p className="v-eyebrow">{label}</p>
          </div>
          <div role="menu" aria-label={label}>
            {options.map((o) => (
              <button
                key={o.value}
                role="menuitem"
                onClick={() => { onChange(o.value); setOpen(false) }}
                className="v-menu-item"
              >
                <span className="inline-flex items-center gap-3">
                  <span className="font-medium text-gray-900">{o.label}</span>
                  {o.detail ? <span className="text-gray-500">{o.detail}</span> : null}
                </span>
                {value === o.value ? <span className="text-xs text-gray-500">Selected</span> : null}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Badge({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase text-gray-700">
      {Icon ? <Icon size={14} className="text-gray-700" aria-hidden="true" /> : null}
      {children}
    </span>
  )
}

export default function Footer() {
  const PHONE_DISPLAY = '+961 1 234 567'
  const PHONE_TEL = '+9611234567'
  const EMAIL = 'hello@velore.com'
  const LOCATION = 'Beirut, Lebanon'
  const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(LOCATION)}`

  const [currency, setCurrency] = useState('USD')
  const [language, setLanguage] = useState('en')

  const currencyOptions = useMemo(() => ([
    { value: 'USD', label: 'USD', detail: '$' },
    { value: 'EUR', label: 'EUR', detail: '€' },
    { value: 'LBP', label: 'LBP', detail: 'ل.ل' },
  ]), [])

  const languageOptions = useMemo(() => ([
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' },
  ]), [])

  return (
    <footer className="v-section-muted">
      <div className="v-divider" />

      {/* Top module */}
      <div className="v-container v-section-tight">
        <div className="v-grid-editorial">
          <div className="md:col-span-5">
            <img src={logo} alt="Velore" className="h-10 object-contain" />
            <p className="v-eyebrow mt-6 mb-3">Premium eyewear</p>
            <p className="v-body max-w-md text-gray-600">
              Modern frames, confident fit, and a calm shopping experience — designed to feel considered at every step.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge icon={ShieldCheck}>Secure checkout</Badge>
              <Badge icon={Truck}>Fast shipping</Badge>
              <Badge icon={RotateCcw}>Easy returns</Badge>
              <Badge icon={Headphones}>Customer care</Badge>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="v-card-luxury p-6 md:p-7">
              <p className="v-eyebrow mb-2">Newsletter</p>
              <h3 className="v-h2 !text-xl md:!text-2xl mb-2">Join the Velore list</h3>
              <p className="v-caption mb-5">
                New arrivals, editorial picks, and product drops — occasional and always intentional.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="email" placeholder="Email address" className="v-input flex-1" aria-label="Email address" />
                <button className="v-btn-primary whitespace-nowrap">Subscribe</button>
              </div>
              <p className="v-helper">By subscribing, you agree to receive emails from Velore. You can unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="v-container">
        <div className="v-divider" />
      </div>

      {/* Link columns */}
      <div className="v-container v-section-tight">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-3">
            <p className="v-eyebrow mb-4">Shop</p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/shop?type=bestsellers" className="hover:text-gray-900 transition">Bestsellers</Link></li>
              <li><Link to="/shop?type=limited" className="hover:text-gray-900 transition">Limited Collection</Link></li>
              <li><Link to="/shop" className="hover:text-gray-900 transition">Shop All</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <p className="v-eyebrow mb-4">Company</p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-gray-900 transition">Our Story</Link></li>
              <li><Link to="/blogs" className="hover:text-gray-900 transition">Journal</Link></li>
              <li><Link to="/contact" className="hover:text-gray-900 transition">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <p className="v-eyebrow mb-4">Customer Care</p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/shipping-policy" className="hover:text-gray-900 transition">Shipping</Link></li>
              <li><Link to="/refund-policy" className="hover:text-gray-900 transition">Returns</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-gray-900 transition">Privacy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-gray-900 transition">Terms</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <p className="v-eyebrow mb-4">Payments</p>
            <div className="flex flex-wrap gap-2">
              <Badge>Visa</Badge>
              <Badge>Mastercard</Badge>
              <Badge>PayPal</Badge>
              <Badge>Cash</Badge>
            </div>
            <p className="v-helper mt-4">
              Payment methods vary by checkout selection.
            </p>
          </div>
        </div>

        {/* Contact tiles */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href={`tel:${PHONE_TEL}`} className="v-icon-tile v-hover-lift" aria-label={`Call Velore: ${PHONE_DISPLAY}`}>
            <div className="flex items-center gap-3">
              <div className="v-icon-circle" aria-hidden="true"><Phone size={16} className="text-gray-800" /></div>
              <div className="min-w-0">
                <p className="v-eyebrow">Call</p>
                <p className="text-sm font-medium text-gray-900 truncate">{PHONE_DISPLAY}</p>
              </div>
            </div>
          </a>
          <a href={`mailto:${EMAIL}`} className="v-icon-tile v-hover-lift" aria-label={`Email Velore: ${EMAIL}`}>
            <div className="flex items-center gap-3">
              <div className="v-icon-circle" aria-hidden="true"><Mail size={16} className="text-gray-800" /></div>
              <div className="min-w-0">
                <p className="v-eyebrow">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">{EMAIL}</p>
              </div>
            </div>
          </a>
          <a href={MAPS_URL} target="_blank" rel="noreferrer noopener" className="v-icon-tile v-hover-lift" aria-label={`Open map for Velore location: ${LOCATION}`}>
            <div className="flex items-center gap-3">
              <div className="v-icon-circle" aria-hidden="true"><MapPin size={16} className="text-gray-800" /></div>
              <div className="min-w-0">
                <p className="v-eyebrow">Visit</p>
                <p className="text-sm font-medium text-gray-900 truncate">{LOCATION}</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div className="v-container">
        <div className="v-divider" />
      </div>

      {/* Bottom bar */}
      <div className="v-container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Velore</p>

          <div className="flex flex-wrap items-center gap-3">
            <SelectMenu label="Currency" value={currency} options={currencyOptions} onChange={setCurrency} />
            <SelectMenu label="Language" value={language} options={languageOptions} onChange={setLanguage} />
          </div>
        </div>
      </div>
    </footer>
  )
}