import Vue from "vue";
import VueRouter from "vue-router";
import VueMeta from "vue-meta";
import store from "./store";

import Landing from "./views/Landing.vue";

Vue.use(VueRouter);
Vue.use(VueMeta);

function checkAuthType(to, from, next) {
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

function checkAuthStatus(to, from, next) {
  const auth = store.getters.auth;
  const admin = store.getters.admin;
  if (admin) {
    next("/adminhome");
  }
  if (!auth) {
    next("/login");
  } else {
    next();
  }
}

function checkAdminStatus(to, from, next) {
  const auth = store.getters.auth;
  const admin = store.getters.admin;
  if (auth) {
    next("/home");
  }
  if (!admin) {
    next("/admin-login");
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
      checkAuthType(to, from, next);
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("./views/auth/Register.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthType(to, from, next);
    },
  },
  {
    path: "/admin-login",
    name: "AdminLogin",
    component: () => import("./views/auth/Login.vue"),
    beforeEnter: (to, from, next) => {
      checkAuthType(to, from, next);
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
    path: "/admin-home",
    name: "AdminHome",
    component: () => import("./views/adminHome/AdminHome.vue"),
    beforeEnter: (to, from, next) => {
      checkAdminStatus(to, from, next);
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
