<template>
  <div id="batches" class="grey lighten-3 fill-height">
    <v-container>
      <!-- title -->
      <v-row justify="center">
        <h1 class="text-title">
          <v-icon class="text-h3 mr-2" color="pink darken-1">
            mdi-account-group
          </v-icon>
          Batches
        </h1>
      </v-row>

      <!-- Add Batches -->
      <v-row justify="center" class="my-4">
        <BatchesCard
          :superLoading="superLoading"
          @setSuperLoading="setSuperLoading"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BatchesCard from "@/components/Home/Manage/Batches/BatchesCard.vue";

export default {
  name: "Batches",
  metaInfo: {
    title: "Batches",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Batches Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    BatchesCard,
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