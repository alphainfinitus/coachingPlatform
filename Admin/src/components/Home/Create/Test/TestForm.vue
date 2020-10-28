<template>
  <div>
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
    <v-container>
      <!-- if there are no questions: Create Question alert row -->
      <v-row justify="center" v-if="noQuestions">
        <v-alert type="info" class="mt-4 mx-auto">
          We strongly recommend you to
          <v-btn class="mx-1" to="/create/question" small
            >create questions</v-btn
          >
          before deploying a test :)
        </v-alert>
      </v-row>

      <!-- Error Row -->
      <v-row justify="center" v-if="error">
        <v-alert type="error" class="mt-4 mx-auto">
          {{ error }}
        </v-alert>
      </v-row>

      <!-- Question Settings Row -->
      <v-row justify="center">
        <v-card :loading="loading || superLoading" class="w-100">
          <v-stepper v-model="stepper" vertical>
            <!-- 1. Test Name and Instructions -->
            <v-stepper-step :complete="stepper > 1" step="1" editable>
              Test Name and Instructions
              <small class="mt-1">Short and simple</small>
            </v-stepper-step>
            <v-stepper-content class="ma-0 pa-2 ml-md-12 pa-md-4" step="1">
              <v-card color="blue lighten-4" class="mb-12 pa-2 pa-md-6">
                <v-form
                  @submit.prevent="stepper = 2"
                  v-model="testNameFormValid"
                  ref="testNameForm"
                >
                  <v-text-field
                    autofocus
                    v-model="testName"
                    type="text"
                    :rules="basicRules"
                    label="Test Name"
                    :disabled="loading || superLoading"
                    required
                  ></v-text-field>
                  <v-textarea
                    v-model="testInstructions"
                    type="text"
                    label="Test Instructions (Optional)"
                    :disabled="loading || superLoading"
                    required
                  ></v-textarea>
                </v-form>
              </v-card>
              <v-btn
                color="primary"
                :disabled="loading || !testNameFormValid || superLoading"
                @click="stepper = 2"
              >
                Continue
              </v-btn>
            </v-stepper-content>

            <!-- 2. Select Batches -->
            <v-stepper-step
              :complete="stepper > 2"
              step="2"
              :editable="stepper > 2"
            >
              Batches
              <small class="mt-1">Select Batches to deploy the test for.</small>
            </v-stepper-step>
            <v-stepper-content class="ma-0 pa-2 ml-md-12 pa-md-4" step="2">
              <v-card color="blue lighten-4" class="mb-12 pa-2 pa-md-6">
                <v-form
                  @submit.prevent="stepper = 3"
                  v-model="batchesFormValid"
                  ref="batchesForm"
                >
                  <v-select
                    v-model="selectedBatches"
                    :items="allBatches"
                    :rules="selectRules"
                    chips
                    label="Select Batches"
                    multiple
                    solo
                  ></v-select>
                </v-form>
              </v-card>
              <v-btn
                color="primary"
                :disabled="loading || !batchesFormValid || superLoading"
                @click="stepper = 3"
              >
                Continue
              </v-btn>
            </v-stepper-content>

            <!-- 3. Test Marking -->
            <v-stepper-step
              :complete="stepper > 3"
              step="3"
              :editable="stepper > 3"
            >
              Marking Settings
              <small class="mt-1">Negative marking etc.</small>
            </v-stepper-step>
            <v-stepper-content class="ma-0 pa-2 ml-md-12 pa-md-4" step="3">
              <v-card color="blue lighten-4" class="mb-12 pt-4 pa-2 pa-md-6">
                <v-form
                  @submit.prevent="stepper = 4"
                  v-model="markingFormValid"
                  ref="markingForm"
                >
                  <div class="d-md-flex">
                    <v-text-field
                      prefix="+ "
                      color="deep-purple accent-4"
                      v-model="rewardPoints"
                      maxlength="10"
                      type="number"
                      min="0"
                      :rules="basicRules"
                      label="Reward Points / Question"
                      class="mx-1"
                      :disabled="loading || superLoading"
                      outlined
                      required
                    ></v-text-field>
                    <v-text-field
                      prefix="- "
                      color="deep-purple accent-4"
                      v-model="punishmentPoints"
                      maxlength="10"
                      type="number"
                      min="0"
                      :rules="basicRules"
                      label="Reward Points / Question"
                      class="mx-1"
                      :disabled="loading || superLoading"
                      outlined
                      required
                    ></v-text-field>
                  </div>
                </v-form>
              </v-card>
              <v-btn
                color="primary"
                :disabled="loading || !markingFormValid || superLoading"
                @click="stepper = 4"
              >
                Continue
              </v-btn>
            </v-stepper-content>

            <!-- 4. Create Sections -->
            <v-stepper-step
              :complete="stepper > 4"
              step="4"
              :editable="stepper > 4"
            >
              Sections
              <small class="mt-1">Create sections to group questions.</small>
            </v-stepper-step>
            <v-stepper-content class="ma-0 pa-2 ml-md-12 pa-md-4" step="4">
              <v-card color="blue lighten-4" class="mb-12 pt-4 pa-2 pa-md-6">
                <v-form
                  @submit.prevent="addSection"
                  v-model="batchesFormValid"
                  ref="batchesForm"
                >
                  <div class="d-flex">
                    <v-text-field
                      v-model="sectionName"
                      type="text"
                      :rules="basicRules"
                      label="Section Name"
                      class="mx-1"
                      @enter.prevent="addSection"
                      :disabled="loading || superLoading"
                      solo
                      required
                    ></v-text-field>
                    <v-btn @click="addSection" color="success" class="mt-2">
                      <v-icon>mdi-plus</v-icon> Add</v-btn
                    >
                  </div>
                  <div class="mt-2">
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Serial No.</th>
                            <th class="text-left">Section Name</th>
                            <th class="text-left">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(section, i) in sections" :key="i">
                            <td>{{ i + 1 }}</td>
                            <td class="text-capitalize">{{ section }}</td>
                            <td>
                              <v-btn icon @click="deleteSection(i, section)">
                                <v-icon color="red">mdi-trash-can</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </v-form>
              </v-card>
              <v-btn
                color="primary"
                :disabled="loading || sections.length < 1 || superLoading"
                @click="stepper = 5"
              >
                Continue
              </v-btn>
            </v-stepper-content>

            <!-- 5. Select Questions -->
            <v-stepper-step
              :complete="stepper > 5"
              step="5"
              :editable="stepper > 5"
            >
              Select Questions
              <small class="mt-1">Add Questions to your sections</small>
            </v-stepper-step>
            <v-stepper-content class="ma-0 pa-2 ml-md-12 pa-md-4" step="5">
              <v-card color="blue lighten-4" class="mb-12 pt-4 pa-2 pa-md-6">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Serial No.</th>
                        <th class="text-left">Section</th>
                        <th class="text-left">Questions</th>
                        <th class="text-left">Select Folder</th>
                        <th class="text-left">or Select Manually</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(section, i) in sections" :key="i">
                        <td>{{ i + 1 }}</td>
                        <td class="text-capitalize">{{ section }}</td>
                        <td class="text-capitalize">
                          {{ displayNoOfQuestions(section) }}
                        </td>
                        <td>
                          <!-- TODO: Add Select Multiple folders option -->
                          <v-select
                            label="Select folder"
                            class="text-capitalize mt-7"
                            color="pink darken-1"
                            v-model="selectedFolder[section]"
                            :items="questionFolders"
                            :disabled="loading || superLoading"
                            @change="folderSelected($event, section)"
                            outlined
                            dense
                          ></v-select>
                        </td>
                        <td>
                          <SelectQuestionsDialog
                            :superLoading="superLoading"
                            @setSuperLoading="setLoading"
                            :sectionName="section"
                            @questionsSelected="questionsSelected"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
              <v-btn
                color="primary"
                :disabled="loading || !markingFormValid || superLoading"
                @click="stepper = 6"
              >
                Continue
              </v-btn>
            </v-stepper-content>

            <!-- 6. Test Marking -->
            <v-stepper-step
              :complete="stepper > 6"
              step="6"
              :editable="stepper > 6"
            >
              Test Timings
              <small class="mt-1">Test duration etc.</small>
            </v-stepper-step>
            <v-stepper-content class="ma-0 pa-2 ml-md-12 pa-md-4" step="6">
              <v-card color="blue lighten-4" class="mb-12 pt-4 pa-2 pa-md-6">
                Options for durations etc.
              </v-card>
              <v-btn
                color="primary"
                :disabled="loading || !markingFormValid || superLoading"
                @click="stepper = 7"
              >
                Deploy Test
              </v-btn>
            </v-stepper-content>
          </v-stepper>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// const moment = require("moment");

