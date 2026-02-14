import client from '../client'
import ENDPOINTS from '../endpoints'

const contentService = {
  async list() { const { data } = await client.get(ENDPOINTS.content.list); return data },
  async create(d) { const { data } = await client.post(ENDPOINTS.content.create, d); return data },
  async update(id, d) { const { data } = await client.patch(ENDPOINTS.content.update(id), d); return data },
  async delete(id) { await client.delete(ENDPOINTS.content.delete(id)) },
  async uploadImage(id, file) {
    const fd = new FormData(); fd.append('file', file)
    const { data } = await client.post(ENDPOINTS.content.uploadImage(id), fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    return data
  },
}
export default contentService