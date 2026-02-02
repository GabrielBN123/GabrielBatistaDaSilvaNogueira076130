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
  foto?: Foto | null;
  tutores?: Tutor[] | null;
}

export interface PetFormData {
  nome: string;
  raca: string;
  idade: number | string;
}