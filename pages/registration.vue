<template>
  <v-container>
    <v-card title="Registration" flat>
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Search (use least common name, NOT full name)"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line>
        </v-text-field>
      </template>

      <v-data-table 
        :headers="headers"
        :items="studentStore.students"
        :search="search"
      >
        <template v-slot:item.FirstName="{ item }">
          <span class="first-name">{{ item.FirstName }}</span>
        </template>
        <template v-slot:item.LastName="{ item }">
          <span class="last-name">{{ item.LastName }}</span>
        </template>
        <template v-slot:item.SubmissionID="{ item }">
          <span class="submission-id">
            <a :href="'https://dpscd.submittable.com/submissions/' + item.SubmissionID" target="_blank"
              style="color:#aed6fc; text-decoration:none;">
              {{ item.SubmissionID }}
            </a>
          </span>
        </template>
        <template v-slot:item.submissionIdUnique="{ item }">
          <span class="submission-id-unique">{{ item.submissionIdUnique }}</span>
        </template>
        <template v-slot:item.controls="{ item }">
          <v-btn class="mx-2" fab dark small color="green" @click="checkIn(item); print(item)">
            <v-icon dark>mdi-account-check</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar
    v-model="snackbar"
    :timeout="timeout"
    color="green"
    top
  >
    {{registrant}}{{ text_success }}

    <template v-slot:actions>
      <v-btn
        color="white"
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar
    v-model="snackerror"
    :timeout="timeout"
    color="red"
    top
  >
    {{ text_error }}

    <template v-slot:actions>
      <v-btn
        color="white"
        @click="snackerror = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  </v-container>
</template>


<script setup lang="ts">
const studentStore = useStudentStore();
await useAsyncData('students', () => studentStore.getAll(), {});

const search = ref('');
const snackbar = ref(false);
const snackerror = ref(false);
const registrant = ref('');
const text_success = ref(' has been successfully registered.');
const text_error = ref('Something went wrong, please refresh the page and try again.');
const timeout = 3000;
const rePrint = ref(true);
const headers = [
  {
    title: 'Name',
    align: 'start',
    sortable: false,
    key: 'FullName',
  },
  { title: 'IEP', key: 'IEP' },
  { title: 'First', key: 'FirstName' },
  { title: 'Last', key: 'LastName' },
  //{ text: 'Session', key: 'Session' },
  { title: 'ID', key: 'SubmissionID' },
  { title: 'NewID', key: 'submissionIdUnique', align: ' d-none' },
  { title: 'Accommodations', key: 'Accommodations', align: ' d-none' },
  { title: 'Registration Time', key: 'CheckIn.Time' },
  { title: 'Register', key: 'controls', sortable: false }
];

const checkIn = (item:any) => {
  if (item.CheckIn.Registered) {
    let reRegister = confirm('This student appears to have already registered, are you sure would like to register this student?')
    if (reRegister) {
    } else {
      rePrint.value = false
      return
    }
  }
  let now = new Date();
  let checkinData = {
    SubmissionID: item.SubmissionID,
    submissionIdUnique: item.submissionIdUnique,
    CheckIn: {
      Date: now.toDateString(),
      Time: now.toLocaleTimeString(),
      Timestamp: now,
      Registered: true
    }
  }
  console.log(checkinData)
  try {
    studentStore.checkInOne(checkinData)
    const student = studentStore.students.filter(
      (each:any) =>
        each.submissionIdUnique === item.submissionIdUnique
    )[0]
    console.log(student)
    student.CheckIn = checkinData.CheckIn
    //this.$store.dispatch('roster/checkInOne', checkinData)
    studentStore.addLabel(item)
    registrant.value = item.FullName
    snackbar.value = true
  } catch (error) {
    console.log(error)
    return snackerror.value = true
  }
};

const print = (item:any) => {
  if (rePrint) {
    printIep(item);
    printLabel(item);
    printPhone(item);
  } else {
    rePrint.value = true;
  }
};
</script>
