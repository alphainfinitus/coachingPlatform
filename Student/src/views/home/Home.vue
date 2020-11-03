<template>
  <div id="home" class="fill-height d-flex">
    <!-- if there is no subscription -->
    <v-container
      v-if="userData.subscriptions.length < 1"
      class="align-self-center"
    >
      <v-row class="mt-n12">
        <v-col cols="12" sm="12">
          Please enter the code provided by the institution:
        </v-col>

        <v-col cols="12" sm="12">
          <AddInstitutionForm />
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else>
      <h1 class="text-h3">
        You have joined {{ userData.subscriptions.length }} batch(es)
      </h1>
    </v-container>
  </div>
</template>

<script>
import AddInstitutionForm from "@/components/Home/Home/AddInstitutionForm.vue";

export default {
  name: "Home",
  metaInfo: {
    title: "Student Home",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Student Home Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    AddInstitutionForm,
  },
  data: () => ({
    loading: true,
    userData: {},
  }),
  created() {
    this.userData = this.$store.getters.userData;
  },
  mounted() {
    this.loading = false;
  },
};
</script>
