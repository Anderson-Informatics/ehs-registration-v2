import { defineStore } from 'pinia';
import type { Student } from '~/types';

export const useStudentStore = defineStore('student-store', {
  state: () => ({
    // list all results
    students: [] as any[],
    student: {},
    registrations: [] as any[],
    summary: [] as any[],
  }),
  actions: {
    // Get all results from DB
    async getAll() {
      try {
        let data = await $fetch('/api/students');
        this.students = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getTodaysRegistrations() {
      const today = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeZone: 'America/Detroit',
      }).format(new Date());
      try {
        let data = await $fetch(`/api/students?CheckIn.Date=${today}`);
        this.registrations = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async checkInOne(checkInData: Student) {
      try {
        let data = await $fetch('/api/students/checkInOne', {
          method: 'POST',
          body: checkInData,
        });
        return {
          message: `Check In Successful for ${checkInData.SubmissionID}`,
        };
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async addLabel(student: any) {
      try {
        let response = await $fetch('/api/submittable/add', {
          method: 'POST',
          body: { ...student },
        });
        console.log(response);
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getSummary() {
      try {
        let data = await $fetch('/api/summary');
        this.summary = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
  },
});
