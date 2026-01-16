import { api } from './api';

// Tipagem forte (TypeScript exigido no edital)
export interface Tutor {
  id: number;
  nome: string;
  email: string;
}

// O Facade abstrai a complexidade das rotas
export class TutorFacade {
  
  // GET: Listar todos
  static async getAll(): Promise<Tutor[]> {
    const response = await api.get<Tutor[]>('/tutores');
    return response.data;
  }

  // GET: Buscar por ID (para edição)
  static async getById(id: number): Promise<Tutor> {
    const response = await api.get<Tutor>(`/tutores/${id}`);
    return response.data;
  }

  // POST: Criar novo
  // Omit<Tutor, 'id'> significa que enviamos tudo MENOS o ID (o banco gera)
  static async create(data: Omit<Tutor, 'id'>): Promise<Tutor> {
    const response = await api.post<Tutor>('/tutores', data);
    return response.data;
  }

  // PUT: Atualizar existente
  static async update(id: number, data: Partial<Tutor>): Promise<Tutor> {
    const response = await api.put<Tutor>(`/tutores/${id}`, data);
    return response.data;
  }

  // DELETE: Remover
  static async delete(id: number): Promise<void> {
    await api.delete(`/tutores/${id}`);
  }
}