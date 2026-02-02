import { PetFacade } from './PetFacade';
import { api } from '../services/api';
import { firstValueFrom } from 'rxjs';

jest.mock('../services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  }
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('PetFacade', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    PetFacade.petSubject.next(PetFacade.initialState);
  });

  it('deve atualizar o estado ao chamar getAll', async () => {
    const mockPets = [{ id: 1, nome: 'Rex' }];
    
    mockedApi.get.mockResolvedValue({ 
      data: mockPets 
    });

    await PetFacade.getAll();

    const state = await firstValueFrom(PetFacade.pets$);
    
    expect(state.pets).toEqual(mockPets);
    expect(state.loading).toBe(false);
  });

  it('deve disparar erro ao falhar o getAll', async () => {
    mockedApi.get.mockRejectedValue(new Error('API Error'));

    try {
      await PetFacade.getAll();
    } catch (e) {
      // Ignora o throw para validar o estado
    }

    const state = await firstValueFrom(PetFacade.pets$);
    expect(state.error).toBe('Erro ao carregar pets');
  });
});