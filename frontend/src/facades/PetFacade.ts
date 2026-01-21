import { api } from '../services/api';

export interface Pet {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: [
    {
      id: number,
      nome: string,
      raca: string,
      idade: number,
      foto: null
    },
  ];
}

export class PetFacade {

  static async getAll(page = 1, limit = 5): Promise<{ data: Pet[]; total: number }> {
    const response = await api.get<Pet[]>('/v1/pets', { params: { page, limit } });
    return {
      data: response.data,
      total: Number(response.headers['x-total-count'] || 0)
    };
  }

  static async create(data: Omit<Pet, 'id'>): Promise<Pet> {
    const response = await api.post<Pet>('/v1/pets', data);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/v1/pets/${id}`);
  }
  
  // Busca pets de um tutor específico (útil para detalhes)
  static async getByTutorId(tutorId: number): Promise<Pet[]> {
    const response = await api.get<Pet[]>(`/v1/pets?tutorId=${tutorId}`);
    return response.data;
  }
}