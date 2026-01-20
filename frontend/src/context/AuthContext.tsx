import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthFacade, type User } from '../facades/AuthFacade';

interface AuthContextType {
    user: User | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signOut: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const { Provider } = AuthContext;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(AuthFacade.getUser());

    useEffect(() => {
        const subscription = AuthFacade.user$.subscribe((newUser) => {
            setUser(newUser);
        });
        return () => subscription.unsubscribe();
    }, []);

    async function signIn(email: string, pass: string) {
        await AuthFacade.login(email, pass);
    }

    function signOut() {
        AuthFacade.logout();
    }

    const isAuth = !!user || AuthFacade.isAuthenticated();

    return (
        <Provider value={{ user, signIn, signOut, isAuthenticated: isAuth }}>
            { children }
        </Provider>
    );
}

export const useAuth = () => useContext(AuthContext);