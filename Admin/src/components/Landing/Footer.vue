<template>
  <div id="footer">
    <v-footer color="grey lighten-3">
      <v-container>
        <!-- Features headline -->
        <v-row justify="space-between">
          <v-col cols="12" sm="12" md="4">
            <h1 class="text-h5">About Us:</h1>
            <p class="text-body-1 mt-4">
              <b>Made by students and teachers together</b>, at Class Pariksha,
              we have a dream of empowering every educator in the country to
              build their online coaching and simplify their lives so that they
              can focus only on teaching. We are on a mission to reshape the
              process of conducting exams by a providing the user a friendly
              interface, hustle free and smooth experience.
            </p>
          </v-col>
          <v-col sm="12" md="4">
            <a
              href="http://facebook.com/classpariksha"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-list-item two-line>
                <v-list-item-icon>
                  <v-icon>mdi-thumb-up</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Follow us on Facebook</v-list-item-title>
                  <v-list-item-subtitle>
                    facebook.com/classpariksha
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </a>

            <a
              href="http://twitter.com/classpariksha"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-list-item two-line>
                <v-list-item-icon>
                  <v-icon>mdi-twitter-retweet</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    >Engage with us on Twitter</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    twitter.com/classpariksha
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </a>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-col class="text-center d-flex align-center justify-center" cols="12">
          ClassPariksha -
          {{ new Date().getFullYear() }}
          <v-icon class="ml-1">mdi-copyright</v-icon>
        </v-col>
      </v-container>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data: () => ({}),
};
</script>
