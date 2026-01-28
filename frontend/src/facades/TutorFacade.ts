import { api } from '../services/api';

interface Foto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

interface Tutor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: string | null;
  foto: Foto | null;
  pet: Pet[] | null
}
export interface TutorPaginatedResponse {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Tutor[];
}

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: {
    id: number;
    nome: string;
    url: string;
  } | null;
}

// O Facade abstrai a complexidade das rotas
export class TutorFacade {

  static async getAll(nome = '', page = 0, limit = 10): Promise<{ data: TutorPaginatedResponse[]; total: number }> {

    const params: any = {
      page,
      limit
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

  // GET: Buscar por ID (para edição)
  static async getById(id: number | string): Promise<Tutor> {
    const response = await api.get<Tutor>(`/v1/tutores/${id}`);
    console.log('DADOS', response);
    return response.data;
  }

  // POST: Criar novo
  // Omit<Tutor, 'id'> significa que enviamos tudo MENOS o ID (o banco gera)
  static async create(data: Omit<Tutor, 'id'>): Promise<Tutor> {
    const response = await api.post<Tutor>('/v1/tutores', data);
    return response.data;
  }

  static async uploadImage(id: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('foto', file); // Ou 'file', verifique o Swagger

    await api.post(`/v1/tutores/${id}/fotos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: (data) => data
    });
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