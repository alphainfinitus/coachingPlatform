<template>
  <div id="editTests" class="grey lighten-3 fill-height">
    <v-container>
      <v-row justify="center">
        <!-- title -->
        <h1 class="text-title">
          <v-icon class="text-h3 mr-2" color="pink darken-1">
            mdi-table-edit
          </v-icon>
          Edit Tests
        </h1>
      </v-row>

      <v-row justify="center" class="mt-4">
        <TestsCard
          :superLoading="superLoading"
          @setSuperLoading="setSuperLoading"
          :enableSelect="false"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TestsCard from "@/components/Home/Manage/EditTests/TestsCard.vue";

export default {
  name: "EditTests",
  metaInfo: {
    title: "Edit Tests",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Edit Tests Page description lorem ipsum dolor sit amet.",
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