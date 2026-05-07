// src/components/ui/ContactModal.jsx
import { useEffect, useRef, useState } from 'react'
import { X, Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactModal({ isOpen, onClose }) {
  const closeBtnRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    closeBtnRef.current?.focus?.()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError(null)

  // Manual validation
  if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
    setError('Please fill in all fields before submitting.')
    return
  }

  setLoading(true)

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (!res.ok) throw new Error('Failed to send message.')

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
      onClose()
    }, 2000)
  } catch (err) {
    console.error(err)
    setError('Something went wrong. Please try again.')
  } finally {
    setLoading(false)
  }
}

  if (!isOpen) return null

  const cardBase =
    'v-icon-tile v-hover-lift group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(var(--velore-ring),0.16)] focus-visible:ring-offset-0'
  const iconCircle =
    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 v-motion ' +
    'bg-[rgba(var(--velore-accent),0.08)] border border-[rgba(var(--velore-border-soft),0.9)] ' +
    'group-hover:bg-[rgba(var(--velore-accent),0.12)]'

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contact Velore"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-2xl max-h-[95vh] overflow-y-auto v-card-luxury v-soft-enter"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(var(--velore-border-soft),0.9)]">
          <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
          <button 
            onClick={onClose}
            className="v-icon-btn !w-10 !h-10"
            aria-label="Close"
            ref={closeBtnRef}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-[rgba(var(--velore-border-soft),0.9)]">
                <a
                  href="tel:+9611234567"
                  aria-label="Call Velore at +961 1 234 567"
                  className={cardBase}
                >
                  <div className="flex items-center gap-3">
                    <div className={iconCircle}>
                      <Phone size={16} className="text-gray-800" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Call us</p>
                      <p className="text-sm font-medium text-gray-900">+961 1 234 567</p>
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:hello@velore.com"
                  aria-label="Email Velore at hello@velore.com"
                  className={cardBase}
                >
                  <div className="flex items-center gap-3">
                    <div className={iconCircle}>
                      <Mail size={16} className="text-gray-800" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Email us</p>
                      <p className="text-sm font-medium text-gray-900 truncate">hello@velore.com</p>
                    </div>
                  </div>
                </a>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Beirut%2C%20Lebanon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Velore location in Google Maps"
                  className={cardBase}
                >
                  <div className="flex items-center gap-3">
                    <div className={iconCircle}>
                      <MapPin size={16} className="text-gray-800" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Visit us</p>
                      <p className="text-sm font-medium text-gray-900">Beirut, Lebanon</p>
                    </div>
                  </div>
                </a>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="v-input"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="v-input"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="v-input"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="v-input resize-none"
                />

                {/* Error message */}
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full v-btn-primary disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}