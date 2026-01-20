import { LoginForm } from "../components/login/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-b from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900 p-4 relative overflow-hidden">
      <LoginForm
        title="Acessar o Sistema"
        subtitle="Faça seu login"
        defaultUsername="admin"
        defaultPassword="admin"
      />
    </div>
  )
}
