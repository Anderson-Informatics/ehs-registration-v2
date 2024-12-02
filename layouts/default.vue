<template>
    <v-app theme="dark">
        <v-card>
      <v-layout>
        <v-navigation-drawer
          v-model="drawer"
          :rail="rail"
          permanent
          @click="rail = false"
        >
          <v-list-item
            prepend-avatar="/DPSCDLogoNoTagBlue.png"
            title="EHS Registration"
            nav
          >
            <template v-slot:append>
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="rail = !rail"
              ></v-btn>
            </template>
          </v-list-item>
  
          <v-divider></v-divider>
  
          <v-list density="compact" nav>
            <v-list-item v-for="item in items"
                :prepend-icon="item.icon"
                :title="item.title"
                :value="item.to"
                router
                :to="item.to">
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="min-height: 500px">
            <NuxtPage />
        </v-main>
      </v-layout>
    </v-card>
    </v-app>
  </template>

<script>
export default {
  data () {
    return {
      drawer: true,
      rail: true,
      items: [
        {
          icon: 'mdi-home-city',
          title: 'Start Page',
          to: '/'
        },
        {
          icon: 'mdi-alarm',
          title: 'Status',
          to: '/status'
        },
        {
          icon: 'mdi-account-check',
          title: 'Registration',
          to: '/registration'
        },
        {
          icon: 'mdi-archive-clock',
          title: 'Proctoring',
          to: '/proctoring'
        },
        {
          icon: 'mdi-car',
          title: 'Pick Up',
          to: '/pickup'
        },
        {
          icon: 'mdi-calendar-sync',
          title: 'End of Day',
          to: '/eod'
        }
      ],
    }
  },
}
</script>
  