import SelectQuestionsDialog from "@/components/Home/Create/Test/SelectQuestionsDialog.vue";

export default {
  name: "QuestionForm",
  props: ["superLoading"],
  components: {
    SelectQuestionsDialog,
  },
  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    subjective: false,
    allQuestions: [],
    noQuestions: true,
    error: "",
    allBatches: [],
    questionFolders: [],
    selectedFolder: {},

    stepper: 1,
    // forms
    testNameFormValid: false,
    batchesFormValid: false,
    markingFormValid: false,

    //form rules
    basicRules: [(value) => !!value || "Required."],
    selectRules: [
      (value) => !!value.length > 0 || "Please select at least one batch.",
    ],

    // form values
    testName: "",
    testInstructions: "",
    selectedBatches: [],
    rewardPoints: "0",
    punishmentPoints: "0",
    sectionName: "",
    sections: [],
    selectedQuestions: {},
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    fetchSingleQuestion() {
      //to check if user has created any questions before creating a test
      this.$store
        .dispatch("getSingleQuestion")
        .then((res) => {
          if (res) {
            //if snapshot is not empty
            this.noQuestions = false;
          }
        })
        .catch(() => {
          this.error = "Network error in fetching questions, please try again.";
        })
        .finally(() => {
          this.setLoading(false);
        });
    },
    fetchBatches() {
      function returnBatchesArr(batchesObj) {
        var batchesArr = [];
        for (let key of Object.keys(batchesObj)) {
          batchesArr.push(batchesObj[key].name);
        }
        return batchesArr;
      }

      this.setLoading(true);

      // get batches from store
      const batches = this.$store.getters.batches;

      //if not found in store
      if (Object.keys(batches).length === 0 && batches.constructor === Object) {
        //get folder names from server
        this.$store
          .dispatch("getBatches")
          .then((res) => {
            if (res) {
              this.allBatches = returnBatchesArr(res);
            }
          })
          .catch(() => {
            this.error = "Network error in fetching batches, please try again.";
          })
          .finally(() => {
            this.setLoading(false);
          });
      } else {
        // if found in store
        this.allBatches = returnBatchesArr(batches);
        this.setLoading(false);
      }
    },
    fetchFolders() {
      this.setLoading(true);

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
    addSection() {
      this.snackbar = false;
      if (this.sections.includes(this.sectionName.toLowerCase())) {
        this.snackbarText = "This section name already exists :(";
        this.snackbar = true;

        return;
      }
      this.sections.push(this.sectionName);
      this.sectionName = "";
    },
    deleteSection(index, sectionName) {
      this.sections.splice(index, 1);

      // also delete all selected questions for the section
      this.$delete(this.selectedQuestions, sectionName);
    },
    questionsSelected(payload) {
      // TODO: reset selectedFolder
      this.$set(
        this.selectedQuestions,
        payload.sectionName,
        payload.selectedQuestions
      );
      this.selectedFolder[payload.sectionName] = "";
    },
    displayNoOfQuestions(section) {
      if (section in this.selectedQuestions) {
        const isArray = this.selectedQuestions[section] instanceof Array;
        if (isArray) {
          return `${this.selectedQuestions[section].length}`;
        }

        //if not array folder selected;
        return `'${this.selectedQuestions[section].folderName}' folder`;
      } else {
        return "0";
      }
    },
    folderSelected(value, sectionName) {
      this.$set(this.selectedQuestions, sectionName, { folderName: value });
      this.selectedFolder[sectionName] = value;
    },
  },
  mounted() {
    //to check if user has created any questions before creating a test
    this.fetchSingleQuestion();
    this.fetchBatches();
    this.fetchFolders();
  },
};
</script>
