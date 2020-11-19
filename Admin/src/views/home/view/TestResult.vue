<template>
  <div id="testResult" class="grey lighten-3 fill-height">
    <v-container>
      <!-- title -->
      <v-row justify="center">
        <h1 class="text-title">
          <v-icon class="text-h3 mr-2" color="green darken-1">
            mdi-table-star
          </v-icon>
          {{ test.testName }} Result
        </h1>
      </v-row>

      <v-divider class="mt-3"></v-divider>

      <!-- Batches -->
      <v-row justify="center" align="center" class="text-h6 my-3">
        <span class="mr-1"> Batches: </span>
        <v-chip
          v-for="(batch, i) in test.selectedBatches"
          :key="i"
          class="text-capitalize ma-1"
          color="primary"
        >
          {{ batch }}
        </v-chip>
      </v-row>

      <v-divider class="my-2"></v-divider>
      <!-- DateTime -->
      <v-row justify="space-around" class="mt-5">
        <span>
          <b>Starts at:</b>
          {{ dateTimeText(test.startDateTime.seconds * 1000) }}
        </span>
        <span>
          <b>Ends at:</b>
          {{ dateTimeText(test.endDateTime.seconds * 1000) }}
        </span>
        <span>
          <b>Duration:</b>
          {{ test.testDuration }} minutes
        </span>
      </v-row>

      <!-- Result Cards -->
      <v-row justify="center" class="mt-6">
        <ResultCard
          :superLoading="superLoading"
          @setSuperLoading="setSuperLoading"
          :testID="test.id"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
const moment = require("moment");

import ResultCard from "@/components/Home/View/Results/ResultCard.vue";

export default {
  name: "TestResult",
  props: ["test"],
  metaInfo: {
    title: "Test Result",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Test Result Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    ResultCard,
  },
  data: () => ({
    superLoading: true,
  }),
  methods: {
    setSuperLoading(value) {
      this.superLoading = value;
    },
    checkTestExists() {
      if (
        !this.test ||
        (this.test.constructor !== Object &&
          Object.keys(this.test).length === 0)
      ) {
        this.$router.push("/home");
      }
    },
    dateTimeText(timestamp) {
      return moment(timestamp).format("hh:mm a, Do MMM");
    },
  },
  created() {
    this.checkTestExists();
  },
  mounted() {
    this.superLoading = false;
    console.log(this.test);
  },
};
</script>