import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useResumeStore } from '@/modules/Resume';

export const useGameStore = defineStore('game', () => {
  const resumeStore = useResumeStore();
  
  const score = ref(0);
  const totalApplications = ref(0);
  const timeLeft = ref(30);
  const isGameActive = ref(false);
  const activeVacancies = ref<Array<{ id: string; x: number; y: number; name: string; alternate_url: string; has_test: boolean; response_letter_required: boolean }>>([]);
  const countdown = ref(0);
  const gameLogs = ref<Array<{ id: number; timestamp: number; message: string; isBonus: boolean; isError: boolean; vacancyUrl?: string }>>([]);
  const gameArea = ref<HTMLElement | null>(null);

  const level = computed(() => resumeStore.level);
  const experience = computed(() => {
    const exp = score.value % (level.value * level.value * 10);
    return isNaN(exp) ? 0 : exp;
  });

  const experienceToNextLevel = computed(() => {
    const expToNext = level.value * level.value * 10;
    return isNaN(expToNext) ? 1 : expToNext;
  });

  const gameSpeed = computed(() => Math.pow(2, level.value - 1));

  const totalAvailableVacancies = computed(() => resumeStore.getActiveVacancies.length);

  const getActiveVacancies = computed(() => resumeStore.getActiveVacancies || []);

  let gameTimer: number | null = null;
  let vacancySpawnTimer: number | null = null;

  function startGame() {
    isGameActive.value = true;
    timeLeft.value = 30;
    totalApplications.value = 0;
    activeVacancies.value = [];
    gameLogs.value = [];

    gameTimer = window.setInterval(() => {
      timeLeft.value--;
      if (timeLeft.value <= 0) {
        endGame();
      }
    }, 1000);

    vacancySpawnTimer = window.setInterval(() => {
      spawnVacancy();
    }, 1000 / gameSpeed.value);
  }

  function endGame() {
    isGameActive.value = false;
    clearTimers();
  }

  function clearTimers() {
    if (gameTimer) clearInterval(gameTimer);
    if (vacancySpawnTimer) clearInterval(vacancySpawnTimer);
  }

  function spawnVacancy() {
    if (!gameArea.value || activeVacancies.value.length >= 5) return;

    const rect = gameArea.value.getBoundingClientRect();
    const availableVacancies = getActiveVacancies.value;
    if (availableVacancies.length === 0) return;

    const randomVacancy = availableVacancies[Math.floor(Math.random() * availableVacancies.length)];
    const vacancy = {
      ...randomVacancy,
      x: Math.random() * (rect.width - 40) + 20,
      y: Math.random() * (rect.height - 40) + 20,
    };

    activeVacancies.value.push(vacancy);

    setTimeout(() => {
      activeVacancies.value = activeVacancies.value.filter(v => v.id !== vacancy.id);
    }, 3000 / gameSpeed.value);
  }

  function addGameLog(message: string, isBonus: boolean = false, isError: boolean = false, vacancyUrl?: string) {
    gameLogs.value.unshift({
      id: Date.now(),
      timestamp: Date.now(),
      message,
      isBonus,
      isError,
      vacancyUrl
    });

    if (gameLogs.value.length > 50) {
      gameLogs.value.pop();
    }
  }

  function initializeGame() {
    score.value = 0;
    totalApplications.value = 0;
    timeLeft.value = 30;
    isGameActive.value = false;
    activeVacancies.value = [];
    countdown.value = 0;
    gameLogs.value = [];
  }

  function startCountdown() {
    countdown.value = 3;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value === 0) {
        clearInterval(timer);
        startGame();
      }
    }, 1000);
  }

  function increaseScore(points: number) {
    score.value += points;
  }

  function increaseTotalApplications() {
    totalApplications.value++;
  }

  function removeActiveVacancy(id: string) {
    activeVacancies.value = activeVacancies.value.filter(v => v.id !== id);
  }

  return {
    score,
    totalApplications,
    timeLeft,
    isGameActive,
    activeVacancies,
    countdown,
    gameLogs,
    level,
    experience,
    experienceToNextLevel,
    gameSpeed,
    totalAvailableVacancies,
    getActiveVacancies,
    startGame,
    endGame,
    clearTimers,
    spawnVacancy,
    addGameLog,
    initializeGame,
    startCountdown,
    increaseScore,
    increaseTotalApplications,
    removeActiveVacancy,
    gameArea,
  };
});