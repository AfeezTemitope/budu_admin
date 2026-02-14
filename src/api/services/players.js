import client from '../client'
import ENDPOINTS from '../endpoints'

const playersService = {
  // List all players with optional filters
  async list(params = {}) {
      const { data } = await client.get(ENDPOINTS.players.list, { params })
      // Handle paginated response (Django REST returns { count, results })
      return Array.isArray(data) ? data : data.results || []
    },

  // Get single player by ID
  async get(id) {
    const { data } = await client.get(ENDPOINTS.players.detail(id))
    return data
  },

  // Create new player (registration form data)
  async create(playerData) {
    const { data } = await client.post(ENDPOINTS.players.create, playerData)
    return data
  },

  // Update existing player
  async update(id, playerData) {
    const { data } = await client.patch(ENDPOINTS.players.update(id), playerData)
    return data
  },

  // Delete player
  async delete(id) {
    await client.delete(ENDPOINTS.players.delete(id))
  },

  // Upload player photo (file goes to backend → Cloudinary → URL saved)
  async uploadPhoto(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await client.post(ENDPOINTS.players.uploadPhoto(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data // { image_url: "https://res.cloudinary.com/..." }
  },

  // Download filled registration PDF
  downloadPdf(id) {
    return `${client.defaults.baseURL}${ENDPOINTS.players.downloadPdf(id)}`
  },

  // Upload filled PDF → OCR extraction → returns structured player data
  async extractFromPdf(file) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await client.post(ENDPOINTS.players.extractFromPdf, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // OCR can take longer
    })
    return data // Returns player form fields pre-filled from the PDF
  },
}

export default playersService
