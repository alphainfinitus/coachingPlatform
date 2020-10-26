<template>
  <div id="batchesCard" class="w-100">
    <v-snackbar color="success" v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>

    <v-card :loading="loading || superLoading" class="w-100 pb-4 px-4">
      <!-- Title -->
      <h6 class="text-h6 pt-4">
        <v-icon class="mr-1">mdi-chevron-right</v-icon> Edit Batches:
      </h6>

      <v-form
        class="mt-3"
        v-model="valid"
        @submit.prevent="addBatch"
        ref="batchForm"
      >
        <v-container>
          <v-row align="center" no-gutters v-if="error">
            <v-col cols="12">
              <v-alert type="error">{{ error }}</v-alert>
            </v-col>
          </v-row>
          <v-row align="center" no-gutters>
            <v-col cols="12" sm="10" class="d-md-flex mx-auto">
              <v-text-field
                color="deep-purple accent-4"
                v-model="batchName"
                type="text"
                :rules="batchNameRules"
                label="Batch Name"
                placeholder="Class 9 P-C-M"
                class="mx-1"
                :disabled="loading || superLoading"
                outlined
                dense
                required
              ></v-text-field>
              <v-text-field
                color="deep-purple accent-4"
                prefix="Rs."
                v-model="batchFee"
                type="text"
                :rules="batchFeeRules"
                label="Subscription Fee/Month"
                class="mx-1"
                :disabled="loading || superLoading"
                outlined
                dense
                required
              ></v-text-field>

              <v-btn
                color="pink darken-2 white--text"
                class="float-right"
                :disabled="loading || superLoading || !valid"
                raised
                @click="addBatch"
              >
                <v-icon class="mr-2">mdi-folder-plus</v-icon>Add
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <v-container>
        <v-row align="center" v-for="batch in batches" :key="batch.name">
          <v-col
            cols="12"
            sm="8"
            class="d-flex align-center justify-space-between mx-auto"
          >
            <div>
              <span>
                <v-chip class="ma-2 text-capitalize" label>
                  {{ batch.name }}
                </v-chip>
                at
                <v-chip class="ma-2" label>
                  <v-icon left> mdi-tag-text mdi-18px </v-icon> Rs.
                  {{ batch.fee }}
                </v-chip>
              </span>
            </div>
            <v-btn
              icon
              color="red"
              text
              @click="deleteBatch(batch.name)"
              :disabled="loading"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row align="center" justify="end" class="mt-2">
          <v-col cols="12" sm="6" class="d-flex justify-end mr-3">
            <v-btn color="primary" @click="submitBatches">
              <v-icon class="mr-1">mdi-content-save</v-icon> Save
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "BatchesCard",
  props: ["superLoading"],
  data: () => ({
    loading: true,
    snackbar: false,
    snackbarText: "",
    error: "",
    valid: false,
    batchName: "",
    batchFee: 0,
    batchNameRules: [
      (value) => !!value || "Required.",
      (value) =>
        value.length > 2 || "Field length should be greater than 2 characters",
    ],
    batchFeeRules: [
      (value) => !!value || "Required.",
      (value) => value.length > 0 || "Please provide a valid number",
      (value) => /^[0-9]{0,9}$/.test(value) || "Please provide a valid number",
    ],
    batches: {},
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },

    addBatch() {
      this.error = "";
      if (this.batchName.toLowerCase() in this.batches) {
        this.error = "This batch already exists :(";
        return;
      }

      const batchObj = {
        name: this.batchName.toLowerCase(),
        fee: +this.batchFee,
      };

      this.$set(this.batches, this.batchName.toLowerCase(), batchObj);

      this.batchName = "";
      this.batchFee = 0;
    },

    deleteBatch(batchName) {
      this.$delete(this.batches, batchName);
    },

    submitBatches() {
      this.setLoading(true);

      const payload = {
        batches: this.batches,
      };

      //save foldersName to server
      this.$store
        .dispatch("saveBatches", payload)
        .then(() => {
          this.snackbarText = "Batches updated successfully :)";
        })
        .catch(() => {
          this.error = "Network error, please try again.";
          this.snackbarText = "Network error, please try again :(";
        })
        .finally(() => {
          this.snackbar = true;
          this.setLoading(false);
          this.dialog = false;
        });
    },

    fetchBatches() {
      // get batches from store
      const batches = this.$store.getters.batches;
      console.log("batches", batches);

      //if not found in store
      if (Object.keys(batches).length === 0 && batches.constructor === Object) {
        //get folder names from server
        this.$store
          .dispatch("getBatches")
          .then((res) => {
            if (res) {
              this.batches = res;
            }
          })
          .catch(() => {
            this.error = "Network error in fetching batches, please try again.";
          })
          .finally(() => {
            this.setLoading(false);
          });
      } else {
        // if found in store
        this.batches = batches.batches;
        this.setLoading(false);
      }
    },
  },
  mounted() {
    this.fetchBatches();
  },
};
</script>
