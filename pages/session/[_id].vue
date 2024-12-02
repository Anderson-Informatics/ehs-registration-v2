<template>
    <v-container>
      <h1>Proctor Session Information</h1>
      <div v-for="session in sessionStore.sessions" :key="session._id">
        <div v-if="session._id == routeId">
          <h3>Proctor: {{ session.proctor }}</h3>
          <h3>Date: {{ session.date }}</h3>
          Location: {{ session.room }} - {{ session.wing}}<br/>
          <div v-if="session.start.length > 0">
            Start time: {{ session.start }}
          </div>
          <div v-else>
            <v-btn
              color="green"
              class="ma-4"
              @click="startSession()"
            >
              Start Testing
            </v-btn>
          </div>
          <div v-if="session.end.length > 0">
            End time: {{ session.end }}
          </div>
          <div v-else>
            <v-btn
              color="purple"
              class="ma-4"
              @click="endSession()"
            >
              End Testing
            </v-btn>
          </div>
          <br/>
          
          Student list:<br/>
          <div v-for="student in session.students" :key="student.SubmissionID">
            {{ student.SubmissionID }} - {{ student.FirstName }} {{ student.LastName }}
          </div>
        
  
  <span></span>
      <span></span>
      <br/>
      <br/>
      <h2>Find and Add Students to your Session</h2>
      <div v-if='session.start.length > 0'>
          <v-card>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="studentStore.registrations"
              :search="search"
            >
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
        </div>
      </div>    
    </v-container>
  </template>
  
<script setup  lang="ts">
const route = useRoute();
// students
// registered
const studentStore = useStudentStore();
await useAsyncData('registrations', () => studentStore.getTodaysRegistrations(), {});
const sessionStore = useSessionStore();
await useAsyncData('sessions', () => sessionStore.getAll(), {});

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

const addStudent = (item) => {
    const payload = {
      sid: routeId,
      student: {
        SubmissionID: item.SubmissionID,
        FullName: item.FullName,
        FirstName: item.FirstName,
        LastName: item.LastName,
        LinkedID: item._id.$oid
      }
    }
    try {
        console.log(payload)
        this.$store.dispatch('sessions/addStudent', payload)
        this.$store.dispatch('roster/deleteRegistration', payload)
    } catch(error) {
        console.log(error)
    }
    try {
        RegistrationService.addStudentToSession(payload)
    } catch(error) {
        console.log(error)
    }
};

const startSession = () => {
    const payload = {
        sid: routeId,
        time: {
        start: new Date().toLocaleTimeString()
        }
    }
    this.$store.dispatch('sessions/setStartEndTime', payload)
    try {
        RegistrationService.startSession(payload)
    } catch(error) {
        console.log(error)
    }
};

const endSession = () => {
    let endConfirmation = confirm('This will check out all students and end the testing session. Please confirm that testing is complete.')
    if(endConfirmation) {
    } else {
    return
    }
    let now = new Date();
    const payload = {
    sid: this.routeId,
    time: {
        end: new Date().toLocaleTimeString()
    },
    CheckOut: {
        Date: now.toDateString(),
        Time: now.toLocaleTimeString(),
        Timestamp: now,
        CheckedOut: true 
    }
    }
    this.$store.dispatch('sessions/setStartEndTime', payload)
    try {
    RegistrationService.endSession(payload)
    } catch(error) {
    console.log(error)
    }
};
</script>