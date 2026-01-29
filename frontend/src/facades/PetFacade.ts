import type { Pet, PetPaginatedResponse } from '@/interfaces/pet.interface';
import { api } from '@/services/api';

export type PetCreateDTO = Omit<Pet, 'id' | 'foto'>;

export class PetFacade {

  static async getAll(nome = '', page = 0, raca = '', size = 10): Promise<{ data: PetPaginatedResponse[]; total: number }> {

    const params: any = {
      page,
      size
    };

    if (nome) {
      params.nome = nome;
    }

    if (raca) {
      params.raca = raca;
    }

    const response = await api.get('/v1/pets', { params });

    return {
      data: response.data,
      total: response.data.total || 'Não foram encontrados'
    };
  }

  static async getById(id: number | string): Promise<Pet> {
    const response = await api.get(`/v1/pets/${id}`);
    return response.data;
  }

  static async create(data: PetCreateDTO): Promise<Pet> {
    const response = await api.post<Pet>('/v1/pets', data);
    return response.data;
  }

  static async update(id: number, data: PetCreateDTO): Promise<Pet> {
    const response = await api.put<Pet>(`/v1/pets/${id}`, data);
    return response.data;
  }

  static async uploadImage(id: number, file: File): Promise<void> {
    const formData = new FormData();
    console.log(file);
    formData.append('foto', file);
    await api.post(`/v1/pets/${id}/fotos`, formData, {
      headers: {
        'Content-type': 'multpart/form-data',
      },
      timeout: 30000,
      transformRequest: (data, headers) => {
        return data;
      }
    });
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/v1/pets/${id}`);
  }

  static async getByTutorId(tutorId: number): Promise<Pet[]> {
    const response = await api.get<Pet[]>(`/v1/pets?tutorId=${tutorId}`);
    return response.data;
  }
}