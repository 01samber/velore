import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import logo from '../../../assets/logoEye-blue.png'

export default function Footer() {
    return (
        <footer className="border-t border-[rgba(var(--velore-border-soft),0.9)] v-section-muted pt-10 pb-6 px-6">

            {/* MOBILE layout — hidden on md and above */}
            <div className="md:hidden mb-10">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Velore Eyewear" className="w-32" />
                </div>

                {/* Contact tiles */}
                <div className="grid grid-cols-1 gap-3 mb-8">
                    <a
                        href="tel:+9611234567"
                        aria-label="Call Velore at +961 1 234 567"
                        className="v-icon-tile v-hover-lift group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(var(--velore-ring),0.16)]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="v-icon-circle group-hover:bg-[rgba(var(--velore-accent),0.12)] v-motion">
                                <Phone size={16} aria-hidden="true" />
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
                        className="v-icon-tile v-hover-lift group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(var(--velore-ring),0.16)]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="v-icon-circle group-hover:bg-[rgba(var(--velore-accent),0.12)] v-motion">
                                <Mail size={16} aria-hidden="true" />
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
                        className="v-icon-tile v-hover-lift group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(var(--velore-ring),0.16)]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="v-icon-circle group-hover:bg-[rgba(var(--velore-accent),0.12)] v-motion">
                                <MapPin size={16} aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Visit us</p>
                                <p className="text-sm font-medium text-gray-900">Beirut, Lebanon</p>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="flex justify-between mb-6">
                    <div>
                        <h4 className="text-xs font-semibold tracking-widest uppercase mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/shop?type=bestsellers" className="hover:text-black">Bestsellers</Link></li>
                            <li><Link to="/shop?type=limited" className="hover:text-black">Limited Collection</Link></li>
                            <li><Link to="/shop" className="hover:text-black">Shop All</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold tracking-widest uppercase mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/about" className="hover:text-black">Our Story</Link></li>
                            <li><button type="button" className="hover:text-black text-left" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Contact</button></li>
                        </ul>
                    </div>
                </div>
                <div className="w-full">
                    <h4 className="text-xs font-semibold tracking-widest uppercase mb-4">Subscribe to our newsletter</h4>
                    <div className="flex flex-col gap-2">
                        <input type="email" placeholder="Enter Your Email" className="v-input !rounded-xl !py-2.5" />
                        <button className="v-btn-secondary !rounded-xl !py-2.5 text-xs tracking-widest uppercase">Subscribe</button>
                    </div>
                </div>
            </div>

            {/* DESKTOP layout — hidden below md */}
            <div className="hidden md:flex justify-between items-start gap-10 mb-10">
                <div className="flex gap-16">
                    <div>
                        <h4 className="text-xs font-semibold tracking-widest uppercase mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/shop?type=bestsellers" className="hover:text-black">Bestsellers</Link></li>
                            <li><Link to="/shop?type=limited" className="hover:text-black">Limited Collection</Link></li>
                            <li><Link to="/shop" className="hover:text-black">Shop All</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold tracking-widest uppercase mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/about" className="hover:text-black">Our Story</Link></li>
                            <li><button type="button" className="hover:text-black text-left" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Contact</button></li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <img src={logo} alt="Velore Eyewear" className="w-36" />
                </div>
                <div className="max-w-xs w-full">
                    <h4 className="text-xs font-semibold tracking-widest uppercase mb-4">Subscribe to our newsletter</h4>
                    <div className="flex flex-col gap-2">
                        <input type="email" placeholder="Enter Your Email" className="v-input !rounded-xl !py-2.5" />
                        <button className="v-btn-secondary !rounded-xl !py-2.5 text-xs tracking-widest uppercase">Subscribe</button>
                    </div>
                </div>
            </div>

            {/* Middle section */}
            <div className="border-t border-gray-200 pt-6 mb-6">

                {/* Mobile layout — stacked */}
                <div className="flex flex-col items-center gap-4 md:hidden">
                    <div className="flex gap-4 text-gray-700">
                        {/* social icons here */}
                    </div>
                    <div className="text-xs text-gray-500">Payments available at checkout.</div>
                    <div className="flex gap-4 text-sm text-gray-600">
                        <select className="border border-gray-300 px-2 py-1 text-sm outline-none">
                            <option>United States (USD $)</option>
                            <option>Lebanon (LBP)</option>
                        </select>
                        <select className="border border-gray-300 px-2 py-1 text-sm outline-none">
                            <option>English</option>
                            <option>Arabic</option>
                        </select>
                    </div>
                </div>

                {/* Desktop layout — side by side with centered payment */}
                <div className="relative hidden md:flex items-center justify-between">
                    <div className="flex gap-4 text-gray-700">
                        {/* social icons here */}
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 text-xs text-gray-500">
                        Payments available at checkout.
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                        <select className="border border-gray-300 px-2 py-1 text-sm outline-none">
                            <option>United States (USD $)</option>
                            <option>Lebanon (LBP)</option>
                        </select>
                        <select className="border border-gray-300 px-2 py-1 text-sm outline-none">
                            <option>English</option>
                            <option>Arabic</option>
                        </select>
                    </div>
                </div>

            </div>

            {/* Bottom section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4 text-xs text-gray-500">
                <p>© 2026 Velore</p>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link to="/refund-policy" className="hover:text-black">Refund Policy</Link>
                    <Link to="/privacy-policy" className="hover:text-black">Privacy Policy</Link>
                    <Link to="/terms-of-service" className="hover:text-black">Terms Of Service</Link>
                    <Link to="/shipping-policy" className="hover:text-black">Shipping Policy</Link>
                </div>
            </div>

        </footer>
    )
}