import { hhService } from '../../services/hhService';

interface Resume {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  // Добавьте другие необходимые поля резюме
}

interface ResumeWithVacancies extends Resume {
  availableVacancies: any[]; // Обновлено в соответствии с изменениями в hhService
  totalAvailableVacancies: number; // Обновлено в соответствии с изменениями в hhService
}

export const resumeService = {
  async getResumesWithVacancies(accessToken: string): Promise<ResumeWithVacancies[]> {
    const resumes = await hhService.getResume(accessToken);
    const resumesWithVacancies = await Promise.all(resumes.items.map(async (resume: Resume) => {
      const similarVacancies = await hhService.getResumeSimilarVacancies(accessToken, resume.id);
      return {
        ...resume,
        availableVacancies: similarVacancies.items,
        totalAvailableVacancies: similarVacancies.found
      };
    }));
    return resumesWithVacancies;
  },

  async getResumeStats(accessToken: string, resumeId: string) {
    const [views, similarVacancies, status] = await Promise.all([
      hhService.getResumeViews(accessToken, resumeId),
      hhService.getResumeSimilarVacancies(accessToken, resumeId),
      hhService.getResumeStatus(accessToken, resumeId)
    ]);

    return { views, similarVacanciesCount: similarVacancies.found, status };
  }
};