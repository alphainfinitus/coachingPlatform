<template>
  <!-- Guest buttons -->
  <div id="guestNavButtons">
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
      Start
    </v-btn>
  </div>
</template>
  
<script>
export default {
  name: "GuestNavButtons",
  props: ["guestOptions"],
};
</script>