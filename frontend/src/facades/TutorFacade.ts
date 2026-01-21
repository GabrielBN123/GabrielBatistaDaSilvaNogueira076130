import { api } from '../services/api';

// Tipagem forte (TypeScript exigido no edital)
export interface Tutor {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cidade?: string;
}

// O Facade abstrai a complexidade das rotas
export class TutorFacade {
  
  // GET: Listar todos
  static async getAll(nome = '',page = 1, limit = 5): Promise<{ data: Tutor[]; total: number }> {
    const response = await api.get<Tutor[]>('/v1/tutores', { params: {nome, page, limit } });
    return {
      data: response.data,
      total: Number(response.headers['x-total-count'] || 0)
    };
  }

  // GET: Buscar por ID (para edição)
  static async getById(id: number): Promise<Tutor> {
    const response = await api.get<Tutor>(`/v1/tutores/${id}`);
    return response.data;
  }

  // POST: Criar novo
  // Omit<Tutor, 'id'> significa que enviamos tudo MENOS o ID (o banco gera)
  static async create(data: Omit<Tutor, 'id'>): Promise<Tutor> {
    const response = await api.post<Tutor>('/v1/tutores', data);
    return response.data;
  }

  // PUT: Atualizar existente
  static async update(id: number, data: Partial<Tutor>): Promise<Tutor> {
    const response = await api.put<Tutor>(`/v1/tutores/${id}`, data);
    return response.data;
  }

  // DELETE: Remover
  static async delete(id: number): Promise<void> {
    await api.delete(`/v1/tutores/${id}`);
  }
}