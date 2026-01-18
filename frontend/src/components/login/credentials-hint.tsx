interface CredentialsHintProps {
  email: string
  password: string
}

export function CredentialsHint({ email, password }: CredentialsHintProps) {
  return (
    <div className="mt-6 text-center">
    <p className="text-xs py-2 px-4 rounded-full inline-block border transition-colors duration-300 text-amber-800 bg-amber-100 border-amber-300 dark:text-amber-500 dark:bg-stone-950/50 dark:border-stone-800">
        Credenciais: {email} / {password}
    </p>
</div>
  )
}
