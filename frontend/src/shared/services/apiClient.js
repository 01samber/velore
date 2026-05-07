import axios from 'axios'
import { clearAdminToken, clearCustomerToken, extractApiError, getAdminToken, getCustomerToken } from './apiHelpers'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000
})

/** True if request is for admin-only API routes. */
function isAdminApiRequest(config) {
  const raw = config.url || ''
  const path = raw.split('?')[0]
  const method = (config.method || 'get').toLowerCase()

  if (path.startsWith('/admin/') && path !== '/admin/login') return true
  if (path === '/reviews/pending') return true
  if (method === 'put' && /^\/reviews\/[^/]+\/(approve|reject)$/.test(path)) return true

  if (path.startsWith('/blogs')) {
    if (['post', 'put', 'patch', 'delete'].includes(method)) return true
  }

  return false
}

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = isAdminApiRequest(config) ? getAdminToken() : getCustomerToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const cfg = error.config || {}
    const adminRequest = isAdminApiRequest(cfg)
    const status = error.response?.status
    const path = (cfg.url || '').split('?')[0]
    const isLoginAttempt = path === '/admin/login' || path === '/auth/login'

    // Normalize error for UI
    const normalized = extractApiError(error)

    // Clean 401/403 handling without cross-logging-out.
    if ((status === 401 || status === 403) && !isLoginAttempt) {
      if (adminRequest) {
        clearAdminToken()
        localStorage.removeItem('velore_admin_user')
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
          window.location.assign('/admin/login')
        }
      } else {
        clearCustomerToken()
        localStorage.removeItem('user')
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.assign('/login')
        }
      }
    }

    return Promise.reject(normalized)
  }
)

export default apiClient
