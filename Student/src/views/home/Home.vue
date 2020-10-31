<template>
  <div id="home">
    <!-- Check if the coaching profile is complete -->
    <v-container v-if="!userData.photoURL" class="mt-12">
      <ProfileAlertRow />
    </v-container>
    <v-container v-else>
      <h1 class="h1">Student Data here</h1>
    </v-container>
  </div>
</template>

<script>
import ProfileAlertRow from "@/components/Home/Home/ProfileAlertRow.vue";

export default {
  name: "Home",
  metaInfo: {
    title: "Student Home",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Student Home Page description lorem ipsum dolor sit amet.",
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
