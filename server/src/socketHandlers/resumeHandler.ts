import { Socket } from 'socket.io';
import { resumeService } from '../modules/resume/resumeService'; // Добавьте эту строку
import { resumeController } from '../modules/resume/resumeController';

export const resumeHandler = (socket: Socket, userSessions: Map<string, any>) => {
  socket.on('get-resumes-with-vacancies', async () => {
    const userData = userSessions.get(socket.id);
    if (userData && userData.accessToken) {
      try {
        const resumesWithVacancies = await resumeService.getResumesWithVacancies(userData.accessToken);
        socket.emit('resumes-with-vacancies', resumesWithVacancies);
      } catch (error) {
        console.error('Error fetching resumes with vacancies:', error);
        socket.emit('error', { message: 'Ошибка при получении резюме и вакансий' });
      }
    } else {
      console.error('User not authenticated');
      socket.emit('error', { message: 'Пользователь не авторизован' });
    }
  });

  // ... остальные обработчики
};