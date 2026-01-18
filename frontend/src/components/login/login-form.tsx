"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Lock } from "lucide-react"

import { LoginCard } from "./login-card"
import { LoginHeader } from "./login-header"
import { LoginInput } from "./login-input"
import { LoginButton } from "./login-button"
import { ErrorMessage } from "../messages/error-message"
import { CredentialsHint } from "./credentials-hint"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

interface LoginFormProps {
  title?: string
  subtitle?: string
  defaultEmail?: string
  defaultPassword?: string
  onLogin?: (email: string, password: string) => Promise<boolean>
}

export function LoginForm({
  title = "Acessar sistema",
  subtitle = "Faça seu login",
  defaultEmail = "admin@mt.gov.br",
  defaultPassword = "123456",
  onLogin,
}: LoginFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    setTimeout(async () => {
      try {
        await signIn(email, password);
        navigate('/'); // Redireciona para home após sucesso
      } catch (err) {
        setError('E-mail ou senha incorretos.');
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <LoginCard isWagging={isLoading}>
      <LoginHeader title={title} subtitle={subtitle} />

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-5 mt-6">
        <LoginInput
          label="E-mail"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="seu@email.com"
          icon={Mail}
          required
        />

        <LoginInput
          label="Senha"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••"
          icon={Lock}
          required
        />

        <LoginButton isLoading={isLoading} />
      </form>

      <CredentialsHint email={defaultEmail} password={defaultPassword} />
    </LoginCard>
  )
}
