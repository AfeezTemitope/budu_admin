import client from '../client'
import ENDPOINTS from '../endpoints'

const storeService = {
  async listProducts() { const { data } = await client.get(ENDPOINTS.store.products); return data },
  async createProduct(d) { const { data } = await client.post(ENDPOINTS.store.createProduct, d); return data },
  async updateProduct(id, d) { const { data } = await client.patch(ENDPOINTS.store.update(id), d); return data },
  async deleteProduct(id) { await client.delete(ENDPOINTS.store.delete(id)) },
  async uploadProductImage(id, file) {
    const fd = new FormData(); fd.append('file', file)
    const { data } = await client.post(ENDPOINTS.store.uploadImage(id), fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    return data
  },
  async listOrders() { const { data } = await client.get(ENDPOINTS.store.orders); return data },
  async updateOrder(id, d) { const { data } = await client.patch(ENDPOINTS.store.orderDetail(id), d); return data },
}
export default storeService