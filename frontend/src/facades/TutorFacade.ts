import type { TutorPaginatedResponse, Tutor } from '@/interfaces/tutor.interface';
import { api } from '../services/api';

export class TutorFacade {

  static async getAll(nome = '', page = 0, size = 10): Promise<{ data: TutorPaginatedResponse[]; total: number }> {

    const params: any = {
      page,
      size
    };

    if (nome) {
      params.nome = nome;
    }

    const response = await api.get('/v1/tutores', { params });
    console.log('LOG: ', response);


    return {
      data: response.data,
      total: response.data.total || 'Não foram encontrados'
    };
  }

  static async getById(id: number | string): Promise<Tutor> {
    const response = await api.get<Tutor>(`/v1/tutores/${id}`);
    return response.data;
  }

  static async create(data: Omit<Tutor, 'id'>): Promise<Tutor> {
    const response = await api.post<Tutor>('/v1/tutores', data);
    return response.data;
  }

  static async uploadImage(id: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('foto', file); // Ou 'file', verifique o Swagger

    await api.post(`/v1/tutores/${id}/fotos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
      transformRequest: (data) => data
    },
    );
  }

  static async update(id: number, data: Partial<Tutor>): Promise<Tutor> {
    const response = await api.put<Tutor>(`/v1/tutores/${id}`, data);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/v1/tutores/${id}`);
  }
}