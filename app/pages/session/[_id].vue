<template>
  <v-container>
    <h1>Proctor Session Information</h1>
    <h3>Proctor: {{ sessionStore.session.proctor }}</h3>
    <h3>Date: {{ sessionStore.session.date }}</h3>
    Location: {{ sessionStore.session.room }} - {{ sessionStore.session.wing
    }}<br />
    <div v-if="(sessionStore.session.start ?? '').length > 0">
      Start time: {{ sessionStore.session.start }}
    </div>
    <div v-else>
      <v-btn color="green" class="ma-4" @click="startSession()">
        Start Testing
      </v-btn>
    </div>
    <div
      v-if="
        (sessionStore.session.end ?? '').length > 0 &&
        (sessionStore.session.start ?? '').length > 0
      "
    >
      End time: {{ sessionStore.session.end }}
    </div>
    <div v-else-if="(sessionStore.session.start ?? '').length > 0">
      <v-btn color="purple" class="ma-4" @click="endSession()">
        End Testing
      </v-btn>
    </div>
    <br />

    Student list:<br />
    <div
      v-for="student in sessionStore.session.students"
      :key="student.SubmissionID"
    >
      {{ student.SubmissionID }} - {{ student.FirstName }}
      {{ student.LastName }}
    </div>

    <span></span>
    <span></span>
    <br />
    <br />
    <div v-if="(sessionStore.session.end ?? '').length == 0">
      <h2>Find and Add Students to your Session</h2>
      <div v-if="(sessionStore.session.start ?? '').length > 0">
        <v-card>
          <v-card-title>
            <template v-slot>
              <v-text-field
                v-model="search"
                placeholder="Search (use Submission ID or least common name, NOT full name)"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                text
                hide-details
                single-line
              >
              </v-text-field>
            </template>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="studentStore.registrations"
            :search="search"
          >
            <template v-slot:[`item.controls`]="props">
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="green"
                @click="addStudent(props.item)"
              >
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
    <div v-else>
      <h4><em>Testing session completed and closed.</em></h4>
    </div>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute();
const studentStore = useStudentStore();
await useAsyncData(
  'registrations',
  () => studentStore.getTodaysRegistrations(),
  {},
);
studentStore.registrations = studentStore.registrations.filter(
  (item) => item.TestSession === '',
);
const sessionStore = useSessionStore();

// Define the type for the payload object
interface StudentPayload {
  sid: string;
  student: StudentShort;
  session: {
    _id: string;
    proctor: string;
    room: string;
    wing: string;
    start: string;
  };
}
// Ensure sessionStore.session.students is typed as an array of Student
sessionStore.session.students =
  sessionStore.session.students || ([] as StudentShort[]);

// Ensure sessionStore.session.students is typed as an array of Student
import type { Session, StudentShort } from '@/types'; // Adjust the path to where the Session and StudentShort types are defined

const session = sessionStore.session as Session;
await useAsyncData(
  'session',
  () =>
    sessionStore.getOne(
      Array.isArray(route.params._id) ? route.params._id[0] : route.params._id,
    ),
  {},
);

const routeId = route.params._id;

const search = ref('');
const headers = [
  {
    text: 'Full Name',
    align: 'start' as 'start',
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

const addStudent = (item: any) => {
  let addConfirmation = confirm(
    `Please confirm you want to add ${item.FullName} (Submission ID: ${item.SubmissionID}) to your testing session. Please double check that this student is in your classroom. This action cannot be undone.`,
  );
  if (addConfirmation) {
  } else {
    return;
  }
  const payload: StudentPayload = {
    sid: Array.isArray(routeId) ? routeId[0] : routeId,
    student: {
      SubmissionID: item.SubmissionID,
      FullName: item.FullName,
      FirstName: item.FirstName,
      LastName: item.LastName,
    },
    session: {
      _id: sessionStore.session._id,
      proctor: sessionStore.session.proctor,
      room: sessionStore.session.room,
      wing: sessionStore.session.wing,
      start: sessionStore.session.start ?? '',
    },
  };

  try {
    console.log(payload);
    sessionStore.addStudent(payload); // This will update the db
    sessionStore.session.students = sessionStore.session.students || []; // Ensure it's an array
    sessionStore.session.students.push(payload.student); // This will update the pinia store
    studentStore.registrations = studentStore.registrations.filter(
      (each) => each.SubmissionID !== item.SubmissionID,
    ); // This will remove the student from the registrations
  } catch (error) {
    console.log(error);
  }
};

const startSession = () => {
  try {
    const starttime = new Date().toLocaleString('en-US', {
      timeZone: 'America/Detroit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
    sessionStore.startSession(Array.isArray(routeId) ? routeId[0] : routeId);
    sessionStore.session.start = starttime;
  } catch (error) {
    console.log(error);
  }
};

const endSession = () => {
  let endConfirmation = confirm(
    'This will check out all students and end the testing session. Please confirm that testing is complete.',
  );
  if (endConfirmation) {
  } else {
    return;
  }
  let ids = (sessionStore.session.students || []).map(
    ({ SubmissionID }) => SubmissionID,
  );
  console.log('end session ids: ', ids);
  let now = new Date();
  const payload = {
    _id: routeId,
    start: sessionStore.session.start,
    end: now.toLocaleString('en-US', {
      timeZone: 'America/Detroit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }),
    CheckOut: {
      Date: new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeZone: 'America/Detroit',
      }).format(now),
      Time: now.toLocaleString('en-US', {
        timeZone: 'America/Detroit',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      }),
      Timestamp: now,
      CheckedOut: true,
    },
    students: ids,
  };
  console.log('end session payload: ', payload);
  try {
    sessionStore.endSession(payload);
    sessionStore.session.end = payload.end;
  } catch (error) {
    console.log(error);
  }
};

// This will enable polling to refresh the student list every 10 seconds
let polling: number | undefined = undefined;

const refresh = () => {
  console.log('Polling...');
  studentStore.getTodaysRegistrations();
};

onMounted(() => {
  polling = window.setInterval(refresh, 120000);
});

onUnmounted(() => {
  window.clearInterval(polling);
});
</script>
