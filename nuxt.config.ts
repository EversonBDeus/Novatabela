// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-icon','@nuxtjs/color-mode','@pinia/nuxt'],
  alias:{
    css:"/<rootDir/>sddryd/css>",

  },

  css:["@/assets/css/main.css"],
 
  pinia:{
    storesDirs:['./stores/**']
  },
  




})
