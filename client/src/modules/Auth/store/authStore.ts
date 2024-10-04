import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { socketService } from '@/shared/services/socketService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const accessToken = ref(localStorage.getItem('accessToken') || '');
  const refreshToken = ref(localStorage.getItem('refreshToken') || '');

  const isAuthenticated = computed(() => !!accessToken.value);

  const initiateLogin = () => {
    const authUrl = `${import.meta.env.VITE_SERVER_URL}/auth/hh-login`;
    window.location.href = authUrl;
  };

  const login = async (code: string) => {
    try {
      const response = await new Promise((resolve, reject) => {
        socketService.emit('authenticate', { code });
        socketService.once('authenticated', resolve);
        socketService.once('auth_error', reject);
      });

      user.value = response.user;
      accessToken.value = response.access_token;
      refreshToken.value = response.refresh_token;

      localStorage.setItem('accessToken', accessToken.value);
      localStorage.setItem('refreshToken', refreshToken.value);
      
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const logout = () => {
    user.value = null;
    accessToken.value = '';
    refreshToken.value = '';
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const checkAuth = async () => {
    if (accessToken.value) {
      try {
        const response = await new Promise((resolve, reject) => {
          socketService.emit('validate_token', { accessToken: accessToken.value });
          socketService.once('token_valid', resolve);
          socketService.once('token_invalid', reject);
        });
        user.value = response;
        return true;
      } catch (error) {
        console.error('Token validation error:', error);
        logout();
        return false;
      }
    }
    return false;
  };

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    initiateLogin,
    login,
    logout,
    checkAuth,
  };
});