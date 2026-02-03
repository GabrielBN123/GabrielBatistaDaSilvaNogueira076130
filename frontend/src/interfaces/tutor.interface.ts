interface Foto {
  id: number;
  nome: string;
  contentType?: string;
  url: string;
}

export interface Tutor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: string | null;
  foto?: Foto | null;
  pets?: Pet[] | null
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

export interface TutorFormData {
	nome: string;
	email: string;
	telefone: string;
	endereco: string;
	cpf: string | number;
}