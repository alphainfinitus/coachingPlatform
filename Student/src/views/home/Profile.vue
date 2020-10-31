<template>
  <div id="profile" class="grey lighten-3 fill-height">
    <v-container>
      <v-row justify="center">
        <v-card :loading="superLoading" class="w-100">
          <ProfilePhotoContainer
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
          />

          <ProfileDetailsContainer
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
          />
        </v-card>
      </v-row>
      <v-row class="mt-4" justify="center">
        <v-card :loading="superLoading" class="w-100">
          <AccountSettings
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
          />
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ProfilePhotoContainer from "@/components/Home/Profile/ProfilePhotoContainer/ProfilePhotoContainer.vue";
import ProfileDetailsContainer from "@/components/Home/Profile/ProfileDetailsContainer.vue";
import AccountSettings from "@/components/Home/Profile/AccountSettings.vue";

export default {
  name: "Profile",
  metaInfo: {
    title: "Student Profile",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Student Profile Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    ProfilePhotoContainer,
    ProfileDetailsContainer,
    AccountSettings,
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