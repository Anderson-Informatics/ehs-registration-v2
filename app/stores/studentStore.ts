import { defineStore } from 'pinia';
import type { Student, SummaryRow } from '~/types';

export const useStudentStore = defineStore('student-store', {
  state: () => ({
    // list all results
    students: [] as Student[],
    student: {},
    registrations: [] as Student[],
    summary: [] as SummaryRow[],
  }),
  actions: {
    // Get all results from DB
    async getAll() {
      try {
        const data = await $fetch<Student[]>('/api/students');
        this.students = data;
        return data;
      } catch (e) {
        console.log((e as Error).message);
      }
    },
    async getTodaysRegistrations() {
      const today = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeZone: 'America/Detroit',
      }).format(new Date());
      try {
        const data = await $fetch<Student[]>(
          `/api/students?CheckIn.Date=${today}`,
        );
        this.registrations = data;
        return data;
      } catch (e) {
        console.log((e as Error).message);
      }
    },
    async checkInOne(checkInData: Student) {
      // your callback gets executed automatically once the data is received
      const callback = (data: unknown, error?: unknown) => {
        // consume data
        if (error) {
          console.error(error);
          return;
        }
        console.log(data);
        return data;
      };

      const request = async (
        retries: number,
        callback: (data: unknown, error?: unknown) => unknown,
      ) => {
        await $fetch('/api/students/checkInOne', {
          method: 'POST',
          body: checkInData,
        })
          .then((response) => {
            // request successful
            if (response.message == 'Check In Successfully Completed') {
              // server done, deliver data to script to consume
              callback(response);
            } else {
              // server not done yet
              // retry, if any retries left
              if (retries > 0) {
                request(--retries, callback);
              } else {
                // no retries left, calling callback with error
                callback([], 'out of retries');
              }
            }
          })
          .catch((error) => {
            // ajax error occurred
            // would be better to not retry on 404, 500 and other unrecoverable HTTP errors
            // retry, if any retries left
            if (retries > 0) {
              request(--retries, callback);
            } else {
              // no retries left, calling callback with error
              callback([], error);
            }
          });
      };
      try {
        // run the request. this function will call itself max. 5 times if the request fails
        await request(5, callback);
        return {
          completed: true,
          message: `Check In Successful for ${checkInData.SubmissionID}`,
        };
      } catch (e) {
        console.log((e as Error).message);
      }
    },
    async addLabel(student: Student) {
      try {
        const response = await $fetch('/api/submittable/add', {
          method: 'POST',
          body: { ...student },
        });
        console.log(response);
      } catch (e) {
        console.log((e as Error).message);
      }
    },
    async getSummary() {
      try {
        const data = await $fetch<SummaryRow[]>('/api/summary');
        this.summary = data;
        return data;
      } catch (e) {
        console.log((e as Error).message);
      }
    },
  },
});
