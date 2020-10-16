<template>
  <v-row justify="center" id="profileAlertRow">
    <v-col cols="12" sm="12" md="9">
      <v-alert prominent type="warning" class="text-center">
        Please complete your profile to continue.
        <v-divider class="hidden-md-and-up mt-2 mb-3"> </v-divider>
        <v-btn to="/profile" class="ml-2">
          <v-icon class="mr-2">mdi-account-cog-outline</v-icon> Go to
          Profile</v-btn
        >
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ProfileAlertRow",
};
</script>
