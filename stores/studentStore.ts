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
      // your callback gets executed automatically once the data is received
      var callback = (data: any, error: any) => {
        // consume data
        if (error) {
          console.error(error);
          return;
        }
        console.log(data);
        return data;
      };

      const request = async (retries: number, callback: any) => {
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
        let response = request(5, callback);
        //let data = await $fetch('/api/students/checkInOne', {
        //  method: 'POST',
        //  body: checkInData,
        //}).then((res) => {
        //  console.log(res);
        //});
        console.log(response);
        return {
          completed: true,
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
