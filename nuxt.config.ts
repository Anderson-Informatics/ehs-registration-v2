// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  build: {
    transpile: ['vuetify'],
  },
  nitro: {
    plugins: ["~/server/plugins/mongodb.ts"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxt/eslint',
    '@pinia/nuxt',
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    API_URL: process.env.API_URL,
    SUBMITTABLE_API_KEY: process.env.SUBMITTABLE_API_KEY,
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }
      ],
      script: [
        { src: 'DYMO.Label.Framework.3.0.js' }
      ],
    },
  }
  
})
