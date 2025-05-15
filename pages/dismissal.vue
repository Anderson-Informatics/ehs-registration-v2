<template>
  <v-container fluid class="d-flex flex-column" style="height: 100vw; width: 100vw">
    <h1 style="font-size: 3em">
      Please proceed to checkout counter when you see your name on the screen
    </h1>
    <hr class="mb-4" />
    <div style="
        height: 100%;
        -webkit-column-count: 5; /* Chrome, Safari, Opera */
        -moz-column-count: 5; /* Firefox */
        column-count: 5;
      ">
      <v-card v-for="pickup in pickupStore.pickups" class="mb-1">
        <h3>{{ (pickup as Pickup).LastName }}, {{ (pickup as Pickup).FirstName }}</h3>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import type { Pickup } from '@/types';
definePageMeta({
  layout: 'marquee',
});

const pickupStore = usePickupStore();
await useAsyncData('pickups', () => pickupStore.getTodaysPickups(), {});

let polling: number | null = null;

const refresh = () => {
  console.log('Polling...');
  pickupStore.getTodaysPickups();
};

onMounted(() => {
  polling = window.setInterval(refresh, 10000);
});

onUnmounted(() => {
  if (polling !== null) {
    window.clearInterval(polling);
  }
});
</script>
