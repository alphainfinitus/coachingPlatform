<template>
  <div id="institution">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="12">
          <InstitutionDataCard
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
            :institutionData="institutionData"
          />
        </v-col>

        <!-- Render only after the institution data is fetched -->
        <v-col v-if="institutionData.uid" cols="12" sm="12">
          <InstitutionBatchesCard
            :superLoading="superLoading"
            @setSuperLoading="setSuperLoading"
            :institutionData="institutionData"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import InstitutionDataCard from "@/components/Home/Institution/InstitutionDataCard.vue";
import InstitutionBatchesCard from "@/components/Home/Institution/InstitutionBatchesCard.vue";

export default {
  name: "Institution",
  props: ["institutionCode"],
  metaInfo: {
    title: "Join Institution",
    meta: [
      {
        vmid: "description",
        name: "description",
        content:
          "Join Institution Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    InstitutionDataCard,
    InstitutionBatchesCard,
  },

  data: () => ({
    superLoading: true,
    error: "",
    institutionData: {},
  }),
  methods: {
    setSuperLoading(value) {
      this.superLoading = value;
    },
    fetchInstitutionData() {
      this.setSuperLoading(true);
      this.error = "";

      this.$store
        .dispatch("fetchInstitutionByUsername", this.institutionCode)
        .then((res) => {
          this.institutionData = res;
        })
        .catch(() => {
          this.error =
            "Error in fetching institution data, please try again :(";
        })
        .finally(() => {
          this.setSuperLoading(false);
        });
    },
  },
  created() {
    if (this.institutionCode) {
      this.fetchInstitutionData();
    }
    // else it'll go to 404
  },
};
</script>
