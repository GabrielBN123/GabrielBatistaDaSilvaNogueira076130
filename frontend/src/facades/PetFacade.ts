import { api } from '@/services/api';

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
}

export interface PetPaginatedResponse {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Pet[];
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

export type PetCreateDTO = Omit<Pet, 'id' | 'foto'>;

export class PetFacade {

  static async getAll(nome = '', page = 0, raca = '', limit = 10): Promise<{ data: PetPaginatedResponse[]; total: number }> {

    // Cria o objeto de parâmetros
    const params: any = {
      page,
      limit
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
      transformRequest: (data, headers) => {
        return data;
      }
    });
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