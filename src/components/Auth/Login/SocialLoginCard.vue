<template>
  <v-card
    class="mx-auto"
    max-width="500"
    elevation="24"
    id="SocialLoginCard"
    :loading="loading || superLoading"
  >
    <v-row class="pa-5">
      <v-col cols="12" sm="12" class="d-flex align-center">
        <v-btn
          color="#DB4A39"
          :disabled="loading || superLoading"
          text
          @click.prevent="signInWithGoogle"
          block
        >
          <v-icon class="mr-2">mdi-google-plus</v-icon>Login with Google
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "SocialLoginCard",
  props: ["superLoading"],
  data: () => ({
    loading: false,
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    signInWithGoogle() {
      this.login_error = null;
      this.setLoading(true);
      this.$store
        .dispatch("signInWithGoogle")
        .then(() => {
          this.setLoading(false);
          this.$router.push("home");
        })
        .catch((error) => {
          this.login_error = error.message;
          this.setLoading(false);
        });
    },
  },
};
</script>
