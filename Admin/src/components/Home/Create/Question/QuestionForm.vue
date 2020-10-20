<template>
  <v-form @submit.prevent="submitQuestion" id="questionForm" ref="questionForm">
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
    <v-container>
      <!-- if there are no question folders: Question Folders alert row -->
      <v-row justify="center" v-if="questionFolders.length < 1">
        <v-alert type="info" class="mt-4 mx-auto">
          We strongly recommend you to
          <v-btn to="/manage/question-bank" small>create folders</v-btn> to
          better categorise your questions before creating a new one :)
        </v-alert>
      </v-row>

      <!-- Question Settings Row -->
      <v-row justify="center">
        <v-card :loading="loading || superLoading" class="w-100 px-4 pb-4">
          <h1 class="text-title mt-3">Question Settings</h1>
          <v-divider class="mt-2"></v-divider>

          <div class="d-flex align-center">
            <v-icon>mdi-chevron-right</v-icon>
            <span class="ml-1 mr-2"> Subjective Question: </span>
            <v-checkbox
              v-model="subjective"
              :disabled="loading || superLoading"
              color="green"
              class="mt-5"
            ></v-checkbox>
          </div>
          <div class="d-flex align-center">
            <v-icon>mdi-chevron-right</v-icon>
            <span class="ml-1 mr-md-2"> Folder: </span>
            <v-select
              label="Select Folder"
              class="px-md-4 px-2 text-capitalize"
              v-model="selectedFolder"
              :items="questionFolders"
              :disabled="loading || superLoading"
              required
            ></v-select>
          </div>
        </v-card>
      </v-row>

      <!-- Question Data Input Row -->
      <v-row justify="center" class="mt-6">
        <v-card :loading="loading || superLoading" class="w-100 px-4 pb-4">
          <h1 class="text-title mt-3">Create Question</h1>
          <v-divider class="mt-2"></v-divider>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="12" class="d-flex justify-start title">
                <span class="ml-2">Question:</span>
              </v-col>
              <v-col cols="12" sm="12" class="d-flex justify-center title">
                <editor
                  apiKey="3772g3j3qcfqv8qqew56cx5c3gnoy7f58s58pve85og05txk"
                  model-events="change keydown blur focus paste keyup undo redo"
                  :init="tinymceInit"
                  v-model="question"
                ></editor>
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>

            <v-row v-if="!subjective">
              <v-col cols="12" sm="12" class="d-flex justify-start title">
                <span class="ml-2">Answer Options:</span>
              </v-col>
            </v-row>

            <v-row align="center" v-if="!subjective">
              <v-col cols="12" sm="2" class="d-flex align-center">
                Option:
                <span class="title ml-2">A</span>
              </v-col>
              <v-col cols="12" sm="10" class="d-flex justify-start title">
                <editor
                  apiKey="3772g3j3qcfqv8qqew56cx5c3gnoy7f58s58pve85og05txk"
                  model-events="change keydown blur focus paste keyup undo redo"
                  :init="tinymceInit"
                  v-model="optionA"
                ></editor>
              </v-col>
            </v-row>

            <v-row align="center" v-if="!subjective">
              <v-col cols="12" sm="2" class="d-flex align-center">
                Option:
                <span class="title ml-2">B</span>
              </v-col>
              <v-col cols="12" sm="10" class="d-flex justify-start title">
                <editor
                  apiKey="3772g3j3qcfqv8qqew56cx5c3gnoy7f58s58pve85og05txk"
                  model-events="change keydown blur focus paste keyup undo redo"
                  :init="tinymceInit"
                  v-model="optionB"
                ></editor>
              </v-col>
            </v-row>

            <v-row align="center" v-if="!subjective">
              <v-col cols="12" sm="2" class="d-flex align-center">
                Option:
                <span class="title ml-2">C</span>
              </v-col>
              <v-col cols="12" sm="10" class="d-flex justify-start title">
                <editor
                  apiKey="3772g3j3qcfqv8qqew56cx5c3gnoy7f58s58pve85og05txk"
                  model-events="change keydown blur focus paste keyup undo redo"
                  :init="tinymceInit"
                  v-model="optionC"
                ></editor>
              </v-col>
            </v-row>

            <v-row align="center" v-if="!subjective">
              <v-col cols="12" sm="2" class="d-flex align-center">
                Option:
                <span class="title ml-2">D</span>
              </v-col>
              <v-col cols="12" sm="10" class="d-flex justify-start title">
                <editor
                  apiKey="3772g3j3qcfqv8qqew56cx5c3gnoy7f58s58pve85og05txk"
                  model-events="change keydown blur focus paste keyup undo redo"
                  :init="tinymceInit"
                  v-model="optionD"
                ></editor>
              </v-col>
            </v-row>

            <v-divider class="my-9"></v-divider>

            <v-row align="center">
              <v-col cols="12" sm="12" class="d-flex align-center">
                <span class="title ml-2">Solution (optional) :</span>
              </v-col>
              <v-col cols="12" sm="12" class="d-flex justify-center title">
                <editor
                  apiKey="3772g3j3qcfqv8qqew56cx5c3gnoy7f58s58pve85og05txk"
                  model-events="change keydown blur focus paste keyup undo redo"
                  :init="tinymceInit"
                  v-model="solution"
                ></editor>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>

      <!-- Question Data Save Row -->
      <v-row justify="center" class="mt-6">
        <v-card :loading="loading || superLoading" class="w-100 px-4 pb-4">
          <h1 class="text-title mt-3">Save Question</h1>
          <v-divider class="mt-2"></v-divider>

          <v-row align="center" class="mt-7 mb-n3" no-gutters v-if="error">
            <v-col cols="12">
              <v-alert type="error">{{ error }}</v-alert>
            </v-col>
          </v-row>

          <!-- correct answer if question is subjective -->
          <div v-if="!subjective" class="d-flex align-center">
            <v-icon>mdi-chevron-right</v-icon>
            <span class="ml-1 mr-md-2"> Correct Answer: </span>
            <v-select
              label="Select Option"
              class="px-md-4 px-2 mt-7 text-capitalize"
              v-model="correctAnswer"
              :items="answersList"
              :disabled="loading || superLoading"
              dense
              outlined
            ></v-select>
          </div>

          <!-- Save Button -->
          <v-btn
            @click="submitQuestion"
            class="float-right mt-2"
            color="info"
            large
          >
            <v-icon>mdi-content-save</v-icon> Save Question
          </v-btn>
        </v-card>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
