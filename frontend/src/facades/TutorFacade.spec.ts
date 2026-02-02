import { TutorFacade } from './TutorFacade';
import { api } from '../services/api';
import { firstValueFrom } from 'rxjs';

jest.mock('../services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  }
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('TutorFacade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (TutorFacade as any).tutorSubject.next((TutorFacade as any).initialState);
  });

  it('deve carregar tutores e atualizar o estado', async () => {
    const mockTutores = [{ id: 1, nome: 'João Silva' }];
    mockedApi.get.mockResolvedValue({ 
        data: { 
            content: mockTutores,
            totalElements: 1 
        } 
    });

    await TutorFacade.getAll();

    const state = await firstValueFrom(TutorFacade.tutores$);
    
    expect(state.tutores).toEqual(expect.arrayContaining([expect.objectContaining({ nome: 'João Silva' })]));
    expect(state.loading).toBe(false);
    expect(mockedApi.get).toHaveBeenCalledWith('/v1/tutores', expect.any(Object));
  });

  it('deve setar erro no estado se a busca de tutores falhar', async () => {
    mockedApi.get.mockRejectedValue(new Error('Erro'));

    try { await TutorFacade.getAll(); } catch (e) {}

    const state = await firstValueFrom(TutorFacade.tutores$);
    expect(state.error).toBe('Erro ao carregar tutores');
  });
});