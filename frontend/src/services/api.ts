import axios from 'axios';

// Cria uma instância configurada do Axios
// Isso é considerado "Best Practice" para evitar repetição de código
export const api = axios.create({
  baseURL: 'http://localhost:3000', // Porta definida no docker-compose da API
  timeout: 5000, // Cancela requisições que demoram mais de 5s
  headers: {
    'Content-Type': 'application/json',
  },
});