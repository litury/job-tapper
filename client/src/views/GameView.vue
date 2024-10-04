<template>
  <div class="game-container bg-base-200 min-h-screen p-2 flex flex-col">
    <div class="max-w-sm mx-auto w-full flex-grow flex flex-col">
      <h1 class="text-xl font-bold mb-2 text-primary text-center">Удаленный труд</h1>

      <div class="stats shadow mb-2 text-xs">
        <div class="stat">
          <div class="stat-title">Очки</div>
          <div class="stat-value">{{ gameStore.score }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Отклики</div>
          <div class="stat-value">{{ gameStore.totalApplications }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Уровень {{ gameStore.level }}</div>
          <div class="stat-value">
            <progress class="progress progress-primary w-full" :value="gameStore.experience" :max="gameStore.experienceToNextLevel"></progress>
          </div>
        </div>
      </div>

      <div class="level-info bg-base-100 p-2 rounded-lg mb-2 text-sm">
        <p>Скорость игры: {{ gameStore.gameSpeed.toFixed(2) }}x</p>
        <p>Очков до следующего уровня: {{ gameStore.experienceToNextLevel - gameStore.experience }}</p>
        <p>Доступно вакансий: {{ gameStore.totalAvailableVacancies }}</p>
      </div>

 
      <div class="game-log mb-2 flex-grow overflow-y-auto bg-base-300 p-2 rounded-lg text-xs">
        <div v-for="log in gameStore.gameLogs" :key="log.id" class="mb-1">
          <span class="font-bold">{{ formatTime(log.timestamp) }}</span>
          <span :class="{ 'text-success': log.isBonus, 'text-error': log.isError }">
            <a v-if="log.vacancyUrl" :href="log.vacancyUrl" target="_blank" class="underline">{{ log.message }}</a>
            <span v-else>{{ log.message }}</span>
          </span>
        </div>
      </div>

      <GameArea
        :handleClick="handleClick"
        :handleVacancyClick="handleVacancyClick"
        :startCountdown="startCountdown"
        :getVacancyEmoji="getVacancyEmoji"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useGameStore } from '@/modules/Game';
import { useResumeStore } from '@/modules/Resume';
import { GameArea } from '@/modules/Game';
import { formatTime } from '@/shared/utils/formatters';

const gameStore = useGameStore();
const resumeStore = useResumeStore();

const handleClick = () => {
  // Пустая функция для обработки кликов по игровой области
};

const handleVacancyClick = async (vacancy: any) => {
  if (!gameStore.isGameActive) return;

  if (vacancy.has_test) {
    const penaltyPoints = 3 * gameStore.level;
    gameStore.increaseScore(-penaltyPoints);
    gameStore.addGameLog(`Требуется пройти тест. -${penaltyPoints} очков`, false, true, vacancy.alternate_url);
  } else if (vacancy.response_letter_required) {
    const penaltyPoints = 2 * gameStore.level;
    gameStore.increaseScore(-penaltyPoints);
    gameStore.addGameLog(`Требуется сопроводительное письмо. -${penaltyPoints} очков`, false, true, vacancy.alternate_url);
  } else {
    const result = await resumeStore.applyToRandomVacancy(vacancy.id);
    if (result.success) {
      const earnedPoints = 5 * gameStore.level;
      gameStore.increaseScore(earnedPoints);
      gameStore.increaseTotalApplications();
      gameStore.addGameLog(`Отклик на "${result.vacancyName}" отправлен через резюме "${result.resumeTitle}". +${earnedPoints} очков`, false, false, result.vacancyUrl);
    } else {
      gameStore.addGameLog(`Ошибка отправки отклика на "${vacancy.name}"`, false, true, vacancy.alternate_url);
    }
  }

  gameStore.removeActiveVacancy(vacancy.id);
};

const startCountdown = () => {
  gameStore.startCountdown();
};

const getVacancyEmoji = (vacancy: any) => {
  if (vacancy.has_test) return '📊';
  if (vacancy.response_letter_required) return '📝';
  return '📄';
};

onMounted(() => {
  gameStore.initializeGame();
});

onUnmounted(() => {
  gameStore.clearTimers();
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.game-log {
  max-height: 20vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>