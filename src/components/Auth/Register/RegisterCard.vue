<template>
  <v-card
    :loading="loading || superLoading"
    class="mx-auto pa-md-4"
    max-width="500"
    id="registerCard"
  >
    <v-card-text>
      <p class="title text--primary">
        Create a new student account
        <v-btn
          class="ml-md-4"
          to="/login"
          color="indigo"
          :disabled="loading || superLoading"
          outlined
          >or Sign in</v-btn
        >
      </p>
      <v-form v-model="valid" @submit.prevent="register" ref="registerForm">
        <v-container>
          <v-row v-if="register_error">
            <v-col cols="12">
              <v-alert type="error">{{ register_error }}</v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                autofocus
                color="deep-purple accent-4"
                v-model="fullName"
                type="text"
                :rules="fullNameRules"
                label="Full Name"
                :disabled="loading || superLoading"
                required
              ></v-text-field>
              <v-text-field
                color="deep-purple accent-4"
                v-model="email"
                type="email"
                :rules="emailRules"
                label="E-mail"
                :disabled="loading || superLoading"
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
                required
              ></v-text-field>
              <v-text-field
                color="deep-purple accent-4"
                v-model="password"
                :rules="passRules"
                type="password"
                label="Password"
                :disabled="loading || superLoading"
                required
              ></v-text-field>
              <v-text-field
                color="deep-purple accent-4"
                v-model="password_confirm"
                :rules="passConfirmRules"
                type="password"
                label="Confirm Password"
                v-on:keydown.enter.prevent="register"
                :disabled="loading || superLoading"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="deep-purple accent-4 white--text"
        :disabled="loading || !valid || superLoading"
        raised
        large
        @click="register"
        >Submit</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "RegisterCard",
  props: ["superLoading"],
  data: () => ({
    loading: false,
    valid: false,
    register_error: null,
    fullName: "",
    email: "",
    phone: "",
    password: "",
    password_confirm: "",
    fullNameRules: [
      (value) => !!value || "Required.",
      (value) => value.length >= 3 || "Field should be greater than 3",
    ],
    phoneRules: [
      (value) => !!value || "Required.",
      (value) => value.length == 10 || "Please provide a valid phone number",
      (value) =>
        /^[6-9]\d{9}$/.test(value) || "Please provide a valid phone number",
    ],
    passRules: [
      (value) => !!value || "Required.",
      (value) =>
        value.length >= 8 || "Field should be greater than 7 characters.",
    ],
    passConfirmRules: [
      (value) => !!value || "Required.",
      (value) => value.length >= 8 || "Field should match the password field",
    ],
    emailRules: [
      (value) => !!value || "Required.",
      (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ) || "Invalid e-mail.",
    ],
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    register() {
      if (!this.$refs.registerForm.validate()) {
        return;
      }
      if (this.password != this.password_confirm) {
        this.register_error = "Both passwords should match.";
        return;
      }
      this.register_error = null;
      this.setLoading(true);
      const payload = {
        email: this.email,
        fullName: this.fullName,
        password: this.password,
        phone: parseInt(this.phone),
      };
      this.$store
        .dispatch("register", payload)
        .then(() => {
          this.$router.push("home");
        })
        .catch((error) => {
          if (
            error == "auth/user-not-found" ||
            error == "auth/wrong-password"
          ) {
            this.register_error = "Invalid Email Or Password";
          } else if (error == "auth/too-many-requests") {
            this.register_error =
              "Too many incorrect attempts. Please try again later.";
          } else {
            this.register_error = error;
          }
          this.password = "";
          this.setLoading(false);
        });
    },
  },
};
</script>