<template>
  <v-form id="questionForm" ref="questionForm">
    <v-container>
      <!-- if there are no question folders: Question Folders alert row -->
      <v-row justify="center">
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
            <span class="ml-1 mr-md-2"> Question Folder: </span>
            <v-select
              label="Available Folders"
              class="mx-md-4 text-capitalize"
              :items="questionFolders"
              :disabled="loading || superLoading"
            ></v-select>
          </div>
        </v-card>
      </v-row>

      <v-row justify="center" class="mt-6">
        <v-card :loading="superLoading" class="w-100 pa-4">
          <h1 class="text-subtitle-1">Create Question</h1>
        </v-card>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: "QuestionForm",
  props: ["superLoading"],
  data: () => ({
    loading: true,
    subjective: false,
    questionFolders: [],
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
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
          console.log("res", res);
          if (res) {
            this.questionFolders = res.folderNames;
          }
        })
        .catch(() => {
          this.error = "Network error in fetching folders, please try again.";
        })
        .finally(() => {
          this.setLoading(false);
          this.dialog = false;
        });
    } else {
      // if found in store
      this.questionFolders = questionFolders.folderNames;
      this.setLoading(false);
    }
  },
};
</script>
