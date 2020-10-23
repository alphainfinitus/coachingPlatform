<template>
  <div id="createQuestion" class="grey lighten-3 fill-height">
    <v-container>
      <v-row justify="center">
        <!-- title -->
        <h1 class="text-title">
          <v-icon class="text-h3 mr-2" color="blue darken-4">
            mdi-text-box-plus
          </v-icon>
          Create Question
        </h1>
      </v-row>
    </v-container>
    <QuestionForm
      :superLoading="superLoading"
      @setSuperLoading="setSuperLoading"
    />
  </div>
</template>

<script>
import QuestionForm from "@/components/Home/Create/Question/QuestionForm.vue";
export default {
  name: "CreateQuestion",
  metaInfo: {
    title: "Create Question",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Create Question Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  props: ["questionObj"],
  components: { QuestionForm },
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
    console.log(this.questionObj);
  },
};
</script>

<style>
.w-100 {
  width: 100%;
}
</style>