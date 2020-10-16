<template>
  <div id="profile">
    <v-container>
      <span class="text-h2 text-center">Profile Page</span>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Profile",
  metaInfo: {
    title: "Admin Profile",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Admin Profile Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  computed: {
    userData() {
      return this.$store.getters.userData;
    },
  },
};
</script>
