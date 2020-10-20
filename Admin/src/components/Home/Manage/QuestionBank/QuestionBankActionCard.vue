<template>
  <div id="questionBankActionCard" class="w-100">
    <v-snackbar color="success" v-model="snackbar">{{
      snackbarText
    }}</v-snackbar>

    <v-card :loading="loading || superLoading" class="w-100 pb-4 px-4">
      <!-- Actions -->
      <h6 class="text-h6 pt-4">
        <v-icon class="mr-1">mdi-chevron-right</v-icon> Actions:
      </h6>

      <v-container>
        <v-row justify="center">
          <!-- Create Question Column -->
          <v-col cols="12" sm="12" md="6" class="d-flex">
            <v-btn
              to="/create/question"
              class="mx-auto"
              color="pink darken-1"
              dark
              :loading="loading || superLoading"
            >
              <v-icon class="mr-2">mdi-text-box-plus</v-icon>
              Create Question
            </v-btn>
          </v-col>

          <!-- Edit folders Column -->
          <v-col cols="12" sm="12" md="6" class="d-flex">
            <v-dialog v-model="dialog" scrollable max-width="720px" persistent>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mx-auto"
                  color="pink darken-1"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  :loading="loading || superLoading"
                >
                  <v-icon class="mr-2">mdi-folder-edit</v-icon>
                  Edit Folders
                </v-btn>
              </template>
              <v-card :loading="loading || superLoading">
                <v-card-title
                  ><v-icon class="mr-2">mdi-folder-edit</v-icon>Edit
                  Folders</v-card-title
                >
                <v-divider></v-divider>
                <v-card-text>
                  <!-- Folder Form -->
                  <v-form
                    v-model="valid"
                    @submit.prevent="addFolderName"
                    ref="foldersForm"
                  >
                    <v-container>
                      <v-row align="center" no-gutters v-if="error">
                        <v-col cols="12">
                          <v-alert type="error">{{ error }}</v-alert>
                        </v-col>
                      </v-row>
                      <v-row align="center" no-gutters>
                        <v-col cols="12" sm="9">
                          <v-text-field
                            color="deep-purple accent-4"
                            v-model="folderName"
                            type="text"
                            :rules="folderNameRules"
                            label="Folder Name"
                            :disabled="loading || superLoading"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" class="d-flex justify-end">
                          <v-btn
                            color="pink darken-2 white--text"
                            :disabled="loading || superLoading || !valid"
                            raised
                            @click="addFolderName"
                          >
                            <v-icon class="mr-2">mdi-folder-plus</v-icon>Add
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>

                  <!-- Folders List -->
                  <v-container>
                    <v-row no-gutters>
                      <v-col>
                        <v-list
                          dense
                          v-for="(question, i) in questionFolders"
                          :key="i"
                        >
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title class="text-capitalize">
                                {{ question }}
                              </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-icon>
                              <v-btn
                                color="red"
                                text
                                @click="deleteFolderName(i)"
                                :disabled="loading"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </v-list-item-icon>
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    :loading="loading || superLoading"
                    :disabled="loading || superLoading"
                    @click="dialog = false"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    :loading="loading || superLoading"
                    :disabled="loading || superLoading"
                    color="blue darken-1"
                    dark
                    @click="submitFolderNames()"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "QuestionBankActionCard",
  props: ["superLoading"],
  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    dialog: false,
    error: "",
    valid: false,
    folderName: "",
    folderNameRules: [
      (value) => !!value || "Required.",
      (value) =>
        value.length > 2 || "Field length should be greater than 2 characters",
    ],
    questionFolders: [],
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    addFolderName() {
      this.error = "";
      if (this.questionFolders.includes(this.folderName.toLowerCase())) {
        this.error = "This folder already exists :(";
        return;
      }
      this.questionFolders.push(this.folderName.toLowerCase());
      this.folderName = "";
    },
    deleteFolderName(index) {
      this.questionFolders.splice(index, 1);
    },
    submitFolderNames() {
      this.setLoading(true);

      const payload = {
        folderNames: this.questionFolders,
      };

      //save foldersName to server
      this.$store
        .dispatch("saveQuestionFolders", payload)
        .then(() => {
          this.snackbarText = "Question Folders saved successfully :)";
        })
        .catch(() => {
          this.error = "Network error, please try again.";
          this.snackbarText = "Network error, please try again :(";
        })
        .finally(() => {
          this.snackbar = true;
          this.setLoading(false);
          this.dialog = false;
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
