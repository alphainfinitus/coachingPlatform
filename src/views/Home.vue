<template>
  <div class="home">
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
import HeroHeader from "@/components/Home/HeroHeader.vue";
import Features from "@/components/Home/Features.vue";
import Accomplishments from "@/components/Home/Accomplishments.vue";
import Testimonials from "@/components/Home/Testimonials.vue";
import ContactUs from "@/components/Home/ContactUs.vue";
import Footer from "@/components/Home/Footer.vue";

export default {
  name: "Home",
  metaInfo: {
    title: "Home",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Home Page description lorem ipsum dolor sit amet.",
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
