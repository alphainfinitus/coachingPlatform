<template>
  <div id="testimonials">
    <v-container>
      <!-- Features headline -->
      <v-row>
        <v-col cols="12" sm="12" class="mb-6">
          <h1 class="text-h4 font-weight-light">Testimonials :</h1>
        </v-col>
      </v-row>
      <v-row class="mt-n5">
        <v-col cols="12" sm="12">
          <!-- Testimonial carousel Medium and Up -->
          <v-carousel
            hide-delimiters
            show-arrows-on-hover
            cycle
            height="400"
            class="hidden-sm-and-down"
          >
            <v-carousel-item v-for="(slide, i) in slideData" :key="i">
              <v-row
                class="fill-height black--text"
                align="center"
                justify="space-around"
                no-gutters
              >
                <v-col
                  v-for="(testimonial, j) in slide"
                  :key="j"
                  cols="12"
                  sm="12"
                  md="3"
                >
                  <v-card
                    light
                    color="grey lighten-2"
                    class="ma-1 mx-md-2 pa-md-4 d-flex align-center"
                    height="310"
                    width="690"
                    outlined
                  >
                    <div>
                      <span class="text-right text-h5 d-flex align-center">
                        <v-icon class="mr-2"
                          >mdi-account-circle mdi-48px</v-icon
                        >
                        <span class="text-left">
                          {{ testimonial.name }}
                          <br />
                          <span class="text-subtitle-1 ml-1">
                            {{ testimonial.role }}
                          </span>
                          <br />
                          <span>
                            <v-icon
                              v-for="i in 5"
                              :key="i"
                              color="amber darken-3"
                            >
                              mdi-star
                            </v-icon>
                          </span>
                        </span>
                      </span>
                      <v-divider class="my-3"></v-divider>
                      <span class="pa-1 pa-md-2">
                        {{ testimonial.text }}
                      </span>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-carousel-item>
          </v-carousel>

          <!-- Testimonial carousel Small and Down -->
          <v-carousel
            hide-delimiters
            show-arrows-on-hover
            height="400"
            class="hidden-md-and-up"
            cycle
          >
            <div v-for="(slide, i) in slideData" :key="i">
              <v-carousel-item v-for="(testimonial, j) in slide" :key="j">
                <v-row
                  class="fill-height black--text"
                  align="center"
                  justify="center"
                  no-gutters
                >
                  <v-col cols="12" sm="12">
                    <v-card
                      light
                      color="grey lighten-2"
                      class="ma-1 mx-md-2 pa-3 pa-md-4 d-flex align-center"
                      height="350"
                      outlined
                    >
                      <div>
                        <span class="text-right text-h5 d-flex align-center">
                          <v-icon class="mr-2"
                            >mdi-account-circle mdi-36px</v-icon
                          >
                          <span class="text-left">
                            {{ testimonial.name }}
                            <br />
                            <span class="text-subtitle-1 ml-1">
                              {{ testimonial.role }}
                            </span>
                            <br />
                            <span>
                              <v-icon
                                v-for="i in 5"
                                :key="i"
                                color="amber darken-3"
                              >
                                mdi-star
                              </v-icon>
                            </span>
                          </span>
                        </span>
                        <v-divider class="my-3"></v-divider>
                        <span class="text-right pa-1 pa-md-2">
                          {{ testimonial.text }}
                        </span>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-carousel-item>
            </div>
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Testimonials",
  data: () => ({
    slideData: [
      [
        {
          name: "Student Name 1",
          role: "MBA Student",
          text:
            "In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope.",
          image: "svg/undraw_online_collaboration_7pfp.svg",
        },
        {
          name: "Student Name 2",
          role: "B.Tech Student",
          text:
            "In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope.",
          image: "svg/undraw_teacher_35j2.svg",
        },
        {
          name: "Teacher Name 3",
          role: "MBA Teacher",
          text:
            "In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope.",
          image: "svg/undraw_online_test_gba7.svg",
        },
      ],
      [
        {
          name: "Teacher Name 4",
          role: "Engineering Teacher",
          text:
            "In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope.",
          image: "svg/undraw_online_collaboration_7pfp.svg",
        },
        {
          name: "Student Name 5",
          role: "GATE Student",
          text:
            "In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope.",
          image: "svg/undraw_teacher_35j2.svg",
        },
        {
          name: "Coaching Owner 6",
          role: "Coahing MD",
          text:
            "In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope.",
          image: "svg/undraw_online_test_gba7.svg",
        },
      ],
    ],
  }),
};
</script>

<style>
</style>