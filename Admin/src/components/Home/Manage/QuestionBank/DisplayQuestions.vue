<template>
  <div id="displayQuestions" class="w-100">
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>

    <!-- Question FullScreen dialog -->
    <v-dialog
      v-model="questionDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card tile v-if="selectedQuestion">
        <!-- Toolbar -->
        <v-toolbar dense dark color="primary">
          <v-btn icon dark @click="questionDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Question</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              @click="deleteQuestionModal(selectedQuestion.arrayPos)"
              dark
              text
              class="mr-1"
              small
            >
              <v-icon class="mr-1">mdi-trash-can-outline mdi-18px</v-icon>
              Delete
            </v-btn>
            <v-btn
              :to="{
                name: 'createQuestion',
                params: { questionObj: selectedQuestion },
              }"
              dark
              text
              class="ml-1"
              small
            >
              <v-icon class="mr-1">mdi-square-edit-outline mdi-18px</v-icon>
              Edit
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <!-- Error Row -->
        <div v-if="error" class="mt-5 mb-n3 px-1 px-md-3">
          <v-alert type="error">{{ error }}</v-alert>
        </div>

        <!-- Question MetaData -->
        <v-card-subtitle class="mt-5 mt-md-9">
          <b class="mr-1">ID:</b> {{ selectedQuestion.id }}
          <b class="ml-2 mr-1"> Type:</b>
          {{ selectedQuestion.isSubjective ? "Subjective" : "Objective" }}
        </v-card-subtitle>

        <v-card-subtitle class="pb-1"> Question: </v-card-subtitle>

        <v-card-text>
          <span class="text-h6" v-html="selectedQuestion.question"></span>

          <v-divider class="my-2"></v-divider>

          <v-container class="pa-2" fluid>
            <!-- Options -->
            <div v-if="!selectedQuestion.isSubjective" class="mb-6">
              <v-row class="mb-2">
                <b>Options:</b>
              </v-row>
              <v-row align="center" v-for="(option, i) in optionsData" :key="i">
                <v-col cols="12" sm="12" class="d-flex">
                  <!-- Option Title -->
                  <span class="mr-2 d-flex align-md-center align-start">
                    <v-icon
                      :color="
                        selectedQuestion.correctAnswer ==
                        `Option ${option.title}`
                          ? 'green'
                          : 'grey'
                      "
                      class="mr-2"
                      style="margin-top: 0.8px"
                    >
                      mdi-check-circle mdi-18px
                    </v-icon>
                    <b class="mr-1">{{ option.title }}</b>
                    :
                  </span>

                  <!-- Option Content -->
                  <span
                    class="mb-n4"
                    v-html="selectedQuestion.options[`option${option.title}`]"
                  ></span>
                </v-col>
              </v-row>
              <v-divider class="mt-2"></v-divider>
            </div>

            <!-- Solution -->
            <v-row>
              <b>Solution:</b>
            </v-row>
            <v-row align="center">
              <v-col cols="12" sm="10" class="d-flex">
                <span class="mb-n3" v-html="selectedQuestion.solution"></span>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete dialog -->
    <v-dialog v-model="deleteDialog" persistent max-width="590">
      <v-card :loading="loading || superLoading">
        <v-card-title class="headline">
          Are you sure you want to delete this question ?
        </v-card-title>
        <v-card-subtitle class="mt-1">
          (Question ID: {{ selectedQuestion.id }})
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
            @click="deleteQuestion"
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

    <h6 class="text-h6 pt-4">
      <v-icon class="mr-1">mdi-chevron-right</v-icon> Questions:
    </h6>

    <v-container class="mt-4 pa-0 pa-md-4">
      <!-- Error Row -->
      <v-row align="center" no-gutters v-if="error">
        <v-col cols="12" class="mt-2">
          <v-alert type="error">{{ error }}</v-alert>
        </v-col>
      </v-row>

      <!-- Display Questions Row -->
      <v-row align="center" no-gutters>
        <v-col
          cols="12"
          sm="12"
          lg="6"
          v-for="(question, i) in allQuestions"
          :key="i"
        >
          <v-card
            color="pink lighten-5"
            class="ma-1"
            outlined
            elevation="0"
            @click="openQuestionModal(i)"
          >
            <!-- ID and Action Buttons -->
            <v-card-subtitle>
              <span class="d-md-flex">
                <b class="mr-1">ID:</b> {{ question.id }}
                <v-spacer></v-spacer>
                <div class="mt-2 mt-md-0">
                  <v-btn
                    class="ml-md-1 ml-n1 mr-1"
                    @click="deleteQuestionModal(i)"
                    small
                  >
                    <v-icon class="mr-1">mdi-trash-can-outline mdi-18px</v-icon>
                    Delete
                  </v-btn>
                  <v-btn
                    :to="{
                      name: 'createQuestion',
                      params: { questionObj: question },
                    }"
                    class="mx-1"
                    small
                  >
                    <v-icon class="mr-1"
                      >mdi-square-edit-outline mdi-18px</v-icon
                    >
                    Edit
                  </v-btn>
                </div>
              </span>
            </v-card-subtitle>

            <!-- Question text-->
            <v-card-subtitle class="pt-0 pb-1"> Question: </v-card-subtitle>
            <v-card-text class="text-h6 ml-1">
              <span v-html="question.question"></span>
            </v-card-text>

            <!-- Question Type and Folder -->
            <v-card-subtitle class="mt-n6">
              <span class="d-md-flex text-capitalize">
                <b class="mr-1"> Folder:</b>
                {{ question.folder ? `'${question.folder}'` : "None" }}

                <b class="mr-1 ml-2"> Type:</b>
                {{ question.isSubjective ? "Subjective" : "Objective" }}
                <v-spacer></v-spacer>
              </span>
            </v-card-subtitle>
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
            @click="fetchQuestions('prev')"
            text
          >
            <v-icon>mdi-chevron-left</v-icon> Previous
          </v-btn>
          <v-btn
            class="mx-1"
            color="pink darken-1"
            :loading="loading || superLoading"
            @click="fetchQuestions('next')"
            text
          >
            Next
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "DisplayQuestions",
  props: ["superLoading", "allQuestions"],
  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    error: "",
    questionDialog: false,
    deleteDialog: false,
    selectedQuestion: "",
    optionsData: [
      {
        title: "A",
      },
      {
        title: "B",
      },
      {
        title: "C",
      },
      {
        title: "D",
      },
    ],
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    fetchQuestions(value) {
      this.$emit("fetchQuestions", value);
    },
    openQuestionModal(index) {
      this.selectedQuestion = this.allQuestions[index];
      this.selectedQuestion.arrayPos = index;
      if (!this.deleteDialog) {
        this.questionDialog = true;
      }
    },
    deleteQuestionModal(index) {
      this.selectedQuestion = this.allQuestions[index];
      this.selectedQuestion.arrayPos = index;
      this.deleteDialog = true;
    },
    deleteQuestion() {
      this.setLoading(true);

      this.$store
        .dispatch("deleteQuestion", this.selectedQuestion.id)
        .then(() => {
          this.snackbarText = "Question deleted successfully :)";
          //remove from allQuestions array
          this.$emit("removeQuestion", this.selectedQuestion.arrayPos);
          this.deleteDialog = false;
          this.questionDialog = false;
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
    this.setLoading(false);
  },
};
</script>
