<template>
  <div id="createTest" class="grey lighten-3 fill-height">
    <v-container>
      <v-row justify="center">
        <!-- title -->
        <h1 class="text-title">
          <v-icon class="text-h3 mr-2" color="blue darken-4">
            mdi-timetable
          </v-icon>
          Create Test
        </h1>
      </v-row>
    </v-container>
    <TestForm
      :superLoading="superLoading"
      @setSuperLoading="setSuperLoading"
      :testObj="testObj"
    />
  </div>
</template>

<script>
import TestForm from "@/components/Home/Create/Test/TestForm.vue";
export default {
  name: "CreateTest",
  metaInfo: {
    title: "Create Test",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Create Test Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    TestForm,
  },
  props: ["testObj"],
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