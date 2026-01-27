"use client"

import type { LucideIcon } from "lucide-react"

interface LoginInputProps {
  label: string
  type: "email" | "password" | "text" | "number"
  value: string
  onChange: (value: string) => void
  placeholder: string
  icon: LucideIcon
  required?: boolean
}

export function Input({
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
      <label className="block text-sm font-bold text-amber-700 dark:text-stone-300 mb-1">
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 dark:text-stone-500 transition-colors duration-200" />

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-3 rounded-2xl transition-all duration-300 outline-none bg-white border-amber-300 text-amber-900 placeholder:text-amber-300/70 focus:ring-4 focus:ring-amber-300/50 focus:border-amber-500 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:placeholder-stone-600 dark:focus:ring-amber-900/40 dark:focus:border-amber-600"
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  )
}
