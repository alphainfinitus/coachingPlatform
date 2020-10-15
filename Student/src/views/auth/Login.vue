<template>
  <v-container
    fluid
    id="login"
    fill-height
    class="d-flex justify-center grey lighten-2"
  >
    <v-row>
      <v-col>
        <LoginCard
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
import LoginCard from "@/components/Auth/Login/LoginCard.vue";
import SocialLoginCard from "@/components/Auth/Login/SocialLoginCard.vue";

export default {
  name: "Login",
  metaInfo: {
    title: "Login",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Student Login Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    LoginCard,
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
