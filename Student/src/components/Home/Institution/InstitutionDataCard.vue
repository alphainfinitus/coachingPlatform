<template>
  <v-card id="institutionDataCard" dark class="pa-1 py-4">
    <div :class="{ bg: !$vuetify.breakpoint.xsOnly }">
      <div class="d-flex justify-space-around">
        <v-avatar :size="$vuetify.breakpoint.xsOnly ? '64' : '100'">
          <img alt="user" :src="institutionData.photoURL" />
        </v-avatar>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div>
        <v-card-title class="white--text mt-n2 mt-md-n1">
          <p class="ml-3 mt-4 text-h5 text-md-h3">
            {{ institutionData.fullName }}
          </p>
        </v-card-title>
        <v-card-subtitle>
          <p class="ml-3 text-caption">
            <b>Institution Code: </b>
            {{ institutionData.username }}
          </p>
        </v-card-subtitle>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "InstitutionDataCard",
  props: ["superLoading", "institutionData"],
  data: () => ({
    loading: true,
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
  },
  mounted() {
    // turn off loading
    this.setLoading(false);
  },
};
</script>

<style>
#institutionDataCard .bg {
  background-image: url("../../../assets/svg/undraw_Meeting_re_i53h.svg");
  background-size: contain;
  height: 30vh;
  background-position: 46vw bottom;
}
</style>