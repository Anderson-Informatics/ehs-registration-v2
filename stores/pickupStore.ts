import { defineStore } from "pinia";

export const usePickupStore = defineStore("pickup-store", {
  state: () => ({
    pickups: [],
    completed: [],
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
      const today = new Date().toLocaleDateString("en-US");
      try {
        let data = await $fetch(`/api/pickups?PickupDate=${today}&Departure=.`);
        this.pickups = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getTodaysCompletedPickups() {
      const today = new Date().toLocaleDateString("en-US");
      const pickup = new Date().toDateString();
      try {
        let data = await $fetch(`/api/pickups?PickupDate=${today}&Departure.Date=${pickup}`);
        this.completed = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
  }
});
