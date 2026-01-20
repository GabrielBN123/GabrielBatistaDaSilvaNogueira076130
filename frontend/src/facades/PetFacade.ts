import { api } from '../services/api';

export interface Pet {
  id: number;
  nome: string;
  tipo: string; // Ex: Cachorro, Gato
  tutorId: number; // Relacionamento com Tutor
}

export class PetFacade {
  
  static async getAll(): Promise<Pet[]> {
    const response = await api.get<Pet[]>('/pets');
    return response.data;
  }

  static async create(data: Omit<Pet, 'id'>): Promise<Pet> {
    const response = await api.post<Pet>('/pets', data);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/pets/${id}`);
  }
  
  // Busca pets de um tutor específico (útil para detalhes)
  static async getByTutorId(tutorId: number): Promise<Pet[]> {
    const response = await api.get<Pet[]>(`/pets?tutorId=${tutorId}`);
    return response.data;
  }
}