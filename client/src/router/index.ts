import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Profile from '../views/ProfileView.vue';
import OAuthCallback from '../views/OAuthCallback.vue';
import GameView from '../views/GameView.vue';
import Leaderboard from '../views/Leaderboard.vue';
import { useAuthStore } from '@/modules/Auth';

const routes = [
  { 
    path: '/', 
    redirect: to => {
      const authStore = useAuthStore();
      return authStore.isAuthenticated ? '/profile' : '/login';
    }
  },
  { 
    path: '/login', 
    component: Login,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        next('/profile');
      } else {
        next();
      }
    }
  },
  { 
    path: '/profile', 
    component: Profile,
    meta: { requiresAuth: true }
  },
  { path: '/oauth/callback', component: OAuthCallback },
  { 
    path: '/game', 
    component: GameView,
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboard',
    component: Leaderboard,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = await authStore.checkAuth();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;