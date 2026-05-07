import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logoEye-blue.png";
import {
  BadgeInfo,
  BookOpen,
  Glasses,
  Headphones,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useFavorites } from "../../contexts";
import apiClient from "../../../shared/services/apiClient";
import ProfileSidebar from "../../../features/profile/ProfileSidebar";
import { resolveImageUrl } from "../../utils/imageUrl";

export default function Navbar({ onCartOpen, onContactOpen }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const location = useLocation();

  const { favorites } = useFavorites();
  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setSearchOpen(false);
        setSearchResults([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 50);
  }, [location.pathname]);

  const handleSearchClick = () => {
    if (!searchOpen) {
      setSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const result = await apiClient.get(`/products/search?q=${encodeURIComponent(value)}`);
        setSearchResults(result?.data || []);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleCartClick = () => {
    if (onCartOpen) onCartOpen();
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (onContactOpen) onContactOpen();
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("guestCart");
    localStorage.removeItem("guestFavorites");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const navItemClass = (active) =>
    `inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition v-motion ${
      active
        ? "bg-[rgba(var(--velore-accent),0.10)] text-gray-900"
        : isTransparent
          ? "text-white hover:bg-white/10"
          : "text-gray-800 hover:bg-[rgba(var(--velore-accent),0.06)]"
    }`;

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isTransparent
            ? "bg-transparent"
            : "bg-[rgb(var(--velore-pearl))]/80 backdrop-blur border-b border-[rgba(var(--velore-border-soft),0.85)]"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <button
            className={`md:hidden p-1 transition-colors ${
              isTransparent ? "text-white" : "text-gray-700"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden md:flex gap-2 flex-1">
            <NavLink to="/shop" className={({ isActive }) => navItemClass(isActive)} aria-label="Shop" title="Shop">
              <Glasses size={18} aria-hidden="true" />
              <span>Shop</span>
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => navItemClass(isActive)} aria-label="About" title="About">
              <BadgeInfo size={18} aria-hidden="true" />
              <span>About</span>
            </NavLink>
            <NavLink to="/blogs" className={({ isActive }) => navItemClass(isActive)} aria-label="Journal" title="Journal">
              <BookOpen size={18} aria-hidden="true" />
              <span>Journal</span>
            </NavLink>
            <button onClick={handleContactClick} className={navItemClass(false)} aria-label="Contact" title="Contact" type="button">
              <Headphones size={18} aria-hidden="true" />
              <span>Contact</span>
            </button>
          </div>

          <Link to="/" className="flex-1 md:flex-none flex justify-center">
            <img src={logo} alt="Velore" className="h-13 object-contain" />
          </Link>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`hidden md:block bg-transparent border-none text-xs cursor-pointer outline-none transition-colors ${isTransparent ? "text-white" : "text-gray-500"}`}
            >
              <option value="USD" className="text-gray-900 bg-white">UNITED STATES (USD $)</option>
              <option value="EUR" className="text-gray-900 bg-white">EUROPE (EUR €)</option>
              <option value="LBP" className="text-gray-900 bg-white">LEBANON (LBP ل.ل)</option>
            </select>

            <div className="flex items-center relative search-container">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`transition-all duration-300 ease-in-out bg-transparent outline-none text-sm border-b ${
                    isTransparent
                      ? "border-white text-white placeholder:text-white/70"
                      : "border-gray-400 text-gray-800"
                  } ${searchOpen ? "w-40 md:w-56 opacity-100 ml-2" : "w-0 opacity-0 ml-0"}`}
                />
                <button
                  type={searchOpen ? "submit" : "button"}
                  onClick={searchOpen ? undefined : handleSearchClick}
                  className={`p-1 transition-colors ${isTransparent ? "text-white hover:text-white/70" : "text-gray-700 hover:text-black"}`}
                  aria-label={searchOpen ? "Search" : "Open search"}
                >
                  <Search size={18} />
                </button>
              </form>

              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-72 v-popover v-popover-anim z-50 max-h-96 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product.product_id}
                      to={`/product/${product.product_id}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="flex items-center gap-3 p-3 v-menu-item border-b border-[rgba(var(--velore-border-soft),0.7)] last:border-b-0"
                    >
                      {(() => {
                        const raw = product.product_variants?.[0]?.images?.[0] || null;
                        const src = resolveImageUrl(raw);
                        return src ? (
                          <img
                            src={src}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                            className="w-10 h-10 object-cover rounded-sm bg-[rgb(var(--velore-canvas-muted))]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-sm bg-[rgb(var(--velore-canvas-muted))] border border-[rgba(var(--velore-border-soft),0.9)] flex items-center justify-center text-xs text-gray-500">
                            —
                          </div>
                        );
                      })()}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          {product.brands?.name} • {product.categories?.name}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">${parseFloat(product.price).toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {searchOpen && searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
                <div className="absolute top-full right-0 mt-2 w-72 v-popover v-popover-anim z-50 p-4 text-center text-sm text-gray-600">
                  No products found
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <button
                onClick={() => setProfileOpen(true)}
                title="My Profile"
                className={`hidden md:flex p-1 transition-colors bg-transparent border-none cursor-pointer ${isTransparent ? "text-white hover:text-white/70" : "text-gray-700 hover:text-black"}`}
              >
                <User size={18} />
              </button>
            ) : (
              <Link
                to="/login"
                className={`hidden md:flex p-1 transition-colors ${isTransparent ? "text-white hover:text-white/70" : "text-gray-700 hover:text-black"}`}
              >
                <User size={18} />
              </Link>
            )}

            <Link
              to="/favorite"
              className={`hidden md:flex p-1 transition-colors bg-transparent border-none cursor-pointer relative ${isTransparent ? "text-white hover:text-white/70" : "text-gray-700 hover:text-black"}`}
            >
              <Heart size={18} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <button
              onClick={handleCartClick}
              className={`hidden md:flex p-1 transition-colors bg-transparent border-none cursor-pointer ${isTransparent ? "text-white hover:text-white/70" : "text-gray-700 hover:text-black"}`}
            >
              <ShoppingCart size={18} />
            </button>
            <button
              onClick={handleCartClick}
              className={`md:hidden p-1 transition-colors ${isTransparent ? "text-white hover:text-white/70" : "text-gray-700 hover:text-black"}`}
            >
              <ShoppingCart size={18} />
            </button>

            <Link
              to="/ar"
              className={`text-xs font-bold rounded px-2 py-1 tracking-wide transition-colors ${isTransparent ? "bg-white/20 text-white hover:bg-white/40" : "bg-gray-900 text-white hover:bg-gray-700"}`}
            >
              AR
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className={`md:hidden flex flex-col px-6 pb-4 gap-3 border-t ${
              isTransparent
                ? "border-white/20 bg-black/20 backdrop-blur-sm"
                : "border-[rgba(var(--velore-border-soft),0.85)] bg-[rgb(var(--velore-pearl))]/90 backdrop-blur"
            }`}
          >
            <NavLink
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm py-2 ${isActive ? "text-gray-900 font-semibold" : isTransparent ? "text-white" : "text-gray-700"}`
              }
            >
              <Glasses size={18} aria-hidden="true" />
              Shop
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm py-2 ${isActive ? "text-gray-900 font-semibold" : isTransparent ? "text-white" : "text-gray-700"}`
              }
            >
              <BadgeInfo size={18} aria-hidden="true" />
              About
            </NavLink>
            <NavLink
              to="/blogs"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm py-2 ${isActive ? "text-gray-900 font-semibold" : isTransparent ? "text-white" : "text-gray-700"}`
              }
            >
              <BookOpen size={18} aria-hidden="true" />
              Journal
            </NavLink>
            <button
              onClick={handleContactClick}
              className={`flex items-center gap-2 text-left text-sm py-2 bg-transparent border-none cursor-pointer ${
                isTransparent ? "text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"
              }`}
              type="button"
            >
              <Headphones size={18} aria-hidden="true" />
              Contact
            </button>

            <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
              {isLoggedIn ? (
                <button
                  onClick={() => { setMenuOpen(false); setProfileOpen(true); }}
                  className="relative bg-transparent border-none cursor-pointer"
                >
                  <User size={18} className={isTransparent ? "text-white" : "text-gray-700"} />
                </button>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <User size={18} className={isTransparent ? "text-white" : "text-gray-700"} />
                </Link>
              )}

              <Link to="/favorite" onClick={() => setMenuOpen(false)} className="relative">
                <Heart size={18} className={isTransparent ? "text-white" : "text-gray-700"} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`bg-transparent border-none text-xs cursor-pointer outline-none w-fit ${isTransparent ? "text-white" : "text-gray-500"}`}
            >
              <option value="USD" className="text-gray-900 bg-white">UNITED STATES (USD $)</option>
              <option value="EUR" className="text-gray-900 bg-white">EUROPE (EUR €)</option>
              <option value="LBP" className="text-gray-900 bg-white">LEBANON (LBP ل.ل)</option>
            </select>
          </div>
        )}
      </nav>

      <ProfileSidebar
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onLogout={handleLogout}
        onContactOpen={onContactOpen}
      />
    </>
  );
}