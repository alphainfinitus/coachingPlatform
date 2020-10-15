<template>
  <v-navigation-drawer id="navDrawer" v-model="drawerComputed" fixed temporary>
    <!-- Drawer buttons -->
    <DrawerButtons
      :options="isAuth ? options.authOptions : options.guestOptions"
    />

    <!-- Logout Button at bottom of drawer if Authenticated -->
    <template v-if="isAuth" v-slot:append>
      <div class="pa-2">
        <v-btn @click="logout" block depressed>
          <v-icon class="mr-2">mdi-logout-variant</v-icon> Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
  
<script>
import DrawerButtons from "@/components/NavBar/NavDrawer/DrawerButtons.vue";

export default {
  name: "NavDrawer",
  props: ["drawer", "options", "isAuth"],
  components: {
    DrawerButtons,
  },
  computed: {
    drawerComputed: {
      get() {
        return this.drawer;
      },
      set(value) {
        this.$emit("setDrawer", value);
      },
    },
  },
  methods: {
    logout() {
      this.$emit("logout");
    },
  },
};
</script>