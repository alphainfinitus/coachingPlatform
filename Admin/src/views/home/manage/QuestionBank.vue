<template>
  <div id="questionBank" class="grey lighten-3 fill-height">
    <v-container>
      <v-row justify="center">
        <!-- title -->
        <h1 class="text-title">
          <v-icon class="text-h3 mr-2" color="pink darken-1">
            mdi-cloud-question
          </v-icon>
          Question Bank
        </h1>
      </v-row>

      <v-row justify="center" class="my-4">
        <ActionCard
          :superLoading="superLoading"
          @setSuperLoading="setSuperLoading"
        />
      </v-row>

      <v-row justify="center">
        <QuestionsCard
          :superLoading="superLoading"
          @setSuperLoading="setSuperLoading"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ActionCard from "@/components/Home/Manage/QuestionBank/ActionCard.vue";
import QuestionsCard from "@/components/Home/Manage/QuestionBank/QuestionsCard.vue";

export default {
  name: "QuestionBank",
  metaInfo: {
    title: "Question Bank",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Question Bank Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    ActionCard,
    QuestionsCard,
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

<style>
.w-100 {
  width: 100%;
}
</style>