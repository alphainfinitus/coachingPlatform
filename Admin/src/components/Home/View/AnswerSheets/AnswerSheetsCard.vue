<template>
  <div id="answerSheetsCard" class="w-100">
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>

    <!--Sheet Dialog -->
    <v-dialog
      v-model="sheetDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card v-if="selectedSheetIndex != null" tile>
        <!-- ToolBar -->
        <v-toolbar dense dark color="primary">
          <v-btn
            :loading="loading || superLoading"
            icon
            dark
            @click="sheetDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Answer Sheet </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn
            v-if="!selectedSheet.graded"
            class="text-capitalize"
            @click="saveGrade()"
          >
            <v-icon class="mr-2">mdi-content-save mdi-18px</v-icon>
            Save Grades
          </v-btn>
          <v-chip v-else class="text-capitalize" color="grey darken-4">
            <v-icon class="mr-2">mdi-check mdi-18px</v-icon>
            Graded
          </v-chip>
        </v-toolbar>

        <!-- Score, Marking Point Chips -->
        <v-card-title class="d-flex justify-center">
          <v-chip class="ma-1">
            Score: {{ selectedSheet.objectiveScore }}
          </v-chip>
          <v-chip class="ma-1">
            Reward Points: {{ markingPoints.rewardPoints }}
          </v-chip>
          <v-chip class="ma-1">
            Punishment Points: {{ markingPoints.punishmentPoints }}
          </v-chip>
        </v-card-title>

        <!-- Answer Sheet -->
        <v-form @submit.prevent="" v-model="gradeFormValid" ref="gradeForm">
          <v-container>
            <!-- Error Row -->
            <v-row align="center" v-if="gradingError" class="mb-1 mt-n3">
              <v-col cols="12" class="mt-2">
                <v-alert type="error">{{ gradingError }}</v-alert>
              </v-col>
            </v-row>

            <v-row align="center">
              <!-- Loop through questions -->
              <template v-for="(section, sectionName) in questions">
                <div :key="sectionName">
                  <v-chip color="primary darken-2 ml-1" label>
                    {{ sectionName }} :
                  </v-chip>

                  <template v-for="(question, i) in questions[sectionName]">
                    <div :key="sectionName + '_' + i">
                      <v-card
                        v-if="isQuestionAttempted(i, sectionName)"
                        class="my-3"
                        color="indigo lighten-5"
                        elevation="0"
                      >
                        <v-card-subtitle>
                          <b> Question {{ i + 1 }}: </b>
                        </v-card-subtitle>
                        <v-container fluid class="mt-n4">
                          <!-- Question -->
                          <v-row align="center" class="px-2 pt-0 px-md-8">
                            <span v-html="question.question"></span>
                          </v-row>

                          <v-divider class="my-2"></v-divider>

                          <!-- Subjective -->
                          <v-row
                            v-if="question.isSubjective"
                            class="d-flex justify-center"
                          >
                            <!-- Student's Answer -->
                            <v-col cols="12" sm="12">
                              <span
                                class="text-subtitle-1 mb-2 d-flex align-center"
                              >
                                <b class="ml-0 ml-md-2">Student's Answer:</b>
                              </span>
                              <div class="ml-0 ml-md-2">
                                <span
                                  v-html="
                                    selectedSheet.answers[sectionName][
                                      question.id
                                    ]
                                  "
                                ></span>
                              </div>
                            </v-col>

                            <!-- Solution -->
                            <v-col cols="12" sm="12">
                              <span class="text-subtitle-1 mb-2">
                                <b class="ml-0 ml-md-2">Solution:</b>
                              </span>
                              <div class="ml-0 ml-md-2">
                                <span
                                  v-html="questions[sectionName][i].solution"
                                ></span>
                              </div>
                            </v-col>

                            <!-- Grade Field -->
                            <v-col cols="12" sm="12" md="6" class="mt-n6">
                              <div class="d-flex align-center justify-center">
                                <v-btn
                                  @click="decGrade(question.id)"
                                  :disabled="selectedSheet.graded"
                                  icon
                                  ><v-icon>mdi-minus</v-icon></v-btn
                                >
                                <v-text-field
                                  v-model="subjectiveGrades[question.id]"
                                  type="number"
                                  label="Points"
                                  class="mx-1 mt-6 inputNum"
                                  :rules="basicRules"
                                  :readonly="selectedSheet.graded"
                                  solo
                                ></v-text-field>
                                <v-btn
                                  @click="incGrade(question.id)"
                                  :disabled="selectedSheet.graded"
                                  icon
                                  ><v-icon>mdi-plus</v-icon></v-btn
                                >
                              </div>
                            </v-col>
                          </v-row>

                          <!-- Objective -->
                          <v-row v-else class="px-0 px-md-4">
                            <v-container fluid class="defaultCursor">
                              <!-- Option A (loop it) -->
                              <v-row
                                align="center"
                                no-gutters
                                v-for="(optionTitle, i) in options"
                                :key="i"
                              >
                                <v-col class="d-flex" cols="12" sm="12">
                                  <span class="mr-2 d-flex align-start">
                                    <v-chip
                                      :color="
                                        question.correctAnswer ==
                                        'Option ' + optionTitle
                                          ? 'green'
                                          : 'grey darken-1'
                                      "
                                      pill
                                      dark
                                      small
                                    >
                                      {{ optionTitle }}
                                    </v-chip>
                                    <v-icon
                                      v-if="
                                        isOptionSelected(
                                          optionTitle,
                                          sectionName,
                                          question.id
                                        )
                                      "
                                      color="blue darken-2"
                                      >mdi-account-check</v-icon
                                    >
                                  </span>
                                  <span
                                    v-html="
                                      question.options['option' + optionTitle]
                                    "
                                  ></span>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-row>
                        </v-container>
                      </v-card>

                      <!-- Display 'Not Attempted' Card -->
                      <v-card
                        v-else
                        class="my-3"
                        color="indigo lighten-5"
                        elevation="0"
                      >
                        <v-card-subtitle>
                          <b> Question {{ i + 1 }}: </b> Not Attempted
                        </v-card-subtitle>
                      </v-card>
                    </div>
                  </template>

                  <v-divider></v-divider>
                </div>
              </template>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>

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
            md="6"
            v-for="(result, i) in allResults"
            :key="i"
          >
            <v-card
              class="pa-0 pa-md-2"
              :disabled="loading || superLoading"
              color="grey darken-4"
              dark
              @click="openSheetDialog(i)"
            >
              <!-- Student Name and Submitted At -->
              <v-card-title class="my-n2">
                <span class="text-capitalize">
                  {{ result.studentData.name }}
                </span>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-subtitle class="text-capitalize d-flex align-center">
                <v-icon color="green lighten-2"
                  >mdi-account-group mdi-18px</v-icon
                >
                <b class="mx-2">Batch:</b>
                <v-chip small>{{ result.studentData.batch }}</v-chip>
              </v-card-subtitle>
              <v-card-text>
                <span class="d-flex align-center">
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
              @click="getAllResults('prev')"
              text
            >
              <v-icon>mdi-chevron-left</v-icon> Previous
            </v-btn>
            <v-btn
              class="mx-1"
              color="green darken-1"
              :loading="loading || superLoading"
              @click="getAllResults('next')"
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
  name: "AnswerSheetsCard",
  props: ["superLoading", "testID", "questions", "markingPoints"],
  computed: {
    selectedSheet() {
      return this.allResults[this.selectedSheetIndex];
    },
  },
  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    error: "",
    gradingError: "",
    sheetDialog: false,
    allResults: [],
    firstAndLastVisible: null,
    selectedSheetIndex: null,
    options: ["A", "B", "C", "D"],
    subjectiveGrades: {},
    basicRules: [(value) => !!value || "Required."],
    gradeFormValid: false,
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    getAllResults(requestType) {
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
        .dispatch("getAllResults", payload)
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
    openSheetDialog(index) {
      this.selectedSheetIndex = index;
      this.subjectiveGrades = this.selectedSheet.subjectiveGrades;
      this.sheetDialog = true;
    },
    isQuestionAttempted(questionIndex, sectionName) {
      const questionID = this.questions[sectionName][questionIndex].id;
      return (
        this.selectedSheet.questionAttemptMeta[questionID] == "attempted" ||
        this.selectedSheet.questionAttemptMeta[questionID] ==
          "markedAndAttempted"
      );
    },
    isOptionSelected(optionTitle, sectionName, questionId) {
      if (questionId in this.selectedSheet.answers[sectionName]) {
        if (
          this.selectedSheet.answers[sectionName][questionId] ==
          "Option " + optionTitle
        )
          return true;
      }
      return false;
    },
    decGrade(questionID) {
      if (!isNaN(this.subjectiveGrades[questionID])) {
        this.$set(
          this.subjectiveGrades,
          questionID,
          parseFloat(this.subjectiveGrades[questionID]) - 1
        );
      } else {
        this.$set(this.subjectiveGrades, questionID, -1);
      }
    },
    incGrade(questionID) {
      if (!isNaN(this.subjectiveGrades[questionID])) {
        this.$set(
          this.subjectiveGrades,
          questionID,
          parseFloat(this.subjectiveGrades[questionID]) + 1
        );
      } else {
        this.$set(this.subjectiveGrades, questionID, 1);
      }
    },
    saveGrade() {
      this.setLoading(true);
      if (this.$refs.gradeForm.validate()) {
        // update subjective grades object in allResults;
        this.$set(
          this.allResults[this.selectedSheetIndex],
          "subjectiveGrades",
          this.subjectiveGrades
        );

        // loop through subjectiveGrades and inc score and correct answer accordingly.
        for (var questionID of Object.keys(this.subjectiveGrades)) {
          if (this.subjectiveGrades[questionID] > 0) {
            // increment correct answer
            this.$set(
              this.allResults[this.selectedSheetIndex],
              "correctAnswers",
              this.allResults[this.selectedSheetIndex].correctAnswers + 1
            );
          }

          // add to objective score
          this.$set(
            this.allResults[this.selectedSheetIndex],
            "objectiveScore",
            this.allResults[this.selectedSheetIndex].objectiveScore +
              parseFloat(this.subjectiveGrades[questionID])
          );
        }

        this.$set(this.allResults[this.selectedSheetIndex], "graded", true);

        const payload = {
          result: this.allResults[this.selectedSheetIndex],
          testID: this.testID,
        };

        this.$store
          .dispatch("gradeSheet", payload)
          .then(() => {
            this.snackbarText = "Test graded successfully :)";
            this.snackbar = true;
          })
          .catch(() => {
            this.$set(
              this.allResults[this.selectedSheetIndex],
              "graded",
              false
            );
            this.gradingError =
              "There was error uploading the information, please try again :(";
          })
          .finally(() => {
            this.setLoading(false);
          });
      } else {
        this.gradingError =
          "Please input grades for all the subjective answers :)";
        this.setLoading(false);
      }
    },
  },
  mounted() {
    this.getAllResults();
  },
};
</script>

<style>
.inputNum input[type="number"] {
  -moz-appearance: textfield;
}

.inputNum input::-webkit-outer-spin-button,
.inputNum input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>