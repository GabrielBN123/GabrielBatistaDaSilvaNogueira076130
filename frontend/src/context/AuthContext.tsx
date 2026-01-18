import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthFacade, type User } from '../services/AuthFacade';

interface AuthContextType {
    user: User | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signOut: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Ao recarregar a página, verifica se já tem login salvo
    useEffect(() => {
        const currentUser = AuthFacade.getUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    async function signIn(email: string, pass: string) {
        const response = await AuthFacade.login(email, pass);
        setUser(response.user);
    }

    function signOut() {
        AuthFacade.logout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated: !!user }}>
            { children }
        </AuthContext.Provider>
    );
}

// Hook personalizado para facilitar o uso
export const useAuth = () => useContext(AuthContext);