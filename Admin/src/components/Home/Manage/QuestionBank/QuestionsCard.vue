<template>
  <div id="questionsCard" class="w-100">
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>

    <v-card
      :loading="loading || superLoading"
      :elevation="enableSelect ? 0 : 3"
      class="w-100 pb-4 px-1 px-md-4"
    >
      <!-- Title -->
      <h6 class="text-h6 pt-4" v-if="!enableSelect">
        <v-icon class="mr-1">mdi-chevron-right</v-icon> Fetch Questions:
      </h6>

      <v-container>
        <!-- Error Row -->
        <v-row align="center" no-gutters v-if="error">
          <v-col cols="12" class="mt-2">
            <v-alert type="error">{{ error }}</v-alert>
          </v-col>
        </v-row>

        <!-- Fetch Questions Row -->
        <v-row
          justify="center"
          align="center"
          :class="enableSelect ? 'mt-n2 mt-md-n7 mb-n4' : ''"
        >
          <!-- All Questions Column -->
          <v-col cols="12" sm="12" md="6" class="d-flex">
            <v-btn
              class="mx-auto"
              color="pink darken-1"
              dark
              :loading="loading || superLoading"
              @click="getAllQuestions(null)"
              large
              outlined
            >
              <v-icon class="mr-2">mdi-text-box-multiple</v-icon>
              Show All Questions
            </v-btn>
          </v-col>

          <!-- Show by folder select column -->
          <v-col cols="12" sm="12" md="6" class="d-flex mt-n6 mt-md-0">
            <v-select
              label="or Browse folder"
              class="text-capitalize mt-7"
              color="pink darken-1"
              v-model="selectedFolder"
              @change="getFolderQuestions"
              :items="questionFolders"
              :disabled="loading || superLoading"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>

        <v-divider class="mb-2"></v-divider>

        <!-- Display Questions Row -->
        <v-row justify="center" align="center" v-if="allQuestions.length > 0">
          <DisplayQuestions
            :superLoading="superLoading"
            @setSuperLoading="setLoading"
            :enableSelect="enableSelect"
            :allQuestions="allQuestions"
            @fetchQuestions="fetchQuestions"
            @removeQuestion="removeQuestion"
            @questionsSelected="emitSelectedQuestions"
          />
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import DisplayQuestions from "@/components/Home/Manage/QuestionBank/DisplayQuestions.vue";

export default {
  name: "QuestionsCard",
  props: ["superLoading", "enableSelect"],
  components: { DisplayQuestions },
  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    error: "",
    questionFolders: [],
    selectedFolder: "",
    allQuestions: [],
    firstAndLastVisible: null,
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    fetchFolders() {
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
            this.dialog = false;
          });
      } else {
        // if found in store
        this.questionFolders = questionFolders.folderNames;
        this.setLoading(false);
      }
    },
    getAllQuestions(requestType) {
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

      this.setLoading(true);
      this.selectedFolder = "";
      this.$store
        .dispatch("getAllQuestions", payload)
        .then((res) => {
          // write data if there is data
          if (res.data.length > 0) {
            this.snackbarText = "Questions fetched successfully :)";
            this.allQuestions = res.data;
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
                this.snackbarText = "You've not added any questions yet :(";
            }
          }
        })
        .catch((error) => {
          console.log(error);
          this.error = "Network error, please try again.";
          this.snackbarText = "Network error, please try again :(";
        })
        .finally(() => {
          this.snackbar = true;
          this.setLoading(false);
        });
    },
    getFolderQuestions(requestType) {
      var payload = "";

      switch (requestType) {
        case "prev":
          payload = {
            requestType,
            doc: this.firstAndLastVisible.firstVisible,
            folder: this.selectedFolder,
          };
          break;
        case "next":
          payload = {
            requestType,
            doc: this.firstAndLastVisible.lastVisible,
            folder: this.selectedFolder,
          };
          break;
        default:
          payload = { requestType: null, folder: this.selectedFolder };
      }

      this.setLoading(true);
      this.$store
        .dispatch("getFolderQuestions", payload)
        .then((res) => {
          // write data if there is data
          if (res.data.length > 0) {
            this.snackbarText = "Questions fetched successfully :)";
            this.allQuestions = res.data;
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
                this.snackbarText =
                  "You've not added any questions to this folder yet :(";
            }
          }
        })
        .catch((error) => {
          console.log(error);
          this.error = "Network error, please try again.";
          this.snackbarText = "Network error, please try again :(";
        })
        .finally(() => {
          this.snackbar = true;
          this.setLoading(false);
        });
    },
    fetchQuestions(requestType) {
      !this.selectedFolder
        ? this.getAllQuestions(requestType)
        : this.getFolderQuestions(requestType);
    },
    removeQuestion(arrayPos) {
      //remove question from allQuestions array
      this.allQuestions.splice(arrayPos, 1);
      this.setLoading(false);
    },
    emitSelectedQuestions(selectedQuestions) {
      this.$emit("questionsSelected", selectedQuestions);
    },
  },
  mounted() {
    this.fetchFolders();
  },
};
</script>
