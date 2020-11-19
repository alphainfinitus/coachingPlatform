<template>
  <div id="resultCard" class="w-100">
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>

    <!-- Sheets Cards -->
    <v-card :loading="loading || superLoading" class="w-100 pb-4 px-1 px-md-4">
      <!-- Title -->
      <h6 class="text-h6 pt-4 d-flex align-center">
        <v-icon class="mr-1">mdi-chevron-right</v-icon> Answer Sheets :
      </h6>

      <v-container class="mt-2">
        <!-- Error Row -->
        <v-row align="center" no-gutters v-if="error">
          <v-col cols="12" class="mt-2">
            <v-alert type="error">{{ error }}</v-alert>
          </v-col>
        </v-row>

        <!-- Display Sheets Row -->
        <v-row align="center">
          <v-col
            cols="12"
            sm="12"
            md="12"
            v-for="(result, i) in allResults"
            :key="i"
          >
            <v-card
              class="pa-0 pa-md-2"
              :disabled="loading || superLoading"
              color="grey darken-4"
              dark
            >
              <!-- Student Name and Submitted At -->
              <v-card-title class="my-n2">
                <span class="text-capitalize">
                  {{ result.studentData.name }}
                </span>
                <v-chip class="ml-3" color="red lighten-2" light small>
                  <v-icon class="mr-1">mdi-close mdi-18px</v-icon> Not
                  Graded</v-chip
                >
              </v-card-title>

              <v-divider></v-divider>

              <v-card-subtitle class="text-capitalize">
                <!-- Rank -->
                <span class="d-flex align-center">
                  <v-icon color="amber">mdi-arrow-up-bold mdi-18px</v-icon>
                  <b class="mx-1">Rank :</b>
                  {{ i + 1 }}
                </span>
              </v-card-subtitle>

              <v-card-text>
                <!-- Batch -->
                <span class="d-flex align-center my-1">
                  <v-icon color="green lighten-2"
                    >mdi-account-group mdi-18px</v-icon
                  >
                  <b class="mx-2">Batch:</b>
                  <v-chip small>{{ result.studentData.batch }}</v-chip>
                </span>

                <!-- Score -->
                <span class="d-flex align-center my-1">
                  <v-icon color="green lighten-2">mdi-trophy mdi-18px</v-icon>
                  <b class="mx-1">Score :</b>
                  {{ result.objectiveScore }}
                </span>

                <!-- Submitted At -->
                <span class="d-flex align-center my-1">
                  <v-icon color="green lighten-2">mdi-calendar mdi-18px</v-icon>
                  <b class="mx-1">Submitted at :</b>
                  {{ dateTimeText(result.submittedAt.seconds * 1000) }}
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
              @click="getAllResultsByScore('prev')"
              text
            >
              <v-icon>mdi-chevron-left</v-icon> Previous
            </v-btn>
            <v-btn
              class="mx-1"
              color="green darken-1"
              :loading="loading || superLoading"
              @click="getAllResultsByScore('next')"
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
  name: "ResultCard",
  props: ["superLoading", "testID"],
  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    error: "",
    allResults: [],
    firstAndLastVisible: null,
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    getAllResultsByScore(requestType) {
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

      payload.testID = this.testID;

      this.setLoading(true);
      this.$store
        .dispatch("getAllResultsByScore", payload)
        .then((res) => {
          // write data if there is data
          if (res.data.length > 0) {
            this.snackbarText = "Answer Sheets fetched successfully :)";
            this.allResults = res.data;
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
                this.snackbarText = "No one has attempted the test yet :(";
                this.error = "No one has attempted the test yet :(";
            }
          }
        })
        .catch(() => {
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
    this.getAllResultsByScore();
  },
};
</script>