<template>
  <div id="activeTestsCard">
    <v-card :loading="loading || superLoading">
      <v-card-title class="ml-0 ml-md-2">
        <v-icon class="mr-2">mdi-timetable</v-icon> Active Tests :
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
                :disabled="loading || superLoading"
                :color="getRandomColor()"
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
    colors: ["red", "orange", "blue", "teal", "pink", "purple", "green"],
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    getRandomColor() {
      const colors = this.colors;
      const randomColor = Math.floor(Math.random() * colors.length);
      return colors[randomColor];
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

      this.$store.dispatch("fetchActiveTests", queryObj).then(() => {
        this.setLoading(false);
      });
    },

    testBatchText(institutionUID) {
      const userSubs = this.userData.subscriptionsData;
      for (let key of Object.keys(userSubs)) {
        if (institutionUID == userSubs[key].institutionUID) {
          return userSubs[key].batchName;
        }
      }
    },
    gotoTest(test) {
      this.$router.push({ name: "Test", params: { test } });
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