<template>
  <div id="home">
    <!-- Check if the coaching profile is complete -->
    <v-container v-if="!userData.username" class="mt-12">
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
import ProfileAlertRow from "@/components/Home/Home/ProfileAlertRow.vue";

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
  data: () => ({
    loading: true,
    userData: {},
  }),
  mounted() {
    this.userData = this.$store.getters.userData;
    this.loading = false;
  },
};
</script>
