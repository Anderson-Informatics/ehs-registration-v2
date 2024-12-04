import { defineStore } from "pinia";

export const usePickupStore = defineStore("pickup-store", {
  state: () => ({
    pickups: [],
  }),
  actions: {
    async getAll() {
      try {
        let data = await $fetch("/api/pickups");
        this.pickups = data;
        return data;
      } catch (e) {
        console.log(e.message);
      }
    },
    async getTodaysPickups() {
      const today = new Date().toDateString("en-US");
      try {
        let data = await $fetch(`/api/pickups?PickupDate=${today}`);
        this.pickups = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
  }
});
