<template>
  <div id="home">
    <!-- Check if the coaching profile is complete -->
    <v-container v-if="!userData.username" class="mt-12">
      <ProfileAlertRow />
    </v-container>
    <v-container v-else>
      <ContentRow :content="options.create" />
      <div class="my-6 my-md-12"></div>
      <ContentRow :content="options.manage" />
      <div class="my-6 my-md-12"></div>
      <ContentRow :content="options.view" />
      <div class="my-6 my-md-12"></div>
    </v-container>
  </div>
</template>

<script>
import ProfileAlertRow from "@/components/Home/Home/ProfileAlertRow.vue";
import ContentRow from "@/components/Home/Home/ContentRow.vue";

export default {
  name: "Home",
  metaInfo: {
    title: "Admin Home",
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Admin Home Page description lorem ipsum dolor sit amet.",
      },
    ],
  },
  components: {
    ProfileAlertRow,
    ContentRow,
  },
  data: () => ({
    loading: true,
    userData: {},
    options: {
      create: {
        title: "Create",
        icon: "mdi-plus-box-multiple",
        colors: ["blue darken-4", "blue darken-1", "blue darken-2"],
        options: [
          {
            title: "New Question",
            subTitle: "Add to the question bank.",
            to: "/create/question",
            image: "undraw_publish_post_vowb.svg",
          },
          {
            title: "New Test",
            subTitle: "Create and deploy a new test.",
            to: "/create/test",
            image: "undraw_File_bundle_xl7g.svg",
          },
        ],
      },
      manage: {
        title: "Manage",
        icon: "mdi-playlist-edit",
        colors: ["pink darken-1", "pink lighten-1", "pink darken-1"],
        options: [
          {
            title: "Edit Tests",
            subTitle:
              "Edit existing tests (add/remove questions, visibility, timing etc.)",
            to: "/manage/edit-tests",
            image: "undraw_profile_details_f8b7.svg",
          },
          {
            title: "Question Bank",
            subTitle:
              "Edit and view existing questions (folders, solution etc.)",
            to: "/manage/question-bank",
            image: "undraw_collecting_fjjl.svg",
          },
        ],
      },
      view: {
        title: "View",
        icon: "mdi-cards",
        colors: ["green darken-1", "green lighten-1", "green darken-1"],
        options: [
          {
            title: "Results",
            subTitle: "Test Results with ranking and score data.",
            to: "/view/results",
            image: "undraw_detailed_analysis_xn7y.svg",
          },
          {
            title: "Student Info",
            subTitle: "Contact information, subscription etc.",
            to: "/view/student-info",
            image: "undraw_personal_info_0okl.svg",
          },
        ],
      },
    },
  }),
  mounted() {
    this.userData = this.$store.getters.userData;
    this.loading = false;
  },
};
</script>
