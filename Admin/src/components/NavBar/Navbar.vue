<template>
  <nav id="navbar">
    <v-app-bar dense app flat elevate-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-btn
          :to="auth ? '/home' : '/'"
          class="text-capitalize"
          depressed
          text
        >
          ClassPariksha
        </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Navigation buttons top right -->
      <NavButtons
        :isAuth="auth"
        :options="auth ? authOptions : guestOptions"
        @logout="logout"
      />
    </v-app-bar>

    <!-- Side Drawer -->
    <NavDrawer
      :isAuth="auth"
      :drawer="drawer"
      :options="{ guestOptions, authOptions }"
      @setDrawer="setDrawer"
      @logout="logout"
    />
  </nav>
</template>
  
<script>
import NavDrawer from "@/components/NavBar/NavDrawer/NavDrawer.vue";
import NavButtons from "@/components/NavBar/NavButtons.vue";

export default {
  name: "Navbar",
  components: { NavDrawer, NavButtons },
  computed: {
    auth: {
      get() {
        return this.$store.getters.auth;
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
    authOptions: [
      { to: "/home", icon: "mdi-home-outline", text: "Home" },
      { to: "/profile", icon: "mdi-account-cog-outline", text: "Profile" },
    ],
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