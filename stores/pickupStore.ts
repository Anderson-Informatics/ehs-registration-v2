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
        let data = await $fetch<Pickup[]>('/api/pickups');
        this.pickups = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getTodaysPickups() {
      const today = new Date().toLocaleString('en-US', {
        timeZone: 'America/Detroit',
        month: 'numeric',
        day: '2-digit',
        year: 'numeric',
      });
      console.log(today);
      try {
        let data = await $fetch<Pickup[]>(
          `/api/pickups?PickupDate=${today}&Departure=.`,
        );
        this.pickups = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getTodaysCompletedPickups() {
      const today = new Date().toLocaleString('en-US', {
        timeZone: 'America/Detroit',
        month: 'numeric',
        day: '2-digit',
        year: 'numeric',
      });
      const pickup = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeZone: 'America/Detroit',
      }).format(new Date());
      try {
        let data = await $fetch<Pickup[]>(
          `/api/pickups?PickupDate=${today}&Departure.Date=${pickup}`,
        );
        this.completed = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async checkOut(payload: Object) {
      try {
        let data = await $fetch('/api/pickups/checkout', {
          method: 'POST',
          body: payload,
        });
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
  },
});