const moment = require("moment");

import Editor from "@tinymce/tinymce-vue";

export default {
  name: "QuestionForm",
  props: ["superLoading"],
  components: {
    editor: Editor,
  },
  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    subjective: false,
    questionFolders: [],
    selectedFolder: "",
    tinymceInit: {
      height: 240,
      menubar: false,
      branding: false,
      plugins: [
        "advlist autolink lists link image charmap",
        "searchreplace visualblocks code fullscreen",
        "print preview anchor insertdatetime media",
        "paste code help wordcount table codesample",
      ],
      toolbar:
        "undo redo | formatselect | bold italic underline strikethrough subscript superscript forecolor |image link |table charmap | codesample | \
                          alignleft aligncenter alignright | \
                          bullist numlist outdent indent",
    },
    error: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    solution: "",
    answersList: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "",
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    submitQuestion() {
      // Validate Editor Input
      if (!this.$refs.questionForm.validate()) {
        return;
      }
      if (
        (!this.optionA || !this.optionB || !this.optionC || !this.optionD) &&
        !this.subjective
      ) {
        this.error = "Please fill in the question and all the options :(";
        return;
      } else if (!this.question) {
        this.error = "Please fill in the question :(";
        return;
      } else if (!this.correctAnswer && !this.subjective) {
        this.error = "Please select a correct answer:(";
        return;
      }
      this.error = "";
      this.setLoading(true);

      const unix_timestamp = this.$route.params.questionObj
        ? this.$route.params.questionObj.id
        : moment().unix();

      const payload = this.subjective
        ? {
            id: `${unix_timestamp}`,
            isSubjective: this.subjective,
            question: this.question,
            solution: this.solution,
            folder: this.selectedFolder,
          }
        : {
            id: `${unix_timestamp}`,
            isSubjective: this.subjective,
            question: this.question,
            options: {
              optionA: this.optionA,
              optionB: this.optionB,
              optionC: this.optionC,
              optionD: this.optionD,
            },
            correctAnswer: this.correctAnswer,
            solution: this.solution,
            folder: this.selectedFolder,
          };

      console.log(payload);

      this.$store
        .dispatch("submitQuestion", payload)
        .then(() => {
          this.snackbarText = "Question saved successfully :)";
          this.$refs.questionForm.reset();
          this.question = "";
          this.optionA = "";
          this.optionB = "";
          this.optionC = "";
          this.optionD = "";
          this.solution = "";
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
  },
  mounted() {
    // get question folders from store
    const questionFolders = this.$store.getters.questionFolders;

    //if not found in store
    if (
      Object.keys(questionFolders).length === 0 &&
      questionFolders.constructor === Object
    ) {
      //get folder names from server
      this.$store
        .dispatch("getQuestionFolders")
        .then((res) => {
          if (res) {
            this.questionFolders = res.folderNames;
          }
        })
        .catch(() => {
          this.error = "Network error in fetching folders, please try again.";
        })
        .finally(() => {
          this.setLoading(false);
        });
    } else {
      // if found in store
      this.questionFolders = questionFolders.folderNames;
      this.setLoading(false);
    }
  },
};
</script>
