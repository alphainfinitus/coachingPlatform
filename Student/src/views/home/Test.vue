<template>
  <div @contextmenu.prevent id="test" class="fill-height d-flex grey lighten-3">
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>

    <!-- Time Up Dialog -->
    <v-dialog v-model="timeUpDialog" persistent max-width="390">
      <v-card :loading="superLoading">
        <v-card-title class="headline"> Time's up :( </v-card-title>
        <v-divider class="mb-2"></v-divider>
        <v-card-text>
          <p>You have run out of time.</p>
          <p>Your test is being submitted.</p>
          <p>Best of luck 👍</p>
        </v-card-text>
      </v-card>
    </v-dialog>

    <TestNavDrawer
      :superLoading="superLoading"
      @setSuperLoading="setSuperLoading"
      :test="test"
      :activeSection="activeSection"
      :startTimer="startTimer"
      :questions="questions"
      :questionAttemptMeta="questionAttemptMeta"
      @gotoQuestion="gotoQuestion"
    />

    <v-container fluid v-if="test" class="px-4 pa-md-5">
      <!-- Error Row -->
      <v-row justify="center" v-if="error">
        <v-alert type="error" class="mt-4 mx-auto">
          {{ error }}
        </v-alert>
      </v-row>

      <!-- Test Info Card -->
      <v-row justify="center">
        <v-col cols="12" sm="12" class="pt-0 px-0">
          <TestInfoCard
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
            :test="test"
            :startTimer="startTimer"
            @timeUp="timeUp"
            :activeSectionIndex="activeSectionIndex"
            @changeToSection="changeToSection"
          />
        </v-col>
      </v-row>

      <!-- Test Instructions Card -->
      <v-row justify="center" v-if="!startTimer && !showResult" class="px-0">
        <v-col cols="12" sm="12" class="pt-0 px-0">
          <TestInstructionsCard
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
            :test="test"
            @startTest="startTest"
          />
        </v-col>
      </v-row>

      <!-- Test Result Card -->
      <v-row v-else-if="showResult">
        <v-col cols="12" sm="12" class="pt-0 px-0">
          <TestResultCard
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
            :test="test"
            :questions="questions"
            :result="result"
            :totalObjectiveQuestions="totalObjectiveQuestions"
          />
        </v-col>
      </v-row>

      <!-- Questions Card -->
      <v-row justify="center" v-else class="px-0">
        <v-col cols="12" sm="12" class="pt-0 px-0">
          <TestQuestionCard
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
            :currentQuestion="currentQuestion"
            :currentQuestionIndex="currentQuestionIndex"
            @nextQuestion="nextQuestion"
            :activeSection="activeSection"
            :answers="answers"
            @clearResponse="clearResponse"
            :askToSubmit="askToSubmit"
            @shouldSubmitTest="shouldSubmitTest"
            :canSubmitBeforeTime="test.submitBeforeTime"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TestInfoCard from "@/components/Home/Test/TestInfoCard.vue";
import TestNavDrawer from "@/components/Home/Test/TestNavDrawer.vue";
import TestInstructionsCard from "@/components/Home/Test/TestInstructionsCard.vue";
import TestQuestionCard from "@/components/Home/Test/TestQuestionCard.vue";
import TestResultCard from "@/components/Home/Test/TestResultCard.vue";

