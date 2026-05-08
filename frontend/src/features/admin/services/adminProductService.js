import { adminApiClient } from './adminApiClient'

export const adminProductService = {
  async list({ page = 1, limit = 20, search = '', is_active } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set('search', search)
    if (is_active !== undefined) params.set('is_active', String(is_active))
    return adminApiClient.get(`/admin/products?${params.toString()}`)
  },
}

