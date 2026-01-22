import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from "jwt-decode"; // Importação nova
import { api } from "../services/api";

export interface User {
  id: number;
  name: string;
  username: string;
  groups?: string[];
}

// Interface do que vem DENTRO do token (Baseado no seu exemplo)
interface JwtPayload {
  userId: number;
  sub: string;       // Geralmente é o username (ex: "admin")
  groups: string[];
  exp: number;
  iss: string;
}

// Interface da resposta da API (O que você mandou agora)
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

export class AuthFacade {
  private static ACCESS_TOKEN_KEY = 'seletivo_mt_access';
  private static REFRESH_TOKEN_KEY = 'seletivo_mt_refresh';
  private static USER_KEY = 'seletivo_mt_user';

  private static userSubject = new BehaviorSubject<User | null>(AuthFacade.getUserFromStorage());
  public static user$ = AuthFacade.userSubject.asObservable();

  // --- TRATAMENTO SEGURO DE ERRO NO JSON.PARSE ---
  private static getUserFromStorage(): User | null {
    try {
      const data = localStorage.getItem(AuthFacade.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      // Se o dado estiver corrompido, limpa e retorna null
      localStorage.removeItem(AuthFacade.USER_KEY);
      return null;
    }
  }

  static async login(username: string, password: string): Promise<User> {
    // 1. Post na API
    const response = await api.post<LoginResponse>('/autenticacao/login', { username, password });
    
    // A API retorna apenas tokens, sem o objeto user explícito
    const { access_token, refresh_token } = response.data;

    // 2. Decodificamos o token para descobrir quem é o usuário
    const decoded = jwtDecode<JwtPayload>(access_token);

    // 3. Montamos o objeto User a partir do token
    const user: User = {
      id: decoded.userId,
      username: decoded.sub,
      name: decoded.sub.toUpperCase(), // O token não tem "name" completo, usamos o sub/username
      groups: decoded.groups
    };

    // 4. Salva TUDO no LocalStorage
    localStorage.setItem(this.ACCESS_TOKEN_KEY, access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    // 5. Notifica a aplicação
    this.userSubject.next(user);

    return user;
  }

  static async refreshSession(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await api.put<LoginResponse>('/autenticacao/refresh', {}, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });

      const { access_token, refresh_token: newRefreshToken } = response.data;

      // Atualiza os tokens no armazenamento
      localStorage.setItem(this.ACCESS_TOKEN_KEY, access_token);
      
      // Algumas APIs retornam um novo refresh token, outras mantém o mesmo.
      // Se vier um novo, salvamos.
      if (newRefreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, newRefreshToken);
      }

      return access_token;
    } catch (error) {
      // Se o refresh falhar (ex: o refresh token também venceu), aí sim desloga
      console.error("Falha ao renovar token", error);
      this.logout();
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static getUser(): User | null {
    return this.getUserFromStorage();
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}