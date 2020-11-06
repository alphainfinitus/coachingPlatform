<template>
  <div id="yourSubscriptionsCard">
    <v-card :loading="loading || superLoading" elevation="0" tile>
      <v-card-title> Your Subscriptions : </v-card-title>
      <v-card-subtitle>
        {{ userData.subscriptions.length }} active subscriptions
      </v-card-subtitle>
      <v-container class="mt-n2">
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="6"
            v-for="(subDataObj, propName) in userData.subscriptionsData"
            :key="propName"
          >
            <v-card class="pa-0 pa-md-3" color="grey darken-2" dark>
              <v-card-title class="text-subtitle-1 text-capitalize">
                {{ subDataObj.batchName }}
              </v-card-title>
              <v-card-subtitle>
                {{ subDataObj.institutionName }}
              </v-card-subtitle>
              <v-card-text>
                <span class="d-flex align-center">
                  <v-icon>mdi-calendar mdi-18px</v-icon>
                  <b class="mx-1">Joined on :</b>
                  {{ startDateText(subDataObj.addedOn.seconds * 1000) }}
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
const moment = require("moment");

export default {
  name: "YourSubscriptionsCard",
  props: ["superLoading"],
  computed: {
    userData() {
      return this.$store.getters.userData;
    },
  },
  data: () => ({
    loading: false,
    error: "",
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    startDateText(timestamp) {
      return moment(timestamp).format("MMMM Do, YYYY");
    },
  },
};
</script>