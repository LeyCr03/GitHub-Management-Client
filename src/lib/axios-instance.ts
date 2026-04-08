/**
 * Instancia de Axios configurada
 * Issue 03 - Cliente API
 *
 * Configuración centralizada con interceptores para:
 * - Autenticación (Bearer token)
 * - Manejo de errores
 */

import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Interceptor de request
 * Agrega token de autenticación si existe
 */
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Interceptor de response
 * Maneja errores de autenticación
 */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_username')
      // Opcional: redirigir a login
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance
