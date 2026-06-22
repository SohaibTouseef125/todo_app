import { useState } from 'react'
import { authApi } from '../api/auth'
import Toast from './Toast'

const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/

const EyeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
)

const EyeOffIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

interface Props {
  onSuccess: () => void
  onSwitch: () => void
}

export default function RegisterForm({ onSuccess: _onSuccess, onSwitch }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)

  const validate = (): string | null => {
    if (!name || name.length < 2) return 'Name must be at least 2 characters'
    if (!email) return 'Email is required'
    if (!phoneNumber || phoneNumber.length < 4) return 'Valid phone number is required'
    if (!password) return 'Password is required'
    if (password.length < 8 || password.length > 16) return 'Password must be 8-16 characters'
    if (!PASSWORD_REGEX.test(password)) return 'Password must include uppercase, lowercase, number, and special character'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setToast({ message: validationError, type: 'error' })
      return
    }
    setToast(null)
    setLoading(true)
    try {
      await authApi.register({ name, email, phoneNumber, password, consent: true })
      setToast({ message: 'Account created! Check your email to confirm.', type: 'success' })
      setRegistered(true)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setToast({ message: axiosErr.response?.data?.message || 'Registration failed', type: 'error' })
      } else {
        setToast({ message: 'Registration failed', type: 'error' })
      }
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Check Your Email</h1>
          <p className="text-gray-500">
            A confirmation link has been sent to <strong>{email}</strong>.
            Please confirm your account before signing in.
          </p>
          <button onClick={onSwitch} className="mt-6 cursor-pointer font-medium text-blue-600 hover:underline">
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required minLength={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="923001234567" required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <p className="mt-1 text-xs text-gray-400">Include country code without +</p>
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <input id="reg-password" type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              <button type="button" onClick={() => setShowPwd((p) => !p)}
                className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                {showPwd ? EyeOffIcon : EyeIcon}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char</p>
          </div>
          <button type="submit" disabled={loading}
            className="cursor-pointer w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button onClick={onSwitch} className="cursor-pointer font-medium text-blue-600 hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}
