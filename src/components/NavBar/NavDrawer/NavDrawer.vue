<template>
  <v-navigation-drawer id="navDrawer" v-model="drawerComputed" fixed temporary>
    <!-- Drawer buttons -->
    <DrawerButtons :options="returnOptionType()" />

    <template v-if="authType != 'guest'" v-slot:append>
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
  props: ["drawer", "options", "authType"],
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
    returnOptionType() {
      var optionData;
      switch (this.authType) {
        case "guest":
          optionData = this.options.guestOptions;
          break;
        case "auth":
          optionData = this.options.authOptions;
          break;
        case "admin":
          optionData = this.options.adminOptions;
          break;
      }
      return optionData;
    },
    logout() {
      this.$emit("logout");
    },
  },
};
</script>