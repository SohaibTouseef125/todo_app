import { useEffect } from 'react'

interface Props {
  message: string
  type: 'error' | 'success'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bg = type === 'error' ? 'bg-red-600' : 'bg-green-600'

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`${bg} flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg`}>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 cursor-pointer text-white/80 hover:text-white">
          ✕
        </button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  )
}
