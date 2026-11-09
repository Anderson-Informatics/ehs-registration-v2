// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },
  ssr: false,
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    //...
  ],
  vite: {
    plugins: [vuetify({ autoImport: true })],
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
    API_KEY: process.env.API_KEY,
    APP_SESSION_SECRET: process.env.APP_SESSION_SECRET,
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }],
      script: [
        { src: 'dymo.connect.framework.full.js', crossorigin: 'anonymous' },
      ],
      //script: [{ src: 'DYMO.Label.Framework.3.0.js' }],
    },
  },
});
