const CUSTOMER_TOKEN_KEY = 'token'
const ADMIN_TOKEN_KEY = 'admin_token'

export function isApiSuccess(result) {
  return !!result && result.success === true
}

export function getCustomerToken() {
  return localStorage.getItem(CUSTOMER_TOKEN_KEY) || sessionStorage.getItem(CUSTOMER_TOKEN_KEY)
}

export function setCustomerToken(token, { persist = true } = {}) {
  if (!token) return
  if (persist) localStorage.setItem(CUSTOMER_TOKEN_KEY, token)
  else sessionStorage.setItem(CUSTOMER_TOKEN_KEY, token)
}

export function clearCustomerToken() {
  localStorage.removeItem(CUSTOMER_TOKEN_KEY)
  sessionStorage.removeItem(CUSTOMER_TOKEN_KEY)
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || sessionStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token, { persist = false } = {}) {
  if (!token) return
  if (persist) localStorage.setItem(ADMIN_TOKEN_KEY, token)
  else sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
}

/**
 * Normalizes Axios/backend errors into a small, UI-friendly shape.
 * Preserves backend `message` when available.
 */
export function extractApiError(err, fallbackMessage = 'Request failed') {
  // Already normalized
  if (err && typeof err === 'object' && err.isApiError) return err

  const status = err?.response?.status
  const backend = err?.response?.data

  // Backend contract error envelope
  if (backend && typeof backend === 'object' && backend.success === false) {
    return {
      isApiError: true,
      status,
      message: backend.message || fallbackMessage,
      errors: Array.isArray(backend.errors) ? backend.errors : [],
      raw: backend,
    }
  }

  // Network / timeout / CORS
  if (err?.request && !err?.response) {
    const msg =
      err?.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : 'Network error. Please check your connection and try again.'
    return {
      isApiError: true,
      status: null,
      message: msg,
      errors: [],
      raw: err,
    }
  }

  // Plain Error or unknown
  return {
    isApiError: true,
    status: status ?? null,
    message: err?.message || fallbackMessage,
    errors: [],
    raw: err,
  }
}

