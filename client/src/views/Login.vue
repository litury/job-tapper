<template>
  <div class="flex items-center justify-center min-h-screen bg-base-200">
    <div class="text-center w-full max-w-sm p-6">
      <h1 class="text-4xl font-bold mb-6">Вступайте в ряды!</h1>
      <p class="mb-8">Товарищ, присоединяйтесь к нашему трудовому коллективу через HeadHunter.</p>
      <button class="btn btn-primary w-full" @click="login">Вступить через HeadHunter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/modules/Auth';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const login = () => {
  authStore.initiateLogin();
};

onMounted(async () => {
  if (authStore.isAuthenticated) {
    router.push('/profile');
    return;
  }

  const code = route.query.code as string;
  if (code) {
    try {
      await authStore.login(code);
      router.push('/profile');
    } catch (error) {
      console.error('Error handling auth callback:', error);
    }
  }

  window.addEventListener('message', (event) => {
    if (event.data.type === 'auth_callback') {
      authStore.login(event.data.code);
    }
  });
});
</script>