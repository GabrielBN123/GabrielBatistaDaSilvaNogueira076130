import { AuthFacade } from './AuthFacade';
import { api } from '../services/api';

jest.mock('../services/api', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({
    userId: 1,
    sub: 'admin',
    groups: ['ADMIN'],
    exp: Math.floor(Date.now() / 1000) + 3600
  }))
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('AuthFacade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('teste de sanidade (deve passar sempre)', () => {
    expect(true).toBe(true);
  });

  it('deve realizar login com sucesso', async () => {
    mockedApi.post.mockResolvedValue({
      data: {
        accessToken: 'token-falso-123',
        refreshToken: 'refresh-falso-456',
        user: { nome: 'Gabriel' }
      }
    });

    const response = await AuthFacade.login('admin', 'admin');

    expect(mockedApi.post).toHaveBeenCalledWith('/autenticacao/login', {
      email: 'admin',
      password: 'admin'
    });

    // Verifica se retornou
    expect(response).toHaveProperty('accessToken');
  });

  it('deve tratar erro no login', async () => {
    mockedApi.post.mockRejectedValue(new Error('Credenciais inválidas'));

    await expect(AuthFacade.login('errado@email.com', '0000'))
      .rejects
      .toThrow();
  });
});