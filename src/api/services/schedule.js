import client from '../client'
import ENDPOINTS from '../endpoints'

const scheduleService = {
  async list() { const { data } = await client.get(ENDPOINTS.schedule.list); return data },
  async create(d) { const { data } = await client.post(ENDPOINTS.schedule.create, d); return data },
  async update(id, d) { const { data } = await client.patch(ENDPOINTS.schedule.update(id), d); return data },
  async delete(id) { await client.delete(ENDPOINTS.schedule.delete(id)) },
}
export default scheduleService