import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { socketService } from '@/shared/services/socketService';

interface Vacancy {
  id: string;
  name: string;
  alternate_url: string;
  has_test: boolean;
  response_letter_required: boolean;
  salary?: {
    from?: number;
    to?: number;
    currency?: string;
  };
}

interface Resume {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  availableVacancies: Vacancy[];
  totalAvailableVacancies: number;
}

export const useResumeStore = defineStore('resume', () => {
  const resumes = ref<Resume[]>([]);
  const appliedVacancies = ref(new Set<string>());
  const activeResumes = ref<Set<string>>(new Set());
  const totalApplications = ref(0);
  const score = ref(0);

  const level = computed(() => Math.floor(Math.sqrt(score.value / 1000)));

  const fetchResumesWithVacanciesAsync = async (): Promise<void> => {
    try {
      const fetchedResumesWithVacancies = await new Promise<Resume[]>((resolve, reject) => {
        socketService.emit('get-resumes-with-vacancies', {});
        socketService.once('resumes-with-vacancies', resolve);
        socketService.once('error', (error) => {
          console.error('Socket error:', error);
          reject(error);
        });
      });
      resumes.value = fetchedResumesWithVacancies;
      console.log('Fetched resumes with vacancies:', resumes.value);
    } catch (error) {
      console.error('Ошибка при получении резюме с вакансиями:', error);
      throw error; // Перебросьте ошибку, чтобы ее можно было обработать в компоненте
    }
  };

  const isResumeActive = (resumeId: string): boolean => {
    return activeResumes.value.has(resumeId);
  };

  const toggleResumeActive = (resumeId: string, isActive: boolean): void => {
    if (isActive) {
      activeResumes.value.add(resumeId);
    } else {
      activeResumes.value.delete(resumeId);
    }
  };

  const fetchResumeStatsAsync = async (resumeId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      socketService.emit('get-resume-stats', { resumeId });
      socketService.once('resume-stats', resolve);
      socketService.once('error', reject);
    });
  };

  const getActiveVacancies = computed(() => {
    return resumes.value
      .filter(resume => activeResumes.value.has(resume.id))
      .flatMap(resume => resume.availableVacancies);
  });

  const increaseScore = (points: number) => {
    score.value += points;
    localStorage.setItem('userScore', score.value.toString());
  };

  const applyToRandomVacancy = async (vacancyId: string): Promise<{ success: boolean; vacancyName?: string; vacancyUrl?: string; resumeTitle?: string }> => {
    const activeVacancies = getActiveVacancies.value;
    const vacancy = activeVacancies.find(v => v.id === vacancyId);
    if (!vacancy) {
      return { success: false };
    }
    
    const activeResumeIds = Array.from(activeResumes.value);
    if (activeResumeIds.length === 0) {
      return { success: false };
    }
    
    const randomResumeId = activeResumeIds[Math.floor(Math.random() * activeResumeIds.length)];
    const resume = resumes.value.find(r => r.id === randomResumeId);
    
    if (!resume) {
      return { success: false };
    }

    return new Promise((resolve) => {
      socketService.emit('apply-to-vacancy', { resumeId: randomResumeId, vacancyId: vacancy.id });
      socketService.once('application-sent', () => {
        resolve({
          success: true,
          vacancyName: vacancy.name,
          vacancyUrl: vacancy.alternate_url,
          resumeTitle: resume.title
        });
      });
      socketService.once('application-error', () => {
        resolve({ success: false });
      });
    });
  };

  return {
    resumes,
    appliedVacancies,
    activeResumes,
    totalApplications,
    score,
    level,
    fetchResumesWithVacanciesAsync,
    isResumeActive,
    toggleResumeActive,
    fetchResumeStatsAsync,
    getActiveVacancies,
    increaseScore,
    applyToRandomVacancy,
  };
});