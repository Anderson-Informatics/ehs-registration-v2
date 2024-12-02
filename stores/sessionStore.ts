import { defineStore } from "pinia";

export const useSessionStore = defineStore("session-store", {
  state: () => ({
    // list all results
    sessions: [],
    session: {},
  }),
  actions: {
    // Get all results from DB
    async getAll() {
      try {
        let data = await $fetch("/api/sessions");
        this.sessions = data;
        return data;
      } catch (e:any) {
        console.log(e.message);
      }
    },
    async getTodaysSessions() {
      try {
        const today = new Date().toDateString();
        let data = await $fetch(`/api/sessions?date=${today}`);
        this.sessions = data;
        return data;
      } catch (e:any) {
        console.log(e.message);
      }
    },
    async addSession(payload: Object) {
      try {
        let data = await $fetch('api/sessions/add', {
          method: "POST",
          body: payload
        });
        console.log(payload);
        console.log(data);
      } catch (e:any) {
        console.log(e.message);
      }
    },
  },
  
});
