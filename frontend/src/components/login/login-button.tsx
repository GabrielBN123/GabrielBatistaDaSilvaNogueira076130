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
    className="w-full py-3 rounded-2xl font-bold text-lg shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 border-2 text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-amber-600 dark:from-amber-700 dark:to-orange-800 dark:hover:from-amber-600 dark:hover:to-orange-700 dark:border-orange-900 dark:shadow-black/50">
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
