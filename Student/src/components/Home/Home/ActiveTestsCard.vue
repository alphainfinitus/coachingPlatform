<template>
  <div id="activeTestsCard">
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>

    <v-card :loading="loading || superLoading">
      <v-card-title class="ml-0 ml-md-2">
        <v-icon class="mr-2">mdi-timetable</v-icon> Tests :
      </v-card-title>
      <v-divider></v-divider>
      <v-container class="px-3 px-md-12">
        <v-row>
          <template v-for="(institutionTest, propName) in activeTests">
            <v-col
              cols="12"
              sm="12"
              md="6"
              v-for="(test, i) in institutionTest"
              :key="i + '-' + propName"
            >
              <v-card
                class="pa-0 pa-md-2"
                @click="gotoTest(test)"
                :color="getRandomGradient()"
                :disabled="loading || superLoading"
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
                  {{ testBatchText(test.institutionUID) }} ({{
                    test.institutionName
                  }})
                </v-card-subtitle>
                <v-card-text>
                  <span class="d-flex align-center">
                    <v-icon>mdi-calendar mdi-18px</v-icon>
                    <b class="mx-1">Starts at :</b>
                    {{ endDateTimeText(test.startDateTime.seconds * 1000) }}
                  </span>
                  <span class="d-flex align-center">
                    <v-icon>mdi-calendar mdi-18px</v-icon>
                    <b class="mx-1">Ends at :</b>
                    {{ endDateTimeText(test.endDateTime.seconds * 1000) }}
                  </span>
                  <span class="d-flex align-center text-subtitle-2">
                    <v-icon>mdi-clock mdi-18px</v-icon>
                    <b class="mx-1">Duration :</b>
                    {{ test.testDuration }} min
                  </span>
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
const moment = require("moment");

export default {
  name: "ActiveTestsCard",
  props: ["superLoading"],
  computed: {
    userData() {
      return this.$store.getters.userData;
    },
    activeTests() {
      return this.$store.getters.activeTests;
    },
  },

  data: () => ({
    loading: false,
    error: "",
    showSnackbar: false,
    snackbarText: "",
    gradientClasses: [
      "calm-darya",
      "day-tripper",
      "endless-river",
      "ohhappiness",
      "nelson",
    ],
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    getRandomGradient() {
      const gradientClasses = this.gradientClasses;
      const randomIndex = Math.floor(Math.random() * gradientClasses.length);
      return gradientClasses[randomIndex];
    },
    endDateTimeText(timestamp) {
      return moment(timestamp).format("hh:mm a, Do MMM");
    },
    fetchActiveTests() {
      this.setLoading(true);
      this.error = "";

      //extract to array of objects, each object with uid of institution and batchName(array)
      const userSubs = this.userData.subscriptionsData;
      // var payload = [];
      var queryObj = {};

      for (let key of Object.keys(userSubs)) {
        const institutionUID = userSubs[key].institutionUID;

        if (!(institutionUID in queryObj)) {
          queryObj[institutionUID] = {
            batchNames: [],
          };
        }

        queryObj[institutionUID].batchNames.push(userSubs[key].batchName);
      }

      this.$store.dispatch("fetchActiveTests", queryObj);
      this.setLoading(false);
    },
    testBatchText(institutionUID) {
      const userSubs = this.userData.subscriptionsData;
      for (let key of Object.keys(userSubs)) {
        if (institutionUID == userSubs[key].institutionUID) {
          return userSubs[key].batchName;
        }
      }
    },
    gotoTest(testObj) {
      const isTestLive = moment(
        testObj.startDateTime.seconds * 1000
      ).isSameOrBefore(moment());

      if (isTestLive) {
        var test = testObj;
        test.batch = this.testBatchText(test.institutionUID);
        this.$router.push({ name: "Test", params: { test } });
      } else {
        this.snackbarText = "The test is not live yet :(";
        this.showSnackbar = true;
      }
    },
  },
  created() {
    if (
      Object.keys(this.activeTests).length === 0 &&
      this.activeTests.constructor === Object
    ) {
      this.fetchActiveTests();
    }
  },
};
</script>

<style>
/* from uiGradients.com */

#activeTestsCard .calm-darya {
  background: #5f2c82; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left bottom,
    #49a09d,
    #5f2c82
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left bottom,
    #49a09d,
    #5f2c82
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

#activeTestsCard .day-tripper {
  background: #f857a6; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right bottom,
    #ff5858,
    #f857a6
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right bottom,
    #ff5858,
    #f857a6
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

#activeTestsCard .endless-river {
  background: #43cea2; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right bottom,
    #185a9d,
    #43cea2
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right bottom,
    #185a9d,
    #43cea2
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

#activeTestsCard .ohhappiness {
  background: #00b09b; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left bottom,
    #96c93d,
    #00b09b
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left bottom,
    #96c93d,
    #00b09b
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

#activeTestsCard .nelson {
  background: #f2709c; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left bottom,
    #ff9472,
    #f2709c
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left bottom,
    #ff9472,
    #f2709c
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>