import apiClient from '../../shared/services/apiClient'
import cartService from '../cart/cartService'
import { clearCustomerToken, extractApiError, isApiSuccess, setCustomerToken } from '../../shared/services/apiHelpers'

const clearCustomerStorage = () => {
  clearCustomerToken()
  localStorage.removeItem('user')
  localStorage.removeItem('guestCart')
  localStorage.removeItem('guestFavorites')
}

const mergeGuestCart = async () => {
  const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
  if (guestCart.length > 0) {
    for (const item of guestCart) {
      try {
        await cartService.addItem({
          productId: Number(item.productId),
          quantity: item.quantity || 1
        })
      } catch (err) {
        // Don't block login on partial cart merge failures.
        console.error('Failed to merge guest cart item:', item, err)
      }
    }
    localStorage.removeItem('guestCart')
  }
}

const authService = {
  login: async (data) => {
    try {
      clearCustomerStorage()
      const result = await apiClient.post('/auth/login', data)

      if (!isApiSuccess(result)) {
        throw extractApiError({ response: { status: 400, data: result } }, 'Login failed')
      }

      const token = result?.data?.token
      if (!token) {
        throw { isApiError: true, status: 500, message: 'Login succeeded but no token was returned.', errors: [], raw: result }
      }

      setCustomerToken(token, { persist: true })

      if (result?.data?.user) {
        localStorage.setItem('user', JSON.stringify(result.data.user))
      }

      // Merge guest cart into API cart (best-effort).
      await mergeGuestCart()

      return result
    } catch (err) {
      throw extractApiError(err, 'Login failed')
    }
  },

  register: async (data) => {
    try {
      clearCustomerStorage()
      const result = await apiClient.post('/auth/register', data)
      if (!isApiSuccess(result)) {
        throw extractApiError({ response: { status: 400, data: result } }, 'Registration failed')
      }
      return result
    } catch (err) {
      throw extractApiError(err, 'Registration failed')
    }
  },

  logout: () => {
    clearCustomerStorage()
  },

  getProfile: () => apiClient.get('/auth/profile'),
}

export default authService