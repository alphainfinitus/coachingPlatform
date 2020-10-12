import Vue from "vue";
import VueRouter from "vue-router";
import VueMeta from "vue-meta";
import store from "./store";

import Home from "./views/Home.vue";

Vue.use(VueRouter);
Vue.use(VueMeta);

function checkAdminOrAuth(to, from, next) {
  const auth = store.getters.auth;
  const admin = store.getters.admin;
  if (admin) {
    next("/adminhome");
  }
  if (auth) {
    next("/home");
  } else {
    next();
  }
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("./views/auth/Login.vue"),
    beforeEnter: (to, from, next) => {
      checkAdminOrAuth(to, from, next);
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("./views/auth/Register.vue"),
    beforeEnter: (to, from, next) => {
      checkAdminOrAuth(to, from, next);
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
