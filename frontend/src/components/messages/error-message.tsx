interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div className="bg-red-100 text-red-700 p-3 rounded-2xl mb-4 text-sm border-2 border-red-300 flex items-center gap-2 animate-pulse">
      <span>🐾</span> {message}
    </div>
  )
}
