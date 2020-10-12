import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

// import {
//   firestore_fieldvalue,
//   fire_auth,
//   fire_auth_provider,
//   fire_functions,
//   fire_store,
//   fire_storage,
// } from "@/firebase/init";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  state: {
    auth: null,
    admin: null,
  },
  getters: {
    auth: (state) => {
      return state.auth;
    },
    admin: (state) => {
      return state.admin;
    },
  },
  mutations: {},
  actions: {},
});
