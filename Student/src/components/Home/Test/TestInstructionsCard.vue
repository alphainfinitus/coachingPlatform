<template>
  <div id="testInstructionsCard">
    <v-card :loading="loading || superLoading" class="pb-2 px-1 px-md-12">
      <v-card-subtitle> Test Instructions: </v-card-subtitle>
      <v-divider></v-divider>
      <v-container>
        <v-row align="center">
          <v-col cols="12" sm="12">
            <span v-html="test.testInstructions"></span>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions class="d-flex justify-center">
        <v-btn @click="startTest" :disabled="loading || superLoading" outlined
          >Start Test</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TestInstructionsCard",
  props: ["superLoading", "test"],
  data: () => ({
    loading: false,
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    startTest() {
      this.$emit("startTest");
    },
  },
};
</script>