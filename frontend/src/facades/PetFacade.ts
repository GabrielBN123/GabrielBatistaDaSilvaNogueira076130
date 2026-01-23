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

  static async getAll(nome = '', page = 0, raca = '', limit = 10): Promise<{ data: Pet[]; total: number }> {

    // Cria o objeto de parâmetros
    const params: any = { 
      page, 
      limit 
    };

    // Só adiciona o nome nos parâmetros se ele não estiver vazio
    if (nome) {
      params.nome = nome; // Ou 'name', verifique como seu Back-end espera receber isso
    }

    // Só adiciona a raça nos parâmetros se ela não estiver vazia
    if (raca) {
      params.raca = raca; // Ou 'breed', verifique como seu Back-end espera receber isso
    }

    const response = await api.get('/v1/pets', { params });

    console.log("Resposta da API:", response);

    return {
      data: response.data,
      total: response.data.total || 'Não foram encontrados'
      // total: response.data.content.length || 'Não foram encontrados'
    };

    // const response = await api.get<Pet[]>('/v1/pets', { 
    //   params: { nome, page, raca, limit } 
    // });
    // return {
    //   data: response.data,
    //   total: Number(response.headers['x-total-count'] || 0)
    // };
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