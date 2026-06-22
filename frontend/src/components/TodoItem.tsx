import type { Todo } from '../api/todos'

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed'
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800'
}

interface Props {
  todo: Todo
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Todo['status']) => void
}

export default function TodoItem({ todo, onEdit, onDelete, onStatusChange }: Props) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <h3 className={`text-lg font-medium ${todo.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className="mt-1 text-sm text-gray-500">{todo.description}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[todo.status]}`}>
            {statusLabels[todo.status]}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(todo.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <select value={todo.status} onChange={(e) => onStatusChange(todo._id, e.target.value as Todo['status'])}
          className="cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none hover:border-gray-400">
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={() => onEdit(todo)}
          className="cursor-pointer rounded px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors">
          Edit
        </button>
        <button onClick={() => onDelete(todo._id)}
          className="cursor-pointer rounded px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">
          Delete
        </button>
      </div>
    </div>
  )
}
