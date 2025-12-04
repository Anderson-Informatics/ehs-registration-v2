<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="sessionStore.sessions"
      class="elevation-1"
      item-key="_id"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Today's Proctor Sessions</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn color="primary" dark class="mb-2" v-bind="activatorProps">
                New Session
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Create New Session</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        v-model="newItem.proctor"
                        label="Proctor name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        v-model="newItem.phone"
                        label="Proctor phone"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        v-model="newItem.room"
                        label="Room #"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-select
                        v-model="newItem.wing"
                        label="Wing"
                        :items="wings"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" @click="close"> Cancel </v-btn>
                <v-btn color="blue darken-1" @click="save(newItem)">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.proctor`]="{ item }">
        <nuxt-link :to="`/session/${item._id}`" prefetch>{{
          item.proctor
        }}</nuxt-link>
      </template>
    </v-data-table>
    <div>
      <v-card title="Registered Students" flat>
        <template v-slot:text>
          <v-text-field
            v-model="search"
            placeholder="Search (use least common name, NOT full name)"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            text
            hide-details
            single-line
          >
          </v-text-field>
        </template>
        <v-data-table
          item-key="_id.$oid"
          :headers="headers2"
          :items="studentStore.registrations"
          :search="search"
        >
          <template v-slot:[`item.IEP`]="props">
            <div v-if="props.item.IEP === 'Yes'">
              <v-chip color="warning" dark>
                <span class="iep">{{ props.item.IEP }}</span>
              </v-chip>
            </div>
            <div v-else>
              <span class="iep">{{ props.item.IEP }}</span>
            </div>
          </template>
          <template v-slot:[`item.FirstName`]="props">
            <span class="first-name">{{ props.item.FirstName }}</span>
          </template>
          <template v-slot:[`item.LastName`]="props">
            <span class="last-name">{{ props.item.LastName }}</span>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import type { Session } from '@/types';

const studentStore = useStudentStore();
await useAsyncData(
  'registrations',
  () => studentStore.getTodaysRegistrations(),
  {},
);
const sessionStore = useSessionStore();
await useAsyncData('sessions', () => sessionStore.getTodaysSessions(), {});

const search = ref('');
const dialog = ref(false);
const wings = ['A', 'B', 'C', 'D'];
const headers: Array<{
  title: string;
  align?: 'start' | 'end' | 'center';
  sortable?: boolean;
  key: string;
}> = [
  {
    title: 'Proctor Name',
    align: 'start',
    sortable: false,
    key: 'proctor',
  },
    { title: 'Room #', key: 'room', align: 'start' },
    { title: 'Wing', key: 'wing', align: 'start' },
    { title: 'Start Time', key: 'start', align: 'start' },
    { title: 'End Time', key: 'end', align: 'start' },
    { title: 'Proctor Phone', key: 'phone', align: 'start' },
];
const headers2 = [
  {
    title: 'Name',
    align: 'start' as 'start',
    sortable: false,
    key: 'FullName',
  },
  { title: 'IEP', key: 'IEP' },
  { title: 'First', key: 'FirstName' },
  { title: 'Last', key: 'LastName' },
  { title: 'Room', key: 'TestSession.room' },
  { title: 'Wing', key: 'TestSession.wing' },
  { title: 'Proctor', key: 'TestSession.proctor' },
  //{ title: "ID", key: "SubmissionID" },
  { title: 'Registration Time', key: 'CheckIn.Time' },
];
const newItem = ref({
  _id: crypto.randomUUID(),
  proctor: '',
  phone: '',
  room: '',
  wing: '',
  date: new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "America/Detroit",
  }).format(new Date()),
  start: '',
  end: '',
  students: [],
});

const close = () => {
  dialog.value = false;
  nextTick(() => {
    newItem.value = Object.assign(
      {},
      {
        _id: crypto.randomUUID(),
        proctor: '',
        phone: '',
        room: '',
        wing: '',
        date: new Intl.DateTimeFormat("en-US", {
          dateStyle: "full",
          timeZone: "America/Detroit",
        }).format(new Date()),
        start: '',
        end: '',
        students: [],
      },
    );
  });
};

const save = (payload: Session) => {
  try {
    console.log(payload);
    // Need to add this endpoint and to sessionStore
    sessionStore.addSession(payload);
    sessionStore.sessions.push(payload);
    const router = useRouter();
    router.push(`/session/${payload._id}`);
  } catch (error) {
    console.log(error);
  }
  close();
};
</script>
