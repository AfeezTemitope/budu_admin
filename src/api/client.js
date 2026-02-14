import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach auth token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('befa_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle 401 redirect
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong'

    // Auto-redirect on 401 (expired/invalid token)
    if (error.response?.status === 401) {
      localStorage.removeItem('befa_access_token')
      localStorage.removeItem('befa_refresh_token')
      localStorage.removeItem('befa_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // 403 = not admin
    if (error.response?.status === 403) {
      toast.error('Admin access required')
    }

    // Server errors
    if (error.response?.status >= 500) {
      toast.error(message)
    }

    return Promise.reject({ message, status: error.response?.status, data: error.response?.data })
  }
)

export default client
