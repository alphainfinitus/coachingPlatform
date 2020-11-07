<template>
  <div id="home" class="fill-height d-flex grey lighten-3">
    <!-- if there is no subscription: add Institute form -->
    <v-container v-if="subLength < 1" class="align-self-center">
      <v-row class="mt-n12">
        <v-col cols="12" sm="12">
          Please enter the code provided by the institution:
        </v-col>

        <v-col cols="12" sm="12">
          <AddInstitutionForm
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- if there is subscription -->
    <v-container v-else class="align-self-start">
      <!-- Active Tests -->
      <v-row>
        <v-col cols="12" sm="12" class="pa-1 pa-md-3">
          <ActiveTestsCard
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
          />
        </v-col>
      </v-row>

      <!-- Subscribed Batches -->
      <v-row>
        <v-col cols="12" sm="12" class="pa-1 pa-md-3">
          <YourSubscriptionsCard
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AddInstitutionForm from "@/components/Home/Home/AddInstitutionForm.vue";
import ActiveTestsCard from "@/components/Home/Home/ActiveTestsCard.vue";
import YourSubscriptionsCard from "@/components/Home/Home/YourSubscriptionsCard.vue";

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
    ActiveTestsCard,
    YourSubscriptionsCard,
  },
  computed: {
    subLength() {
      if (
        Object.keys(this.$store.getters.userData).length === 0 &&
        this.$store.getters.userData.constructor === Object
      ) {
        return 0;
      }
      return this.$store.getters.userData.subscriptions.length;
    },
    userData() {
      return this.$store.getters.userData;
    },
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
    this.setSuperLoading(false);
  },
};
</script>