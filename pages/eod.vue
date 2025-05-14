<template>
  <v-container>
    <h2>Summary Data</h2>
    <v-card v-for="item in studentStore.summary" class="mb-5">
      <div v-if="item._id">
        <v-card-title>{{ item._id }}</v-card-title>
        <p>Registered: {{ item.Registered }}</p>
        <p>Completed: {{ item.Completed }}</p>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const studentStore = useStudentStore();
await useAsyncData('summary', () => studentStore.getSummary(), {});
</script>
