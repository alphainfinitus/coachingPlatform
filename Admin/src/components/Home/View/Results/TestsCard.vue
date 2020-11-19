<template>
  <div id="testsCard" class="w-100">
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>

    <v-card :loading="loading || superLoading" class="w-100 pb-4 px-1 px-md-4">
      <!-- Title -->
      <h6 class="text-h6 pt-4 d-flex align-center">
        <v-icon class="mr-1">mdi-chevron-right</v-icon> Tests:
      </h6>

      <v-container class="mt-2">
        <!-- Error Row -->
        <v-row align="center" no-gutters v-if="error">
          <v-col cols="12" class="mt-2">
            <v-alert type="error">{{ error }}</v-alert>
          </v-col>
        </v-row>

        <!-- Display Tests Row -->
        <v-row align="center">
          <v-col
            cols="12"
            sm="12"
            md="6"
            v-for="(test, i) in allTests"
            :key="i"
          >
            <v-card
              class="pa-0 pa-md-2"
              :disabled="loading || superLoading"
              :to="{
                name: routeName,
                params: { test },
              }"
              color="grey darken-4"
              dark
            >
              <!-- Test Name and Duration -->
              <v-card-title class="my-n2">
                <span class="text-capitalize">
                  {{ test.testName }}
                </span>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-subtitle class="text-capitalize">
                <b>ID:</b> {{ test.id }}
              </v-card-subtitle>
              <v-card-text>
                <span class="d-flex align-center">
                  <v-icon color="green lighten-2">mdi-calendar mdi-18px</v-icon>
                  <b class="mx-1">Starts at :</b>
                  {{ dateTimeText(test.startDateTime.seconds * 1000) }}
                </span>
                <span class="d-flex align-center">
                  <v-icon color="green lighten-2">mdi-calendar mdi-18px</v-icon>
                  <b class="mx-1">Ends at :</b>
                  {{ dateTimeText(test.endDateTime.seconds * 1000) }}
                </span>
                <span class="d-flex align-center text-subtitle-2">
                  <v-icon color="green lighten-2">mdi-clock mdi-18px</v-icon>
                  <b class="mx-1">Duration :</b>
                  {{ test.testDuration }} min
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Navigation Buttons Row -->
        <v-row class="mt-9" align="center" no-gutters>
          <v-col cols="12" sm="12" class="d-flex justify-center">
            <v-btn
              class="mx-1"
              color="green darken-1"
              :loading="loading || superLoading"
              @click="getAllTests('prev')"
              text
            >
              <v-icon>mdi-chevron-left</v-icon> Previous
            </v-btn>
            <v-btn
              class="mx-1"
              color="green darken-1"
              :loading="loading || superLoading"
              @click="getAllTests('next')"
              text
            >
              Next
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
const moment = require("moment");

export default {
  name: "TestsCard",
  props: ["superLoading", "routeName"],

  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    error: "",
    allTests: [],
    firstAndLastVisible: null,
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    getAllTests(requestType) {
      this.error = "";
      this.snackbarText = "";

      var payload = "";

      switch (requestType) {
        case "prev":
          payload = { requestType, doc: this.firstAndLastVisible.firstVisible };
          break;
        case "next":
          payload = { requestType, doc: this.firstAndLastVisible.lastVisible };
          break;
        default:
          payload = { requestType: null };
      }

      this.setLoading(true);
      this.$store
        .dispatch("getAllTests", payload)
        .then((res) => {
          // write data if there is data
          if (res.data.length > 0) {
            this.snackbarText = "Tests fetched successfully :)";
            this.allTests = res.data;
            this.firstAndLastVisible = res.firstAndLastVisible;
          } else {
            //if there is no data show on snackbar accordingly
            switch (requestType) {
              case "prev":
                this.snackbarText = "This is the first page.";
                break;
              case "next":
                this.snackbarText = "This is the last page.";
                break;
              default:
                this.snackbarText = "You've not added any tests yet :(";
                this.error = "You've not added any tests yet :(";
            }
          }
        })
        .catch((error) => {
          console.log(error);
          this.error = "Network error, please try again.";
          this.snackbarText = "Network error, please try again :(";
        })
        .finally(() => {
          this.snackbar = true;
          this.setLoading(false);
        });
    },
    dateTimeText(timestamp) {
      return moment(timestamp).format("hh:mm a, Do MMM");
    },
  },
  mounted() {
    this.getAllTests();
  },
};
</script>
