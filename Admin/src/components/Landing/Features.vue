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
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Institution Bathces </v-card-title>

            <v-card-text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Question Bank -->
        <v-col cols="12" sm="12" md="4" style="margin-top: -6em">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Question Bank </v-card-title>

            <v-card-text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Test Analysis -->
        <v-col cols="12" sm="12" md="4" style="margin-top: -6em">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Test Analysis </v-card-title>

            <v-card-text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Test Analysis -->
        <v-col cols="12" sm="12" md="4" style="margin-top: -12em">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Test Management </v-card-title>

            <v-card-text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
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
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Institution Bathces </v-card-title>

            <v-card-text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Question Bank -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Question Bank </v-card-title>

            <v-card-text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Test Analysis -->
        <v-col cols="12" sm="12" md="4">
          <v-card dark class="py-3 mx-md-3 px-3 pb-9">
            <v-card-subtitle>
              <v-icon :color="getRandomColor()">mdi-heart mdi-36px</v-icon>
            </v-card-subtitle>
            <v-card-title class="headline"> Test Management </v-card-title>

            <v-card-text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              dolores ipsa id dolore doloribus velit modi vero nemo reiciendis,
              lorem ipsum dolor sit amet consectetur adipisicing elit.
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