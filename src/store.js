import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import {
  //   firestore_fieldvalue,
  fire_auth,
  //   fire_auth_provider,
  //   fire_functions,
  fire_store,
  //   fire_storage,
} from "@/firebase/init";

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
    userdata: {},
  },
  getters: {
    auth: (state) => {
      return state.auth;
    },
    admin: (state) => {
      return state.admin;
    },
  },
  mutations: {
    login: (state, payload) => {
      if (payload.isAdmin) {
        state.admin = payload.user;
      } else {
        state.auth = payload.user;
      }
    },
    setUserData: (state, payload) => {
      state.userdata = payload;
    },
    logout: (state) => {
      state.auth = null;
      state.admin = null;
      state.userdata = {};
      sessionStorage.clear();
    },
  },
  actions: {
    register: (context, payload) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .createUserWithEmailAndPassword(payload.email, payload.password)
          .then((cred) => {
            if (cred.user) {
              context.commit("login", { user: cred.user, isAdmin: false });
              // create a new document for the user
              const userData = {
                email: payload.email,
                fullName: payload.fullName,
                phone: payload.phone,
                uid: cred.user.uid,
              };
              fire_store
                .collection("users")
                .doc(cred.user.uid)
                .set(userData);

              context.commit("setUserData", userData);

              //send verification email:
              fire_auth.currentUser
                .sendEmailVerification()
                .then(function() {
                  // Email sent.
                  resolve();
                })
                .catch(function(error) {
                  console.log(error);
                });

              resolve();
            } else {
              reject("Network Error");
            }
          })
          .catch((error) => {
            reject(error.code);
          });
      });
    },
    login: (context, payload) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .signInWithEmailAndPassword(payload.email, payload.password)
          .then((cred) => {
            if (cred.user) {
              context.commit("login", {
                user: cred.user,
                isAdmin: payload.isAdmin,
              });
              context
                .dispatch("setUserData")
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  reject(error.code);
                });
            } else {
              reject("Network Error");
            }
          })
          .catch((error) => {
            reject(error.code);
          });
      });
    },
    setUserData: (context) => {
      const ref = fire_store.collection("users").doc(context.state.auth.uid);
      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((res) => {
            const data = res.data();
            context.commit("setUserData", data);
            resolve(data);
          })
          .catch((error) => {
            reject(error.code);
          });
      });
    },
    logout: (context) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .signOut()
          .then(() => {
            context.commit("logout");
            resolve();
          })
          .catch((error) => {
            reject(error.code);
          });
      });
    },
  },
});
