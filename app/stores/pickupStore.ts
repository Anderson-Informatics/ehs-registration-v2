import { defineStore } from 'pinia';
import type { Pickup } from '~/types';

export const usePickupStore = defineStore('pickup-store', {
  state: () => ({
    pickups: [] as Pickup[],
    completed: [] as Pickup[],
  }),
  actions: {
    async getAll() {
      try {
        const data = await $fetch<Pickup[]>('/api/pickups');
        this.pickups = data;
        return data;
      } catch (e) {
        console.log((e as Error).message);
      }
    },
    async getTodaysPickups() {
      const today = new Date().toLocaleString('en-US', {
        timeZone: 'America/Detroit',
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      });
      console.log(today);
      console.log(new Date());
      try {
        const data = await $fetch<Pickup[]>(
          `/api/pickups?PickupDate=${today}&Departure=.`,
        );
        this.pickups = data;
        return data;
      } catch (e) {
        console.log((e as Error).message);
      }
    },
    async getTodaysCompletedPickups() {
      const today = new Date().toLocaleString('en-US', {
        timeZone: 'America/Detroit',
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      });
      const pickup = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeZone: 'America/Detroit',
      }).format(new Date());
      try {
        const data = await $fetch<Pickup[]>(
          `/api/pickups?PickupDate=${today}&Departure.Date=${pickup}`,
        );
        this.completed = data;
        return data;
      } catch (e) {
        console.log((e as Error).message);
      }
    },
    async checkOut(payload: object) {
      try {
        const data = await $fetch('/api/pickups/checkout', {
          method: 'POST',
          body: payload,
        });
        return data;
      } catch (e) {
        console.log((e as Error).message);
      }
    },
  },
});
