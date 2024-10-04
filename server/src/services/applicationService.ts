import { Queue } from '../shared/utils/queue';
import { Server } from 'socket.io';
import { hhService } from './hhService';

export async function processApplicationQueue(queue: Queue, io: Server) {
  while (!queue.isEmpty()) {
    const application = queue.dequeue();
    if (application) {
      try {
        await hhService.applyToVacancy(application.accessToken, application.vacancyId, application.resumeId);
        io.to(application.socketId).emit('application-sent', { vacancyId: application.vacancyId });
        console.log('Отклик успешно отправлен:', application);
      } catch (error: unknown) {
        console.error('Error sending application:', error);
        if (error instanceof Error) {
          const errorMessage = error.message;
          if (errorMessage.includes('Already applied')) {
            io.to(application.socketId).emit('application-error', { 
              vacancyId: application.vacancyId, 
              error: 'Вы уже откликнулись на эту вакансию' 
            });
          } else {
            io.to(application.socketId).emit('application-error', { 
              vacancyId: application.vacancyId, 
              error: errorMessage 
            });
          }
        } else {
          io.to(application.socketId).emit('application-error', { 
            vacancyId: application.vacancyId, 
            error: 'An unknown error occurred' 
          });
        }
      }
    }
  }
}