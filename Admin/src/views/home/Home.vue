<template>
  <div id="home">
    <!-- Check if the coaching profile is complete -->
    <v-container v-if="!userData.coachingURL" class="mt-12">
      <ProfileAlertRow />
    </v-container>
    <v-container v-else>
      <span class="text-h3">
        Profile Complete display admin dash options here</span
      >
    </v-container>
  </div>
</template>

<script>
import ProfileAlertRow from "@/components/Home/ProfileAlertRow.vue";

export default {
  name: "Home",
  metaInfo: {
    title: "Admin Home",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Admin Home Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    ProfileAlertRow,
  },
  computed: {
    userData() {
      return this.$store.getters.userData;
    },
  },
};
</script>
