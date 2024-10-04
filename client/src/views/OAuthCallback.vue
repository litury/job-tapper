<template>
  <div class="flex items-center justify-center h-screen">
    <p class="text-xl">Обработка авторизации...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/modules/Auth';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const code = route.query.code as string;
  if (code) {
    try {
      const success = await authStore.login(code);
      if (success) {
        router.push('/profile');
      } else {
        console.error('Login failed');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error handling auth callback:', error);
      router.push('/login');
    }
  } else {
    console.error('No auth code provided');
    router.push('/login');
  }
});
</script>