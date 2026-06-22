import { useState, useEffect } from 'react'
import type { Todo, CreateTodoPayload, UpdateTodoPayload } from '../api/todos'
import Toast from './Toast'

interface Props {
  initial?: Todo | null
  onSubmit: (data: CreateTodoPayload | UpdateTodoPayload) => void
  onCancel: () => void
  loading: boolean
}

export default function TodoForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'error' } | null>(null)

  useEffect(() => {
    if (initial) {
      setTitle(initial.title)
      setDescription(initial.description || '')
    } else {
      setTitle('')
      setDescription('')
    }
  }, [initial])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setToast({ message: 'Title is required', type: 'error' })
      return
    }
    if (title.trim().length < 2) {
      setToast({ message: 'Title must be at least 2 characters', type: 'error' })
      return
    }
    setToast(null)
    onSubmit({ title: title.trim(), description: description.trim() || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2 className="text-lg font-medium text-gray-900">
        {initial ? 'Edit Todo' : 'Add New Todo'}
      </h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?" required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details..." rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} disabled={loading}
          className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          Cancel
        </button>
        <button type="submit" disabled={loading || !title.trim()}
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Saving...' : initial ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  )
}
