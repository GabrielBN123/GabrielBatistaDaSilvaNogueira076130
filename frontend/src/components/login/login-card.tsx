import type React from "react"

interface LoginCardProps {
  children: React.ReactNode
  isWagging?: boolean
}

export function LoginCard({ children }: LoginCardProps) {
  return (
    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl shadow-2xl w-full max-w-md border-4 border-amber-400 transform hover:scale-[1.02] transition-transform duration-300">
      {children}
    </div>
  )
}
