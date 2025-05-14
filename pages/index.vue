<template>
  <v-container>
    <div class="text-h3 mb-8">DPSCD Exam School Registration</div>
    <!-- Stack the columns on mobile by making one full-width and the other half-width -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="pa-2" outlined tile>
          Thank you for helping with the registration process for the High
          School Placement Test. Please use the buttons below or the menu bar on
          the left to navigate to the dashboard for your assigned station.
          <!--
              Thank you for volunteering to help with our registration proccess for our Examination High School Testing. To prevent the further spread of Covid-19 we are moving to a minimal-contact registration and check-out process. Please use the buttons below or the links in the top-left menu to navigate to your assigned station's dashboard.
            -->
        </v-card>
      </v-col>
      <v-col cols="6" md="4">
        <v-card class="pa-2" outlined tile>
          <v-img src="\DPSCDLogowTagWhite.png" />
        </v-card>
      </v-col>
    </v-row>

    <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
    <v-row>
      <v-col v-for="(item, i) in items" :key="i" cols="6" md="3">
        <v-btn
          x-large
          block
          class="pa-2"
          outlined
          color="teal"
          :to="item.to"
          router
        >
          <v-icon>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-card class="pa-2" outlined tile>
          {{ item.help }}
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="pa-2" outlined tile>
          Some useful tips for searching for names:
          <ul>
            <li>Do not enter full names</li>
            <li>Always confirm spelling before entering name</li>
            <li>Use the least common name</li>
          </ul>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//import axios from "axios";
//import { mapState } from "vuex";
export default {
  //computed: {
  //  ...mapState({
  //    roster: (state) => state.roster.list,
  //  }),
  //},
  data() {
    return {
      items: [
        {
          icon: 'mdi-alarm',
          title: 'Status',
          to: '/status',
          help: 'For greeters and entrance/exit management to check for eligibility to take the exam.',
        },
        {
          icon: 'mdi-account-check',
          title: 'Registration',
          to: '/registration',
          help: 'For registering students and printing test IDs, cell phone claim tags and accommodations information, if applicable.',
        },
        {
          icon: 'mdi-archive-clock',
          title: 'Proctoring',
          to: '/proctoring',
          help: "For adding proctor sessions and identifying students' test location.",
        },
        {
          icon: 'mdi-car',
          title: 'Pick Up',
          to: '/pickup',
          help: 'For checking parent arrival and logging student departure from testing center.',
        },
      ],
    };
  },
  //async fetch({ store }) {
  //  await store.dispatch("roster/loadRoster");
  //  await store.dispatch("pickups/loadPickups");
  //},
};
</script>
