import { TutorPetFacade } from './TutorPetFacade';
import { api } from '../services/api';
import { PetFacade } from './PetFacade';

jest.mock('../services/api', () => ({
  api: {
    post: jest.fn(),
    delete: jest.fn(),
  }
}));

// Mockamos também o PetFacade pois o TutorPetFacade chama o getAll() dele
jest.mock('./PetFacade', () => ({
  PetFacade: {
    getAll: jest.fn()
  }
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('TutorPetFacade', () => {
  it('deve chamar a rota correta ao vincular um pet a um tutor', async () => {
    mockedApi.post.mockResolvedValue({ data: {} });

    await TutorPetFacade.link(1, 10);

    expect(mockedApi.post).toHaveBeenCalledWith('/v1/tutores/1/pets/10');
    expect(PetFacade.getAll).toHaveBeenCalled(); // Garante que a lista foi atualizada
  });

  it('deve chamar a rota correta ao desvincular um pet', async () => {
    mockedApi.delete.mockResolvedValue({ data: {} });

    await TutorPetFacade.unlink(1, 10);

    expect(mockedApi.delete).toHaveBeenCalledWith('/v1/tutores/1/pets/10');
    expect(PetFacade.getAll).toHaveBeenCalled();
  });
});