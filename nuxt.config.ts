// https://nuxt.com/docs/api/configuration/nuxt-config
import { componentNames } from "#components";
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  components: true,
  compatibilityDate: "2024-11-01",
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/content",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "nuxt-toast",
  ],
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
