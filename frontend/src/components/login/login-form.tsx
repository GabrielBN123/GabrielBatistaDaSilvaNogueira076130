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
	defaultUsername?: string
	defaultPassword?: string
	onLogin?: (username: string, password: string) => Promise<boolean>
}

export function LoginForm({
	title = "Acessar sistema",
	subtitle = "Faça seu login",
	defaultUsername = "admin",
	defaultPassword = "admin",
	onLogin,
}: LoginFormProps) {
	const [username, setUsername] = useState(defaultUsername);
	const [password, setPassword] = useState(defaultPassword);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { signIn } = useAuth();
	const navigate = useNavigate();

	const handleUsernameChange = (val: string) => {
        setError("");
        setUsername(val);
    }

    const handlePasswordChange = (val: string) => {
        setError("")
        setPassword(val)
    }

	const validateForm = (): boolean => {
        if (!username || !password) {
            setError("Por favor, preencha todos os campos.")
            return false;
        }
        if (username.length < 1) {
            setError("Insira um nome de usuário válido.")
            return false;
        }
        if (password.length < 1) {
            setError("A senha deve ter pelo menos 1 caractere.")
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
				await signIn(username, password);
				navigate('/');
			} catch (err) {
				setError('Nome de usuário ou senha incorretos.');
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
					label="Nome de Usuário"
					type="text"
					value={username}
					onChange={handleUsernameChange}
					placeholder="nomeusuario"
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

			<CredentialsHint username={defaultUsername} password={defaultPassword} />
		</LoginCard>
	)
}
