import { socketService } from '@/shared/services/socketService';

export const gameService = {
  applyToVacancy(resumeId: string, vacancyId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      socketService.emit('apply-to-vacancy', { resumeId, vacancyId });
      socketService.once('application-sent', resolve);
      socketService.once('application-error', reject);
    });
  },

  // Добавьте другие методы, связанные с игрой, если необходимо
};