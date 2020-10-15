<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "@/components/NavBar/Navbar.vue";
export default {
  name: "App",
  metaInfo: {
    titleTemplate: "%s - AdminPlatform",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  },
  components: { Navbar },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
.montserrat-font {
  font-family: "Montserrat", sans-serif !important;
}
</style>
