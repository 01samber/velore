import { adminApiClient } from './adminApiClient'

export const adminStaffService = {
  async list() {
    return adminApiClient.get('/admin/admins')
  },

  async create({ email, password, name, role }) {
    return adminApiClient.post('/admin/admins', { email, password, name, role })
  },
}

