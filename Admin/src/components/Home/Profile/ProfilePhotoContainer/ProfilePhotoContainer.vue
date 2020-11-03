<template>
  <v-container id="profilePhotoContainer" fluid>
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>

    <v-row justify="center">
      <!-- Display Profile Photo or icon -->
      <v-col cols="12" sm="12" class="d-flex justify-center">
        <v-avatar width="150" height="150" v-if="userData.photoURL">
          <v-img class="d-block mx-auto" :src="userData.photoURL" />
        </v-avatar>
        <v-icon v-else size="120">mdi-account-circle</v-icon>
      </v-col>

      <v-col cols="12" sm="12" class="d-flex justify-center">
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on }">
            <v-btn
              :disabled="loading || superLoading"
              color="indigo"
              v-on="on"
              outlined
              >Change profile photo</v-btn
            >
          </template>
          <v-row justify="center">
            <UploadForm
              :uid="userData.uid"
              @success="showMessage(true)"
              @failed="showMessage(false)"
            />
          </v-row>
        </v-dialog>
      </v-col>

      <v-col cols="12" sm="12" class="d-flex justify-center headline">
        <v-btn
          target="_blank"
          :href="
            'https://student.platform.com/institution/' + userData.username
          "
        >
          <v-icon class="mr-2">mdi-earth-arrow-right</v-icon>
          {{ userData.fullName }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UploadForm from "@/components/Home/Profile/ProfilePhotoContainer/UploadForm.vue";

export default {
  name: "ProfilePhotoContainer",
  props: ["superLoading"],
  components: {
    UploadForm,
  },
  computed: {
    userData() {
      return this.$store.getters.userData;
    },
  },
  data: () => ({
    loading: false,
    dialog: false,
    showSnackbar: false,
    snackbarText: "",
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    showMessage(value) {
      if (value) {
        this.snackbarText = "Profile photo updated successfully :)";
      } else {
        this.snackbarText = "Error in uploading photo, please try again :(";
      }
      this.dialog = false;
      this.showSnackbar = true;
    },
  },
};
</script>


