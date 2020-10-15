<template>
  <div
    id="hero_header"
    style="min-height: 93.5vh; width: 100vw"
    class="d-flex justify-center align-center"
  >
    <!-- Overlay Gradient sheet -->
    <v-sheet
      id="sheet"
      class="d-flex align-center"
      style="min-height: 93.5vh; width: 100vw"
    >
      <v-carousel cycle hide-delimiters show-arrows-on-hover>
        <!-- Slides -->
        <v-carousel-item v-for="(slide, i) in slideData" :key="i">
          <v-row class="fill-height" align="center" justify="center" no-gutters>
            <v-col cols="12" sm="12" md="7" class="pa-1 pa-md-12">
              <h1 class="text-h2 montserrat-font text-right">
                {{ slide.heading }}
              </h1>
              <br />
              <h3
                class="text-subtitle-1 montserrat-font text-right pa-1 pa-md-2"
              >
                {{ slide.text }}
              </h3>
              <v-btn class="float-right my-3" to="/register">Get Started</v-btn>
            </v-col>

            <v-col sm="12" md="5" class="px-12">
              <v-img
                class="mx-auto hidden-sm-and-downs"
                style="max-height: 50vh"
                :src="require(`../../assets/${slide.image}`)"
                contain
              ></v-img>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-sheet>
  </div>
</template>

<script>
import * as THREE from "three";
import Vanta from "vanta/dist/vanta.birds.min";

export default {
  name: "HeroHeader",
  data: () => ({
    slideData: [
      {
        heading: "Teach and study online with us",
        text:
          "In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope.",
        image: "svg/undraw_online_collaboration_7pfp.svg",
      },
      {
        heading: "Ease of teaching test 2",
        text:
          "In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope.",
        image: "svg/undraw_teacher_35j2.svg",
      },
      {
        heading: "Online test 3",
        text:
          "In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope.",
        image: "svg/undraw_online_test_gba7.svg",
      },
      {
        heading: "Instant test analysis 4",
        text:
          "In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope known as the Hubble.",
        image: "svg/undraw_instat_analysis_ajld.svg",
      },
    ],
  }),
  mounted() {
    const heroContainer = document.getElementById("hero_header");
    this.vantaEffect = Vanta({
      el: "#hero_header",
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: heroContainer.clientHeight,
      minWidth: heroContainer.clientWidth,
      scale: 1.0,
      scaleMobile: 1.0,
      backgroundColor: 0x4a96f2,
      color1: 0xf739cc,
      color2: 0xffffff,
      separation: 60.0,
      quantity: 4.0,
    });
  },
};
</script>

<style>
#hero_header > #sheet {
  background: rgba(0, 0, 0, 0.6); /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    rgba(168, 192, 255, 0.7),
    rgba(63, 43, 150, 0.7)
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    rgba(168, 192, 255, 0.7),
    rgba(63, 43, 150, 0.7)
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>