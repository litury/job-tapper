<template>
  <div class="leaderboard container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Доска почёта</h2>
    <table class="table w-full">
      <thead>
        <tr>
          <th>Ранг</th>
          <th>Товарищ</th>
          <th>Трудовые очки</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in leaderboard" :key="player.id">
          <td>{{ index + 1 }}</td>
          <td>{{ player.name }}</td>
          <td>{{ player.score }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { socketService } from '../services/socketService';

const leaderboard = ref([
  { id: 1, name: "Игрок 1", score: 1000 },
  { id: 2, name: "Игрок 2", score: 950 },
  { id: 3, name: "Игрок 3", score: 900 },
  { id: 4, name: "Игрок 4", score: 850 },
  { id: 5, name: "Игрок 5", score: 800 },
]);

onMounted(() => {
  socketService.emit('get-leaderboard');
  socketService.on('leaderboard', (data) => {
    if (data && data.length > 0) {
      leaderboard.value = data;
    }
  });
});
</script>