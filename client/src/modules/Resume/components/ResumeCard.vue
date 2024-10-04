<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">{{ resume.title }}</h2>
      <p>{{ resume.first_name }} {{ resume.last_name }}</p>
      <p>Создано: {{ new Date(resume.created_at).toLocaleDateString() }}</p>
      <p>Обновлено: {{ new Date(resume.updated_at).toLocaleDateString() }}</p>
      <p>Просмотров: {{ stats.views?.total || 0 }}</p>
      <p>Новых просмотров: {{ stats.views?.new || 0 }}</p>
      <p>Доступных вакансий: {{ resume.totalAvailableVacancies }}</p>
      <p>Статус: {{ stats.status?.status?.name || 'Неизвестно' }}</p>
      <div class="form-control">
        <label class="label cursor-pointer">
          <input type="checkbox" class="toggle toggle-primary" v-model="isActive" @change="toggleResume" />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useResumeStore } from '../store/resumeStore';

const props = defineProps<{
  resume: {
    id: string;
    title: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
    totalAvailableVacancies: number;
  }
}>();

const resumeStore = useResumeStore();
const isActive = ref(false);
const stats = ref({
  views: { total: 0, new: 0 },
  status: { status: { name: 'Неизвестно' } }
});

onMounted(async () => {
  try {
    isActive.value = resumeStore.isResumeActive(props.resume.id);
    stats.value = await resumeStore.fetchResumeStatsAsync(props.resume.id);
  } catch (error) {
    console.error('Error fetching resume data:', error);
  }
});

const toggleResume = () => {
  resumeStore.toggleResumeActive(props.resume.id, isActive.value);
};
</script>

<style scoped>
.card {
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .card {
    width: auto;
    margin: 0;
  }
}
</style>