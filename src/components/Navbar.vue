<template>
  <nav id="id">
    <v-app-bar dense app flat elevate-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-btn to="/" depressed text>PlatformName</v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Guest buttons -->
      <div>
        <v-btn
          v-for="(optionData, i) in guestOptions"
          :key="i"
          :to="optionData.to"
          class="mr-1 hidden-sm-and-down"
          depressed
          text
        >
          <v-icon class="mr-1">{{ optionData.icon }}</v-icon>
          {{ optionData.text }}
        </v-btn>
        <v-btn class="hidden-md-and-up" to="/login" depressed text x-small>
          Login
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Side Drawer -->
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <!-- Guest buttons -->
      <v-list nav>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item
            v-for="(optionData, i) in guestOptions"
            :key="i"
            :to="optionData.to"
          >
            <v-list-item-icon>
              <v-icon class="mr-1">{{ optionData.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ optionData.text }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>
  
<script>
export default {
  name: "Navbar",
  data: () => ({
    drawer: false,
    guestOptions: [
      { to: "/login", icon: "mdi-login-variant", text: "Login" },
      { to: "/register", icon: "mdi-account-plus-outline", text: "Register" },
    ],
  }),
};
</script>