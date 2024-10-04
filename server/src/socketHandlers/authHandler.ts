import { Socket } from 'socket.io';
import { authController } from '../modules/auth/authController';
import { authService } from '../modules/auth/authService'; // Добавьте эту строку

export const authHandler = (socket: Socket, userSessions: Map<string, any>) => {
  socket.on('authenticate', async (data: { code: string }) => {
    try {
      const tokens = await authService.getTokens(data.code);
      const userData = await authService.getUserInfo(tokens.access_token);
      userSessions.set(socket.id, { ...userData, accessToken: tokens.access_token });
      socket.emit('authenticated', { user: userData, ...tokens });
    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('auth_error', { message: 'Ошибка аутентификации' });
    }
  });

  socket.on('validate_token', (data: { accessToken: string }) => {
    authController.handleValidateToken(socket, userSessions, data);
  });

  socket.on('disconnect', () => {
    authController.handleDisconnect(socket, userSessions);
  });
};