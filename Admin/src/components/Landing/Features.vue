<template>
  <div id="features">
    <v-container>
      <!-- Features headline -->
      <v-row>
        <v-col cols="12" sm="3">
          <h1 class="text-h3 font-weight-light">Features for everyone :</h1>
        </v-col>
      </v-row>
      <v-row class="mt-n6">
        <v-col cols="12" sm="4">
          <p class="mt-3">
            We offer an ever-growing list of features, for everyone involved:
            students, teachers and institutions.
          </p>
        </v-col>
      </v-row>

      <!-- Feature Cards Medium and Up -->
      <v-row class="hidden-sm-and-down">
        <!-- Institution Bathces -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-contacts mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Institution Bathces </v-card-title>

            <v-card-text>
              Create multiple batches with our "Institution Batches" feature,
              students can join a single batch or multiple batches, upcoming
              features will let you manage the batches you create.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Question Bank -->
        <v-col cols="12" sm="12" md="4" style="margin-top: -6em">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()"
                >mdi-cloud-question mdi-36px</v-icon
              >
            </v-card-subtitle>
            <v-card-title class="headline"> Question Bank </v-card-title>

            <v-card-text>
              Class Pariksha provides you a Question Bank with the ability to
              create folders to better manage your questions, and easily select
              questions while creating and deploying tests.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- User-friendly design -->
        <v-col cols="12" sm="12" md="4" style="margin-top: -12em">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()"
                >mdi-account-heart mdi-36px</v-icon
              >
            </v-card-subtitle>
            <v-card-title class="headline"> User-friendly design </v-card-title>

            <v-card-text>
              Our user interface on both ends, be it the student site or the
              admin site is super intuitive and up to date. We also provide a
              very rich text editor, to create any type of questions.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Gov. like exam interface -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()"
                >mdi-format-float-left mdi-36px</v-icon
              >
            </v-card-subtitle>
            <v-card-title class="headline">
              Gov. like exam interface
            </v-card-title>

            <v-card-text>
              Since Class Pariksha is created by students we have experience
              with using many different exam interfaces available online. We
              have created a user friendly design close to the government-like
              interface.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Test Analysis -->
        <v-col cols="12" sm="12" md="4" style="margin-top: -6em">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()"
                >mdi-format-list-checks mdi-36px</v-icon
              >
            </v-card-subtitle>
            <v-card-title class="headline"> Test Analysis </v-card-title>

            <v-card-text>
              Instant test analysis for both students and institutions, see
              important metrics such as the student's score, rank and even the
              answer sheet instantly as the student submits his test.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Test Management -->
        <v-col cols="12" sm="12" md="4" style="margin-top: -12em">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()"
                >mdi-folder-clock mdi-36px</v-icon
              >
            </v-card-subtitle>
            <v-card-title class="headline"> Test Management </v-card-title>

            <v-card-text>
              Our realtime test deployment system allows students to see the
              tests, as soon as they are deployed by the institution, the
              institution can edit the tests and make necessary changes anytime.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Feature Cards Small and down -->
      <v-row class="hidden-md-and-up">
        <!-- Institution Bathces -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-contacts mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Institution Bathces </v-card-title>

            <v-card-text>
              Create multiple batches with our "Institution Batches" feature,
              students can join a single batch or multiple batches, upcoming
              features will let you manage the batches you create.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Question Bank -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()"
                >mdi-cloud-question mdi-36px</v-icon
              >
            </v-card-subtitle>
            <v-card-title class="headline"> Question Bank </v-card-title>

            <v-card-text>
              Class Pariksha provides you a Question Bank with the ability to
              create folders to better manage your questions, and easily select
              questions while creating and deploying tests.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- User-friendly design -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()"
                >mdi-account-heart mdi-36px</v-icon
              >
            </v-card-subtitle>
            <v-card-title class="headline"> User-friendly design </v-card-title>

            <v-card-text>
              Our user interface on both ends, be it the student site or the
              admin site is super intuitive and up to date. We also provide a
              very rich text editor, to create any type of questions.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Gov. like exam interface -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()"
                >mdi-format-float-left mdi-36px</v-icon
              >
            </v-card-subtitle>
            <v-card-title class="headline">
              Gov. like exam interface
            </v-card-title>

            <v-card-text>
              Since Class Pariksha is created by students we have experience
              with using many different exam interfaces available online. We
              have created a user friendly design close to the government-like
              interface.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Test Analysis -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()"
                >mdi-format-list-checks mdi-36px</v-icon
              >
            </v-card-subtitle>
            <v-card-title class="headline"> Test Analysis </v-card-title>

            <v-card-text>
              Instant test analysis for both students and institutions, see
              important metrics such as the student's score, rank and even the
              answer sheet instantly as the student submits his test.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Test Management -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()"
                >mdi-folder-clock mdi-36px</v-icon
              >
            </v-card-subtitle>
            <v-card-title class="headline"> Test Management </v-card-title>

            <v-card-text>
              Our realtime test deployment system allows students to see the
              tests, as soon as they are deployed by the institution, the
              institution can edit the tests and make necessary changes anytime.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Features",
  data: () => ({
    colors: ["red", "orange", "blue", "teal", "pink", "purple", "green"],
  }),
  methods: {
    getRandomColor() {
      const colors = this.colors;
      const randomColor = Math.floor(Math.random() * colors.length);
      return colors[randomColor];
    },
  },
};
</script>