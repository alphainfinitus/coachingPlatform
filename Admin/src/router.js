import Vue from "vue";
import VueRouter from "vue-router";
import VueMeta from "vue-meta";
import store from "./store";

import Landing from "./views/Landing.vue";

Vue.use(VueRouter);
Vue.use(VueMeta);

// for (auth-enabling) routes that should redirect if already authenticated
function verifyAuthRoute(to, from, next) {
  const auth = store.getters.auth;
  if (auth) {
    next("/home");
  } else {
    next();
  }
}

// for routes that require authentication
function checkAuthStatus(to, from, next) {
  const auth = store.getters.auth;
  if (!auth) {
    next("/login");
  } else {
    next();
  }
}

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },
  // Auth Routes
  {
    path: "/login",
    name: "Login",
    component: () => import("./views/auth/Login.vue"),
    beforeEnter: (to, from, next) => {
      verifyAuthRoute(to, from, next);
    },
  },
  // {
  //   path: "/register",
  //   name: "Register",
  //   component: () => import("./views/auth/Register.vue"),
  //   beforeEnter: (to, from, next) => {
  //     verifyAuthRoute(to, from, next);
  //   },
  // },
  // User Routes
  {
    path: "/home",
    name: "Home",
    component: () => import("./views/home/Home.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthStatus(to, from, next);
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("./views/home/Profile.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthStatus(to, from, next);
    },
  },
  // create routes
  {
    path: "/create/question",
    name: "createQuestion",
    props: true,
    component: () => import("./views/home/create/Question.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthStatus(to, from, next);
    },
  },
  {
    path: "/create/test",
    name: "createTest",
    props: true,
    component: () => import("./views/home/create/Test.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthStatus(to, from, next);
    },
  },
  // manage routes
  {
    path: "/manage/question-bank",
    name: "questionBank",
    component: () => import("./views/home/manage/QuestionBank.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthStatus(to, from, next);
    },
  },
  {
    path: "/manage/batches",
    name: "batches",
    component: () => import("./views/home/manage/Batches.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthStatus(to, from, next);
    },
  },
  {
    path: "/manage/edit-tests",
    name: "editTests",
    component: () => import("./views/home/manage/EditTests.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthStatus(to, from, next);
    },
  },
  // view routes
  {
    path: "/view/results",
    name: "viewResults",
    component: () => import("./views/home/view/Results.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthStatus(to, from, next);
    },
  },
  {
    path: "/view/result/test",
    name: "viewTestResult",
    props: true,
    component: () => import("./views/home/view/TestResult.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthStatus(to, from, next);
    },
  },
  {
    path: "/view/answer-sheets",
    name: "viewAnswerSheets",
    component: () => import("./views/home/view/AnswerSheets.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthStatus(to, from, next);
    },
  },
  {
    path: "/view/answer-sheet/test",
    name: "viewTestAnswerSheet",
    props: true,
    component: () => import("./views/home/view/TestAnswerSheet.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthStatus(to, from, next);
    },
  },
  // 404
  {
    path: "*",
    name: "NotFound404",
    component: () => import("./views/NotFound404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
