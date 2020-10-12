<template>
  <div id="contactUs">
    <v-snackbar color="success" v-model="snackbar">{{ snackbar }}</v-snackbar>
    <v-container>
      <!-- Features headline -->
      <v-row
        :class="$vuetify.breakpoint.mobile ? 'contact-bg white--text' : ''"
        justify="space-between"
      >
        <v-col cols="12" sm="12" md="4">
          <div :class="$vuetify.breakpoint.mobile ? 'pa-12 white--text' : ''">
            <h1 class="text-h3 font-weight-light mb-4">Contact Us :)</h1>
            <p class="mt-3">Write to us here or contact us through:</p>
            <div class="d-flex align-center">
              <v-icon
                :class="
                  $vuetify.breakpoint.mobile ? 'mr-3 white--text' : 'mr-3'
                "
              >
                mdi-email
              </v-icon>
              <span>email@example.com</span>
            </div>

            <div class="d-flex align-center mt-2">
              <v-icon
                :class="
                  $vuetify.breakpoint.mobile ? 'mr-3 white--text' : 'mr-3'
                "
                >mdi-phone</v-icon
              >
              <span>+91 94832X7XX8</span>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-card
            :loading="loading"
            class="pa-2 pa-md-4 mt-md-n12"
            elevation="24"
          >
            <v-form
              v-model="valid"
              @submit.prevent="submitContactForm"
              ref="contactForm"
            >
              <v-container>
                <v-row v-if="contact_error">
                  <v-col cols="12">
                    <v-alert type="error">{{ contact_error }}</v-alert>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      color="deep-purple accent-4"
                      v-model="fullName"
                      type="text"
                      :rules="fullNameRules"
                      label="Full Name"
                      :disabled="loading"
                      outlined
                      required
                    ></v-text-field>

                    <v-text-field
                      color="deep-purple accent-4"
                      v-model="email"
                      type="email"
                      :rules="emailRules"
                      label="E-mail"
                      :disabled="loading"
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
                      :disabled="loading"
                      outlined
                      required
                    ></v-text-field>

                    <v-text-field
                      color="deep-purple accent-4"
                      v-model="subject"
                      :rules="fullNameRules"
                      type="text"
                      label="Subject"
                      :disabled="loading"
                      outlined
                      required
                    ></v-text-field>

                    <v-textarea
                      color="deep-purple accent-4"
                      v-model="message"
                      :rules="fullNameRules"
                      type="text"
                      label="Message"
                      v-on:keydown.enter.prevent="submitContactForm"
                      :disabled="loading"
                      outlined
                      required
                    ></v-textarea>
                    <v-btn
                      color="deep-purple accent-4 white--text"
                      :disabled="loading || !valid"
                      raised
                      large
                      @click="submitContactForm"
                      >Submit</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "ContactUs",
  data: () => ({
    loading: true,
    snackbar: "",
    valid: false,
    contact_error: "",
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    fullNameRules: [
      (value) => !!value || "Required.",
      (value) => value.length >= 3 || "Field length should be greater than 3",
    ],
    emailRules: [
      (value) => !!value || "Required.",
      (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ) || "Invalid e-mail.",
    ],
    phoneRules: [
      (value) => !!value || "Required.",
      (value) => value.length == 10 || "Please provide a valid phone number",
      (value) =>
        /^[6-9]\d{9}$/.test(value) || "Please provide a valid phone number",
    ],
  }),
  methods: {
    submitContactForm() {
      console.log("submitContactForm called");
      if (!this.$refs.contactForm.validate()) {
        return;
      }
      this.contact_error = null;
      this.loading = true;
      const payload = {
        email: this.email,
        fullName: this.fullName,
        subject: this.subject,
        message: this.message,
        phone: this.phone,
        datetime: new Date(),
      };
      this.$store
        .dispatch("submitContactForm", payload)
        .then(() => {
          this.loading = false;
          this.$refs.contactForm.reset();
          this.snackbar = "Message saved successfully, we will respond soon :)";
        })
        .catch(() => {
          this.contact_error = "Network error, please try again.";
          this.loading = false;
        });
    },
  },
  mounted() {
    this.loading = false;
  },
};
</script>

<style>
#contactUs {
  background: url("../../assets/home/contact-us.png") no-repeat center;
  background-size: cover;
  min-height: 40rem;
}

#contactUs .contact-bg {
  background: rgba(0, 0, 0, 0.6);
}
</style>