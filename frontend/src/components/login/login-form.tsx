"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Lock } from "lucide-react"

import { LoginCard } from "./login-card"
import { LoginHeader } from "./login-header"
import { Input } from "../ui/input"
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

	// Eliminar aviso de erro ao digitar no e-mail
	const handleEmailChange = (val: string) => {
        setError("");
        setEmail(val);
    }

	// Eliminar aviso de erro ao digitar na senha
    const handlePasswordChange = (val: string) => {
        setError("")
        setPassword(val)
    }

	const validateForm = (): boolean => {
        if (!email || !password) {
            setError("Por favor, preencha todos os campos.")
            return false;
        }
        // Regex simples para validar formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Insira um endereço de e-mail válido.")
            return false;
        }
        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.")
            return false;
        }
        return true;
    }

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) return

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
				<Input
					label="E-mail"
					type="email"
					value={email}
					onChange={handleEmailChange}
					placeholder="seu@email.com"
					icon={Mail}
					required
				/>

				<Input
					label="Senha"
					type="password"
					value={password}
					onChange={handlePasswordChange}
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
