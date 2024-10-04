import { Socket } from 'socket.io';
import { resumeService } from './resumeService';

export const resumeController = {
  handleGetResumesWithVacancies: async (socket: Socket, userSessions: Map<string, any>) => {
    const userData = userSessions.get(socket.id);
    if (userData) {
      try {
        const resumesWithVacancies = await resumeService.getResumesWithVacancies(userData.accessToken);
        console.log('Resumes with vacancies:', resumesWithVacancies.map(resume => ({
          id: resume.id,
          title: resume.title,
          totalAvailableVacancies: resume.totalAvailableVacancies,
          availableVacanciesCount: resume.availableVacancies.length,
          sampleVacancies: resume.availableVacancies.slice(0, 5).map(v => ({ id: v.id, name: v.name }))
        })));
        socket.emit('resumes-with-vacancies', resumesWithVacancies);
      } catch (error) {
        console.error('Error fetching resumes with vacancies:', error);
        socket.emit('error', { message: 'Ошибка при получении резюме и вакансий' });
      }
    } else {
      socket.emit('error', { message: 'Пользователь не авторизован' });
    }
  },

  handleGetResumeStats: async (socket: Socket, userSessions: Map<string, any>, data: { resumeId: string }) => {
    const userData = userSessions.get(socket.id);
    if (userData) {
      try {
        const stats = await resumeService.getResumeStats(userData.accessToken, data.resumeId);
        socket.emit('resume-stats', stats);
      } catch (error) {
        console.error('Error fetching resume stats:', error);
        socket.emit('error', { message: 'Ошибка при получении статистики резюме' });
      }
    } else {
      socket.emit('error', { message: 'Пользователь не авторизован' });
    }
  }
};