<template>
  <div class="landing">
    <HeroHeader />
    <div class="my-6 my-md-12"></div>
    <Features />
    <div class="my-6 my-md-12 py-1"></div>
    <Accomplishments />
    <div class="my-6 my-md-12"></div>
    <Testimonials />
    <div class="my-6 my-md-12 py-md-2"></div>
    <ContactUs />
    <div class="my-6 my-md-12 py-md-6"></div>
    <Footer />
  </div>
</template>

<script>
import HeroHeader from "@/components/Landing/HeroHeader.vue";
import Features from "@/components/Landing/Features.vue";
import Accomplishments from "@/components/Landing/Accomplishments.vue";
import Testimonials from "@/components/Landing/Testimonials.vue";
import ContactUs from "@/components/Landing/ContactUs.vue";
import Footer from "@/components/Landing/Footer.vue";

export default {
  name: "Landing",
  metaInfo: {
    title: "Welcome",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Admin Landing Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    HeroHeader,
    Features,
    Accomplishments,
    Testimonials,
    ContactUs,
    Footer,
  },
};
</script>
