import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import {
  // firestore_fieldvalue,
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
    submitProfile: (state, payload) => {
      state.userData.fullName = payload.fullName;
      state.userData.phone = payload.phone;
    },
    setUserEmail: (state, payload) => {
      state.userData.email = payload;
    },

    // Institution Mutations
    joinBatch: (state, payload) => {
      state.userData.subscriptions = payload.subscriptions;
      state.userData.subscriptionsData = payload.subscriptionsData;
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
                subscriptions: [],
                subscriptionsData: {},
              };
              fire_store
                .collection("students")
                .doc(cred.user.uid)
                .set(userData);

              context.commit("setUserData", userData);

              //send verification email:
              fire_auth.currentUser
                .sendEmailVerification()
                .then(() => {
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
      const ref = fire_store.collection("students").doc(context.state.auth.uid);

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
    resetPassword: (context, payload) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .sendPasswordResetEmail(payload)
          .then(() => {
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
        .collection("students")
        .doc(context.state.auth.uid);

      //students/[uid]/dp.jpeg
      const storageRef = fire_storage
        .ref()
        .child(`students/${context.state.auth.uid}/dp.jpeg`);

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
    submitProfile: (context, payload) => {
      const ref = fire_store.collection("students").doc(context.state.auth.uid);
      return new Promise((resolve, reject) => {
        ref
          .update(payload)
          .then(() => {
            context.commit("submitProfile", payload);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    changeEmail: (context, payload) => {
      var user = fire_auth.currentUser;
      const ref = fire_store.collection("students").doc(context.state.auth.uid);
      return new Promise((resolve, reject) => {
        user
          .updateEmail(payload)
          .then(function() {
            ref
              .update({ email: payload })
              .then(() => {
                user.sendEmailVerification();
                context.commit("setUserEmail", payload);
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((error) => {
            reject(error.code);
          });
      });
    },
    checkUsernameExists: (context, payload) => {
      const ref = fire_store
        .collection("admins")
        .where("username", "==", payload)
        .limit(1);

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((querySnapshot) => {
            resolve(!querySnapshot.empty);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // Institute Actions
    fetchInstitutionByUsername: (context, payload) => {
      const ref = fire_store
        .collection("admins")
        .where("username", "==", payload)
        .limit(1);

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((snapshot) => {
            if (!snapshot.empty) {
              const resData = snapshot.docs.map((doc) => doc.data());
              resolve(resData[0]);
            } else {
              resolve(false);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    fetchInstitutionBatches: (context, payload) => {
      const ref = fire_store
        .collection("admins")
        .doc(payload)
        .collection("meta")
        .doc("batches");

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((doc) => {
            resolve(doc.data());
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    joinBatch: (context, payload) => {
      const ref = fire_store.collection("students").doc(context.state.auth.uid);
      return new Promise((resolve, reject) => {
        ref
          .update(payload)
          .then(() => {
            context.commit("joinBatch", payload);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});
