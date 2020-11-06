<template>
  <div id="test">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="12">
          <h1 class="text-h1">Test Page ;)</h1>
          <span class="text-subtitle-1">
            {{ test.testName }}
          </span>
        </v-col>
      </v-row>
    </v-container>
    <!-- <v-container v-else>
      <v-row justify="center">
        <v-col cols="12" sm="12">
          <v-alert v-if="error" type="error">{{ error }}</v-alert>
        </v-col>
      </v-row>
    </v-container> -->
  </div>
</template>

<script>
export default {
  name: "Test",
  props: ["test"],
  metaInfo: {
    title: "Test",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Test Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  data: () => ({
    superLoading: true,
    error: "",
  }),
  methods: {
    setSuperLoading(value) {
      this.superLoading = value;
    },
  },
};
</script>
