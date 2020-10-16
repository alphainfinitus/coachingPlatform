import Vue from "vue";
import VueRouter from "vue-router";
import VueMeta from "vue-meta";
import store from "./store";

import Landing from "./views/Landing.vue";

Vue.use(VueRouter);
Vue.use(VueMeta);

// for (auth) routes that should redirect if already authenticated
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
  {
    path: "/login",
    name: "Login",
    component: () => import("./views/auth/Login.vue"),
    beforeEnter: (to, from, next) => {
      verifyAuthRoute(to, from, next);
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("./views/auth/Register.vue"),
    beforeEnter: (to, from, next) => {
      verifyAuthRoute(to, from, next);
    },
  },
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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
