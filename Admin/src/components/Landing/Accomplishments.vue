<template>
  <div id="accomplishments">
    <!-- Overlay Gradient sheet -->
    <v-sheet id="sheet" class="fill-height d-flex align-center justify-center">
      <v-container>
        <!-- Accomplishments row -->
        <v-row>
          <v-col cols="12" sm="12" md="3">
            <v-list-item three-line>
              <v-list-item-icon tile size="80" color="grey">
                <v-icon class="white--text">mdi-charity mdi-48px</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="white--text">
                <v-list-item-title class="text-h4 mb-1">
                  Made By
                </v-list-item-title>
                <v-list-item-subtitle class="white--text text-subtitle-1">
                  Students and Teachers
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="3">
            <v-list-item three-line>
              <v-list-item-icon tile size="80" color="grey">
                <v-icon class="white--text">mdi-map-marker mdi-48px</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="white--text">
                <v-list-item-subtitle class="white--text text-subtitle-1">
                  Made in
                </v-list-item-subtitle>
                <v-list-item-title class="text-h4 mb-1">
                  India
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="3">
            <v-list-item three-line>
              <v-list-item-icon tile size="80" color="grey">
                <v-icon class="white--text">mdi-account-group mdi-48px</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="white--text">
                <v-list-item-title class="text-h4 mb-1">
                  500+
                </v-list-item-title>
                <v-list-item-subtitle class="white--text text-subtitle-1">
                  Students Enrolled
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="3">
            <v-list-item three-line>
              <v-list-item-icon tile size="80" color="grey">
                <v-icon class="white--text">mdi-domain mdi-48px</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="white--text">
                <v-list-item-title class="text-h4 mb-1">
                  100+
                </v-list-item-title>
                <v-list-item-subtitle class="white--text text-subtitle-1">
                  Institutions Enrolled
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: "Accomplishments",
  data: () => ({}),
};
</script>

<style>
#accomplishments #sheet {
  background: rgba(0, 0, 0, 0.7); /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    rgba(73, 166, 241, 0.6),
    rgba(177, 16, 169, 0.6)
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    rgba(73, 166, 241, 0.6),
    rgba(177, 16, 169, 0.6)
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>