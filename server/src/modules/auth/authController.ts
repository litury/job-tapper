import { Socket } from 'socket.io';
import { authService } from './authService';
import { hhService } from '../../services/hhService'; // Добавьте эту строку
import { AxiosError } from 'axios';

export const authController = {
  handleAuthenticate: async (socket: Socket, userSessions: Map<string, any>, data: { code: string }) => {
    try {
      console.log('Authenticating with code:', data.code);
      const tokens = await hhService.getTokens(data.code);
      console.log('Received tokens:', tokens);
      const userData = await authService.validateToken(tokens.access_token);
      console.log('User data:', userData);
      userSessions.set(socket.id, { ...userData, accessToken: tokens.access_token });
      socket.emit('authenticated', { user: userData, ...tokens });
    } catch (error: unknown) {
      console.error('Error during authentication:', error);
      if (error instanceof AxiosError) {
        socket.emit('auth_error', { 
          message: 'Ошибка аутентификации', 
          details: error.response?.data || error.message 
        });
      } else if (error instanceof Error) {
        socket.emit('auth_error', { 
          message: 'Ошибка аутентификации', 
          details: error.message 
        });
      } else {
        socket.emit('auth_error', { 
          message: 'Ошибка аутентификации', 
          details: 'Неизвестная ошибка' 
        });
      }
    }
  },

  handleValidateToken: async (socket: Socket, userSessions: Map<string, any>, data: { accessToken: string }) => {
    try {
      const userData = await authService.validateToken(data.accessToken);
      userSessions.set(socket.id, { ...userData, accessToken: data.accessToken });
      socket.emit('token_valid', userData);
    } catch (error) {
      console.error('Error validating token:', error);
      socket.emit('token_invalid');
    }
  },

  handleDisconnect: (socket: Socket, userSessions: Map<string, any>) => {
    userSessions.delete(socket.id);
    console.log('Отключение:', socket.id);
  }
};