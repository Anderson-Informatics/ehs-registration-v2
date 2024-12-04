<template>
  <v-container>
    <div>
      <v-card>
        <v-card-title>
          Pick Up Requests
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
            hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="pickups" :search="search" :sort-by="['LastName']" :sort-desc="[false]"
          :itemsPerPage='-1'>
          <template v-slot:item.CheckIn.Registered="{ item }">
            <v-simple-checkbox v-model="item.CheckIn.Registered" disabled></v-simple-checkbox>
          </template>
          <template v-slot:item.controls="props">
            <v-btn class="mx-2" fab dark small color="red" @click="logDeparture(props.item)">
              <v-icon dark>mdi-logout-variant</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
      <div>{{ checkdate }}</div>
      <v-card>
        <v-card-title>
          Pick Up Completed
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table :headers="headersComplete" :items="pickupsComplete" :search="search"
          :sort-by="['PickUp.Time', 'Departure.Time']" :sort-desc="[false, true]" :itemsPerPage='-1' item-key="QID">
          <template v-slot:item.CheckIn.Registered="{ item }">
            <v-simple-checkbox v-model="item.CheckIn.Registered" disabled></v-simple-checkbox>
          </template>
          <template v-slot:item.controls="props">
            <v-btn class="mx-2" fab dark small color="red" @click="logDeparture(props.item)">
              <v-icon dark>mdi-logout-variant</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>

      <v-snackbar v-model="snackbar" :timeout="timeout" color="green" top>
        {{ registrant }}{{ text_success }}

        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="snackerror" :timeout="timeout" color="red" top>
        {{ text_error }}

        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackerror = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <br />
      <br />
      <v-btn small to="/dismissal">
        Dismissal Screen
      </v-btn>
    </div>
  </v-container>
</template>


<script>
export default {
  computed: {
    ...mapState({
      pickups: state => state.pickups.list.filter(student => student.Departure === '.'),
      pickupsComplete: state => state.pickups.list.filter(student => student.Departure !== '.')
    })
  },
  data() {
    return {
      search: '',
      headers: [
        { title: 'First', key: 'FirstName' },
        { title: 'Last', key: 'LastName' },
        { title: 'Person', key: 'PickupPerson' },
        { title: 'Relation', key: 'PickupRelation' },
        { title: 'Phone', key: 'PickupPhone' },
        { title: 'Parent Arrival Time', key: 'PickupTime' },
        { title: 'Time Out', key: 'Departure.Time' },
        { title: 'Depart', key: 'controls', sortable: false }
      ],
      headersComplete: [
        { title: 'First', key: 'FirstName' },
        { title: 'Last', key: 'LastName' },
        { title: 'Person', key: 'PickupPerson' },
        { title: 'Relation', key: 'PickupRelation' },
        { title: 'Phone', key: 'PickupPhone' },
        { title: 'Parent Arrival Time', key: 'PickupTime' },
        { title: 'Time Out', key: 'Departure.Time' }
      ],
      snackbar: false,
      snackerror: false,
      registrant: '',
      text_success: ' has been successfully picked up.',
      text_error: 'Something went wrong, please refresh the page and try again.',
      timeout: 3000,
      polling: null,
      checkdate: Date()
    }
  },
  methods: {
    setData() {
      this.$store.dispatch('pickups/loadPickups')
    },
    pollData() {
      this.polling = setInterval(() => {
        console.log("Polling...")
        this.$store.dispatch('pickups/loadPickups')
      }, 10000)
    },
    cancelAutoUpdate() {
      clearInterval(this.polling);
    },
    logDeparture(item) {
      console.log(item.QID)
      let now = new Date();
      let departureData = {
        QID: item.QID,
        FirstName: item.FirstName,
        LastName: item.LastName,
        Departure: {
          Date: now.toDateString(),
          Time: now.toLocaleTimeString(),
          Timestamp: now,
          PickedUp: true
        }
      }
      console.log(departureData)
      try {
        this.$store.dispatch('pickups/departOne', departureData)
      } catch (error) {
        console.log(error)
        return this.snackerror = true
      }
      try {
        return RegistrationService.postDeparture(departureData)
          .then(
            this.registrant = item.FirstName,
            //ADD CHECKOUT MUTATION TO ROSTER LIST STATE HERE
            console.log(this.registrant + ' had been checked out and picked up.')
          )
          .then(this.snackbar = true)
      } catch (error) {
        console.log(error)
        return this.snackerror = true
      }
    },
  },
  beforeDestroy() {
    this.cancelAutoUpdate();
  },
  created() {
    this.setData();
    this.pollData();
  },
}
</script>