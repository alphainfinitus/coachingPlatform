<template>
  <div id="answerSheets" class="grey lighten-3 fill-height">
    <v-container>
      <!-- title -->
      <v-row justify="center">
        <h1 class="text-title">
          <v-icon class="text-h3 mr-2" color="green darken-1">
            mdi-clipboard-text-multiple
          </v-icon>
          Answer Sheets
        </h1>
      </v-row>

      <!-- Tests Cards -->
      <v-row justify="center" class="my-4">
        <TestsCard
          :superLoading="superLoading"
          @setSuperLoading="setSuperLoading"
          routeName="viewTestAnswerSheet"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TestsCard from "@/components/Home/View/Results/TestsCard.vue";

export default {
  name: "AnswerSheets",
  metaInfo: {
    title: "Answer Sheets",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Answer Sheets Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    TestsCard,
  },
  data: () => ({
    superLoading: true,
  }),
  methods: {
    setSuperLoading(value) {
      this.superLoading = value;
    },
  },
  mounted() {
    this.superLoading = false;
  },
};
</script>