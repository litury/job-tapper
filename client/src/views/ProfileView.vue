<template>
  <div class="container mx-auto p-4">

  <div class="navbar bg-base-100 bg-opacity-70 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl">Трудовая книжка</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1 hidden sm:flex">
        <li><router-link to="/profile">Личное дело</router-link></li>
        <li><router-link to="/game">Трудовой фронт</router-link></li>
        <li><router-link to="/leaderboard">Доска почёта</router-link></li>
      </ul>
      <label class="swap swap-rotate ml-4">
        <input type="checkbox" v-model="isDarkMode" @change="toggleTheme" />
        <SunIcon class="swap-on h-6 w-6" />
        <MoonIcon class="swap-off h-6 w-6" />
      </label>
    </div>
  </div>


    <div v-if="loading" class="text-center pt-20">
      <p>Сбор данных...</p>
    </div>

    <div v-else-if="resumes.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
      <ResumeCard 
        v-for="resume in resumes" 
        :key="resume.id" 
        :resume="resume" 
        @toggle-active="toggleResumeActive"
      />
    </div>
    <div v-else class="text-center">
      <p>Товарищ, ваша трудовая книжка пуста!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useResumeStore, ResumeCard } from '@/modules/Resume';
import { useAuthStore } from '@/modules/Auth';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/solid';

import { useRouter } from 'vue-router';

const resumeStore = useResumeStore();
const authStore = useAuthStore();
const router = useRouter();
const { resumes } = storeToRefs(resumeStore);
const { fetchResumesWithVacanciesAsync, toggleResumeActive } = resumeStore;
const loading = ref(true);

const isDarkMode = ref(false);

const toggleTheme = () => {
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'soviet-dark' : 'soviet-light');
};

onMounted(async () => {
  try {
    const isAuthenticated = await authStore.checkAuth();
    if (isAuthenticated) {
      await fetchResumesWithVacanciesAsync();
    } else {
      console.error('User is not authenticated');
      router.push('/login');
    }
  } catch (error) {
    console.error('Error loading profile data:', error);
  } finally {
    loading.value = false;
  }
});
</script>