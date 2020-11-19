<template>
  <div id="testAnswerSheet" class="grey lighten-3 fill-height">
    <v-container>
      <!-- title -->
      <v-row justify="center">
        <h1 class="text-title text-center">
          <v-icon class="text-h3 mr-2" color="green darken-1">
            mdi-clipboard-text
          </v-icon>
          {{ test.testName }} Answer Sheets
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

      <!-- Answer Sheets -->
      <v-row justify="center" class="mt-6">
        <AnswerSheetsCard
          :superLoading="superLoading"
          @setSuperLoading="setSuperLoading"
          :testID="test.id"
          :questions="questions"
          :markingPoints="{
            rewardPoints: test.rewardPoints,
            punishmentPoints: test.punishmentPoints,
          }"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
const moment = require("moment");

import AnswerSheetsCard from "@/components/Home/View/AnswerSheets/AnswerSheetsCard.vue";

export default {
  name: "TestAnswerSheet",
  props: ["test"],
  metaInfo: {
    title: "Test Answer Sheets",
    meta: [
      {
        vmid: "description",
        name: "description",
        content:
          "Test Answer Sheets Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    AnswerSheetsCard,
  },
  data: () => ({
    superLoading: true,
    questions: {},
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
    fetchTestQuestions() {
      this.superLoading = true;
      this.error = "";

      const payload = {
        selectedQuestions: this.test.selectedQuestions,
      };

      this.$store
        .dispatch("fetchTestQuestions", payload)
        .then((res) => {
          this.questions = res.questionsObj;
          // this.totalObjectiveQuestions = res.totalObjectiveQuestions;
        })
        .catch(() => {
          this.error = "Network error, please try again.";
          this.snackbarText = "Network error, please try again :(";
          this.snackbar = true;
        })
        .finally(() => {
          this.superLoading = false;
        });
    },
  },
  created() {
    this.checkTestExists();
    this.fetchTestQuestions();
  },
  mounted() {
    this.superLoading = false;
  },
};
</script>