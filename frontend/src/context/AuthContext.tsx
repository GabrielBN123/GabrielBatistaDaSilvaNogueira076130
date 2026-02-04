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
                const storedUser = AuthFacade.getUserFromStorage();

                if (!storedUser) {
                    if (mounted) setLoading(false);
                    return;
                }

                const isValid = AuthFacade.isTokenValid();

                if (isValid) {
                    if (mounted) setUser(storedUser);
                } else {
                    console.log("Token expirado. Tentando refresh...");

                    const newToken = await AuthFacade.refreshSession();

                    if (newToken && mounted) {
                        const freshUser = AuthFacade.getUserFromStorage();
                        setUser(freshUser);
                        console.log("Sessão restaurada com sucesso.");
                    } else {
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
        const checkTokenExpiration = async () => {
            if (!user) return;

            const secondsLeft = AuthFacade.getSecondsToExpiry();

            if (secondsLeft <= 0) {
                console.log("Token expirado (tempo esgotado). Tentando refresh ou logout...");

                const newToken = await AuthFacade.refreshSession();

                if (!newToken) {
                    console.log("Não foi possível renovar. Encerrando sessão.");
                    AuthFacade.logout();
                    toast.warning("Sua sessão expirou.");
                }
                return;
            }

            if (secondsLeft < 120) {
                console.log("Renovando token preventivamente...");
                await AuthFacade.refreshSession();
            }
        };

        checkTokenExpiration();
        const intervalId = setInterval(checkTokenExpiration, 30 * 1000);

        return () => clearInterval(intervalId);
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