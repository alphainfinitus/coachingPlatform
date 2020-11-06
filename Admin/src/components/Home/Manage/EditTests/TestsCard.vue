<template>
  <div id="testsCard" class="w-100">
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>

    <!-- TODO: Add OpenTestDialog -->

    <!-- Delete dialog -->
    <v-dialog v-model="deleteDialog" persistent max-width="590">
      <v-card :loading="loading || superLoading">
        <v-card-title class="headline">
          Are you sure you want to delete this test ?
        </v-card-title>
        <v-card-subtitle class="mt-1">
          (<b>Test ID:</b> {{ selectedTest.id }}; <b>Test Name:</b>
          {{ selectedTest.testName }})
        </v-card-subtitle>
        <v-card-text>
          This action cannot be reversed. Please click the "DELETE" button to
          confirm.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            dark
            :loading="loading || superLoading"
            @click="deleteTest"
            text
          >
            <v-icon class="mr-1">mdi-trash-can-outline</v-icon> Delete
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :loading="loading || superLoading"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card :loading="loading || superLoading" class="w-100 pb-4 px-1 px-md-4">
      <!-- Title -->
      <h6 class="text-h6 pt-4 d-flex align-center">
        <v-icon class="mr-1">mdi-chevron-right</v-icon> Tests (or
        <v-btn color="pink" class="mx-2" to="/create/test" dark small>
          <v-icon class="mr-1">mdi-timetable mdi-18px</v-icon> Create Test </v-btn
        >) :
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
                  <v-icon color="pink lighten-2">mdi-calendar mdi-18px</v-icon>
                  <b class="mx-1">Starts at :</b>
                  {{ dateTimeText(test.startDateTime.seconds * 1000) }}
                </span>
                <span class="d-flex align-center">
                  <v-icon color="pink lighten-2">mdi-calendar mdi-18px</v-icon>
                  <b class="mx-1">Ends at :</b>
                  {{ dateTimeText(test.endDateTime.seconds * 1000) }}
                </span>
                <span class="d-flex align-center text-subtitle-2">
                  <v-icon color="pink lighten-2">mdi-clock mdi-18px</v-icon>
                  <b class="mx-1">Duration :</b>
                  {{ test.testDuration }} min
                </span>
              </v-card-text>

              <v-divider class="my-2"></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="ml-md-1 ml-n1 mr-1"
                  color="pink lighten-1"
                  outlined
                  @click="deleteTestModal(i)"
                  :disabled="loading || superLoading"
                  dark
                >
                  <v-icon class="mr-1">mdi-trash-can-outline mdi-18px</v-icon>
                  Delete
                </v-btn>
                <v-btn
                  :to="{
                    name: 'createTest',
                    params: { testObj: test },
                  }"
                  class="mx-1"
                  color="pink lighten-1"
                  :disabled="loading || superLoading"
                  dark
                >
                  <v-icon class="mr-1">mdi-square-edit-outline mdi-18px</v-icon>
                  Edit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Navigation Buttons Row -->
        <v-row class="mt-9" align="center" no-gutters>
          <v-col cols="12" sm="12" class="d-flex justify-center">
            <v-btn
              class="mx-1"
              color="pink darken-1"
              :loading="loading || superLoading"
              @click="getAllTests('prev')"
              text
            >
              <v-icon>mdi-chevron-left</v-icon> Previous
            </v-btn>
            <v-btn
              class="mx-1"
              color="pink darken-1"
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
  props: ["superLoading"],

  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    error: "",
    deleteDialog: false,
    testDialog: false,
    selectedTest: "",
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
    deleteTestModal(index) {
      this.selectedTest = this.allTests[index];
      this.selectedTest.arrayPos = index;
      this.deleteDialog = true;
    },
    deleteTest() {
      this.setLoading(true);
      this.$store
        .dispatch("deleteTest", this.selectedTest.id)
        .then(() => {
          this.snackbarText = "Test deleted successfully :)";
          //remove from allTests array
          this.allTests.splice(this.selectedTest.arrayPos, 1);
          this.deleteDialog = false;
          this.testDialog = false;
        })
        .catch(() => {
          this.snackbarText = "Network error, please try again :(";
        })
        .finally(() => {
          this.snackbar = true;
          this.setLoading(false);
        });
    },
  },
  mounted() {
    this.getAllTests();
  },
};
</script>
