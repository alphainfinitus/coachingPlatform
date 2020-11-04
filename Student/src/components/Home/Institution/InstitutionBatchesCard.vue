<template>
  <div id="#institutionBatchesCard">
    <!-- Snackbar to show success -->
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>

    <!-- Join Batch Confirmation Dialog (payment gateway here) -->
    <v-dialog v-model="dialog" max-width="390" persistent>
      <v-card v-if="selectedBatch" :loading="loading || superLoading">
        <v-card-title class="headline"> Join batch confirmation </v-card-title>

        <v-card-text>
          Are you sure you want to join the
          <b class="text-capitalize">"{{ selectedBatch.name }}"</b> batch at
          <b class="text-capitalize">"{{ institutionData.fullName }}"</b> ?
          <br /><br />
          Please click "CONFIRM" to continue
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            :disabled="loading || superLoading"
            color="green darken-1"
            dark
            @click="joinBatch()"
          >
            Confirm
          </v-btn>

          <v-btn
            :disabled="loading || superLoading"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Batches Card -->
    <v-card
      id="institutionBatchesCard"
      elevation="0"
      color="grey lighten-2"
      light
      class="pa-1 py-4"
      :loading="loading || superLoading"
    >
      <v-card-title>
        <v-icon>mdi-chevron-right</v-icon> Batches offered:</v-card-title
      >
      <v-alert v-if="error" type="error" class="mx-2">{{ error }}</v-alert>
      <v-container fluid class="mt-n8 mt-md-n6">
        <v-row justify="center">
          <v-col cols="12" sm="12" md="8">
            <v-list color="transparent">
              <template v-for="batch in batches">
                <v-list-item two-line :key="batch.name">
                  <v-list-item-content>
                    <v-list-item-title class="text-capitalize">
                      {{ batch.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ batch.fee != 0 ? `Rs. ${batch.fee}/month` : "Free" }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      v-if="!isBatchJoined(batch.name)"
                      :disabled="loading || superLoading"
                      color="success"
                      @click="joinBatchDialog(batch)"
                      :small="$vuetify.breakpoint.xsOnly"
                      >Join Batch</v-btn
                    >
                    <v-btn
                      v-else
                      disabled
                      color="success"
                      :small="$vuetify.breakpoint.xsOnly"
                      >Joined</v-btn
                    >
                  </v-list-item-action>
                </v-list-item>
                <v-divider :key="`divider_${batch.name}`"></v-divider>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "InstitutionBatchesCard",
  props: ["superLoading", "institutionData"],
  computed: {
    userData() {
      return this.$store.getters.userData;
    },
  },
  data: () => ({
    loading: true,
    error: "",
    showSnackbar: false,
    snackbarText: "",
    dialog: false,
    batches: {},
    selectedBatch: null,
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    fetchInstitutionBatches() {
      this.setLoading(true);
      this.error = "";
      this.$store
        .dispatch("fetchInstitutionBatches", this.institutionData.uid)
        .then((res) => {
          this.batches = res.batches;
        })
        .catch(() => {
          this.error =
            "Error in fetching institution data, please try again :(";
        })
        .finally(() => {
          this.setLoading(false);
        });
    },
    joinBatchDialog(batch) {
      this.selectedBatch = batch;
      this.dialog = true;
    },
    joinBatch() {
      this.setLoading(true);
      this.error = "";

      // create sub entry name
      const subscriptionEntry = `${this.institutionData.uid}_${this.selectedBatch.name}`;

      //add to subs array
      var subscriptions = this.userData.subscriptions;
      subscriptions.push(subscriptionEntry);

      // create current date and reset to midnight
      var addedOn = new Date();
      addedOn.setHours(0, 0, 0, 0);

      //create sub data object and add to subs data obj
      var subscriptionsData = this.userData.subscriptionsData;
      subscriptionsData[subscriptionEntry] = {
        institutionUID: this.institutionData.uid,
        institutionName: this.institutionData.fullName,
        batchName: this.selectedBatch.name,
        batchFee: this.selectedBatch.fee,
        addedOn,
      };

      const payload = {
        subscriptions,
        subscriptionsData,
      };

      this.$store
        .dispatch("joinBatch", payload)
        .then(() => {
          this.snackbarText = "Batch joined successfully 🎉";
          this.$router.push("/home");
        })
        .catch(() => {
          this.error = "Error in joining batch, please try again :(";
          this.snackbarText = "Error in joining batch :(";
        })
        .finally(() => {
          this.showSnackbar = true;
          this.dialog = false;
          this.setLoading(false);
        });
    },
    isBatchJoined(batchName) {
      const subscriptionEntry = `${this.institutionData.uid}_${batchName}`;
      return this.userData.subscriptions.includes(subscriptionEntry);
    },
  },
  mounted() {
    this.fetchInstitutionBatches();
  },
};
</script>