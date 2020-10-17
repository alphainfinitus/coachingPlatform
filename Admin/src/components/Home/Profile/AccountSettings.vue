<template>
  <v-container id="accountSettings" fluid>
    <!-- Snackbar for notifications -->
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>

    <v-row>
      <v-col cols="12" sm="12" class="d-flex justify-center">
        <v-icon class="mr-2">mdi-account-cog</v-icon>Account Settings
      </v-col>
      <v-col v-if="error" cols="12" sm="12" class="d-flex justify-center">
        <v-alert type="error">{{ error }}</v-alert>
      </v-col>
    </v-row>
    <!-- Reset Password -->
    <v-row>
      <v-col class="d-flex justify-center">
        <v-dialog
          :loading="loading || superLoading"
          v-model="dialogResetPass"
          persistent
          max-width="600"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="deep-purple accent-4"
              :disabled="loading || superLoading"
              large
              v-on="on"
              class="white--text mx-auto"
            >
              <v-icon class="mr-2">mdi-asterisk</v-icon>Reset Password
            </v-btn>
          </template>
          <v-card class="pa-md-4">
            <v-form
              v-model="validPasswordResetForm"
              @submit.prevent="sendPasswordEmail"
              ref="resetPassForm"
            >
              <v-card-title>
                <span class="headline">Reset Password</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="resetPassEmail"
                        :rules="emailRules"
                        type="email"
                        label="Confirm Email"
                        v-on:keydown.enter.prevent="sendPasswordEmail"
                        :disabled="loading || superLoading"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="deep-purple accent-4"
                  text
                  @click="dialogResetPass = false"
                  >Close</v-btn
                >
                <v-btn
                  color="deep-purple accent-4"
                  :loading="loading || superLoading"
                  :disabled="loading || superLoading"
                  raised
                  @click="sendPasswordEmail"
                  class="white--text"
                  >Send Email</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <!-- Reset Email -->
    <v-row>
      <v-col class="d-flex justify-center">
        <v-dialog
          :loading="loading || superLoading"
          v-model="dialogResetEmail"
          persistent
          max-width="600"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="deep-purple accent-4"
              :disabled="loading || superLoading"
              large
              v-on="on"
              class="white--text mx-auto"
            >
              <v-icon class="mr-2">mdi-email</v-icon>Change Email
            </v-btn>
          </template>
          <v-card class="pa-md-4">
            <v-form
              v-model="validEmailResetForm"
              @submit.prevent="setNewEmail"
              ref="changeEmailForm"
            >
              <v-card-title>
                <span class="headline">Change Email</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="resetEmailval"
                        :rules="emailRules"
                        type="email"
                        label="New Email"
                        v-on:keydown.enter.prevent="setNewEmail"
                        :disabled="loading || superLoading"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="deep-purple accent-4"
                  text
                  @click="dialogResetEmail = false"
                  >Close</v-btn
                >
                <v-btn
                  color="deep-purple accent-4"
                  :loading="loading || superLoading"
                  :disabled="loading || superLoading"
                  raised
                  @click="setNewEmail"
                  class="white--text"
                  >Submit</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AccountSettings",
  props: ["superLoading"],
  data: () => ({
    loading: false,
    showSnackbar: false,
    snackbarText: "",
    error: "",
    dialogResetPass: false,
    validPasswordResetForm: false,
    resetPassEmail: "",
    emailRules: [
      (value) => !!value || "Required.",
      (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ) || "Invalid e-mail.",
    ],
    dialogResetEmail: false,
    validEmailResetForm: false,
    resetEmailval: "",
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    sendPasswordEmail() {
      if (!this.$refs.resetPassForm.validate()) {
        return;
      }
      this.snackbarText = "";
      this.setLoading(true);

      this.$store
        .dispatch("resetPassword", this.resetPassEmail)
        .then(() => {
          this.setLoading(false);
          this.dialogResetPass = false;
          this.snackbarText =
            "Password reset link sent, please check your email.";
        })
        .catch((error) => {
          if (error == "auth/user-not-found") {
            this.snackbarText = "Wrong email address, please check again!";
          } else {
            this.snackbarText = "Error, please try again :(";
          }
          this.setLoading(false);
        })
        .finally(() => {
          this.showSnackbar = true;
        });
    },
    setNewEmail() {
      if (!this.$refs.changeEmailForm.validate()) {
        return;
      }
      if (this.resetEmailval == this.$store.getters.userData.email) {
        return;
      }
      this.snackbarText = "";
      this.setLoading(true);

      this.$store
        .dispatch("changeEmail", this.resetEmailval)
        .then(() => {
          this.setLoading(false);
          this.dialogResetEmail = false;
          this.snackbarText = "Email updated successfully.";
        })
        .catch((err) => {
          if (err == "auth/requires-recent-login") {
            this.error =
              "Please logout and login again, to change email (for security reasons).";
          }

          this.snackbarText = "Error, please try again :(";
          this.setLoading(false);
        })
        .finally(() => {
          this.showSnackbar = true;
        });
    },
  },
  mounted() {
    this.resetEmailval = this.$store.getters.userData.email;
  },
};
</script>


