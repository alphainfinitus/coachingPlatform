<template>
  <div id="results" class="grey lighten-3 fill-height">
    <v-container>
      <!-- title -->
      <v-row justify="center">
        <h1 class="text-title">
          <v-icon class="text-h3 mr-2" color="green darken-1">
            mdi-table-star
          </v-icon>
          Results
        </h1>
      </v-row>

      <!-- Add Batches -->
      <v-row justify="center" class="my-4">
        <span class="text-h6">Tests List Here</span>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Results",
  metaInfo: {
    title: "Results",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Results Page description lorem ipsum dolor sit amet.",
      },
    ],
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