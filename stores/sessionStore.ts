import { defineStore } from 'pinia';
import type { Session } from '~/types';

export const useSessionStore = defineStore('session-store', {
  state: () => ({
    // list all results
    sessions: [] as Session[],
    session: {} as Session,
  }),
  actions: {
    // Get all results from DB
    async getAll() {
      try {
        let data = await $fetch<Session[]>('/api/sessions');
        this.sessions = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getOne(sessionId: string) {
      try {
        console.log(sessionId);
        const sid = sessionId;
        let data = await $fetch<Session[]>(`/api/sessions?_id=${sid}`);
        this.session = data[0];
        return data[0];
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getTodaysSessions() {
      try {
        const today = new Intl.DateTimeFormat('en-US', {
          dateStyle: 'full',
          timeZone: 'America/Detroit',
        }).format(new Date());
        let data = await $fetch<Session[]>(`/api/sessions?date=${today}`);
        this.sessions = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async addSession(payload: Object) {
      try {
        await $fetch('/api/sessions/add', {
          method: 'POST',
          body: payload,
        });
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async startSession(sid: String) {
      // Get the runtimeconfig SUBMITTABLE API KEY
      const API_URL = useRuntimeConfig().API_URL;
      try {
        console.log(`Session store sid: ${sid}`);
        await $fetch(`/api/sessions/start?sid=${sid}`);
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async addStudent(payload: Object) {
      try {
        let data = await $fetch('/api/sessions/register', {
          method: 'POST',
          body: payload,
        });
        console.log('Added student', data);
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async endSession(payload: Object) {
      try {
        let data = await $fetch('/api/sessions/end', {
          method: 'POST',
          body: payload,
        });
        console.log('Ended session', data);
      } catch (e: any) {
        console.log(e.message);
      }
    },
  },
});
