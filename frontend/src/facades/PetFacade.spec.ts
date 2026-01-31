import { PetFacade } from './PetFacade';
import { api } from '../services/api'; // <--- Use caminho relativo aqui
import { firstValueFrom } from 'rxjs';

// Forçamos o mock no caminho que o Facade usa internamente
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
    // Reset manual do estado para garantir limpeza entre testes
    // @ts-ignore
    PetFacade.petSubject.next(PetFacade.initialState);
  });

  it('deve atualizar o estado ao chamar getAll', async () => {
    const mockPets = [{ id: 1, nome: 'Rex' }];
    
    // Simula exatamente a estrutura que o Axios entrega
    mockedApi.get.mockResolvedValue({ 
      data: mockPets 
    });

    await PetFacade.getAll();

    const state = await firstValueFrom(PetFacade.pets$);
    
    // Se continuar falhando aqui, adicione um console.log(PetFacade) 
    // antes do await para ver se os métodos existem.
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