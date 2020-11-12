<template>
  <div id="testInfoCard">
    <v-card :loading="loading || superLoading">
      <v-card-title class="text-capitalize">
        <span class="mr-1"> {{ test.testName }} </span>
        <span class="mr-1 subtitle-1">( {{ test.batch }} )</span>
        <v-spacer></v-spacer>
        <span>
          <span class="text-subtitle-1"> Marking/Question: </span>
          <v-chip class="green darken-2 white--text mx-1" small>
            + {{ test.rewardPoints }}</v-chip
          >
          <v-chip class="red darken-2 white--text" small>
            - {{ test.punishmentPoints }}
          </v-chip>
        </span>
      </v-card-title>
      <v-divider></v-divider>
      <v-container fluid>
        <!-- Sections -->
        <v-row align="center" class="px-2 pt-0 pt-md-1 px-md-8">
          <span class="my-2"> Sections: </span>
          <v-slide-group
            v-model="activeSection"
            mandatory
            show-arrows
            center-active
          >
            <v-slide-item
              v-for="(section, i) in test.sections"
              :key="i"
              v-slot="{ active }"
            >
              <v-btn
                class="mx-2"
                :color="
                  active && timeLeft
                    ? 'green white--text'
                    : 'grey darken-2 white--text'
                "
                depressed
                small
                @click="changeToSection(i)"
              >
                {{ section }}
              </v-btn>
            </v-slide-item>
          </v-slide-group>
        </v-row>

        <v-divider class="mt-4 my-6"></v-divider>

        <!-- Test Clock -->
        <v-row align="center" justify="center" class="px-2 px-md-8 my-2">
          <span class="mr-2"> Time Left: </span>
          <v-chip class="white--text" color="blue" label>
            {{ timeLeftText }}
          </v-chip>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
const moment = require("moment");

export default {
  name: "TestInfoCard",
  props: ["superLoading", "test", "startTimer", "activeSectionIndex"],
  computed: {
    timeLeftText() {
      if (!this.timeLeft) {
        return "00.00.00";
      }
      return this.timeLeft;
    },
  },
  watch: {
    startTimer: {
      handler(newVal) {
        if (newVal) {
          this.startTestTimer();
        } else {
          clearInterval(this.timeInterval);
          this.timeLeft = null;
        }
      },
    },
    activeSectionIndex: {
      handler(newVal) {
        this.activeSection = newVal;
      },
    },
  },
  data: () => ({
    loading: false,
    error: "",
    activeSection: 0,
    testWillEndAt: null,
    timeInterval: null,
    timeLeft: null,
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
      this.$emit("setSuperLoading", value);
    },
    startTestTimer() {
      const endDateTime = moment(this.test.endDateTime.seconds * 1000);

      // check what is less time, test avialability or test duration
      const useTestDuration = endDateTime.isSameOrAfter(
        moment().add(this.test.testDuration, "minutes")
      );

      // if test ends before duration show time left wrt endDateTime else testDuration
      this.testWillEndAt = useTestDuration
        ? moment().add(this.test.testDuration, "minutes")
        : endDateTime;

      this.timeInterval = setInterval(() => {
        var timeLeft = this.testWillEndAt.diff(moment());
        this.timeLeft = moment.utc(timeLeft).format("HH:mm:ss");
        var currMoment = moment();
        if (
          currMoment.isSameOrAfter(this.testWillEndAt) ||
          currMoment.isSameOrAfter(endDateTime)
        ) {
          clearInterval(this.timeInterval);
          this.timeLeft = null;
          this.$emit("timeUp");
          return;
        }
      }, 1000);
    },
    changeToSection(index) {
      if (this.timeLeft) {
        this.$emit("changeToSection", index);
        this.activeSection = index;
      }
    },
  },
};
</script>