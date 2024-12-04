<template>
  <v-container>
    <h1>Proctor Session Information</h1>
    <h3>Proctor: {{ sessionStore.session.proctor }}</h3>
    <h3>Date: {{ sessionStore.session.date }}</h3>
    Location: {{ sessionStore.session.room }} - {{ sessionStore.session.wing }}<br />
    <div v-if="sessionStore.session.start.length > 0">
      Start time: {{ sessionStore.session.start }}
    </div>
    <div v-else>
      <v-btn color="green" class="ma-4" @click="startSession()">
        Start Testing
      </v-btn>
    </div>
    <div v-if="sessionStore.session.end.length > 0 && sessionStore.session.start.length > 0">
      End time: {{ sessionStore.session.end }}
    </div>
    <div v-else-if="sessionStore.session.start.length > 0">
      <v-btn color="purple" class="ma-4" @click="endSession()">
        End Testing
      </v-btn>
    </div>
    <br />

    Student list:<br />
    <div v-for="student in sessionStore.session.students" :key="student.SubmissionID">
      {{ student.SubmissionID }} - {{ student.FirstName }} {{ student.LastName }}
    </div>

    <span></span>
    <span></span>
    <br />
    <br />
    <h2>Find and Add Students to your Session</h2>
    <div v-if='sessionStore.session.start.length > 0'>
      <v-card>
        <v-card-title>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
            hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="studentStore.registrations" :search="search">
          <template v-slot:[`item.controls`]="props">
            <v-btn class="mx-2" fab dark small color="green" @click="addStudent(props.item)">
              <v-icon dark>mdi-account-plus</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <div v-else>
      <h4><em>You can add students once you have started testing.</em></h4>
    </div>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute();
const studentStore = useStudentStore();
await useAsyncData('registrations', () => studentStore.getTodaysRegistrations(), {});
studentStore.registrations = studentStore.registrations.filter(item => item.TestSession === "");
const sessionStore = useSessionStore();
await useAsyncData('session', () => sessionStore.getOne(route.params._id), {});

const routeId = route.params._id;

const search = ref('');
const headers = [
  {
    text: 'Full Name',
    align: 'start',
    filterable: false,
    value: 'FullName',
  },
  { text: 'First Name', value: 'FirstName' },
  { text: 'Last Name', value: 'LastName' },
  { text: 'Submission ID', value: 'SubmissionID' },
  { text: 'Check In Date', value: 'CheckIn.Date' },
  { text: 'Check In Time', value: 'CheckIn.Time' },
  { text: 'Add', value: 'controls', sortable: false },
];

const addStudent = (item:any) => {
  const payload = {
    sid: routeId,
    student: {
      SubmissionID: item.SubmissionID,
      FullName: item.FullName,
      FirstName: item.FirstName,
      LastName: item.LastName,
      LinkedID: item._id.$oid
    },
    session: { 
      _id: sessionStore.session._id,
      proctor: sessionStore.session.proctor,
      room: sessionStore.session.room,
      wing: sessionStore.session.wing,
      start: sessionStore.session.start,
    }
  }
  
  try {
    console.log(payload)
    sessionStore.addStudent(payload); // This will update the db
    sessionStore.session.students.push(payload.student); // This will update the pinia store
    studentStore.registrations = studentStore.registrations.filter(each => each.SubmissionID !== item.SubmissionID); // This will remove the student from the registrations
  } catch (error) {
    console.log(error)
  }
};

const startSession = () => {
  try {
    const starttime = new Date().toLocaleTimeString();
    sessionStore.startSession(routeId);
    sessionStore.session.start = starttime;
  } catch (error) {
    console.log(error)
  }
};

const endSession = () => {
  let endConfirmation = confirm('This will check out all students and end the testing session. Please confirm that testing is complete.')
  if (endConfirmation) {
  } else {
    return
  }
  let ids = sessionStore.session.students.map(({SubmissionID}) => SubmissionID);
  let now = new Date();
  const payload = {
    _id: routeId,
    end: new Date().toLocaleTimeString(),
    CheckOut: {
      Date: now.toDateString(),
      Time: now.toLocaleTimeString(),
      Timestamp: now,
      CheckedOut: true
    },
    students: ids
  }
  try {
    sessionStore.endSession(payload);
    sessionStore.session.end = payload.end;
  } catch (error) {
    console.log(error)
  }
};
</script>