import type { TutorPaginatedResponse, Tutor } from '@/interfaces/tutor.interface';
import { api } from '../services/api';
import { BehaviorSubject } from 'rxjs';

export interface TutorState {
  tutores: TutorPaginatedResponse[];
  loading: boolean;
  error: string | null;
  total: number | string;
}

export class TutorFacade {

  private static initialState: TutorState = {
    tutores: [],
    loading: false,
    error: null,
    total: 0
  };

  private static tutorSubject = new BehaviorSubject<TutorState>(TutorFacade.initialState);
  public static tutores$ = TutorFacade.tutorSubject.asObservable();

  private static updateState(newState: Partial<TutorState>) {
    this.tutorSubject.next({ ...this.tutorSubject.value, ...newState });
  }

  static async getAll(nome = '', page = 0, size = 10): Promise<{ data: TutorPaginatedResponse[]; total: number }> {
    this.updateState({ loading: true, error: null });

    try {
      const params = { page, size, ...(nome && { nome }) };
      const response = await api.get('/v1/tutores', { params });
      
      const result = {
        data: response.data,
        total: response.data.total || 0
      };

      this.updateState({ tutores: result.data, total: result.total, loading: false });
      return result;
    } catch (error) {
      this.updateState({ error: 'Erro ao carregar tutores', loading: false });
      throw error;
    }
  }

  static async getById(id: number | string): Promise<Tutor> {
    const response = await api.get<Tutor>(`/v1/tutores/${id}`);
    return response.data;
  }

  static async create(data: Omit<Tutor, 'id'>): Promise<Tutor> {
    const response = await api.post<Tutor>('/v1/tutores', data);
    await this.getAll();
    return response.data;
  }

  static async uploadImage(id: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('foto', file);

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
    await this.getAll();
  }
}