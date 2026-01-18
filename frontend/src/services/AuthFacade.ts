// Simulamos um usuário e uma resposta de login
export interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export class AuthFacade {
  private static LOCAL_STORAGE_KEY = 'seletivo_mt_token';

  // Simula uma chamada API de Login
  static async login(email: string, password: string): Promise<LoginResponse> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validação Mockada (Para o teste, usaremos este login)
    if (email === 'admin@mt.gov.br' && password === '123456') {
      const response = {
        user: { id: 1, name: 'Administrador SEPLAG', email },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-token-seletivo-mt-2026'
      };
      
      // Salva no navegador (Persistência)
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(response));
      return response;
    }

    throw new Error('Credenciais inválidas. Tente admin@mt.gov.br / 123456');
  }

  static logout(): void {
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }

  static getUser(): User | null {
    const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data).user : null;
  }

  static getToken(): string | null {
    const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data).token : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}