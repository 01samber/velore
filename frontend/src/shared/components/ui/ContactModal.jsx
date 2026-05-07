// src/components/ui/ContactModal.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import apiClient from '../../services/apiClient'
import { extractApiError, isApiSuccess } from '../../services/apiHelpers'

export default function ContactModal({ isOpen, onClose }) {
  const PHONE_DISPLAY = '+961 1 234 567'
  const PHONE_TEL = '+9611234567'
  const EMAIL = 'hello@velore.com'
  const LOCATION = 'Beirut, Lebanon'
  const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(LOCATION)}`

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const closeBtnRef = useRef(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const infoCards = useMemo(() => ([
    { icon: Phone, label: 'Call us', value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}` },
    { icon: Mail, label: 'Email us', value: EMAIL, href: `mailto:${EMAIL}` },
    { icon: MapPin, label: 'Visit us', value: LOCATION, href: MAPS_URL, external: true },
  ]), [MAPS_URL])

  const validate = () => {
    const next = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.name.trim()) next.name = 'Name is required'
    if (!formData.email.trim()) next.email = 'Email is required'
    else if (!emailRegex.test(formData.email)) next.email = 'Please enter a valid email'
    if (!formData.subject.trim()) next.subject = 'Subject is required'
    if (!formData.message.trim()) next.message = 'Message is required'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    setLoading(true)
    try {
      const result = await apiClient.post('/contact', formData)
      if (!isApiSuccess(result)) {
        throw extractApiError({ response: { status: 400, data: result } }, result?.message || 'Failed to send message.')
      }

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setFieldErrors({})
        onClose()
      }, 1600)
    } catch (err) {
      const apiErr = extractApiError(err, 'Something went wrong. Please try again.')
      setError(apiErr.message)
    } finally {
      setLoading(false)
    }
  }

  // ESC close + basic focus
  useEffect(() => {
    if (!isOpen) return
    closeBtnRef.current?.focus?.()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/35 backdrop-blur-[2px] z-50 transition-opacity duration-300 v-motion v-soft-enter"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Contact Velore"
      >
        <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto v-card-luxury v-soft-enter">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-6 border-b border-[rgba(var(--velore-border-soft),0.9)]">
          <div>
            <p className="v-eyebrow mb-2">Support</p>
            <h2 className="v-h2 !text-xl md:!text-2xl">Contact Velore</h2>
            <p className="v-caption mt-2 inline-flex items-center gap-2">
              <Clock size={14} className="text-gray-500" aria-hidden="true" />
              We usually reply within 24 hours.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="v-icon-btn text-gray-700"
            aria-label="Close contact dialog"
            ref={closeBtnRef}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 md:px-8 md:py-8">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-5">
                <Send size={22} className="text-white" />
              </div>
              <p className="v-eyebrow mb-2">Sent</p>
              <h3 className="v-h2 !text-xl mb-2">Message delivered</h3>
              <p className="v-lead">We’ll get back to you shortly.</p>
            </div>
          ) : (
            <>
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {infoCards.map((c) => {
                  const Icon = c.icon
                  return (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noreferrer noopener" : undefined}
                      className="v-icon-tile v-hover-lift"
                      aria-label={`${c.label}: ${c.value}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="v-icon-circle" aria-hidden="true">
                          <Icon size={16} className="text-gray-800" />
                        </div>
                        <div className="min-w-0">
                          <p className="v-eyebrow">{c.label}</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{c.value}</p>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Form */}
              <div className="v-divider mb-8" />
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="v-label mb-2" htmlFor="contact-name">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`v-input ${fieldErrors.name ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''}`}
                      autoComplete="name"
                      aria-label="Name"
                    />
                    {fieldErrors.name ? <p className="v-field-error">{fieldErrors.name}</p> : null}
                  </div>
                  <div>
                    <label className="v-label mb-2" htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`v-input ${fieldErrors.email ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''}`}
                      autoComplete="email"
                      aria-label="Email"
                    />
                    {fieldErrors.email ? <p className="v-field-error">{fieldErrors.email}</p> : null}
                  </div>
                </div>
                <div>
                  <label className="v-label mb-2" htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`v-input ${fieldErrors.subject ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''}`}
                    aria-label="Subject"
                  />
                  {fieldErrors.subject ? <p className="v-field-error">{fieldErrors.subject}</p> : null}
                </div>
                <div>
                  <label className="v-label mb-2" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`v-input resize-none min-h-[160px] ${fieldErrors.message ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''}`}
                    aria-label="Message"
                  />
                  {fieldErrors.message ? <p className="v-field-error">{fieldErrors.message}</p> : null}
                </div>

                {/* Error message */}
                {error && (
                  <div className="v-banner-error">
                    <span className="min-w-0">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full v-btn-primary !rounded-xl"
                >
                  {loading ? 'Sending…' : 'Send message'}
                </button>
              </form>
            </>
          )}
        </div>
        </div>
      </div>
    </>
  )
}