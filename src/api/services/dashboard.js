import client from '../client'
import ENDPOINTS from '../endpoints'

const dashboardService = {
  async getStats() {
    const { data } = await client.get(ENDPOINTS.dashboard.stats)
    return data
  },

  async getRecentPlayers() {
    const { data } = await client.get(ENDPOINTS.dashboard.recentPlayers)
    return data
  },

  async getPositionBreakdown() {
    const { data } = await client.get(ENDPOINTS.dashboard.positionBreakdown)
    return data
  },
}

export default dashboardService
