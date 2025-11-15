import axios from 'axios'

// Create axios instance for API calls
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: false, // No cookies needed for token auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
