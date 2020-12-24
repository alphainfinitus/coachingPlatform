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
        <!-- Join Multiple Institutions -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline">
              Join Multiple Institutions
            </v-card-title>

            <v-card-text>
              Our platform allows you to join multiple batches, be it from the
              same or from multiple institutions. So that you can enroll with as
              many institutions you like to learn better.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Clear Batch Pricing -->
        <v-col cols="12" sm="12" md="4" style="margin-top: -6em">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Clear Batch Pricing </v-card-title>

            <v-card-text>
              Pay your fee online, through our payment portal. Same price
              provided for every student by your teachers or institutions. No
              hidden charges, what you see is what you pay.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- User-friendly design -->
        <v-col cols="12" sm="12" md="4" style="margin-top: -12em">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> User-friendly design </v-card-title>

            <v-card-text>
              Our entire platform is intuitive and simple, easy to operate, and
              mobile friendly. Hustle free exams and features like auto exam
              submission feature to avoid failure in submission due to network
              issues etc.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Gov. like exam interface -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline">
              Gov. like exam interface
            </v-card-title>

            <v-card-text>
              No more exam fright or worry for exam patterns. Class pariksha is
              primarily based on a government like exam interface, following
              common norms providing you best practice sets and guidance.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Test Solutions -->
        <v-col cols="12" sm="12" md="4" style="margin-top: -6em">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Test Solutions </v-card-title>

            <v-card-text>
              Get real time solutions right after submitting the test. Proper
              answers provided by your institution to the be it subjective or
              objective. Clear all your queries and doubts.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Test Analysis -->
        <v-col cols="12" sm="12" md="4" style="margin-top: -12em">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Test Analysis </v-card-title>

            <v-card-text>
              Know your weaknesses, strengths and everything else that you need
              to know to improve your overall score and rank. Get real time
              ranking and gain the experience of a real exam.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Feature Cards Small and down -->
      <v-row class="hidden-md-and-up">
        <!-- Join Multiple Institutions -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline">
              Join Multiple Institutions
            </v-card-title>

            <v-card-text>
              Our platform allows you to join multiple batches, be it from the
              same or from multiple institutions. So that you can enroll with as
              many institutions you like to learn better.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Clear Batch Pricing -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Clear Batch Pricing </v-card-title>

            <v-card-text>
              Pay your fee online, through our payment portal. Same price
              provided for every student by your teachers or institutions. No
              hidden charges, what you see is what you pay.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- User-friendly design -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> User-friendly design </v-card-title>

            <v-card-text>
              Our entire platform is intuitive and simple, easy to operate, and
              mobile friendly. Hustle free exams and features like auto exam
              submission feature to avoid failure in submission due to network
              issues etc.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Gov. like exam interface -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline">
              Gov. like exam interface
            </v-card-title>

            <v-card-text>
              No more exam fright or worry for exam patterns. Class pariksha is
              primarily based on a government like exam interface, following
              common norms providing you best practice sets and guidance.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Test Solutions -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Test Solutions </v-card-title>

            <v-card-text>
              Get real time solutions right after submitting the test. Proper
              answers provided by your institution to the be it subjective or
              objective. Clear all your queries and doubts.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Test Analysis -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Test Analysis </v-card-title>

            <v-card-text>
              Know your weaknesses, strengths and everything else that you need
              to know to improve your overall score and rank. Get real time
              ranking and gain the experience of a real exam.
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