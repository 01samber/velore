import { Link } from 'react-router-dom'
import sketchImage from '../assets/Veloresketch.jpeg'
import { Eye, Glasses, Sparkles, Headphones } from 'lucide-react'

export default function About() {
  return (
    <div className="v-page">
      <section className="px-6 md:px-16 pt-10 pb-6 v-section-muted">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Velore</p>
        <h1 className="v-title mb-3">About us</h1>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl">
          We’re focused on premium eyewear with a simple goal: help you find frames that feel right, look right,
          and arrive with the quality you expect.
        </p>
      </section>

      <section className="px-6 md:px-16 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { icon: Eye, label: 'Clarity', value: 'Clear guidance on fit & lenses' },
            { icon: Glasses, label: 'Comfort', value: 'Frames chosen for everyday wear' },
            { icon: Sparkles, label: 'Curated', value: 'A refined selection — no noise' },
            { icon: Headphones, label: 'Support', value: 'Help when you need it' },
          ].map(({ icon, label, value }) => {
            const Icon = icon
            return (
            <div key={label} className="v-card-luxury p-4 md:p-5">
              <div className="flex items-center gap-3">
                <div className="v-icon-circle" aria-hidden="true"><Icon size={16} className="text-gray-800" /></div>
                <div className="min-w-0">
                  <p className="v-eyebrow">{label}</p>
                  <p className="text-xs md:text-sm text-gray-700 leading-snug">{value}</p>
                </div>
              </div>
            </div>
          )})}
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="v-card-luxury p-6">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900">20+</span>
              <span className="text-sm text-gray-500">years</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Years of experience selecting frames and lenses with comfort, fit, and timeless design in mind.
              Explore the collection and use our tools to choose confidently.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/shop" className="v-btn-primary">Browse shop</Link>
              <Link to="/ai-advisor" className="v-btn-secondary">Try Virtual Try‑On</Link>
            </div>
          </div>

          <div className="v-card-luxury overflow-hidden">
            <div className="p-6 v-card-media">
              <img
                src={sketchImage}
                alt="Eyewear design sketches"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

