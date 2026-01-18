import { PawPrint } from "lucide-react"

interface LoginButtonProps {
  isLoading?: boolean
  loadingText?: string
  text?: string
}

export function LoginButton({ isLoading = false, loadingText = "Entrando...", text = "Entrar" }: LoginButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-bold text-lg shadow-lg hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 border-2 border-amber-600"
    >
      {isLoading ? (
        <>
          <PawPrint className="w-5 h-5 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <PawPrint className="w-5 h-5" />
          {text}
        </>
      )}
    </button>
  )
}
