<template>
  <nav id="navbar">
    <v-app-bar dense app flat elevate-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-btn to="/" depressed text>PlatformName</v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Guest buttons -->
      <GuestNavButtons
        v-if="authType == 'guest'"
        :guestOptions="guestOptions"
      />

      <!-- Auth buttons -->
      <AuthNavButtons
        v-if="authType == 'auth'"
        :authOptions="authOptions"
        @logout="logout"
      />

      <!-- Admin buttons -->
      <AdminNavButtons
        v-if="authType == 'admin'"
        :authOptions="adminOptions"
        @logout="logout"
      />
    </v-app-bar>

    <!-- Side Drawer -->
    <NavDrawer
      :authType="authType"
      :drawer="drawer"
      :options="{ guestOptions, authOptions, adminOptions }"
      @setDrawer="setDrawer"
      @logout="logout"
    />
  </nav>
</template>
  
<script>
import NavDrawer from "@/components/NavBar/NavDrawer/NavDrawer.vue";
import GuestNavButtons from "@/components/NavBar/GuestNavButtons.vue";
import AuthNavButtons from "@/components/NavBar/AuthNavButtons.vue";
import AdminNavButtons from "@/components/NavBar/AdminNavButtons.vue";

export default {
  name: "Navbar",
  components: { NavDrawer, GuestNavButtons, AuthNavButtons, AdminNavButtons },
  computed: {
    authType() {
      if (this.admin) {
        return "admin";
      } else if (this.auth) {
        return "auth";
      }
      return "guest";
    },
    auth: {
      get() {
        return this.$store.getters.auth;
      },
      set(newAuth) {
        return newAuth;
      },
    },
    admin: {
      get() {
        return this.$store.getters.admin;
      },
      set(newAuth) {
        return newAuth;
      },
    },
  },
  data: () => ({
    drawer: false,
    guestOptions: [
      { to: "/login", icon: "mdi-login-variant", text: "Login" },
      { to: "/register", icon: "mdi-account-plus-outline", text: "Register" },
    ],
    authOptions: [{ to: "/home", icon: "mdi-home", text: "Home" }],
    adminOptions: [{ to: "/admin-home", icon: "mdi-home", text: "Home" }],
  }),
  methods: {
    setDrawer(value) {
      this.drawer = value;
    },
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push({ name: "Landing" });
      });
    },
  },
};
</script>