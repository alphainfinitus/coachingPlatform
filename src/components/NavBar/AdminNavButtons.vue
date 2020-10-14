<template>
  <!-- Auth buttons -->
  <div id="adminNavButtons">
    <v-btn
      v-for="(optionData, i) in authOptions"
      :key="i"
      :to="optionData.to"
      class="mr-1 hidden-sm-and-down"
      depressed
      text
    >
      <v-icon class="mr-1">{{ optionData.icon }}</v-icon>
      {{ optionData.text }}
    </v-btn>
    <v-menu left bottom class="z-index">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" small>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item @click="logout">
          <v-list-item-title>
            <v-icon>mdi-logout-variant</v-icon>&nbsp;Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
  
<script>
export default {
  name: "AdminNavButtons",
  props: ["adminOptions"],
  methods: {
    logout() {
      this.$emit("logout");
    },
  },
};
</script>