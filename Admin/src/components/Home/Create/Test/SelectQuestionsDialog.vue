<template>
  <div id="selectQuestionsDialog">
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark small v-bind="attrs" v-on="on">
          Select Questions
        </v-btn>
      </template>
      <v-card tile>
        <v-toolbar dense dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="text-capitalize"
            >'{{ sectionName }}' Questions
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <QuestionsCard
          :superLoading="superLoading"
          @setSuperLoading="setLoading"
          :enableSelect="true"
          @questionsSelected="emitSelectedQuestions"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// const moment = require("moment");

import QuestionsCard from "@/components/Home/Manage/QuestionBank/QuestionsCard.vue";

export default {
  name: "SelectQuestionsDialog",
  props: ["superLoading", "sectionName"],
  components: { QuestionsCard },
  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    dialog: false,
    error: "",
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    emitSelectedQuestions(selectedQuestions) {
      const payload = {
        selectedQuestions,
        sectionName: this.sectionName,
      };
      this.$emit("questionsSelected", payload);
    },
  },
  mounted() {},
};
</script>
