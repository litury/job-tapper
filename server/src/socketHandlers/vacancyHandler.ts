import { Socket } from 'socket.io';
import { vacancyController } from '../modules/vacancy/vacancyController';
import { Queue } from '../shared/utils/queue';

export const vacancyHandler = (socket: Socket, userSessions: Map<string, any>, applicationQueue: Queue) => {
  socket.on('get-similar-vacancies', (data: { resumeId: string }) => {
    vacancyController.handleGetSimilarVacancies(socket, userSessions, data);
  });

  socket.on('apply-to-vacancy', (data: { resumeId: string, vacancyId: string }) => {
    vacancyController.handleApplyToVacancy(socket, userSessions, applicationQueue, data);
  });
};