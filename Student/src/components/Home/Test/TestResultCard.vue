<template>
  <div id="testResultCard">
    <!-- Result Card -->
    <v-card :loading="loading || superLoading" class="pb-2 px-1 px-md-12 mb-4">
      <v-card-subtitle>
        Performance (based on all objective questions):
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-container>
        <v-row align="center" justify="center" class="mt-3">
          <!-- Rank -->
          <!-- <v-col v-if="!test.isQuiz" class="d-flex justify-center">
            <span>
              <v-icon color="green darken-3" size="58"
                >mdi-sort-descending</v-icon
              >
              <br />
              <span class="caption">
                Rank
                <br />
                <span class="title">{{ rankText }}</span>
              </span>
            </span>
          </v-col> -->

          <!-- Score -->
          <v-col class="d-flex justify-center">
            <span class="text-center">
              <v-icon color="amber accent-4" size="58"
                >mdi-trophy-variant</v-icon
              >
              <br />
              <span class="caption">
                Score
                <br />
                <span class="title"
                  >{{ result.objectiveScore }}/{{ totalScore }}</span
                >
              </span>
            </span>
          </v-col>

          <!-- Attempted -->
          <v-col class="d-flex justify-center">
            <span class="text-center">
              <v-icon color="pink" size="58">mdi-playlist-check</v-icon>
              <br />
              <span class="caption">
                Attempted
                <br />
                <span class="title"
                  >{{ overallAttempted }}/{{ totalQuestions }}</span
                >
              </span>
            </span>
          </v-col>

          <!-- Accuracy -->
          <v-col class="d-flex justify-center">
            <span class="text-center">
              <v-icon color="purple darken-1" size="58"
                >mdi-bullseye-arrow</v-icon
              >
              <br />
              <span class="caption">
                Accuracy
                <br />
                <span class="title">{{ accuracy }}%</span>
              </span>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- Solution Card -->
    <v-card :loading="loading || superLoading" class="pb-2 px-1 px-md-12">
      <v-card-subtitle> Test Solution: </v-card-subtitle>
      <v-divider></v-divider>
      <v-container>
        <v-row align="center">
          <!-- Solution -->
          <template v-for="(section, sectionName) in questions">
            <div :key="sectionName">
              <v-chip color="primary darken-2" label>
                {{ sectionName }} :
              </v-chip>

              <template v-for="(question, i) in questions[sectionName]">
                <v-card
                  class="my-3"
                  color="indigo lighten-5"
                  elevation="0"
                  :key="sectionName + '_' + i"
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
                    <v-row v-if="question.isSubjective">
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

                      <!-- Your Answer -->
                      <v-col cols="12" sm="12">
                        <span class="text-subtitle-1 mb-2">
                          <b class="ml-0 ml-md-2">Your Answer:</b>
                        </span>
                        <div class="ml-0 ml-md-2">
                          <span
                            v-html="result.answers[sectionName][question.id]"
                          ></span>
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
                              v-html="question.options['option' + optionTitle]"
                            ></span>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-row>
                  </v-container>
                </v-card>
              </template>

              <v-divider></v-divider>
            </div>
          </template>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TestInstructionsCard",
  props: [
    "superLoading",
    "test",
    "questions",
    "result",
    "totalObjectiveQuestions",
  ],
  computed: {
    totalScore() {
      return this.totalObjectiveQuestions * this.test.rewardPoints;
    },

    overallAttempted() {
      var totalAttempted = 0;

      for (let question of Object.keys(this.result.questionAttemptMeta)) {
        if (
          this.result.questionAttemptMeta[question] == "markedAndAttempted" ||
          this.result.questionAttemptMeta[question] == "attempted"
        ) {
          totalAttempted++;
        }
      }

      return totalAttempted;
    },

    totalQuestions() {
      var totalQuestions = 0;

      for (let section of Object.keys(this.questions)) {
        totalQuestions += this.questions[section].length;
      }

      return totalQuestions;
    },

    attemptedObjectiveQuestions() {
      var attemptedObjectiveQuestions = 0;

      for (let question of Object.keys(this.result.questionAttemptMeta)) {
        if (
          this.result.questionAttemptMeta[question] == "markedAndAttempted" ||
          this.result.questionAttemptMeta[question] == "attempted"
        ) {
          for (let section of Object.keys(this.questions)) {
            var searchQuestion = this.questions[section].find((obj) => {
              return obj.id == question;
            });

            if (!searchQuestion.isSubjective) {
              attemptedObjectiveQuestions++;
            }
          }
        }
      }

      return attemptedObjectiveQuestions;
    },

    accuracy() {
      return (
        (this.result.correctAnswers / this.attemptedObjectiveQuestions) *
        100
      ).toFixed(2);
    },
  },
  data: () => ({
    loading: false,
    options: ["A", "B", "C", "D"],
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    startTest() {
      this.$emit("startTest");
    },
    isOptionSelected(optionTitle, sectionName, questionId) {
      if (questionId in this.result.answers[sectionName]) {
        if (
          this.result.answers[sectionName][questionId] ==
          "Option " + optionTitle
        )
          return true;
      }
      return false;
    },
  },
};
</script>