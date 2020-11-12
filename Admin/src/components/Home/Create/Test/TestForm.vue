<template>
  <div>
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>

    <!-- Reset question selection confirmation dialog -->
    <v-dialog v-model="resetQuestionSelectionDialog" max-width="390">
      <v-card>
        <v-card-title class="headline">
          Reset selected questions ?
        </v-card-title>

        <v-card-text>
          Are you sure you want to reset the selected questions for
          <b class="text-capitalize">'{{ resetSectionSelected }}'</b> section ?
          <br /><br />
          This action cannot be undone.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            text
            @click="resetQuestionSelection(resetSectionSelected)"
          >
            Reset
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="resetQuestionSelectionDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

      <!-- Stepper Card Row -->
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
                      label="Punishment Points / Question"
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
                  v-model="sectionFormValid"
                  ref="sectionForm"
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
                        <th class="text-left">Reset Selection</th>
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
                        <td>
                          <v-btn
                            @click="openResetQuestionsDialog(section)"
                            icon
                            color="red"
                          >
                            <v-icon>mdi-close-circle</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
              <v-btn
                color="primary"
                :disabled="loading || !selectQuestionsValid() || superLoading"
                @click="stepper = 6"
              >
                Continue
              </v-btn>
            </v-stepper-content>

            <!-- 6. Test Timings -->
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
                <v-form
                  @submit.prevent="deployTest"
                  v-model="timingsFormValid"
                  ref="timingsForm"
                >
                  <!-- Test Availability -->
                  <div>
                    <span>Test Availability:</span>
                    <div class="d-md-flex mt-4">
                      <!-- Start Date Field -->
                      <v-menu
                        ref="start_date_menu"
                        v-model="startDateMenu"
                        :close-on-content-click="false"
                        :return-value.sync="startDate"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            class="mx-4"
                            v-model="startDateText"
                            label="Start Date"
                            prepend-icon="mdi-calendar-clock"
                            :rules="basicRules"
                            v-on="on"
                            readonly
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          :min="currentDate"
                          v-model="startDate"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="startDateMenu = false"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.start_date_menu.save(startDate)"
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-menu>

                      <!-- Start Time Field -->
                      <v-menu
                        ref="startTimeMenu"
                        v-model="startTimeMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="startTime"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            class="mx-4"
                            v-model="startTimeText"
                            label="Start Time"
                            prepend-icon="mdi-timeline-clock"
                            :rules="basicRules"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="startTimeMenu"
                          v-model="startTime"
                          full-width
                          @click:minute="$refs.startTimeMenu.save(startTime)"
                        ></v-time-picker>
                      </v-menu>
                    </div>

                    <div class="d-md-flex mt-4">
                      <!-- End Date Field -->
                      <v-menu
                        ref="end_date_menu"
                        v-model="endDateMenu"
                        :close-on-content-click="false"
                        :return-value.sync="endDate"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            class="mx-4"
                            v-model="endDateText"
                            label="End Date"
                            prepend-icon="mdi-calendar-clock"
                            :rules="basicRules"
                            v-on="on"
                            readonly
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          :min="startDate"
                          v-model="endDate"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="endDateMenu = false"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.end_date_menu.save(endDate)"
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-menu>

                      <!-- End Time Field -->
                      <v-menu
                        ref="endTimeMenu"
                        v-model="endTimeMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="endTime"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            class="mx-4"
                            v-model="endTimeText"
                            label="End Time"
                            prepend-icon="mdi-timeline-clock"
                            :rules="basicRules"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="endTimeMenu"
                          v-model="endTime"
                          :min="startDate == endDate ? startTime : null"
                          full-width
                          @click:minute="$refs.endTimeMenu.save(endTime)"
                        ></v-time-picker>
                      </v-menu>
                    </div>
                  </div>

                  <v-divider class="my-6"></v-divider>

                  <!-- Test Duration  -->
                  <div>
                    <span>Test Duration:</span>
                    <br />
                    <small
                      >Maximum Duration is {{ maxTestDuration }} minutes
                      according to test availability.</small
                    >
                    <v-container fluid>
                      <v-row justify="center">
                        <v-col cols="12" sm="12" md="6">
                          <v-text-field
                            suffix="minutes"
                            v-model="testDuration"
                            type="number"
                            :min="1"
                            :max="maxTestDuration"
                            :rules="durationRules()"
                            label="Test Duration"
                            :disabled="loading || superLoading"
                            outlined
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </div>

                  <v-divider class="my-6"></v-divider>

                  <!-- Allow submit before time -->
                  <div>
                    <v-checkbox
                      v-model="submitBeforeTime"
                      label="Allow students to submit before duration is complete"
                    ></v-checkbox>
                  </div>
                </v-form>
              </v-card>
              <v-btn
                color="primary"
                :disabled="loading || !timingsFormValid || superLoading"
                @click="deployTest"
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
const moment = require("moment");

