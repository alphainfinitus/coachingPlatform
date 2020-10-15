<template>
  <!-- Guest buttons -->
  <v-list nav id="drawerButtons">
    <v-list-item-group active-class="deep-purple--text text--accent-4">
      <v-list-item
        v-for="(optionData, i) in options"
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
</template>
  
<script>
export default {
  name: "DrawerButtons",
  props: ["options"],
};
</script>