import client from '../client'
import ENDPOINTS from '../endpoints'

const authService = {
  async login(email, password) {
    const { data } = await client.post(ENDPOINTS.auth.login, { email, password })
    localStorage.setItem('befa_access_token', data.access)
    localStorage.setItem('befa_refresh_token', data.refresh)
    localStorage.setItem('befa_user', JSON.stringify(data.user))
    return data
  },
  async me() {
    const { data } = await client.get(ENDPOINTS.auth.me)
    localStorage.setItem('befa_user', JSON.stringify(data))
    return data
  },
  logout() {
    localStorage.removeItem('befa_access_token')
    localStorage.removeItem('befa_refresh_token')
    localStorage.removeItem('befa_user')
    window.location.href = '/login'
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem('befa_user')) } catch { return null }
  },
  isAuthenticated() {
    return !!localStorage.getItem('befa_access_token')
  },
}
export default authService