import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../contexts'
import { Check } from 'lucide-react'
import cartService from "../../../features/cart/cartService";
import { resolveImageUrl } from "../../utils/imageUrl";

export default function EyewearCard({ id, productId, product_id, image, name, price, description, colors }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const [addingToCart, setAddingToCart] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  
  const productIdFinal = product_id || productId || id
  const favorited = isFavorite(productIdFinal)

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

    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1200)
    return  // ← STOP here
  }
  
  // ✅ Logged in: ONLY API
  setAddingToCart(true)
  try {
    await cartService.addItem({
      productId: Number(productIdFinal),
      quantity: 1
    })

    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1200)
  } catch (error) {
    console.error('Failed to add to cart:', error)
  } finally {
    setAddingToCart(false)
  }
}

  return (
    <div className="v-card-luxury v-hover-lift relative flex flex-col w-full overflow-hidden">
      <Link
        to="/ai-advisor"
        className="absolute top-3 right-3 bg-[rgb(var(--velore-pearl))]/85 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-gray-600 hover:bg-[rgb(var(--velore-pearl))] transition z-10 border border-[rgba(var(--velore-border-soft),0.9)]"
      >
        Virtual Try-on
      </Link>

      <Link to={`/product/${productIdFinal}`} className="block">
        <div className="p-3 md:p-6 v-card-media">
          {(() => {
            const src = resolveImageUrl(image)
            return src ? (
              <img
                src={src}
                alt={name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
                className="w-full object-contain h-32 md:h-48"
              />
            ) : (
              <div className="w-full h-32 md:h-48 flex items-center justify-center text-sm text-gray-500">
                No image
              </div>
            )
          })()}
        </div>

        <div className="flex gap-1 md:gap-2 px-3 md:px-4 mb-2 md:mb-3">
          {colors?.map((color, index) => (
            <div
              key={index}
              className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="px-3 md:px-4 mb-3 md:mb-4">
          <h3 className="font-medium text-xs md:text-sm text-gray-900 mb-1 line-clamp-2">{name}</h3>
          <p className="text-xs md:text-sm font-semibold text-gray-900 mb-1">${parseFloat(price).toFixed(2)}</p>
          <p className="text-xs text-gray-500 hidden md:block">{description}</p>
        </div>
      </Link>

      <div className="flex items-center gap-2 px-3 md:px-4 pb-3 md:pb-4 mt-auto">
        <button 
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="flex-1 v-btn-primary text-xs md:text-sm py-1.5 md:py-2 px-2 md:px-4 disabled:opacity-60"
        >
          {addingToCart ? 'Adding...' : justAdded ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Check size={16} aria-hidden="true" />
              Added
            </span>
          ) : 'Add to cart'}
        </button>

        <button
          onClick={() => toggleFavorite({ id: productIdFinal, image, name, price, description, colors })}
          className="transition-colors"
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
    </div>
  )
}