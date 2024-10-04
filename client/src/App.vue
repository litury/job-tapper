<template>
  <Header v-if="showHeader" />
  <router-view />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Header } from './modules/Layout';

const route = useRoute();

const showHeader = computed(() => {
  return !['/', '/login'].includes(route.path);
});
</script>