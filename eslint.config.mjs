// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    // DYMO label printing code is kept as-is
    ignores: ['public/dymo*.js', 'app/composables/print*.ts'],
  },
  {
    rules: {
      // Vuetify slot names such as `item.CheckIn.Date` contain dots
      'vue/valid-v-slot': ['error', { allowModifiers: true }],
    },
  },
  eslintConfigPrettier,
);
// Your custom configs here
