<template>
  <div id="testNavDrawer">
    <!-- FAB -->
    <v-btn
      v-if="!testNavDrawer"
      :disabled="loading || superLoading"
      fab
      fixed
      bottom
      right
      color="primary"
      class="ml-2"
      @click="testNavDrawer = !testNavDrawer"
    >
      <v-icon class="white--text">mdi-menu-open</v-icon>
    </v-btn>

    <v-navigation-drawer v-model="testNavDrawer" right fixed app>
      <!-- Test Name and Batch Info -->
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>{{ test.testName }}</v-list-item-title>
          <v-list-item-subtitle class="text-capitalize">
            {{ test.batch }} : {{ test.institutionName }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <!-- Color Guide -->
      <v-container fluid>
        <v-chip class="ma-1 white--text" color="grey" small>
          <v-icon size="20" left>mdi-eye-off</v-icon>Not Visited
        </v-chip>
        <v-chip class="ma-1 white--text" color="cyan" small>
          <v-icon size="20" left>mdi-eye</v-icon>Visited
        </v-chip>
        <v-chip class="ma-1 white--text" color="orange" small>
          <v-icon size="20" left>mdi-check</v-icon>Marked
        </v-chip>
        <v-chip class="ma-1 white--text" color="green" small>
          <v-icon size="20" left>mdi-pencil</v-icon>Attempted
        </v-chip>
        <v-chip class="ma-1 white--text" color="pink" small>
          <v-icon size="20" left>mdi-check</v-icon>Marked &amp; Attempted
        </v-chip>
      </v-container>

      <v-divider></v-divider>

      <!-- Section Buttons -->
      <v-container v-if="testActive" fluid>
        <v-row justify="start">
          <v-chip
            class="ml-3 mb-2 white--text text-capitalize"
            color="primary"
            label
          >
            Section : {{ activeSection }}
          </v-chip>
        </v-row>
        <v-row justify="start">
          <v-col
            v-for="(question, i) in questions[activeSection]"
            :key="i"
            cols="3"
            sm="3"
          >
            <v-btn
              class="white--text"
              @click="gotoQuestion(i)"
              :color="generateQuestionColor(question.id)"
              small
              depressed
              :disabled="!testActive || loading || superLoading"
            >
              {{ i + 1 }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "TestNavDrawer",
  props: [
    "superLoading",
    "test",
    "activeSection",
    "startTimer",
    "questions",
    "questionAttemptMeta",
  ],
  watch: {
    startTimer: {
      handler(newVal) {
        if (newVal) {
          this.testActive = true;
        } else {
          this.testActive = false;
        }
      },
    },
  },
  data: () => ({
    loading: false,
    testNavDrawer: null,
    timeLeft: null,
    testActive: false,
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    generateQuestionColor(id) {
      switch (this.questionAttemptMeta[id]) {
        case "marked":
          return "orange";

        case "markedAndAttempted":
          return "pink";

        case "attempted":
          return "green";

        case "visited":
          return "cyan";

        default:
          return "grey";
      }
    },
    gotoQuestion(index) {
      this.$emit("gotoQuestion", index);
    },
  },
};
</script>