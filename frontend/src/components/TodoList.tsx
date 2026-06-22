import { useState, useEffect } from 'react'
import { todoApi } from '../api/todos'
import type { Todo, CreateTodoPayload, UpdateTodoPayload } from '../api/todos'
import Toast from './Toast'
import TodoItem from './TodoItem'
import TodoForm from './TodoForm'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [editing, setEditing] = useState<Todo | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const res = await todoApi.getAll()
      setTodos(res.data.data.todos)
    } catch {
      setToast({ message: 'Failed to load todos. Make sure you are logged in.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleCreate = async (data: CreateTodoPayload | UpdateTodoPayload) => {
    setFormLoading(true)
    try {
      await todoApi.create(data as CreateTodoPayload)
      setShowForm(false)
      setToast({ message: 'Todo created!', type: 'success' })
      await fetchTodos()
    } catch {
      setToast({ message: 'Failed to create todo.', type: 'error' })
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (data: CreateTodoPayload | UpdateTodoPayload) => {
    if (!editing) return
    setFormLoading(true)
    try {
      await todoApi.update(editing._id, data as UpdateTodoPayload)
      setEditing(null)
      setShowForm(false)
      setToast({ message: 'Todo updated!', type: 'success' })
      await fetchTodos()
    } catch {
      setToast({ message: 'Failed to update todo.', type: 'error' })
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this todo?')) return
    try {
      await todoApi.delete(id)
      setToast({ message: 'Todo deleted!', type: 'success' })
      await fetchTodos()
    } catch {
      setToast({ message: 'Failed to delete todo.', type: 'error' })
    }
  }

  const handleStatusChange = async (id: string, status: Todo['status']) => {
    try {
      await todoApi.update(id, { status })
      setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)))
    } catch {
      setToast({ message: 'Failed to update status.', type: 'error' })
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditing(todo)
    setShowForm(true)
  }

  const handleCancel = () => {
    setEditing(null)
    setShowForm(false)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            + Add Todo
          </button>
        )}
      </div>

      {showForm && (
        <TodoForm initial={editing} onSubmit={editing ? handleUpdate : handleCreate} onCancel={handleCancel} loading={formLoading} />
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading todos...</div>
      ) : todos.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p className="text-lg">No todos yet</p>
          <p className="mt-1 text-sm">Click &quot;Add Todo&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
