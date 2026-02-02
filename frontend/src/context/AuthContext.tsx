import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthFacade } from '@/facades/AuthFacade';
import type { User } from '@/interfaces/auth.interface';
import { Loading } from '@/components/ui/loading';
import { toast } from 'react-toastify';

interface AuthContextType {
    user: User | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signOut: () => void;
    isAuthenticated: boolean;
    loading: boolean; // Adicionado para expor o estado de carregamento se necessário
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const { Provider } = AuthContext;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function initializeAuth() {
            try {
                // tenta pegar o usuário salvo (independente da validade do token por enquanto)
                const storedUser = AuthFacade.getUserFromStorage();

                if (!storedUser) {
                    if (mounted) setLoading(false);
                    return;
                }

                // verifica se o Token de Acesso ainda é válido
                const isValid = AuthFacade.isTokenValid();

                if (isValid) {
                    // Tudo certo, restaura o usuário
                    if (mounted) setUser(storedUser);
                } else {
                    // Token expirado. Tenta renovar via Refresh Token.
                    console.log("Token expirado. Tentando refresh...");
                    
                    // Nota: Verifique se o refreshSession retorna o token string ou boolean
                    const newToken = await AuthFacade.refreshSession();

                    if (newToken && mounted) {
                        const freshUser = AuthFacade.getUserFromStorage();
                        setUser(freshUser);
                        console.log("Sessão restaurada com sucesso.");
                    } else {
                        // falhou
                        throw new Error("Refresh failed");
                    }
                }
            } catch (error) {
                console.error("Sessão inválida ou expirada:", error);
                AuthFacade.logout();
                if (mounted) setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        initializeAuth();

        const subscription = AuthFacade.user$.subscribe((newUser) => {
            if (mounted) setUser(newUser);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        // Função de monitoramento
        const checkTokenExpiration = async () => {
            if (!user) return; // Só verifica se tiver usuário logado

            const secondsLeft = AuthFacade.getSecondsToExpiry();
            
            // Regra 1: Se faltar menos de 2 minutos, tenta renovar silenciosamente (Auto-Refresh)
            if (secondsLeft < 120 && secondsLeft > 0) {
                console.log("Token expirando em breve. Renovando automaticamente...");
                const newToken = await AuthFacade.refreshSession();
                if (!newToken) {
                    // Se falhar o auto-refresh, avisa o usuário que a sessão vai cair
                    toast.warning("Sua sessão expirou. Por favor, faça login novamente.");
                    setUser(null);
                }
            } 
            
            // Regra 2: Se já expirou (0 segundos), faz logout
            else if (secondsLeft === 0) {
                console.log("Token expirado. Encerrando sessão.");
                setUser(null);
                AuthFacade.logout();
            }
        };

        // Roda a verificação imediatamente e depois a cada 30 segundos
        checkTokenExpiration(); // Checa ao montar
        const intervalId = setInterval(checkTokenExpiration, 30 * 1000);

        return () => clearInterval(intervalId); // Limpa ao desmontar
    }, [user]);

    async function signIn(email: string, pass: string) {
        await AuthFacade.login(email, pass);
    }

    function signOut() {
        AuthFacade.logout();
        setUser(null);
    }

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <Provider value={{ user, signIn, signOut, isAuthenticated: !!user, loading }}>
            {children}
        </Provider>
    );
}

export const useAuth = () => useContext(AuthContext);