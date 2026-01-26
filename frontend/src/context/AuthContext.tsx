import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthFacade, type User } from '@/facades/AuthFacade';

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
    // 1. Começamos com null. A verdade virá do useEffect.
    const [user, setUser] = useState<User | null>(null);

    // 2. Loading começa true para "segurar" a renderização das rotas privadas
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function initializeAuth() {

            try {
                // Verifica se o método existe e é acessível
                const storedUser = AuthFacade.getUserFromStorage();

                if (!storedUser) {
                    if (mounted) setLoading(false);
                    return;
                }

                const isValid = AuthFacade.isTokenValid();

                if (isValid) {
                    if (mounted) setUser(storedUser);
                } else {
                    // SE TRAVAR AQUI, O PROBLEMA É NA SUA API OU NO AXIOS
                    const newToken = await AuthFacade.refreshSession();

                    if (newToken && mounted) {
                        setUser(storedUser);
                    } else {
                        AuthFacade.logout();
                        if (mounted) setUser(null);
                    }
                }
            } catch (error) {
                console.error("ERRO FATAL na inicialização:", error);
                if (mounted) setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        initializeAuth();

        // Mantemos a inscrição para atualizações em tempo real (ex: login/logout manual)
        const subscription = AuthFacade.user$.subscribe((newUser) => {
            if (mounted) setUser(newUser);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    async function signIn(email: string, pass: string) {
        await AuthFacade.login(email, pass);
    }

    function signOut() {
        AuthFacade.logout();
        setUser(null); // Garante a atualização visual imediata
    }

    // Enquanto estiver verificando o token, mostramos um loading.
    // Isso IMPEDE que a PrivateRoute redirecione para login indevidamente
    // ou que mostre o Dashboard com token inválido.
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-stone-950 z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-amber-500 font-medium">Verificando credenciais...</p>
                </div>
            </div>
        );
    }

    return (
        <Provider value={{ user, signIn, signOut, isAuthenticated: !!user, loading }}>
            {children}
        </Provider>
    );
}

export const useAuth = () => useContext(AuthContext);