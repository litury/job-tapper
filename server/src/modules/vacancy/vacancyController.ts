import { Socket } from 'socket.io';
import { vacancyService } from './vacancyService';
import { Queue } from '../../shared/utils/queue';

export const vacancyController = {
  handleGetSimilarVacancies: async (socket: Socket, userSessions: Map<string, any>, data: { resumeId: string }) => {
    const userData = userSessions.get(socket.id);
    if (userData) {
      try {
        const vacancies = await vacancyService.getSimilarVacancies(userData.accessToken, data.resumeId);
        socket.emit('similar-vacancies', vacancies);
      } catch (error) {
        console.error('Error fetching similar vacancies:', error);
        socket.emit('error', { message: 'Ошибка при получении похожих вакансий' });
      }
    }
  },

  handleApplyToVacancy: async (socket: Socket, userSessions: Map<string, any>, applicationQueue: Queue, data: { resumeId: string, vacancyId: string }) => {
    const userData = userSessions.get(socket.id);
    if (userData) {
      console.log('Добавление отклика в очередь:', data);
      applicationQueue.enqueue({
        accessToken: userData.accessToken,
        vacancyId: data.vacancyId,
        resumeId: data.resumeId,
        socketId: socket.id
      });
      socket.emit('application-queued', { vacancyId: data.vacancyId });
      console.log('Отклик добавлен в очередь:', data);
    } else {
      console.log('Ошибка: пользователь не авторизован');
      socket.emit('error', { message: 'Пользователь не авторизован' });
    }
  }
};