<template>
  <v-form
    id="addInstitutionForm"
    v-model="valid"
    @submit.prevent="submit"
    ref="addInstitutionForm"
  >
    <v-alert class="mb-7" type="error" v-if="error">{{ error }}</v-alert>

    <div class="d-md-flex align-center">
      <v-text-field
        color="deep-purple accent-4"
        v-model="institutionCode"
        type="text"
        :rules="institutionCodeRules"
        :loading="loading || superLoading"
        :disabled="loading || superLoading"
        class="text-h4"
        required
      >
        <template v-slot:label>
          <span class="text-h4"> institution-code </span>
        </template>
      </v-text-field>

      <v-btn
        class="float-right white--text ml-3"
        color="deep-purple accent-4"
        :disabled="loading || superLoading || !valid"
        raised
        large
        depressed
        @click="submit"
        >Go</v-btn
      >
    </div>
  </v-form>
</template>

<script>
export default {
  name: "AddInstitutionForm",
  props: ["superLoading"],
  computed: {
    lowerCaseUserName() {
      return this.institutionCode.toLowerCase();
    },
  },
  data: () => ({
    loading: false,
    valid: false,
    error: "",
    institutionCode: "",
    institutionCodeRules: [
      (value) => !!value || "Required.",
      (value) => value.length >= 3 || "Minimum 3 charachters required.",
      (value) =>
        /^[a-zA-Z0-9-]+$/.test(value) ||
        "No spaces or special characters(@, $, % etc) allowed except for hyphen (-)",
    ],
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    submit() {
      this.setLoading(true);
      this.error = "";
      if (!this.$refs.addInstitutionForm.validate()) {
        return;
      }

      const payload = this.lowerCaseUserName;

      this.$store
        .dispatch("checkUsernameExists", payload)
        .then((exists) => {
          if (exists) {
            // GOTO INSTITUTION PAGE
            this.$router.push({
              name: "Institution",
              params: { institutionCode: payload },
            });
          } else {
            this.error = "Invalid code, please try with a diffrent code :(";
            this.setLoading(false);
          }
        })
        .catch(() => {
          console.log("Error");
          this.setLoading(false);
        });
    },
  },
};
</script>

<style>
#addInstitutionForm .v-label {
  height: 50vh;
}

#addInstitutionForm input {
  margin-top: 0.7em;
  margin-bottom: 0.35em;
  padding-bottom: 0.39em;
}
</style>