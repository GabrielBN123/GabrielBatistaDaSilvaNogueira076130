import axios from 'axios';

export const api = axios.create({
  // Base URL da API
  baseURL: 'http://localhost:3000', 
  // Cancela requisições que demoram mais de 5s
  timeout: 5000, 
  // Configura o cabeçalho padrão para JSON
  headers: {
    'Content-Type': 'application/json',
  },
});