import SelectQuestionsDialog from "@/components/Home/Create/Test/SelectQuestionsDialog.vue";

export default {
  name: "QuestionForm",
  props: ["superLoading", "testObj"],
  components: {
    SelectQuestionsDialog,
  },
  computed: {
    startDateText: {
      get() {
        return this.startDate
          ? moment(this.startDate).format("dddd, MMMM Do YYYY")
          : "";
      },
      set(newDateText) {
        return newDateText;
      },
    },

    endDateText: {
      get() {
        return this.endDate
          ? moment(this.endDate).format("dddd, MMMM Do YYYY")
          : "";
      },
      set(newDateText) {
        return newDateText;
      },
    },

    startTimeText: {
      get() {
        return this.startTime
          ? moment(this.startTime, ["HH:mm "]).format("hh:mm a")
          : "";
      },
      set(newDateText) {
        return newDateText;
      },
    },

    endTimeText: {
      get() {
        return this.endTime
          ? moment(this.endTime, ["HH:mm "]).format("hh:mm a")
          : "";
      },
      set(newDateText) {
        return newDateText;
      },
    },

    currentDate() {
      return new Date().toISOString();
    },

    maxTestDuration() {
      const startDateTime = moment(this.startDate + " " + this.startTime);
      const endDateTime = moment(this.endDate + " " + this.endTime);
      const diff = endDateTime.diff(startDateTime, "minutes", true);
      return !isNaN(diff) ? diff : 1;
    },
  },
  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    noQuestions: true,
    error: "",
    stepper: 1,
    allBatches: [],
    questionFolders: [],
    selectedFolder: {},
    resetQuestionSelectionDialog: false,
    resetSectionSelected: "",
    startDateMenu: false,
    startTimeMenu: false,
    endDateMenu: false,
    endTimeMenu: false,

    // forms
    testNameFormValid: false,
    batchesFormValid: false,
    markingFormValid: false,
    sectionFormValid: false,
    timingsFormValid: false,

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
    startDate: moment().format().substr(0, 10),
    startTime: null,
    endDate: moment().format().substr(0, 10),
    endTime: null,
    testDuration: 1,
    submitBeforeTime: true,
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
      } else if (this.sectionName) {
        this.sections.push(this.sectionName);
        this.sectionName = "";
      }
      return;
    },
    deleteSection(index, sectionName) {
      this.sections.splice(index, 1);
      // delete all selected questions for the section
      this.resetQuestionSelection(sectionName);
      //reset the folder selected
      this.resetFolderSelection(sectionName);
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
        if (this.selectedQuestions[section] instanceof Array) {
          return `${this.selectedQuestions[section].length}`;
        }

        //if not array : fetch number from firestore;

        // get question Count from store
        var questionCount = this.$store.getters.questionCount;
        return questionCount[this.selectedQuestions[section].folderName];
      } else {
        return 0;
      }
    },
    folderSelected(value, sectionName) {
      this.$set(this.selectedQuestions, sectionName, { folderName: value });
      this.$set(this.selectedFolder, sectionName, value);
    },
    selectQuestionsValid() {
      //run only when select Questions form is displayed
      if (this.stepper == 5) {
        //  displayNoOfQuestions for each section is zero then not valid
        for (var i = 0; i < this.sections.length; i++) {
          if (this.displayNoOfQuestions(this.sections[i]) < 1) {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    },
    openResetQuestionsDialog(sectionName) {
      this.resetSectionSelected = sectionName;
      this.resetQuestionSelectionDialog = true;
    },
    resetQuestionSelection(sectionName) {
      this.$delete(this.selectedQuestions, sectionName);
      this.resetFolderSelection(sectionName);
      this.resetQuestionSelectionDialog = false;
    },
    resetFolderSelection(sectionName) {
      this.selectedFolder[sectionName] = "";
    },
    durationRules() {
      return [
        (value) => !!value || "Required.",
        (value) => value >= 1 || `Value should be at least 1 minute.`,
        (value) =>
          value <= this.maxTestDuration ||
          `Value should be less than or equal to ${this.maxTestDuration} minutes.`,
      ];
    },
    resetTestForm() {
      this.$refs.testNameForm.reset();
      this.stepper = 1;
      this.$refs.batchesForm.reset();
      this.$refs.markingForm.reset();
      this.$refs.batchesForm.reset();
      this.$refs.sectionForm.reset();
      this.$refs.timingsForm.reset();

      this.selectedFolder = {};
      this.resetSectionSelected = "";
      this.sections = [];
      this.selectedQuestions = {};
      this.startDate = moment().format().substr(0, 10);
      this.startTime = null;
      this.endDate = moment().format().substr(0, 10);
      this.endTime = null;
      this.testDuration = 1;
    },
    deployTest() {
      this.setLoading(true);
      this.error = "";

      const unix_timestamp_id = this.testObj
        ? this.testObj.id
        : moment().unix();

      const payload = {
        id: `${unix_timestamp_id}`,
        institutionUID: "",
        testName: this.testName,
        testInstructions: this.testInstructions,
        selectedBatches: this.selectedBatches,
        rewardPoints: parseFloat(this.rewardPoints),
        punishmentPoints: parseFloat(this.punishmentPoints),
        sections: this.sections,
        selectedQuestions: this.selectedQuestions,
        startDateTime: moment(this.startDate + " " + this.startTime).toDate(),
        endDateTime: moment(this.endDate + " " + this.endTime).toDate(),
        testDuration: parseInt(this.testDuration),
        submitBeforeTime: this.submitBeforeTime,
      };

      this.$store
        .dispatch("submitTest", payload)
        .then(() => {
          this.snackbarText = "Test deployed successfully :)";
          this.resetTestForm();
          this.$router.push("/home");
        })
        .catch(() => {
          this.error = "Network error, please try again.";
          this.snackbarText = "Network error, please try again :(";
          this.stepper = 1;
        })
        .finally(() => {
          this.snackbar = true;
          this.setLoading(false);
        });
    },
    fillTestForm() {
      this.testName = this.testObj.testName;
      this.testInstructions = this.testObj.testInstructions;
      this.selectedBatches = this.testObj.selectedBatches;
      this.rewardPoints = `${this.testObj.rewardPoints}`;
      this.punishmentPoints = `${this.testObj.punishmentPoints}`;
      this.sections = this.testObj.sections;
      this.selectedBatches = this.testObj.selectedBatches;
      this.selectedQuestions = this.testObj.selectedQuestions;
      this.testDuration = `${this.testObj.testDuration}`;
      this.startDate = moment(this.testObj.startDateTime.seconds * 1000)
        .format()
        .substr(0, 10);
      this.startTime = moment(this.testObj.startDateTime.seconds * 1000).format(
        "HH:mm"
      );
      this.endDate = moment(this.testObj.endDateTime.seconds * 1000)
        .format()
        .substr(0, 10);
      this.endTime = moment(this.testObj.endDateTime.seconds * 1000).format(
        "HH:mm"
      );
      this.submitBeforeTime = this.testObj.submitBeforeTime;

      //fill this.selectedFolder
      for (var key of Object.keys(this.selectedQuestions)) {
        if (!(this.selectedQuestions[key] instanceof Array)) {
          // if folder Selected
          this.$set(
            this.selectedFolder,
            key,
            this.selectedQuestions[key].folderName
          );
        }
      }
    },
  },
  mounted() {
    //to check if user has created any questions before creating a test
    this.fetchSingleQuestion();
    this.fetchBatches();
    this.fetchFolders();
    if (this.testObj) {
      this.fillTestForm();
    }
  },
};
</script>
