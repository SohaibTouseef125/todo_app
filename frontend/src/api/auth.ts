import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
})

export interface RegisterPayload {
  name: string
  email: string
  phoneNumber: string
  password: string
  consent: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  statusCode: number
  data: {
    user: {
      _id: string
      name: string
      email: string
    }
    accessToken: string
    refreshToken: string
  }
}

export const authApi = {
  register: (payload: RegisterPayload) => api.post<AuthResponse>('/register', payload),
  login: (payload: LoginPayload) => api.post<AuthResponse>('/login', payload),
  logout: () => api.put('/logout'),
  me: () => api.get('/user/me')
}
