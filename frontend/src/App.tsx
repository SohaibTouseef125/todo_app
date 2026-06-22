import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import TodoList from './components/TodoList'
import { authApi } from './api/auth'
import Toast from './components/Toast'

export default function App() {
  const [view, setView] = useState<'login' | 'register' | 'todos'>('login')
  const [checking, setChecking] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken')
    if (token) {
      authApi.me()
        .then(() => setView('todos'))
        .catch(() => {
          sessionStorage.removeItem('accessToken')
          setView('login')
        })
        .finally(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, [])

  const handleLogout = () => {
    authApi.logout().catch(() => {})
    sessionStorage.removeItem('accessToken')
    setToast({ message: 'Logged out successfully', type: 'success' })
    setTimeout(() => setView('login'), 300)
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (view === 'todos') {
    return (
      <div className="min-h-screen bg-gray-50">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Todo App</h1>
            <button onClick={handleLogout}
              className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Logout
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-8">
          <TodoList />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Todo App</h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-12">
        {view === 'login' ? (
          <LoginForm onSuccess={() => setView('todos')} onSwitch={() => setView('register')} />
        ) : (
          <RegisterForm onSuccess={() => setView('login')} onSwitch={() => setView('login')} />
        )}
      </main>
    </div>
  )
}
