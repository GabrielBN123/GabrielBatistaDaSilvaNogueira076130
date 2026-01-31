import { AuthFacade } from './AuthFacade'; 
import { api } from '../services/api'; // Ajuste o número de ../ se necessário
import { firstValueFrom } from 'rxjs';

// Mock simplificado da API
jest.mock('../services/api', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

// Mock do jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({
    userId: 1,
    sub: 'admin',
    groups: ['ADMIN'],
    exp: Math.floor(Date.now() / 1000) + 3600
  }))
}));

// Importante para o mockedApi funcionar
const mockedApi = api as jest.Mocked<typeof api>;

describe('AuthFacade', () => {
  // Verifique se os 'it' estão aqui dentro
  it('teste de sanidade', () => {
    expect(true).toBe(true);
  });

  it('deve realizar login...', async () => {
     // ... seu código de login
  });
});