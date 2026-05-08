import { adminApiClient } from './adminApiClient'

export const adminBlogService = {
  async listPublished() {
    return adminApiClient.get('/blogs')
  },
}

