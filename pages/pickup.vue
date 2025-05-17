<template>
  <v-container>
    <v-card title="Pick Up Requests">
      <v-spacer></v-spacer>
      <v-text-field v-model="search" placeholder="Search (use least common name, NOT full name)"
        prepend-inner-icon="mdi-magnify" variant="outlined" text hide-details single-line>
      </v-text-field>
      <v-data-table :headers="headers" :items="pickupStore.pickups" :search="search"
        :sort-by="[{ key: 'LastName', order: 'asc' }]" :sort-desc="[false]" :itemsPerPage="-1">
        <!--
        <template v-slot:item.CheckIn.Registered="{ item }">
          <v-simple-checkbox v-model="item.CheckIn.Registered" disabled></v-simple-checkbox>
        </template>
-->
        <template v-slot:item.controls="{ item }">
          <v-btn class="mx-2" fab dark small color="red" @click="logDeparture(item)">
            <v-icon dark>mdi-logout-variant</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-card title="Pick Up Completed">
      <v-spacer></v-spacer>
      <v-data-table :headers="headersComplete" :items="pickupStore.completed" :search="search"
        :sort-by="[{ key: 'PickUp.Time', order: 'asc' }, { key: 'Departure.Time', order: 'desc' }]"
        :sort-desc="[false, true]" :itemsPerPage="-1" item-key="QID">
        <!--
        <template v-slot:item.CheckIn.Registered="{ item }">
          <v-simple-checkbox v-model="item.CheckIn.Registered" disabled></v-simple-checkbox>
        </template>
      -->
        <template v-slot:item.controls="props">
          <v-btn class="mx-2" fab dark small color="red" @click="logDeparture(props.item)">
            <v-icon dark>mdi-logout-variant</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="timeout" color="green" top>
      {{ registrant }}{{ text_success }}

      <template v-slot:actions>
        <v-btn color="white" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="snackerror" :timeout="timeout" color="red" top>
      {{ text_error }}

      <template v-slot:actions>
        <v-btn color="white" @click="snackerror = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <br />
    <br />
    <v-btn small to="/dismissal"> Dismissal Screen </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import type { Pickup } from '@/types';

const pickupStore = usePickupStore();
const pickups = ref<Pickup[]>(pickupStore.pickups);
await useAsyncData('pickups', () => pickupStore.getTodaysPickups(), {});
const completed = ref<Pickup[]>(pickupStore.completed);
await useAsyncData(
  'completed',
  () => pickupStore.getTodaysCompletedPickups(),
  {},
);

const search = ref('');
const snackbar = ref(false);
const snackerror = ref(false);
const registrant = ref('');
const text_success = ref(' has been successfully picked up.');
const text_error = ref(
  'Something went wrong, please refresh the page and try again.',
);
const timeout = ref(3000);
const checkdate = ref(Date());
let polling: number | undefined = undefined;

const headers = [
  { title: 'First', key: 'FirstName' },
  { title: 'Last', key: 'LastName' },
  { title: 'Person', key: 'PickupPerson' },
  { title: 'Relation', key: 'PickupRelation' },
  { title: 'Phone', key: 'PickupPhone' },
  { title: 'Parent Arrival Time', key: 'PickupTime' },
  { title: 'Time Out', key: 'Departure.Time' },
  { title: 'Depart', key: 'controls', sortable: false },
];
const headersComplete = [
  { title: 'First', key: 'FirstName' },
  { title: 'Last', key: 'LastName' },
  { title: 'Person', key: 'PickupPerson' },
  { title: 'Relation', key: 'PickupRelation' },
  { title: 'Phone', key: 'PickupPhone' },
  { title: 'Parent Arrival Time', key: 'PickupTime' },
  { title: 'Time Out', key: 'Departure.Time' },
];
const logDeparture = (item: Pickup) => {
  const now = new Date();
  const departureData = {
    QID: item.QID,
    FirstName: item.FirstName,
    LastName: item.LastName,
    Departure: {
      Date: new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeZone: "America/Detroit",
      }).format(now),
      Time: now.toLocaleString('en-US', {
        timeZone: 'America/Detroit',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      }),
      Timestamp: now.toISOString(),
      PickedUp: true,
    },
  };
  try {
    const student = pickups.value.filter(
      (each) => each.QID === item.QID,
    )[0];
    console.log('student: ', student);
    console.log('departureData: ', departureData);
    //student.Departure = departureData.Departure; // Add the departure data to the student
    pickupStore.checkOut(departureData); // Run the checkOut via the API
    registrant.value = item.FirstName + ' ' + item.LastName;
    console.log(registrant.value + ' had been checked out and picked up.');
    text_success.value = registrant.value + ' had been checked out and picked up.';
    snackbar.value = true;
  } catch (error: any) {
    console.log(error);
    return (snackerror.value = true);
  }
};

const refresh = () => {
  console.log('Polling...');
  pickupStore.getTodaysPickups();
  pickupStore.getTodaysCompletedPickups();
};

onMounted(() => {
  polling = window.setInterval(refresh, 10000);
});

onUnmounted(() => {
  window.clearInterval(polling);
});
</script>
