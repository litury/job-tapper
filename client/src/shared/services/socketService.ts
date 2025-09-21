import { io, Socket } from 'socket.io-client';

const socket: Socket = io(import.meta.env.VITE_SERVER_URL, {
  withCredentials: true,
  path: '/socket.io'
});

export const socketService = {
  on(event: string, callback: (...args: any[]) => void) {
    socket.on(event, callback);
  },

  emit(event: string, data?: any) {
    socket.emit(event, data);
  },

  off(event: string, callback: (...args: any[]) => void) {
    socket.off(event, callback);
  },

  once(event: string, callback: (...args: any[]) => void) {
    socket.once(event, callback);
  }
};