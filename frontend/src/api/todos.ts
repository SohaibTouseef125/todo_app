import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Todo {
  _id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  user: string
  createdAt: string
  updatedAt: string
}

export interface CreateTodoPayload {
  title: string
  description?: string
}

export interface UpdateTodoPayload {
  title?: string
  description?: string
  status?: 'pending' | 'in_progress' | 'completed'
}

export const todoApi = {
  getAll: () => api.get<{ data: { todos: Todo[] } }>('/todos'),
  getById: (id: string) => api.get<{ data: { todo: Todo } }>(`/todos/${id}`),
  create: (payload: CreateTodoPayload) => api.post<{ data: { todo: Todo } }>('/todos', payload),
  update: (id: string, payload: UpdateTodoPayload) => api.put<{ data: { todo: Todo } }>(`/todos/${id}`, payload),
  delete: (id: string) => api.delete(`/todos/${id}`)
}
