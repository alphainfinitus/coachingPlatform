<template>
  <v-container id="profileDetailsContainer">
    <!-- Snackbar for notifications -->
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>

    <!-- Form Row -->
    <v-row justify="center">
      <v-col cols="12" sm="12" class="d-flex mt-4 justify-center">
        <v-icon class="mr-2">mdi-account-edit</v-icon>Personal Details
      </v-col>
      <v-form
        v-model="valid"
        @submit.prevent="submit"
        ref="personalDetailsForm"
      >
        <v-container>
          <v-row v-if="error">
            <v-col cols="12">
              <v-alert type="error">{{ error }}</v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12">
              <v-text-field
                color="deep-purple accent-4"
                v-model="fullName"
                type="text"
                :rules="fullNameRules"
                label="Full Name"
                :disabled="loading || superLoading"
                outlined
                required
              ></v-text-field>
              <v-text-field
                prefix="+91 "
                color="deep-purple accent-4"
                v-model="phone"
                maxlength="10"
                type="number"
                :rules="phoneRules"
                label="Phone Number"
                :disabled="loading || superLoading"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                color="deep-purple accent-4 white--text"
                :disabled="loading || superLoading || !valid"
                raised
                large
                @click="submit"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ProfileDetailsContainer",
  props: ["superLoading"],
  computed: {
    lowerCaseUserName() {
      return this.username.toLowerCase();
    },
  },
  data: () => ({
    loading: false,
    showSnackbar: false,
    snackbarText: "",
    valid: false,
    error: "",
    userData: {},
    fullName: "",
    fullNameRules: [
      (value) => !!value || "Required.",
      (value) => value.length >= 3 || "Minimum 3 charachters required.",
    ],
    phone: "",
    phoneRules: [
      (value) => !!value || "Required.",
      (value) => value.length == 10 || "Please provide a valid phone number",
      (value) =>
        /^[6-9]\d{9}$/.test(value) || "Please provide a valid phone number",
    ],
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    submit() {
      this.setLoading(true);
      this.error = "";

      if (!this.$refs.personalDetailsForm.validate()) {
        return;
      }

      const payload = {
        fullName: this.fullName,
        phone: parseInt(this.phone),
        subscriptions: [],
      };

      this.$store
        .dispatch("submitProfile", payload)
        .then(() => {
          this.snackbarText = "Profile Updated Successfully :)";
        })
        .catch(() => {
          this.snackbarText = "Error in updating profile, please try again :(";
          this.error = "Error in updating profile, please try again :(";
        })
        .finally(() => {
          this.showSnackbar = true;
          this.setLoading(false);
        });
    },
  },
  mounted() {
    this.userData = this.$store.getters.userData;
    this.fullName = this.userData.fullName;
    this.phone = `${this.userData.phone}`;
  },
};
</script>