export default {
  name: "Test",
  props: ["test", "batch", "attempted"],
  metaInfo: {
    title: "Test",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Test Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    TestInfoCard,
    TestNavDrawer,
    TestInstructionsCard,
    TestQuestionCard,
    TestResultCard,
  },
  computed: {
    activeSection() {
      return this.test.sections[this.activeSectionIndex];
    },
    currentQuestion() {
      return this.questions[this.activeSection][this.currentQuestionIndex];
    },
    userData() {
      return this.$store.getters.userData;
    },
  },
  data: () => ({
    superLoading: false,
    snackbar: false,
    snackbarText: "",
    error: "",
    startTimer: false,
    activeSectionIndex: 0,
    questions: {},
    currentQuestionIndex: 0,
    questionAttemptMeta: {}, //id: review, attempted, visited.
    answers: {},
    askToSubmit: false,
    timeUpDialog: false,
    showResult: false,
    result: {},
    totalObjectiveQuestions: 0,
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
    fetchTestQuestions() {
      this.superLoading = true;
      this.error = "";

      const payload = {
        selectedQuestions: this.test.selectedQuestions,
        institutionUID: this.test.institutionUID,
      };

      this.$store
        .dispatch("fetchTestQuestions", payload)
        .then((res) => {
          this.questions = res.questionsObj;
          this.totalObjectiveQuestions = res.totalObjectiveQuestions;
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
    timeUp() {
      this.superLoading = true;
      this.timeUpDialog = true;
      this.submitTest();
    },
    changeToSection(index) {
      this.activeSectionIndex = index;
      this.gotoQuestion(0);
    },
    startTest() {
      this.startTimer = true;
      this.$set(this.questionAttemptMeta, this.currentQuestion.id, "visited");
    },
    gotoQuestion(index) {
      this.currentQuestionIndex = index;

      // if currentQuestion is not marked, attempted or both : add it to visited
      this.markCurrentQuestionVisited();
    },
    nextQuestion(changeObj) {
      // Mark for Review
      if (changeObj.type == "reviewNext") {
        this.$set(this.questionAttemptMeta, this.currentQuestion.id, "marked");
      }

      // if answered: put into attempted and save answer
      if ("answer" in changeObj) {
        // put into markedAndAttempted
        if (changeObj.type == "reviewNext") {
          this.$set(
            this.questionAttemptMeta,
            this.currentQuestion.id,
            "markedAndAttempted"
          );
        } else {
          // put into attempted
          this.$set(
            this.questionAttemptMeta,
            this.currentQuestion.id,
            "attempted"
          );
        }

        // and save answer

        // create section if it does not exist in answer object
        if (!(this.activeSection in this.answers)) {
          this.answers[this.activeSection] = {};
        }

        this.$set(
          this.answers[this.activeSection],
          this.currentQuestion.id,
          changeObj.answer
        );
      }

      // goto next question

      // if last question of section: goto next section
      if (
        this.currentQuestionIndex + 1 ==
        this.questions[this.activeSection].length
      ) {
        // if last section: ask to submit test
        if (this.activeSectionIndex + 1 == this.test.sections.length) {
          this.askToSubmit = true;
          return;
        } else {
          // if not last section goto first question of next section
          this.currentQuestionIndex = 0;
          this.activeSectionIndex++;
        }
      } else {
        // if not last question: go to next question
        this.currentQuestionIndex++;
      }

      // if currentQuestion is not marked, attempted or both: add it to visited
      this.markCurrentQuestionVisited();
    },
    markCurrentQuestionVisited() {
      // if currentQuestion is not marked, attempted or both: add it to visited
      const currentAttemptMark = this.questionAttemptMeta[
        this.currentQuestion.id
      ];

      if (
        currentAttemptMark != "marked" &&
        currentAttemptMark != "attempted" &&
        currentAttemptMark != "markedAndAttempted"
      ) {
        this.$set(this.questionAttemptMeta, this.currentQuestion.id, "visited");
      }
    },
    clearResponse() {
      //if it is in attempted: replace it with visited;
      if (this.questionAttemptMeta[this.currentQuestion.id] == "attempted") {
        this.$set(this.questionAttemptMeta, this.currentQuestion.id, "visited");
      }

      //if it is markedAndAttempted: replace it with marked;
      if (
        this.questionAttemptMeta[this.currentQuestion.id] ==
        "markedAndAttempted"
      ) {
        this.$set(this.questionAttemptMeta, this.currentQuestion.id, "marked");
      }

      // check if it is saved in answers and remove it;

      // create section if it does not exist in answer object
      if (!(this.activeSection in this.answers)) {
        this.answers[this.activeSection] = {};
      }

      if (this.currentQuestion.id in this.answers[this.activeSection]) {
        this.$delete(this.answers[this.activeSection], this.currentQuestion.id);
      }
    },
    shouldSubmitTest(res) {
      if (res) {
        this.submitTest();
      } else {
        this.askToSubmit = false;
      }
    },
    submitTest() {
      this.superLoading = true;
      const submittedAt = new Date();

      var payload = {
        result: {
          submittedAt,
          uid: this.userData.uid,
          studentData: {
            name: this.userData.fullName,
            batch: this.test.batch,
          },
          questionAttemptMeta: this.questionAttemptMeta,
          answers: this.answers,
          objectiveScore: 0,
          correctAnswers: 0,
        },
        studentResult: {
          submittedAt,
          testID: this.test.id,
          institutionUID: this.test.institutionUID,
          institutionName: this.test.institutionName,
          batch: this.test.batch,
        },
      };

      // Calculate score and correct answers
      const calculatedScore = this.calculateScore(payload.result);
      payload.result.objectiveScore = calculatedScore.score;
      payload.result.correctAnswers = calculatedScore.correctAnswers;

      this.result = payload.result;

      this.$store
        .dispatch("submitTestResult", payload)
        .then(() => {
          this.startTimer = false;
          this.showResult = true;
        })
        .catch(() => {
          this.error =
            "Network error during submitting result, please try again.";
          this.snackbarText = "Network error, please try again :(";
          this.snackbar = true;
        })
        .finally(() => {
          this.askToSubmit = false;
          this.timeUpDialog = false;
          this.superLoading = false;
        });
    },
    calculateScore(result) {
      var score = 0;
      var correctAnswers = 0;

      for (let section of Object.keys(result.answers)) {
        for (let question of Object.keys(result.answers[section])) {
          var searchQuestion = this.questions[section].find((obj) => {
            return obj.id == question;
          });

          if (
            !searchQuestion.isSubjective &&
            result.answers[section][question] == searchQuestion.correctAnswer
          ) {
            score += this.test.rewardPoints;
            correctAnswers++;
          } else if (
            !searchQuestion.isSubjective &&
            result.answers[section][question] != searchQuestion.correctAnswer
          ) {
            score -= this.test.punishmentPoints;
          }
        }
      }

      return { score, correctAnswers };
    },
    fetchResult() {
      // check attempted
      this.superLoading = true;
      const payload = {
        institutionUID: this.test.institutionUID,
        testID: this.test.id,
      };

      this.$store
        .dispatch("checkTestAttempted", payload)
        .then((res) => {
          if (res) {
            this.result = res;
            this.startTimer = false;
            this.showResult = true;
          }
        })
        .catch(() => {
          this.error = "Network error during fetching data, please try again.";
          this.snackbarText = "Network error, please try again :(";
          this.snackbar = true;
        })
        .finally(() => {
          this.superLoading = false;
        });
    },
    beforeUnloadHandler(event) {
      event.preventDefault();
      event.returnValue = "";
    },
  },
  created() {
    this.checkTestExists();
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.beforeUnloadHandler);
    this.fetchTestQuestions();
    this.fetchResult();
  },
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm(
      "Do you really want to leave? Your progress will be discarded if not submitted."
    );
    if (answer) {
      next();
    } else {
      next(false);
    }
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.beforeUnloadHandler);
  },
};
</script>

<style>
#test {
  -moz-user-select: none !important;
  -webkit-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}
</style>
