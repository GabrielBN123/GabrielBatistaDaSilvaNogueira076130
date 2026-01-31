import { api } from '@/services/api';
import { PetFacade } from './PetFacade';
export class TutorPetFacade {

  static async link(tutorId: number, petId: number): Promise<void> {
    await api.post(`/v1/tutores/${tutorId}/pets/${petId}`);
    await PetFacade.getAll();
  }

  static async unlink(tutorId: number, petId: number): Promise<void> {
    await api.delete(`/v1/tutores/${tutorId}/pets/${petId}`);
    await PetFacade.getAll();
  }
}