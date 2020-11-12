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
    activeTests: {},
  },
  getters: {
    auth: (state) => {
      return state.auth;
    },
    userData: (state) => {
      return state.userData;
    },
    activeTests: (state) => {
      return state.activeTests;
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
      state.activeTests = {};
      sessionStorage.clear();
    },

    // Profile Mutations
    setUserDataPhotoURL: (state, payload) => {
      Vue.set(state.userData, "photoURL", payload);
    },
    submitProfile: (state, payload) => {
      Vue.set(state.userData, "fullName", payload.fullName);
      Vue.set(state.userData, "phone", payload.phone);
    },
    setUserEmail: (state, payload) => {
      Vue.set(state.userData, "email", payload);
    },

    // Home Mutations
    setActiveTests: (state, payload) => {
      Vue.set(state.activeTests, payload.institutionUID, payload.tests);
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

    // /institute Actions
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
            context.dispatch("setUserData");
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    // /Home Actions
    fetchActiveTests: (context, payload) => {
      return new Promise((resolve) => {
        for (let key of Object.keys(payload)) {
          fire_store
            .collection("admins")
            .doc(key)
            .collection("tests")
            .where(
              "selectedBatches",
              "array-contains-any",
              payload[key].batchNames
            )
            .where("endDateTime", ">", new Date())
            .orderBy("endDateTime")
            .onSnapshot((snapshot) => {
              var institutionTestsObj = {
                institutionUID: key,
                tests: [],
              };

              if (!snapshot.empty) {
                snapshot.docs.forEach((doc) => {
                  institutionTestsObj.tests.push(doc.data());
                });
              }
              context.commit("setActiveTests", institutionTestsObj);
            });
        }
        resolve();
      });
    },

    // /Test Actions
    fetchTestQuestions: (context, payload) => {
      var promises = [];
      var questionsObj = {};
      var questionsLogObj = {}; //to log which question belongs to which section

      for (var key of Object.keys(payload.selectedQuestions)) {
        questionsObj[key] = [];

        // if array: loop through array and push promise to fetch each document
        if (payload.selectedQuestions[key] instanceof Array) {
          let questionRefsArr = [];
          payload.selectedQuestions[key].forEach((id) => {
            questionRefsArr.push(
              fire_store
                .collection("admins")
                .doc(payload.institutionUID)
                .collection("questions")
                .doc(id)
                .get()
            );
            questionsLogObj[id] = key;
          });
          promises = promises.concat(questionRefsArr);
        } else {
          // if not array, then folder: push promise query to fetch folder documents
          let folderQuery = fire_store
            .collection("admins")
            .doc(payload.institutionUID)
            .collection("questions")
            .where("folder", "==", payload.selectedQuestions[key].folderName)
            .get();

          promises.push(folderQuery);

          // log which folder belongs to what section
          questionsLogObj[payload.selectedQuestions[key].folderName] = key;
        }
      }

      var totalObjectiveQuestions = 0;

      return new Promise((resolve, reject) => {
        return Promise.all(promises)
          .then((resArr) => {
            resArr.forEach((res) => {
              if ("id" in res) {
                //is a document
                var docData = res.data();

                //questionsLogObj[docData.id] is docSection;
                questionsObj[questionsLogObj[docData.id]].push(docData);

                if (!docData.isSubjective) {
                  totalObjectiveQuestions++;
                }
              } else if (!res.empty) {
                // is a snapshot for a folder; check if snapshot is not empty
                res.docs.forEach((doc) => {
                  var docData = doc.data();
                  questionsObj[questionsLogObj[docData.folder]].push(docData);
                  if (!docData.isSubjective) {
                    totalObjectiveQuestions++;
                  }
                });
              }
            });

            resolve({ questionsObj, totalObjectiveQuestions });
          })
          .catch((error) => reject(error));
      });
    },
    submitTestResult: (context, payload) => {
      var batch = fire_store.batch();

      const adminRef = fire_store
        .collection("admins")
        .doc(payload.studentResult.institutionUID)
        .collection("tests")
        .doc(payload.studentResult.testID)
        .collection("results")
        .doc(payload.result.uid);

      batch.set(adminRef, payload.result);

      const studentRef = fire_store
        .collection("students")
        .doc(context.state.auth.uid)
        .collection("results")
        .doc(payload.studentResult.institutionUID)
        .collection("results")
        .doc(payload.studentResult.testID);

      batch.set(studentRef, payload.studentResult);

      return new Promise((resolve, reject) => {
        batch
          .commit()
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error.code);
          });
      });
    },
    checkTestAttempted: (context, payload) => {
      const ref = fire_store
        .collection("admins")
        .doc(payload.institutionUID)
        .collection("tests")
        .doc(payload.testID)
        .collection("results")
        .doc(context.state.auth.uid);

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((doc) => {
            if (doc.exists) {
              resolve(doc.data());
            } else {
              resolve(false);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
