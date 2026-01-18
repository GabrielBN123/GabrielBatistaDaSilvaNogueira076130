"use client"

import type { LucideIcon } from "lucide-react"

interface LoginInputProps {
  label: string
  type: "email" | "password" | "text"
  value: string
  onChange: (value: string) => void
  placeholder: string
  icon: LucideIcon
  required?: boolean
}

export function LoginInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
}: LoginInputProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-bold text-amber-700 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-3 border-amber-300 rounded-2xl bg-white focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition-all text-amber-900 font-medium placeholder:text-amber-300"
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  )
}
