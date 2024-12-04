<template>
  <v-container>
    <v-card title='Pick Up Requests'>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" label="Search (use least common name, NOT full name)"
        prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line>
      </v-text-field>
      <v-data-table :headers="headers" :items="pickupStore.pickups" :search="search" :sort-by="['LastName']"
        :sort-desc="[false]" :itemsPerPage='-1'>
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

    <v-card title='Pick Up Completed'>
      <v-spacer></v-spacer>
      <v-data-table :headers="headersComplete" :items="pickupStore.completed" :search="search"
        :sort-by="['PickUp.Time', 'Departure.Time']" :sort-desc="[false, true]" :itemsPerPage='-1' item-key="QID">
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
  </v-container>
</template>

<script setup lang="ts">
const pickupStore = usePickupStore();
await useAsyncData('pickups', () => pickupStore.getTodaysPickups(), {});
await useAsyncData('completed', () => pickupStore.getTodaysCompletedPickups(), {});

const search = ref("");
const snackbar = ref(false);
const snackerror = ref(false);
const registrant = ref('');
const text_success = ref(' has been successfully picked up.');
const text_error = ref('Something went wrong, please refresh the page and try again.');
const timeout = ref(3000);
const checkdate = ref(Date());
let polling = null;

const headers = [
  { title: 'First', key: 'FirstName' },
  { title: 'Last', key: 'LastName' },
  { title: 'Person', key: 'PickupPerson' },
  { title: 'Relation', key: 'PickupRelation' },
  { title: 'Phone', key: 'PickupPhone' },
  { title: 'Parent Arrival Time', key: 'PickupTime' },
  { title: 'Time Out', key: 'Departure.Time' },
  { title: 'Depart', key: 'controls', sortable: false }
];
const headersComplete = [
  { title: 'First', key: 'FirstName' },
  { title: 'Last', key: 'LastName' },
  { title: 'Person', key: 'PickupPerson' },
  { title: 'Relation', key: 'PickupRelation' },
  { title: 'Phone', key: 'PickupPhone' },
  { title: 'Parent Arrival Time', key: 'PickupTime' },
  { title: 'Time Out', key: 'Departure.Time' }
];
const logDeparture = (item) => {
  console.log(item.QID)
};

//const refresh = () => {
//  console.log("Polling...");
//  pickupStore.getTodaysPickups();
//};

//onMounted(() => {
//    polling = window.setInterval(refresh, 10000);
//});

//onUnmounted(() => {
//  window.clearInterval(polling);
//});

</script>