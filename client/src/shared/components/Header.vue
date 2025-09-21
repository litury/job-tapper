<template>

  <div class="btm-nav sm:hidden bg-base-100 shadow-md fixed bottom-0 left-0 right-0 z-50">
    <router-link to="/profile" class="text-primary">
      <UserIcon class="h-5 w-5" />
    </router-link>
    <router-link to="/game" class="text-primary">
      <BoltIcon class="h-5 w-5" />
    </router-link>
    <router-link to="/leaderboard" class="text-primary">
      <ChartBarIcon class="h-5 w-5" />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, BoltIcon, ChartBarIcon } from '@heroicons/vue/24/solid';

// Theme functionality for future use
// const isDarkMode = ref(false);

// const toggleTheme = () => {
//   document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'soviet-dark' : 'soviet-light');
// };
</script>

<style scoped>
.navbar {
/* Используем цвет темы */
  backdrop-filter: blur(10px);
}

.btm-nav {
  backdrop-filter: blur(10px);
}
</style>