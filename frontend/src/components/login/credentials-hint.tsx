interface CredentialsHintProps {
  email: string
  password: string
}

export function CredentialsHint({ email, password }: CredentialsHintProps) {
  return (
    <div className="mt-6 text-center">
      <p className="text-xs text-amber-600 bg-amber-100 py-2 px-4 rounded-full inline-block border border-amber-300">
        Credenciais: {email} / {password}
      </p>
    </div>
  )
}
