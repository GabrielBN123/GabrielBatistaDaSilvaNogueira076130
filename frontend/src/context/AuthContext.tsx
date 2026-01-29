import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthFacade } from '@/facades/AuthFacade';
import type { User } from '@/interfaces/auth.interface';

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
        setUser(null);
    }

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