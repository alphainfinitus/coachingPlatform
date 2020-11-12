<template>
  <div id="testQuestionCard">
    <!-- Ask to submit Dialog -->
    <v-dialog v-model="submitDialog" persistent max-width="390">
      <v-card :loading="loading || superLoading">
        <v-card-title class="headline">
          {{ canSubmitBeforeTime ? "Submit Test ?" : "End Of Test" }}
        </v-card-title>
        <v-card-text>
          {{
            canSubmitBeforeTime
              ? "This is the end of the last section do you want to submit the test ?"
              : "You cannot submit this test before the test duration is over."
          }}
          <br /><br />
          Your test will be automatically submitted if the test duration is
          over.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="canSubmitBeforeTime"
            color="primary darken-1"
            dark
            :loading="loading || superLoading"
            @click="shouldSubmitTest(true)"
          >
            Submit Test
          </v-btn>
          <v-btn
            :disabled="loading || superLoading"
            text
            @click="shouldSubmitTest(false)"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Question Card -->
    <v-card :loading="loading || superLoading" class="pb-2">
      <v-card-title class="text-capitalize">
        Question {{ currentQuestionIndex + 1 }}:
      </v-card-title>
      <v-divider></v-divider>
      <v-container fluid>
        <!-- Question -->
        <v-row align="center" class="px-2 pt-0 pt-md-1 px-md-8">
          <span v-html="currentQuestion.question"></span>
        </v-row>

        <v-divider class="my-2"></v-divider>

        <v-row v-if="currentQuestion.isSubjective">
          <v-col cols="12" sm="12" class="d-flex justify-start text-h6">
            <span class="ml-2">Your Answer:</span>
          </v-col>
          <v-col cols="12" sm="12" class="d-flex justify-center title">
            <editor
              apiKey="3772g3j3qcfqv8qqew56cx5c3gnoy7f58s58pve85og05txk"
              model-events="change keydown blur focus paste keyup undo redo"
              :init="tinymceInit"
              v-model="subjectiveAnswer"
            ></editor>
          </v-col>
        </v-row>

        <v-row v-else class="px-0 px-md-4">
          <v-radio-group v-model="objectiveAnswer">
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
                    <v-radio :value="'Option ' + optionTitle"> </v-radio>
                  </span>
                  <span
                    v-html="currentQuestion.options['option' + optionTitle]"
                  ></span>
                </v-col>
              </v-row>
            </v-container>
          </v-radio-group>
        </v-row>
      </v-container>
    </v-card>

    <!-- Next, Mark for Review and Clear Response buttons -->
    <v-card class="my-2">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="4" class="d-flex justify-center">
            <v-btn
              :disabled="loading || superLoading"
              outlined
              @click="nextQuestion('reviewNext')"
            >
              Mark for Review &amp; Next
            </v-btn>
          </v-col>
          <v-col cols="12" sm="4" class="d-flex justify-center">
            <v-btn
              :disabled="loading || superLoading"
              @click="clearResponse"
              outlined
            >
              Clear Response
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" sm="4" class="d-flex justify-center">
            <v-btn
              @click="nextQuestion('saveNext')"
              :disabled="loading || superLoading"
              color="primary"
            >
              Save &amp; Next
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "TestQuestionCard",
  props: [
    "superLoading",
    "currentQuestion",
    "currentQuestionIndex",
    "activeSection",
    "answers",
    "askToSubmit",
    "canSubmitBeforeTime",
  ],
  components: {
    editor: Editor,
  },
  watch: {
    currentQuestion: {
      handler() {
        // if answered: fill form with values
        this.fillForm();
      },
    },
    askToSubmit: {
      handler(newVal) {
        if (newVal) {
          this.submitDialog = true;
          // if answered: fill form with values
          this.fillForm();
        } else {
          this.submitDialog = false;
        }
      },
    },
  },
  data: () => ({
    loading: false,
    error: "",
    tinymceInit: {
      height: 240,
      menubar: false,
      branding: false,
      contextmenu_never_use_native: true,
      plugins: [
        "lists charmap",
        "searchreplace visualblocks code fullscreen",
        "code wordcount table codesample",
      ],
      toolbar:
        "undo redo | formatselect | bold italic underline strikethrough subscript superscript |table charmap | codesample | \
                          alignleft aligncenter alignright | \
                          bullist numlist outdent indent",
    },
    subjectiveAnswer: "",
    objectiveAnswer: "",
    options: ["A", "B", "C", "D"],
    submitDialog: false,
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    nextQuestion(changeType) {
      var changeObj = {};
      if (
        (this.currentQuestion.isSubjective && this.subjectiveAnswer) ||
        (!this.currentQuestion.isSubjective && this.objectiveAnswer)
      ) {
        changeObj.answer = this.currentQuestion.isSubjective
          ? this.subjectiveAnswer
          : this.objectiveAnswer;
      }
      changeObj.type = changeType;
      this.$emit("nextQuestion", changeObj);
      this.subjectiveAnswer = "";
      this.objectiveAnswer = "";
    },
    clearResponse() {
      this.subjectiveAnswer = "";
      this.objectiveAnswer = "";
      this.$emit("clearResponse");
    },
    fillForm() {
      if (this.activeSection in this.answers) {
        if (this.currentQuestion.id in this.answers[this.activeSection]) {
          if (this.currentQuestion.isSubjective) {
            this.subjectiveAnswer = this.answers[this.activeSection][
              this.currentQuestion.id
            ];
          } else {
            this.objectiveAnswer = this.answers[this.activeSection][
              this.currentQuestion.id
            ];
          }
        }
      }
    },
    shouldSubmitTest(res) {
      this.$emit("shouldSubmitTest", res);
    },
  },
  mounted() {},
};
</script>

<style>
.defaultCursor {
  cursor: default;
}
</style>