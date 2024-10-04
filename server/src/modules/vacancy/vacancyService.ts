import { hhService } from '../../services/hhService';

export const vacancyService = {
  async getSimilarVacancies(accessToken: string, resumeId: string) {
    return await hhService.getSimilarVacancies(accessToken, resumeId);
  },

  async applyToVacancy(accessToken: string, vacancyId: string, resumeId: string) {
    return await hhService.applyToVacancy(accessToken, vacancyId, resumeId);
  }
};