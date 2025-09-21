<template>
  <div
    class="game-area bg-base-100 rounded-lg shadow-xl p-2 h-64 relative overflow-hidden cursor-pointer mb-2"
    ref="gameAreaRef"
    @click="handleClick"
  >
    <TransitionGroup name="vacancy" tag="div">
      <div
        v-for="vacancy in activeVacancies"
        :key="vacancy.id"
        class="vacancy-icon absolute"
        :style="{ left: vacancy.x + 'px', top: vacancy.y + 'px' }"
        @click.stop="handleVacancyClick(vacancy)"
      >
        {{ getVacancyEmoji(vacancy) }}
      </div>
    </TransitionGroup>

    <div v-if="!isGameActive && !countdown" class="absolute inset-0 flex items-center justify-center">
      <button @click="startCountdown" class="btn btn-primary btn-sm" :disabled="isStartDisabled">
        <PlayIcon class="h-4 w-4 mr-1" />
        Старт
      </button>
    </div>

    <div v-if="countdown > 0" class="absolute inset-0 flex items-center justify-center">
      <div class="text-4xl font-bold text-primary">{{ countdown }}</div>
    </div>

    <div v-if="isGameActive" class="absolute top-1 left-1 text-sm font-bold">
      {{ formatTime(timeLeft) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useGameStore } from '../store/gameStore';
import { PlayIcon } from '@heroicons/vue/24/solid';
import { formatTime } from '@/shared/utils/formatters';

const gameStore = useGameStore();
const gameAreaRef = ref<HTMLElement | null>(null);

// Props are handled via emits, keeping definition for component interface
defineProps<{
  handleClick: () => void;
  handleVacancyClick: (vacancy: any) => void;
  startCountdown: () => void;
  getVacancyEmoji: (vacancy: any) => string;
}>();

const activeVacancies = computed(() => gameStore.activeVacancies);
const isGameActive = computed(() => gameStore.isGameActive);
const countdown = computed(() => gameStore.countdown);
const timeLeft = computed(() => gameStore.timeLeft);

const isStartDisabled = computed(() => gameStore.getActiveVacancies.length === 0);

onMounted(() => {
  gameStore.gameArea = gameAreaRef.value;
});

onUnmounted(() => {
  gameStore.clearTimers();
  gameStore.gameArea = null;
});
</script>

<style scoped>
.game-area {
  transition: transform 0.1s ease-out;
  height: 64vh;
  max-height: 400px;
}

.vacancy-icon {
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.1s ease-out;
}

.vacancy-icon:hover {
  transform: scale(1.1);
}

.vacancy-enter-active,
.vacancy-leave-active {
  transition: all 0.3s ease;
}

.vacancy-enter-from,
.vacancy-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>