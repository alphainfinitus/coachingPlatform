<template>
  <div id="profile" class="grey lighten-3 fill-height">
    <v-container>
      <v-row justify="center">
        <v-card :loading="superLoading">
          <ProfilePhotoContainer
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
          />
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ProfilePhotoContainer from "@/components/Home/Profile/ProfilePhotoContainer.vue";

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
  components: {
    ProfilePhotoContainer,
  },
  computed: {
    userData() {
      return this.$store.getters.userData;
    },
  },
  data: () => ({
    superLoading: true,
  }),
  methods: {
    setSuperLoading(value) {
      this.superLoading = value;
    },
  },
  mounted() {
    this.superLoading = false;
  },
};
</script>


