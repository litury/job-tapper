import { socketService } from '@/shared/services/socketService';

export const resumeService = {
  async fetchResumesWithVacancies(): Promise<any> {
    return new Promise((resolve, reject) => {
      socketService.emit('get-resumes-with-vacancies', {});
      socketService.once('resumes-with-vacancies', resolve);
      socketService.once('error', reject);
    });
  },

  async fetchResumeStats(resumeId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      socketService.emit('get-resume-stats', { resumeId });
      socketService.once('resume-stats', resolve);
      socketService.once('error', reject);
    });
  },

  // Добавьте другие методы, связанные с резюме
};