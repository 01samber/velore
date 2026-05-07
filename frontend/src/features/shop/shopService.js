import apiClient from '../../shared/services/apiClient'

const shopService = {
  getProducts: (params) => apiClient.get('/products', { params }),
  getProduct: (id) => apiClient.get(`/products/${id}`),
  searchProducts: (q, params) => apiClient.get('/products/search', { params: { q, ...(params || {}) } }),
  getCategories: () => apiClient.get('/categories'),
  getBrands: () => apiClient.get('/brands'),
}

export default shopService