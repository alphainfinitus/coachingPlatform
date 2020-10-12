<template>
  <v-container
    fluid
    id="register"
    fill-height
    class="d-flex justify-center grey lighten-2"
  >
    <v-row>
      <v-col>
        <RegisterCard
          :superLoading="superLoading"
          @setSuperLoading="setSuperLoading"
        />
        <div class="my-4"></div>
        <SocialLoginCard
          :superLoading="superLoading"
          @setSuperLoading="setSuperLoading"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RegisterCard from "@/components/Auth/Register/RegisterCard.vue";
import SocialLoginCard from "@/components/Auth/Login/SocialLoginCard.vue";

export default {
  name: "Register",
  metaInfo: {
    title: "Register",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Register Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    RegisterCard,
    SocialLoginCard,
  },
  data: () => ({
    superLoading: true,
  }),
  methods: {
    setSuperLoading(value) {
      this.superLoading = value;
    },
  },
  mounted() {
    this.superLoading = false;
  },
};
</script>
