import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../contexts'
import cartService from "../../../features/cart/cartService";
import { extractApiError } from '../../services/apiHelpers'
import { Check } from 'lucide-react'

export default function EyewearCard({ id, productId, product_id, image, name, price, description, colors }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const [addingToCart, setAddingToCart] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState(null)
  
  const productIdFinal = product_id || productId || id
  const favorited = isFavorite(productIdFinal)

  const safePrice = useMemo(() => {
    const n = Number(price)
    return Number.isFinite(n) ? n : 0
  }, [price])

  useEffect(() => {
    if (!added) return
    const t = setTimeout(() => setAdded(false), 1200)
    return () => clearTimeout(t)
  }, [added])

  const handleAddToCart = async (e) => {
  e.preventDefault()
  e.stopPropagation()
  
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  
  // ✅ Guest mode: ONLY localStorage
  if (!token) {
    const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
    const existing = localCart.find(item => item.productId === productIdFinal)
    
    if (existing) {
      existing.quantity += 1
    } else {
      localCart.push({
        productId: productIdFinal,
        name: name,
        price: parseFloat(price),
        image: image || '',
        quantity: 1
      })
    }
    
    localStorage.setItem('guestCart', JSON.stringify(localCart))
    setAdded(true)
    return  // ← STOP here
  }
  
  // ✅ Logged in: ONLY API
  setAddingToCart(true)
  setError(null)
  try {
    await cartService.addItem({
      productId: Number(productIdFinal),
      quantity: 1
    })
    setAdded(true)
  } catch (error) {
    const apiErr = extractApiError(error, 'Failed to add to cart')
    setError(apiErr.message)
  } finally {
    setAddingToCart(false)
  }
}

  return (
    <div className="v-card-luxury v-hover-lift relative flex flex-col w-full overflow-hidden group">
      <Link
        to="/ai-advisor"
        className="absolute top-4 right-4 bg-[rgb(var(--velore-pearl))]/80 backdrop-blur-sm text-[11px] px-3 py-1.5 rounded-full text-gray-800 hover:bg-[rgb(var(--velore-pearl))] transition z-10 border border-[rgba(var(--velore-border-soft),0.9)] tracking-[0.12em] uppercase"
      >
        Virtual Try-on
      </Link>

      <Link to={`/product/${productIdFinal}`} className="block">
        <div className="p-4 md:p-6 v-card-media border-b border-[rgba(var(--velore-border-soft),0.9)]">
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              decoding="async"
              className="w-full object-contain h-32 md:h-52 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-32 md:h-52 flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>

        {colors?.length ? (
          <div className="flex gap-2 px-4 md:px-6 pt-4">
            {colors.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className="w-3.5 h-3.5 rounded-full border border-gray-200/70"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : null}

        <div className="px-4 md:px-6 py-4">
          <p className="v-eyebrow mb-2">Velore</p>
          <h3 className="text-sm md:text-[15px] font-medium text-gray-900 mb-2 line-clamp-2">{name}</h3>
          <p className="v-price">${safePrice.toFixed(2)}</p>
          <p className="v-caption mt-2 hidden md:block line-clamp-2">{description}</p>
        </div>
      </Link>

      <div className="flex items-center gap-2 px-4 md:px-6 pb-5 mt-auto">
        <button 
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="flex-1 v-btn-primary !py-2.5 !px-4 !text-[12px] md:!text-[12px] inline-flex items-center justify-center gap-2"
        >
          {addingToCart ? 'Adding…' : added ? (<><Check size={16} aria-hidden="true" /> Added</>) : 'Add to cart'}
        </button>

        <button
          onClick={() => toggleFavorite({ id: productIdFinal, image, name, price, description, colors })}
          className="v-icon-btn text-gray-700 hover:text-gray-900"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 md:w-6 md:h-6"
            fill={favorited ? 'red' : 'none'}
            viewBox="0 0 24 24"
            stroke={favorited ? 'red' : 'currentColor'}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {error && (
        <div className="px-4 md:px-6 pb-5 text-xs text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}