import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import {
  //   firestore_fieldvalue,
  fire_auth,
  //   fire_auth_provider,
  //   fire_functions,
  fire_store,
  fire_storage,
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
    userData: {},
  },
  getters: {
    auth: (state) => {
      return state.auth;
    },
    userData: (state) => {
      return state.userData;
    },
  },
  mutations: {
    // Auth Mutations
    login: (state, payload) => {
      state.auth = payload;
    },
    setUserData: (state, payload) => {
      state.userData = payload;
    },
    logout: (state) => {
      state.auth = null;
      state.userData = {};
      sessionStorage.clear();
    },

    // Profile Mutations
    setUserDataPhotoURL: (state, payload) => {
      state.userData.photoURL = payload;
    },
    setUserDataOrganisationDetails: (state, payload) => {
      state.userData.fullName = payload.fullName;
      state.userData.phone = payload.phone;
      state.userData.username = payload.username;
    },
  },
  actions: {
    // Auth Actions
    register: (context, payload) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .createUserWithEmailAndPassword(payload.email, payload.password)
          .then((cred) => {
            if (cred.user) {
              context.commit("login", cred.user);
              // create a new document for the user
              const userData = {
                email: payload.email,
                fullName: payload.fullName,
                phone: payload.phone,
                uid: cred.user.uid,
              };
              fire_store
                .collection("admins")
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
                .catch((error) => {
                  console.log(error);
                });

              resolve();
            } else {
              reject("Network Error");
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    login: (context, payload) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .signInWithEmailAndPassword(payload.email, payload.password)
          .then((cred) => {
            if (cred.user) {
              context.commit("login", cred.user);
              context
                .dispatch("setUserData")
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              reject("Network Error");
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setUserData: (context) => {
      const ref = fire_store.collection("admins").doc(context.state.auth.uid);

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((res) => {
            const data = res.data();
            context.commit("setUserData", data);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
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

    // Profile Actions
    setProfilePhoto: (context, payload) => {
      const docRef = fire_store
        .collection("admins")
        .doc(context.state.auth.uid);

      //admins/[uid]/dp.jpeg
      const storageRef = fire_storage
        .ref()
        .child(`admins/${context.state.auth.uid}/dp.jpeg`);

      return new Promise((resolve, reject) => {
        storageRef
          .putString(payload.image_data, "data_url")
          .then((snapshot) => {
            snapshot.ref.getDownloadURL().then((url) => {
              docRef
                .update({ photoURL: url })
                .then(() => {
                  context.commit("setUserDataPhotoURL", url);
                  resolve();
                })
                .catch((err) => {
                  console.log(err);
                  reject(err);
                });
            });
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    checkUsernameExists: (context, payload) => {
      const ref = fire_store
        .collection("admins")
        .where("username", "==", payload)
        .limit(1);

      return new Promise((resolve, reject) => {
        // if user has not changed his original username, then return username does NOT exist
        if (payload == context.state.userData.username) {
          resolve(false);
        } else {
          ref
            .get()
            .then((querySnapshot) => {
              resolve(!querySnapshot.empty);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    },
    submitOrganisationDetails: (context, payload) => {
      const ref = fire_store.collection("admins").doc(context.state.auth.uid);
      return new Promise((resolve, reject) => {
        context
          .dispatch("checkUsernameExists", payload.username)
          .then((res) => {
            const userNameExists = res;
            if (userNameExists) {
              reject("invalidUsername");
            } else {
              ref
                .update(payload)
                .then(() => {
                  context.commit("setUserDataOrganisationDetails", payload);
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            }
          });
      });
    },
  },
});