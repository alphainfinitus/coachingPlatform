<template>
  <v-row id="contentRow">
    <!-- Heading Column -->
    <v-col cols="12" sm="12">
      <span class="mx-4 px-2 text-h5 white">
        <v-icon :color="content.colors[0]" class="mr-1">
          {{ content.icon }}
        </v-icon>
        {{ content.title }}
      </span>
      <v-divider class="mt-n4"></v-divider>
    </v-col>

    <!-- Cards Cotainer -->
    <v-container class="mt-1 mt-md-4">
      <v-row justify="start">
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="(option, i) in content.options"
          :key="i"
        >
          <v-card
            :to="option.to"
            :color="content.colors[1]"
            class="mx-auto pt-4"
            max-width="310"
          >
            <v-img
              height="180px"
              :src="require(`../../../assets/svg/home/${option.image}`)"
              contain
            ></v-img>
            <div :class="'mt-3 px-1 white--text ' + content.colors[2]">
              <v-card-title> {{ option.title }} </v-card-title>
              <v-card-subtitle class="white--text">
                {{ option.subTitle }}
              </v-card-subtitle>
            </div>
          </v-card>
        </v-col>

        <!-- Coming Soon Card -->
        <v-col cols="12" sm="6" md="4">
          <v-card
            :color="content.colors[1]"
            class="mx-auto pt-4"
            max-width="310"
          >
            <v-img
              height="180px"
              src="@/assets/svg/home/undraw_loading_frh4.svg"
              contain
            ></v-img>
            <div :class="'mt-3 px-1 white--text ' + content.colors[2]">
              <v-card-title> Coming Soon </v-card-title>
              <v-card-subtitle class="white--text">
                Stay tuned for more features :)
              </v-card-subtitle>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>

<script>
export default {
  name: "ContentRow",
  props: ["content"],
};
</script>
