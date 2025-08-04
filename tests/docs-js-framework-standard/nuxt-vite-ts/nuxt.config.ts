// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@vueuse/nuxt'],

  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
      },
      {
        code: 'zh-CN',
        name: '简体中文',
      },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_and_default',
  },

  vite: {
    build: {
      target: 'es2015',
    }
  }
})
