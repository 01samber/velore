import { useState, useEffect, useMemo, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logoEye-blue.png";
import { Search, User, Heart, ShoppingCart, Menu, X, ChevronDown, Sparkles, Glasses, BadgeInfo, BookOpen, Headphones } from "lucide-react";
import { useFavorites } from "../../contexts";
import apiClient from "../../../shared/services/apiClient";
import ProfileSidebar from "../../../features/profile/ProfileSidebar";
import { extractApiError } from "../../../shared/services/apiHelpers";

export default function Navbar({ onCartOpen, onContactOpen }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const currencyRef = useRef(null);
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
        setSearchError(null);
      }
      if (!e.target.closest(".currency-container")) {
        setCurrencyOpen(false);
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

  // Currency conversion rates can be added later when used in UI.

  const handleSearchClick = () => {
    if (!searchOpen) {
      setSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setSearchError(null);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchError(null);

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
        const apiErr = extractApiError(error, "Search failed");
        setSearchError(apiErr.message);
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
      setSearchError(null);
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

  const currencyOptions = useMemo(() => ([
    { value: "USD", label: "USD", detail: "$" },
    { value: "EUR", label: "EUR", detail: "€" },
    { value: "LBP", label: "LBP", detail: "ل.ل" },
  ]), []);

  const activeCurrency = currencyOptions.find(c => c.value === currency) || currencyOptions[0];

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isTransparent ? "bg-transparent" : "bg-[rgb(var(--velore-pearl))]/75 backdrop-blur border-b border-[rgba(var(--velore-border-soft),0.85)]"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 md:px-16">
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`md:hidden v-icon-btn ${
              isTransparent ? "text-white" : "text-gray-700"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden md:flex gap-7 flex-1 items-center">
            {[
              { to: "/shop", label: "Shop", Icon: Glasses },
              { to: "/about", label: "About", Icon: BadgeInfo },
              { to: "/blogs", label: "Journal", Icon: BookOpen },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "group relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] tracking-[0.18em] uppercase transition v-motion",
                    "hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
                    isTransparent
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-gray-800 hover:text-gray-900 hover:bg-[rgba(var(--velore-accent),0.06)]",
                    isActive
                      ? (isTransparent ? "bg-white/10 text-white" : "bg-[rgba(var(--velore-accent),0.08)] text-gray-900")
                      : "",
                  ].join(" ")
                }
                aria-label={item.label}
                title={item.label}
              >
                <item.Icon size={16} aria-hidden="true" className={isTransparent ? "text-white/85" : "text-gray-800"} />
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute left-3 right-3 -bottom-1 h-[2px] rounded-full transition-opacity",
                    isTransparent ? "bg-white/70" : "bg-[rgba(var(--velore-accent),0.55)]",
                    "opacity-0 group-hover:opacity-60",
                  ].join(" ")}
                />
              </NavLink>
            ))}
            <button
              onClick={handleContactClick}
              className={[
                "group relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] tracking-[0.18em] uppercase transition v-motion bg-transparent border-none cursor-pointer",
                "hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
                isTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-gray-800 hover:text-gray-900 hover:bg-[rgba(var(--velore-accent),0.06)]",
              ].join(" ")}
              aria-label="Contact"
              title="Contact"
            >
              <Headphones size={16} aria-hidden="true" className={isTransparent ? "text-white/85" : "text-gray-800"} />
              <span>Contact</span>
              <span
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute left-3 right-3 -bottom-1 h-[2px] rounded-full transition-opacity",
                  isTransparent ? "bg-white/70" : "bg-[rgba(var(--velore-accent),0.55)]",
                  "opacity-0 group-hover:opacity-60",
                ].join(" ")}
              />
            </button>
          </div>

          <Link to="/" className="flex-1 md:flex-none flex justify-center">
            <img src={logo} alt="Velore" className="h-10 object-contain" />
          </Link>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className="hidden md:block relative currency-container" ref={currencyRef}>
              <button
                type="button"
                aria-label="Currency"
                aria-haspopup="menu"
                aria-expanded={currencyOpen}
                onClick={() => setCurrencyOpen((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setCurrencyOpen(false);
                }}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] tracking-[0.14em] uppercase transition border",
                  isTransparent
                    ? "text-white/90 border-white/20 hover:border-white/35 hover:text-white bg-white/0"
                    : "text-gray-800 border-gray-200 hover:border-gray-300 bg-white",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
                ].join(" ")}
              >
                <span className="tabular-nums">{activeCurrency.label}</span>
                <span className={isTransparent ? "text-white/70" : "text-gray-500"}>{activeCurrency.detail}</span>
                <ChevronDown size={14} className={["transition", currencyOpen ? "rotate-180" : "", isTransparent ? "text-white/75" : "text-gray-500"].join(" ")} />
              </button>
              {currencyOpen && (
                <div className="absolute right-0 top-full mt-3 min-w-56 v-popover v-popover-anim">
                  <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-200/60">
                    <p className="v-eyebrow">Currency</p>
                  </div>
                  <div role="menu" aria-label="Currency options">
                    {currencyOptions.map((c) => (
                      <button
                        key={c.value}
                        role="menuitem"
                        onClick={() => {
                          setCurrency(c.value);
                          setCurrencyOpen(false);
                        }}
                        className="v-menu-item"
                      >
                        <span className="inline-flex items-center gap-3">
                          <span className="text-gray-900 font-medium tabular-nums">{c.label}</span>
                          <span className="text-gray-500">{c.detail}</span>
                        </span>
                        {currency === c.value ? <span className="text-xs text-gray-500">Selected</span> : null}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                  aria-label={searchOpen ? "Search" : "Open search"}
                  className={`v-icon-btn ${isTransparent ? "text-white hover:text-white/90 hover:bg-white/10" : "text-gray-800"}`}
                >
                  <Search size={18} />
                </button>
                {searchOpen && searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    className={`v-icon-btn ${isTransparent ? "text-white hover:text-white/90 hover:bg-white/10" : "text-gray-800"}`}
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setSearchError(null);
                      setSearchLoading(false);
                      setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                  >
                    <X size={18} />
                  </button>
                )}
              </form>

              {searchOpen && searchQuery.length >= 2 && searchLoading && (
                <div className="absolute top-full right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] v-popover v-popover-anim p-4">
                  <div className="space-y-3">
                    <div className="h-4 w-28 bg-gray-200/70 rounded animate-pulse" />
                    <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              )}

              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] v-popover v-popover-anim z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-200/60">
                    <p className="v-eyebrow">Results</p>
                  </div>
                  <div className="max-h-[22rem] overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product.product_id}
                      to={`/product/${product.product_id}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 border-b border-gray-100/70 last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
                    >
                      {product.product_variants?.[0]?.images?.[0] ? (
                        <img
                          src={product.product_variants?.[0]?.images?.[0]}
                          alt={product.name}
                          className="w-11 h-11 object-cover rounded-lg border border-gray-200/70"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg border border-gray-200/70 bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                          —
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {product.brands?.name} • {product.categories?.name}
                        </p>
                        <p className="v-price">${parseFloat(product.price).toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                  </div>
                </div>
              )}

              {searchOpen && searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
                <div className="absolute top-full right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] v-popover v-popover-anim z-50 p-6 text-center">
                  <p className="v-eyebrow mb-2">{searchError ? "Search error" : "No results"}</p>
                  <p className={searchError ? "text-sm text-red-700" : "text-sm text-gray-600"}>
                    {searchError ? searchError : "Try a different keyword or browse the shop."}
                  </p>
                  {!searchError ? (
                    <div className="mt-4 inline-flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Sparkles size={14} aria-hidden="true" />
                      Try “acetate”, “titanium”, or “round”.
                    </div>
                  ) : null}
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <button onClick={() => handleSearchChange({ target: { value: searchQuery } })} className="v-btn-secondary !px-4 !py-2.5">
                      Retry
                    </button>
                    <Link to="/shop" className="v-btn-ghost !px-4 !py-2.5" onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}>
                      Browse shop
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <button
                onClick={() => setProfileOpen(true)}
                title="My Profile"
                aria-label="Open profile"
                className={`hidden md:flex v-icon-btn bg-transparent border-none cursor-pointer ${isTransparent ? "text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"}`}
              >
                <User size={18} />
              </button>
            ) : (
              <Link
                to="/login"
                aria-label="Sign in"
                className={`hidden md:flex v-icon-btn ${isTransparent ? "text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"}`}
              >
                <User size={18} />
              </Link>
            )}

            <Link
              to="/favorite"
              aria-label="Favorites"
              className={`hidden md:flex v-icon-btn bg-transparent border-none cursor-pointer relative ${isTransparent ? "text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"}`}
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
              aria-label="Open cart"
              className={`hidden md:flex v-icon-btn bg-transparent border-none cursor-pointer ${isTransparent ? "text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"}`}
            >
              <ShoppingCart size={18} />
            </button>
            <button
              onClick={handleCartClick}
              aria-label="Open cart"
              className={`md:hidden v-icon-btn ${isTransparent ? "text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"}`}
            >
              <ShoppingCart size={18} />
            </button>

            <Link
              to="/ar"
              className={`hidden md:inline-flex items-center justify-center h-10 px-4 rounded-full text-[12px] font-semibold tracking-[0.18em] uppercase transition border ${
                isTransparent ? "bg-white/10 text-white border-white/15 hover:bg-white/15 hover:border-white/25" : "bg-gray-900 text-white border-gray-900 hover:bg-black"
              }`}
            >
              AR
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden flex flex-col px-6 pb-4 gap-4 border-t ${isTransparent ? "border-white/20 bg-black/20 backdrop-blur-sm" : "border-gray-200 bg-white"}`}>
            <NavLink to="/shop" onClick={() => setMenuOpen(false)} className={({ isActive }) => `text-sm transition-colors ${isTransparent ? "text-white hover:text-white/70" : "text-gray-800 hover:text-gray-500"} ${isActive ? "font-semibold" : "font-normal"}`}>Shop</NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)} className={({ isActive }) => `text-sm transition-colors ${isTransparent ? "text-white hover:text-white/70" : "text-gray-800 hover:text-gray-500"} ${isActive ? "font-semibold" : "font-normal"}`}>About</NavLink>
            <NavLink to="/blogs" onClick={() => setMenuOpen(false)} className={({ isActive }) => `text-sm transition-colors ${isTransparent ? "text-white hover:text-white/70" : "text-gray-800 hover:text-gray-500"} ${isActive ? "font-semibold" : "font-normal"}`}>Blogs</NavLink>
            <button onClick={handleContactClick} className={`text-left text-sm transition-colors bg-transparent border-none cursor-pointer ${isTransparent ? "text-white hover:text-white/70" : "text-gray-800 hover:text-gray-500"}`}>Contact</button>

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
              className={`v-select !w-auto !py-2 !text-xs !pr-9 bg-transparent ${isTransparent ? "text-white border-white/30 focus:border-white" : "text-gray-700 border-gray-200"}`}
            >
              <option value="USD" className="text-gray-900 bg-white">USD $</option>
              <option value="EUR" className="text-gray-900 bg-white">EUR €</option>
              <option value="LBP" className="text-gray-900 bg-white">LBP ل.ل</option>
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