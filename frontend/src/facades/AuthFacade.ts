import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { api } from "../services/api";
import axios from 'axios';
import type { JwtPayload, LoginResponse, User } from '@/interfaces/auth.interface';

export class AuthFacade {
  private static ACCESS_TOKEN_KEY = 'seletivo_mt_access';
  private static REFRESH_TOKEN_KEY = 'seletivo_mt_refresh';
  private static USER_KEY = 'seletivo_mt_user';

  private static userSubject = new BehaviorSubject<User | null>(AuthFacade.getUserFromStorage());
  public static user$ = AuthFacade.userSubject.asObservable();

  public static getUserFromStorage(): User | null {
    try {
      const data = localStorage.getItem(AuthFacade.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      localStorage.removeItem(AuthFacade.USER_KEY);
      return null;
    }
  }

  static async login(username: string, password: string): Promise<User> {
    const response = await api.post<LoginResponse>('/autenticacao/login', { username, password });

    const { access_token, refresh_token } = response.data;

    const decoded = jwtDecode<JwtPayload>(access_token);

    const user: User = {
      id: decoded.userId,
      username: decoded.sub,
      name: decoded.sub.toUpperCase(),
      groups: decoded.groups
    };

    localStorage.setItem(this.ACCESS_TOKEN_KEY, access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    this.userSubject.next(user);
    return user;
  }

  static async refreshSession(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const baseURL = 'https://pet-manager-api.geia.vip';

      const response = await axios.put<LoginResponse>(`${baseURL}/autenticacao/refresh`, {}, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });

      const { access_token, refresh_token: newRefreshToken } = response.data;

      localStorage.setItem(this.ACCESS_TOKEN_KEY, access_token);

      if (newRefreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, newRefreshToken);
      }

      return access_token;
    } catch (error) {
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

  static isTokenValid(): boolean {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (!token) return false;

    try {
      const decoded = jwtDecode<any>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > (currentTime + 10);
    } catch (error) {
      return false;
    }
  }

  static getSecondsToExpiry(): number {
    const token = this.getAccessToken();
    if (!token) return 0;

    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) return 0;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeRemaining = decoded.exp - currentTime;

      return timeRemaining > 0 ? timeRemaining : 0;
    } catch (error) {
      return 0;
    }
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