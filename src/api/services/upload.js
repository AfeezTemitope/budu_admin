import client from '../client'
import ENDPOINTS from '../endpoints'

const uploadService = {
  // Upload any image — backend handles Cloudinary
  async image(file) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await client.post(ENDPOINTS.upload.image, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data // { url: "https://res.cloudinary.com/...", public_id: "..." }
  },
}

export default uploadService
