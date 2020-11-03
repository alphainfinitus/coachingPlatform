<template>
  <v-container id="profileDetailsContainer">
    <!-- Snackbar for notifications -->
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>

    <!-- Form Row -->
    <v-row justify="center">
      <v-col cols="12" sm="12" class="d-flex mt-4 justify-center">
        <v-icon class="mr-2">mdi-account-edit</v-icon>Organisation Details
      </v-col>
      <v-form
        v-model="valid"
        @submit.prevent="submit"
        ref="organisationDetailsForm"
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
                label="Institution Name"
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
              <v-text-field
                color="deep-purple accent-4"
                v-model="username"
                type="text"
                :rules="usernameRules"
                label="Institution Code (for organisation link)"
                :disabled="loading || superLoading"
                outlined
                required
              >
                <template v-slot:append>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on" small>
                        <v-icon>mdi-help-circle</v-icon>
                      </v-btn>
                    </template>
                    <span
                      >Example: student.coachingplatform.com/institution/{{
                        !username ? "username" : lowerCaseUserName
                      }}</span
                    >
                  </v-tooltip>
                </template>
              </v-text-field>
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
    username: "",
    usernameRules: [
      (value) => !!value || "Required.",
      (value) => value.length >= 3 || "Minimum 3 charachters required.",
      (value) =>
        /^[a-zA-Z0-9-]+$/.test(value) ||
        "No spaces or special characters(@, $, % etc) allowed except for hyphen (-)",
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

      if (!this.$refs.organisationDetailsForm.validate()) {
        return;
      }

      const payload = {
        fullName: this.fullName,
        phone: parseInt(this.phone),
        username: this.lowerCaseUserName,
      };

      this.$store
        .dispatch("submitOrganisationDetails", payload)
        .then(() => {
          this.snackbarText = "Profile Updated Successfully :)";
        })
        .catch((err) => {
          if (err == "invalidUsername") {
            this.error = "Username taken, please try a diffrent one :(";
            this.snackbarText = "Username taken, please try a diffrent one :(";
          } else {
            this.snackbarText =
              "Error in updating profile, please try again :(";
            this.error = "Error in updating profile, please try again :(";
          }
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
    this.username = this.userData.username;
  },
};
</script>


