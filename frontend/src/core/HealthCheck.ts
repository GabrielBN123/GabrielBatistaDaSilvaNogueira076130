import { api } from '../services/api';

export class HealthCheckService {
  static async checkReadiness(): Promise<boolean> {
    try {
      await api.get('/v1/pets', { timeout: 3000 });
      return true;
    } catch (error: any) {
      if (!error.response) {
        return false;
      }

      const status = error.response.status;
      if (status >= 200 && status < 500) {
        return true;
      }
      return false;
    }
  }
}