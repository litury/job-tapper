import { hhService } from '../../services/hhService';

export const authService = {
  async getTokens(code: string) {
    return hhService.getTokens(code);
  },

  async getUserInfo(accessToken: string) {
    return hhService.getUserInfo(accessToken);
  },

  async validateToken(accessToken: string) {
    return hhService.getUserInfo(accessToken);
  }
};